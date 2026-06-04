import { describe, expect, it } from "vitest";
import {
  api,
  createAndLoginAdmin,
  createAndLoginUser,
} from "../helpers/request.helper";

describe("POST /api/tasks", () => {
  it("debe crear una task con un usuario autenticado", async () => {
    const { accessToken } = await createAndLoginUser();
    const res = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Mi task", description: "Descripcion" });
    expect(res.status).toBe(201);
    expect(res.body.data.task.title).toBe("Mi task");
    expect(res.body.data.task.completed).toBe(false);
    expect(res.body.data.task.userId).toBeDefined();
  });

  it("debe rechazar creacion sin autenticacion", async () => {
    const res = await api.post("/api/tasks").send({ title: "Mi task" });

    expect(res.status).toBe(401);
  });

  it("debe rechazar task sin titulo", async () => {
    const { accessToken } = await createAndLoginUser();
    const res = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ description: "Sin titulo" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/tasks", () => {
  it("debe retornar solo las tareas del usuario autenticado", async () => {
    const userA = await createAndLoginUser("usera@tast.com");
    const userB = await createAndLoginUser("userb@test.com");

    await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({ title: "Task de A - 1" });

    await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({ title: "Task de A - 2" });

    await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userB.accessToken}`)
      .send({ title: "Task de B - 1" });

    const res = await api
      .get("/api/tasks")
      .set("Authorization", `Bearer ${userA.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tasks).toHaveLength(2);
    expect(
      res.body.data.tasks.every((t: any) => t.userId === userA.user.id),
    ).toBe(true);
  });
});

describe("GET /api/tasks/:id", () => {
  it("debe retornar una task propia", async () => {
    const { accessToken } = await createAndLoginUser();

    const created = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Task propia" });

    const taskId = created.body.data.task.id;

    const res = await api
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.task.id).toBe(taskId);
  });

  it("debe rechazar acceso a task de otro usuario", async () => {
    const userA = await createAndLoginUser("owner@test.com");
    const userB = await createAndLoginUser("intruder@test.com");

    const created = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({ title: "Task propia" });

    const taskId = created.body.data.task.id;

    const res = await api
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${userB.accessToken}`);

    expect(res.status).toBe(403);
  });

  it("debe retornar 404 para task inexistente", async () => {
    const { accessToken } = await createAndLoginUser();
    const res = await api
      .get("/api/tasks/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(404);
  });

  it("debe retornar un 400 para un id invalido", async () => {
    const { accessToken } = await createAndLoginUser();

    const res = await api
      .get("/api/tasks/esto-no-es-uuid")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
  });

  it("admin debe poder ver cualquier task de cualquier usuario", async () => {
    const user = await createAndLoginUser("normaluser@test.com");
    const admin = await createAndLoginAdmin();

    const created = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ title: "Task del usuario normal" });

    const taskId = created.body.data.task.id;

    const res = await api
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${admin.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.task.id).toBe(taskId);
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("debe actualizar una task propia", async () => {
    const { accessToken } = await createAndLoginUser();

    const created = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Titulo original" });

    const taskId = created.body.data.task.id;

    const res = await api
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Titulo actualizado", completed: true });

    expect(res.status).toBe(201);
    expect(res.body.data.task.title).toBe("Titulo actualizado");
    expect(res.body.data.task.completed).toBe(true);
  });

  it("debe rechazar actualizacion de task de otro usuario", async () => {
    const userA = await createAndLoginUser("owner2@test.com");
    const userB = await createAndLoginUser("intruder2@test.com");

    const created = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({ title: "Task protegida" });

    const taskId = created.body.data.task.id;

    const res = await api
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${userB.accessToken}`)
      .send({ title: "Intento de modificacion" });

    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("debe eliminar una task propia", async () => {
    const { accessToken } = await createAndLoginUser();

    const created = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Task a eliminar" });

    const taskId = created.body.data.task.id;

    const res = await api
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);

    const check = await api
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(check.status).toBe(404);
  });

  it("debe rechazar la eliminacion de task de otro usuario", async () => {
    const userA = await createAndLoginUser("owner3@test.com");
    const userB = await createAndLoginUser("intruder3@test.com");

    const created = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({ title: "Task privada" });

    const taskId = created.body.data.task.id;

    const res = await api
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${userB.accessToken}`);

    expect(res.status).toBe(403);
  });

  it("admin debe poder eliminar task de cualquier usuario", async () => {
    const user = await createAndLoginUser("user@test.com");
    const admin = await createAndLoginAdmin("admin@test.com");

    const created = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ title: "Task del usuario" });

    const taskId = created.body.data.task.id;

    const res = await api
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${admin.accessToken}`);

    expect(res.status).toBe(204);
  });
});
