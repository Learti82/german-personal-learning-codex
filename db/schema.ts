import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userProgress = sqliteTable('user_progress', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull(),
  payload: text('payload').notNull(),
  updatedAt: integer('updated_at').notNull(),
})
