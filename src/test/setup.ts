import { beforeAll, afterAll, beforeEach } from "vitest";
import { runMigrations } from "./helpers/migration.helper";
import db from "@/libs/db";
import { refreshTokens, tasks, users } from "@/db/schema";

beforeAll(async () => {
  await runMigrations();
});

beforeEach(async () => {
  await db.delete(refreshTokens);
  await db.delete(tasks);
  await db.delete(users);
});

afterAll(async () => {
  // el pool se cierra solo al terminar el proceso
});
