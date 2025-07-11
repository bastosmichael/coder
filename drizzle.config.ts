import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

// Load development environment variables pulled from Vercel
config({ path: ".env.development.local" })

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  schema: "./db/schema/index.ts",
  out: "./db/migrations"
})
