import { db } from '../index';
import { documents, documentVersions, comments, documentCollaborators } from '../schema/omniwrite';
import { eq, and } from 'drizzle-orm';

export class OmniWriteService {
  // Documents
  async createDocument(data: typeof documents.$inferInsert) {
    return await db.insert(documents).values(data).returning();
  }

  async getDocument(id: string) {
    return await db.select().from(documents).where(eq(documents.id, id));
  }

  async getUserDocuments(userId: string) {
    return await db.select().from(documents).where(eq(documents.userId, userId));
  }

  async updateDocument(id: string, data: Partial<typeof documents.$inferInsert>) {
    return await db.update(documents).set({ ...data, updatedAt: new Date() }).where(eq(documents.id, id)).returning();
  }

  async deleteDocument(id: string) {
    return await db.delete(documents).where(eq(documents.id, id));
  }

  // Document Versions
  async createVersion(data: typeof documentVersions.$inferInsert) {
    return await db.insert(documentVersions).values(data).returning();
  }

  async getDocumentVersions(documentId: string) {
    return await db.select().from(documentVersions).where(eq(documentVersions.documentId, documentId));
  }

  // Comments
  async createComment(data: typeof comments.$inferInsert) {
    return await db.insert(comments).values(data).returning();
  }

  async getDocumentComments(documentId: string) {
    return await db.select().from(comments).where(eq(comments.documentId, documentId));
  }

  // Collaborators
  async addCollaborator(data: typeof documentCollaborators.$inferInsert) {
    return await db.insert(documentCollaborators).values(data).returning();
  }

  async getDocumentCollaborators(documentId: string) {
    return await db.select().from(documentCollaborators).where(eq(documentCollaborators.documentId, documentId));
  }

  async removeCollaborator(documentId: string, userId: string) {
    return await db.delete(documentCollaborators).where(
      and(
        eq(documentCollaborators.documentId, documentId),
        eq(documentCollaborators.userId, userId)
      )
    );
  }
}