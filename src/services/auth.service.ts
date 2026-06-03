import { env } from "@/config/env";
import type { RegisterInput, LoginInput, RefreshInput } from "@/dto/auth.dto";
import { RefreshTokenModel } from "@/models/refreshToken.model";
import { UserModel } from "@/models/user.model";
import { AppError } from "@/utils/AppError";
import * as argon2 from "argon2";
import jwt, { decode } from "jsonwebtoken";

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ sub: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

const saveRefreshToken = async (token: string, userId: string) => {
  const decoded = jwt.decode(token) as { exp: number };
  const expiresAt = new Date(decoded.exp * 1000);

  // Eliminar refresh tokens anteriores del usuario antes de crear uno nuevo
  await RefreshTokenModel.deleteByUserId(userId);
  await RefreshTokenModel.create({ token, userId, expiresAt });
};

export const AuthService = {
  register: async (input: RegisterInput) => {
    const existing = await UserModel.findByEmail(input.email);
    if (existing) {
      throw new AppError("El email ya esta registrado", 409);
    }

    const hashedPassword = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await UserModel.create({
      email: input.email,
      password: hashedPassword,
    });

    if (!user) {
      throw new AppError("ALGO SALIO MAL", 500);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    await saveRefreshToken(refreshToken, user.id);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  },

  login: async (input: LoginInput) => {
    const user = await UserModel.findByEmail(input.email);

    if (!user) {
      throw new AppError("Credenciales invalidas", 401);
    }

    const isValidPassword = await argon2.verify(user.password, input.password);
    if (!isValidPassword) {
      throw new AppError("Credenciales invalidas", 401);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    await saveRefreshToken(refreshToken, user.id);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  },

  refresh: async (input: RefreshInput) => {
    let payload: { sub: string };
    try {
      payload = jwt.verify(input.refreshToken, env.JWT_REFRESH_SECRET) as {
        sub: string;
      };
    } catch {
      throw new AppError("Refresh token invalido o expirado", 401);
    }

    const stored = await RefreshTokenModel.findByToken(input.refreshToken);

    if (!stored) {
      throw new AppError("Refresh token invalido o expirado", 401);
    }

    const user = await UserModel.findById(payload.sub);
    if (!user) {
      throw new AppError("el usuario no encontrado", 401);
    }

    await RefreshTokenModel.deleteByToken(input.refreshToken);

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);
    saveRefreshToken(newRefreshToken, user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  logout: async (userId: string) => {
    await RefreshTokenModel.deleteByUserId(userId);
  },
};
