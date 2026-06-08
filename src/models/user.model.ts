import { eq } from "drizzle-orm";
import db from "@/libs/db";
import { users, type NewUser } from "@/db/schema";

export const UserModel = {
  findByEmail: async (email: string) => {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result ?? null;
  },

  findById: async (id: string) => {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result ?? null;
  },

  create: async (data: NewUser) => {
    const [result] = await db.insert(users).values(data).returning();
    return result;
  },
};
