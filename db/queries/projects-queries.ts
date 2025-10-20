"use server"

import { getUserId } from "@/actions/auth/auth"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "../db"
import {
  InsertProject,
  SelectProject,
  projectsTable
} from "../schema/projects-schema"
import { InsertIssue, issuesTable, SelectIssue } from "../schema/issues-schema"
import { listRepos } from "@/actions/github/list-repos"
import { listBranches } from "@/actions/github/list-branches"
import { workspacesTable } from "../schema/workspaces-schema"
import {
  InsertInstruction,
  instructionsTable,
  SelectInstruction
} from "../schema/instructions-schema"
import {
  InsertTemplate,
  SelectTemplate,
  templatesTable
} from "../schema/templates-schema"
import { addInstructionToIssue } from "./issues-to-instructions-queries"
import { addInstructionToTemplate } from "./templates-to-instructions-queries"
import { fetchGitHubRepoIssues } from "@/app/api/auth/callback/github/api"

export async function createProjects(workspaces: any[]): Promise<any[]> {
  try {
    const projectCreationPromises = workspaces.map(async workspace => {
      if (workspace.githubOrganizationId) {
        const organizationId = workspace.githubOrganizationName
        let repositories: any[] = []

        // In advanced mode we don't yet have an installation ID to
        // authenticate the GitHub App, so skip repo fetching.
        if (process.env.NEXT_PUBLIC_APP_MODE === "simple") {
          repositories = await listRepos(null, organizationId)
        }

        const projects = await Promise.all(
          repositories.map(async (repo: any) => {
            const existing = await findProjectByRepo(
              workspace.id,
              repo.full_name
            )
            if (existing) {
              return existing
            }

            let githubTargetBranch = null
            const branches = await listBranches(null, repo.full_name)
            if (branches.includes("main")) {
              githubTargetBranch = "main"
            } else if (branches.includes("master")) {
              githubTargetBranch = "master"
            }

            const project = await createProject({
              name: repo.name,
              workspaceId: workspace.id,
              githubRepoId: repo.id, // Passing repository ID as INTEGER
              githubRepoFullName: repo.full_name, // Assigning repo.full_name to githubRepoFullName
              githubTargetBranch: githubTargetBranch // Assigning target branch if exists
            })

            const instruction = await createSampleInstruction(project.id, repo) // Create a sample instruction for the project
            const template = await createSampleTemplate(project.id, repo) // Create a sample template for the project
            await addInstructionToTemplate(template.id, instruction.id) // Tie the instruction to the template

            const issues = await createSampleIssues(project.id, repo)

            // Now you have an array; attach the instruction to each local issue
            for (const issue of issues) {
              await addInstructionToIssue(issue.id, instruction.id)
            }

            return project
          })
        )

        // Return the created projects

        return projects
      } else {
        // Advanced mode - create a bare project for the workspace if none exists
        const existing = await getProjectsByWorkspaceId(workspace.id)
        if (existing.length > 0) {
          return existing
        }

        const project = await createProject({
          name: workspace.name,
          workspaceId: workspace.id
        })

        return [project]
      }
    })

    const projects = await Promise.all(projectCreationPromises)

    // Flatten the array of projects
    return projects.flat()
  } catch (error) {
    console.error("Error creating projects:", error)
    throw error
  }
}

export async function createProject(
  data: Omit<InsertProject, "userId">
): Promise<SelectProject> {
  const userId = await getUserId()

  try {
    if (data.githubRepoFullName) {
      const existing = await findProjectByRepo(
        data.workspaceId,
        data.githubRepoFullName
      )
      if (existing) {
        return existing
      }
    }
    const [result] = await db
      .insert(projectsTable)
      .values({ ...data, userId })
      .returning()
    revalidatePath("/")
    await updateWorkspaceUpdatedAt(data.workspaceId) // Update the workspace's updatedAt field
    return result
  } catch (error) {
    console.error("Error creating project record:", error)
    throw error
  }
}

export async function getProjectById(
  id: string
): Promise<SelectProject | undefined> {
  try {
    return await db.query.projects.findFirst({
      where: eq(projectsTable.id, id)
    })
  } catch (error) {
    console.error(`Error getting project by id ${id}:`, error)
    throw error
  }
}

export async function getProjectsByUserId(): Promise<SelectProject[]> {
  const userId = await getUserId()

  try {
    return db.query.projects.findMany({
      where: eq(projectsTable.userId, userId),
      orderBy: desc(projectsTable.updatedAt)
    })
  } catch (error) {
    console.error("Error getting projects for user:", error)
    throw error
  }
}

