import { tasks, type NewTask } from "@/db/schema";
import db from "@/libs/db";
import { eq } from "drizzle-orm";

export const TaskModel = {
  create: async (data: NewTask) => {
    const [result] = await db.insert(tasks).values(data).returning();
    return result;
  },
  findAllByUser: async (userId: string) => {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  },
  findById: async (id: string) => {
    const [result] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    return result ?? null;
  },
  update: async (id: string, data: Partial<NewTask>) => {
    const [result] = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning();
    return result ?? null;
  },
  delete: async (id: string) => {
    return await db.delete(tasks).where(eq(tasks.id, id));
  },
};
