import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/config/env";
import * as schema from "@/db/schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});

const db = drizzle(pool, { schema });

export default db;
