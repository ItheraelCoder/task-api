import { describe, expect, it } from "vitest";
import { api, createAndLoginUser } from "../helpers/request.helper";

describe("POST /api/auth/register", () => {
  it("debe registrar un usuario con datos validos", async () => {
    const res = await api
      .post("/api/auth/register")
      .send({ email: "new@test.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.user.email).toBe("new@test.com");
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it("debe rechazar un email invalido", async () => {
    const res = await api
      .post("/api/auth/register")
      .send({ email: "no-es-un-email", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("debe rechazar una contraseña menor a 8 caracteres", async () => {
    const res = await api
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "123" });

    expect(res.status).toBe(400);
  });

  it("debe rechazar un email ya registrado", async () => {
    await api
      .post("/api/auth/register")
      .send({ email: "duplicate@test.com", password: "password123" });
    const res = await api
      .post("/api/auth/register")
      .send({ email: "duplicate@test.com", password: "password123" });

    expect(res.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  it("debe hacer login coppn credenciales validas", async () => {
    await api
      .post("/api/auth/register")
      .send({ email: "login@test.com", password: "password123" });
    const res = await api
      .post("/api/auth/login")
      .send({ email: "login@test.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it("debe rechazar credenciales invalidas", async () => {
    const res = await api
      .post("/api/auth/login")
      .send({ email: "noexiste@test.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Credenciales invalidas");
  });

  it("debe rechazar el password incorrecto con el mismo mensaje que usuario inexistente", async () => {
    await api
      .post("/api/auth/register")
      .send({ email: "user@test.com", password: "password123" });

    const res = await api
      .post("/api/auth/login")
      .send({ email: "user@test.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Credenciales invalidas");
  });
});

describe("POST /api/auth/refresh", () => {
  it("debe generar nuevos tokens con un refresh token valido", async () => {
    const { refreshToken } = await createAndLoginUser();

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const res = await api.post("/api/auth/refresh").send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.refreshToken).not.toBe(refreshToken);
  });

  it("debe rechazar un refresh token invalido", async () => {
    const res = await api
      .post("/api/auth/refresh")
      .send({ refreshToken: "token.falso.aqui" });

    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("debe cerrar sesion con token valido", async () => {
    const { accessToken } = await createAndLoginUser();
    const res = await api
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sesion cerrada");
  });

  it("debe rechazar un logout sin token", async () => {
    const res = await api.post("/api/auth/logout");
    expect(res.status).toBe(401);
  });
});
