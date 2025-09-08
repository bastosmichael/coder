CREATE TABLE "user_github_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"token_type" text DEFAULT 'bearer' NOT NULL,
	"scope" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_github_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "plan_response" text;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "code_gen_response" text;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "runner" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "github_repo_id" integer;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "github_organization_id" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "github_organization_name" text;