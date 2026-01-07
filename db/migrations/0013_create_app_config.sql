CREATE TABLE IF NOT EXISTS "app_config" (
  "user_id" text PRIMARY KEY,
  "anthropic_api_key" text NOT NULL,
  "openai_api_key" text NOT NULL,
  "grok_api_key" text NOT NULL,
  "github_pat" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
