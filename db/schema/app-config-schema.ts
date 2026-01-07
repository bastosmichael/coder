import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const appConfigTable = pgTable("app_config", {
  userId: text("user_id").primaryKey(),
  anthropicApiKey: text("anthropic_api_key").notNull(),
  openaiApiKey: text("openai_api_key").notNull(),
  grokApiKey: text("grok_api_key").notNull(),
  githubPat: text("github_pat").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export type InsertAppConfig = typeof appConfigTable.$inferInsert
export type SelectAppConfig = typeof appConfigTable.$inferSelect
