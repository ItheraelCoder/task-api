import app from "@/app";
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