export async function getProjectsByWorkspaceId(
  workspaceId: string
): Promise<SelectProject[]> {
  try {
    return await db.query.projects.findMany({
      where: eq(projectsTable.workspaceId, workspaceId),
      orderBy: desc(projectsTable.updatedAt)
    })
  } catch (error) {
    console.error(`Error getting projects for workspace ${workspaceId}:`, error)
    throw error
  }
}

export async function getAllProjects(): Promise<SelectProject[]> {
  return db.query.projects.findMany({
    orderBy: desc(projectsTable.updatedAt)
  })
}

export async function findProjectByRepo(
  workspaceId: string,
  repoFullName: string
): Promise<SelectProject | undefined> {
  try {
    return db.query.projects.findFirst({
      where: and(
        eq(projectsTable.workspaceId, workspaceId),
        eq(projectsTable.githubRepoFullName, repoFullName)
      )
    })
  } catch (error) {
    console.error(
      `Error finding project for repo ${repoFullName} in workspace ${workspaceId}:`,
      error
    )
    throw error
  }
}

export async function updateProject(
  id: string,
  data: Partial<InsertProject>
): Promise<void> {
  try {
    const project = await getProjectById(id)
    if (!project) {
      throw new Error(`Project with id ${id} not found`)
    }
    await db
      .update(projectsTable)
      .set(data)
      .where(and(eq(projectsTable.id, id)))
    revalidatePath("/")
    await updateWorkspaceUpdatedAt(project.workspaceId) // Update the workspace's updatedAt field
  } catch (error) {
    console.error(`Error updating project ${id}:`, error)
    throw error
  }
}

export async function getMostRecentIssueWithinProjects(
  workspaceId: string
): Promise<{ projectId: string } | undefined> {
  const result = await db
    .select({
      projectId: projectsTable.id
    })
    .from(issuesTable)
    .innerJoin(projectsTable, eq(issuesTable.projectId, projectsTable.id))
    .where(eq(projectsTable.workspaceId, workspaceId))
    .orderBy(desc(issuesTable.updatedAt))
    .limit(1)

  return result[0] ? { projectId: result[0].projectId } : undefined
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const project = await getProjectById(id)
    if (!project) {
      throw new Error(`Project with id ${id} not found`)
    }
    await db.delete(projectsTable).where(and(eq(projectsTable.id, id)))
    revalidatePath("/")
    await updateWorkspaceUpdatedAt(project.workspaceId) // Update the workspace's updatedAt field
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error)
    throw error
  }
}

async function updateWorkspaceUpdatedAt(workspaceId: string): Promise<void> {
  try {
    await db
      .update(workspacesTable)
      .set({ updatedAt: new Date() })
      .where(eq(workspacesTable.id, workspaceId))
  } catch (error) {
    console.error(`Error updating workspace ${workspaceId}:`, error)
    throw error
  }
}

async function createSampleInstruction(
  projectId: string,
  repo: any
): Promise<SelectInstruction> {
  const userId = await getUserId()

  try {
    const instructionData: InsertInstruction = {
      projectId,
      userId,
      name: `Sample Instruction for ${repo.name}`,
      content: `This is a sample instruction created for the repository ${repo.full_name}.`
    }

    const [instruction] = await db
      .insert(instructionsTable)
      .values(instructionData)
      .returning()
    return instruction
  } catch (error) {
    console.error(
      `Error creating sample instruction for project ${projectId}:`,
      error
    )
    throw error
  }
}

async function createSampleTemplate(
  projectId: string,
  repo: any
): Promise<SelectTemplate> {
  const userId = await getUserId()

  try {
    const templateData: InsertTemplate = {
      projectId,
      userId,
      name: `Sample Template for ${repo.name}`,
      content: `This is a sample template created for the repository ${repo.full_name}.`
    }

    const [template] = await db
      .insert(templatesTable)
      .values(templateData)
      .returning()
    return template
  } catch (error) {
    console.error(
      `Error creating sample template for project ${projectId}:`,
      error
    )
    throw error
  }
}

