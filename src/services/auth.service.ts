import { env } from "@/config/env";
import type { RegisterInput, LoginInput } from "@/dto/auth.dto";
import { UserModel } from "@/models/user.model";
import { AppError } from "@/utils/AppError";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ sub: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
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

    return {
      user: { id: user.id, emai: user.email, role: user.role },
      accessToken,
    };
  },

  login: async (input: LoginInput) => {
    const user = await UserModel.findByEmail(input.email);

    if (!user) {
      throw new AppError("Credenciales Invalidas", 401);
    }

    const isValidPassword = await argon2.verify(user.password, input.password);
    if (!isValidPassword) {
      throw new AppError("Credenciales Invalidas", 401);
    }

    const accessToken = generateAccessToken(user.id, user.role);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
    };
  },
};
