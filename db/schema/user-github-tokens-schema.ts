import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const userGithubTokensTable = pgTable("user_github_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenType: text("token_type").notNull().default("bearer"),
  scope: text("scope"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export type InsertUserGithubToken = typeof userGithubTokensTable.$inferInsert
export type SelectUserGithubToken = typeof userGithubTokensTable.$inferSelect