async function createSampleIssues(
  projectId: string,
  repo: any
): Promise<SelectIssue[]> {
  const userId = await getUserId()

  // 1. Pull down all GitHub issues for the repository
  const existingGitHubIssues = await fetchGitHubRepoIssues(repo.full_name)

  // 2. If the repo has no GitHub issues, create a series of local bootstrap issues
  if (existingGitHubIssues.length === 0) {
    const bootstrapIssues: InsertIssue[] = [
      {
        projectId,
        userId,
        name: `Create AGENTS.md for ${repo.name}`,
        content: `# 🧠 Create \`AGENTS.md\` to Document AI-Powered Codebase Agents

## Objective
Document the roles, triggers, behavior, and outputs of any LLM-based or autonomous agents used in this project. This file will act as a reference for contributors and AI tooling alike.

## Tasks
- Create a top-level \`AGENTS.md\` file
- Identify all LLM-based or automated agent functions in the codebase
  - Example: agents that generate README files, templates, test cases, CI workflows, etc.
- For each agent, include:
  - ✅ Name
  - ✅ Description of what it does
  - ✅ What triggers it (issues, commands, CI events)
  - ✅ Inputs and outputs
  - ✅ Where the logic lives (e.g., \`/agents/doc-writer.ts\`)
  - ✅ Review or audit process (if applicable)

## Suggested Sections
- Overview of agents in this repo
- Table of agents with name + description + trigger
- Detailed breakdown of each agent
- How to invoke each agent (via CLI, CI, or prompts)
- Future agent proposals (optional)
- Contribution instructions for new agents

## Prompt Guidance
If using an LLM to generate this file:
- Look for repeated logic patterns or utilities used to create or respond to issues, templates, or test generation
- Cross-reference \`createSampleIssues\`, instruction logic, or \`addInstructionToX\` files to infer agent behavior

## ✅ Completion Criteria
- A complete \`AGENTS.md\` exists at the repo root
- All currently known agents are listed
- Information is accurate and human-readable
- Structure follows markdown best practices

This file will help guide contributors and support reproducibility of LLM agent behavior in the future.`
      },
      {
        projectId,
        userId,
        name: `Add and Improve Documentation for ${repo.name}`,
        content: `# 📘 Improve Documentation for ${repo.full_name}

## 🧭 Goal
Create or update the repository documentation to clearly explain:
- What this project does,
- Who it's for,
- How to set it up locally,
- And how to contribute or run it.

## 📋 Task Breakdown
1. Overview of the app
2. Setup instructions
3. Run instructions
4. Testing steps
5. Contribution guidelines

## 🤖 LLM Prompt Context
Generate a README.md with placeholders if needed. Be general where tech is unclear, and specific where recognizable.

## ✅ Completion Criteria
- Well-structured \`README.md\`
- Clean, markdown formatted
- Covers setup, usage, and contribution steps`
      },
      {
        projectId,
        userId,
        name: `Generate Auto Documentation for ${repo.name}`,
        content: `# 📄 Generate Code Documentation Using Built-In Tools

## Objective
Use built-in tooling or comment-based generators (e.g., JSDoc, docstrings, etc.) to create auto documentation artifacts.

## Tasks
- Add missing doc comments to source files
- Generate API/index or module reference documentation
- Output to /docs or integrate into README

## ✅ Completion Criteria
- Includes a /docs folder or equivalent
- Documentation generation steps are documented
- Core functions/classes/modules are described`
      },
      {
        projectId,
        userId,
        name: `Add CI/CD GitHub Actions Workflow to ${repo.name}`,
        content: `# 🚀 Setup GitHub Actions for CI/CD

## Goal
Create a workflow that runs on push and pull requests to validate the codebase.

## Tasks
- Add lint, build, and test steps
- Use project language or detect tooling automatically
- Name file: \`.github/workflows/ci.yml\`

## ✅ Completion Criteria
- CI runs successfully on PRs
- Workflow includes lint/build/test jobs`
      },
      {
        projectId,
        userId,
        name: `Add Initial Unit Test and Coverage for ${repo.name}`,
        content: `# 🧪 Add Unit Test & Coverage

## Objective
Add at least one unit test and setup test coverage tooling.

## Tasks
- Identify a small function or entry point to test
- Use default test framework if one exists, or scaffold one
- Ensure test passes and produces coverage output

## ✅ Completion Criteria
- Test file exists and passes
- Coverage output is generated
- Test command documented in README or package script`
      }
    ]

    const insertedIssues: SelectIssue[] = []
    for (const issueData of bootstrapIssues) {
      const [issue] = await db.insert(issuesTable).values(issueData).returning()
      insertedIssues.push(issue)
    }

    return insertedIssues
  }

  // 3. If there are existing GitHub issues, mirror them locally
  const createdIssues: SelectIssue[] = []
  for (const ghIssue of existingGitHubIssues) {
    const issueData: InsertIssue = {
      projectId,
      userId,
      name: ghIssue.title,
      content: ghIssue.body || "No content provided."
    }

    const [localIssue] = await db
      .insert(issuesTable)
      .values(issueData)
      .returning()
    createdIssues.push(localIssue)
  }

  return createdIssues
}
