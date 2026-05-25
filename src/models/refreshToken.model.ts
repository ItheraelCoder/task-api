import { refreshTokens, type NewRefreshToken } from "@/db/schema";
import db from "@/libs/db";
import { eq, lt } from "drizzle-orm";

export const RefreshTokenModel = {
  create: async (data: NewRefreshToken) => {
    const [result] = await db.insert(refreshTokens).values(data).returning();
    return result;
  },
  findByToken: async (token: string) => {
    const [result] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);

    return result ?? null;
  },

  deleteByToken: async (token: string) => {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  },

  deleteByUserId: async (userId: string) => {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  },

  deleteExpired: async () => {
    await db
      .delete(refreshTokens)
      .where(lt(refreshTokens.expiresAt, new Date()));
  },
};
