import { env } from "@/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export const runMigrations = async () => {
  const pool = new Pool({
    connectionString: env.DATABASE_URL_TEST ?? env.DATABASE_URL,
  });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "./drizzle" });
  await pool.end();
};
