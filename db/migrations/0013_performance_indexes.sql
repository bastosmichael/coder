-- Performance optimization indexes

-- Index for projects by workspace and updated_at (most common query)
CREATE INDEX IF NOT EXISTS "idx_projects_workspace_updated" 
ON "projects" ("workspace_id", "updated_at" DESC);

-- Index for instructions by project
CREATE INDEX IF NOT EXISTS "idx_instructions_project" 
ON "instructions" ("project_id", "updated_at" DESC);

-- Index for issues by project and status (if status field exists)
CREATE INDEX IF NOT EXISTS "idx_issues_project_updated" 
ON "issues" ("project_id", "updated_at" DESC);

-- Index for issue messages by issue
CREATE INDEX IF NOT EXISTS "idx_issue_messages_issue" 
ON "issue_messages" ("issue_id", "created_at" DESC);

-- Index for templates by project
CREATE INDEX IF NOT EXISTS "idx_templates_project" 
ON "templates" ("project_id", "updated_at" DESC);

-- Composite index for user-specific queries
CREATE INDEX IF NOT EXISTS "idx_projects_user_workspace" 
ON "projects" ("user_id", "workspace_id");

-- Index for embedded files lookup
CREATE INDEX IF NOT EXISTS "idx_embedded_files_project_branch" 
ON "embedded_files" ("project_id", "embedded_branch_id");

-- Index for workspace queries by user
CREATE INDEX IF NOT EXISTS "idx_workspaces_user_updated" 
ON "workspaces" ("user_id", "updated_at" DESC);