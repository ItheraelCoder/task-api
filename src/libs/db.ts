import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/config/env";
import * as schema from "@/db/schema";

const connectionString =
  env.NODE_ENV === "test"
    ? (env.DATABASE_URL_TEST ?? env.DATABASE_URL)
    : env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 10,
});

const db = drizzle(pool, { schema });

export default db;
