import { pgTable, uuid, varchar, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core';
import { users } from './users';

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  contentHtml: text('content_html'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isAutoSaving: boolean('is_auto_saving').default(false),
  lastSavedTimestamp: timestamp('last_saved_timestamp'),
  wordCount: integer('word_count').default(0),
  readabilityScore: integer('readability_score'),
  seoScore: integer('seo_score'),
  toneSetting: varchar('tone_setting', { length: 50 }),
  visibility: varchar('visibility', { length: 20 }).default('private'),
});

export const documentVersions = pgTable('document_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => documents.id).notNull(),
  contentHtmlSnapshot: text('content_html_snapshot'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => documents.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  targetSelection: json('target_selection'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documentCollaborators = pgTable('document_collaborators', {
  documentId: uuid('document_id').references(() => documents.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  permissionLevel: varchar('permission_level', { length: 20 }).notNull(),
});