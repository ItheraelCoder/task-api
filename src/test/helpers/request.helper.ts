import app from "@/app";
import { users } from "@/db/schema";
import db from "@/libs/db";
import { eq } from "drizzle-orm";
import supertest from "supertest";
export const api = supertest(app);

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login").send({ email, password });
  return res.body.data as {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; role: string };
  };
};

export const createAndLoginUser = async (
  email = "test@test.com",
  password = "password123",
) => {
  await api.post("/api/auth/register").send({ email, password });
  return loginUser(email, password);
};

export const createAndLoginAdmin = async (
  email = "admin@test.com",
  password = "password123",
) => {
  await api.post("/api/auth/register").send({ email, password });
  await db.update(users).set({ role: "admin" }).where(eq(users.email, email));
  return loginUser(email, password);
};
