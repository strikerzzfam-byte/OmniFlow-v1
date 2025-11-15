import { db } from '../index';
import { users } from '../schema/users';
import { eq } from 'drizzle-orm';

export class UserService {
  async createUser(data: typeof users.$inferInsert) {
    return await db.insert(users).values(data).returning();
  }

  async getUserById(id: string) {
    return await db.select().from(users).where(eq(users.id, id)).limit(1);
  }

  async getUserByEmail(email: string) {
    return await db.select().from(users).where(eq(users.email, email)).limit(1);
  }

  async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    return await db.update(users).set(data).where(eq(users.id, id)).returning();
  }

  async updateLastLogin(id: string) {
    return await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, id));
  }
}