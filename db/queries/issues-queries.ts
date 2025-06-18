"use server"

import { getUserId } from "@/actions/auth/auth"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "../db"
import { InsertIssue, SelectIssue, issuesTable } from "../schema/issues-schema"
import { projectsTable } from "../schema/projects-schema"
import { fetchGitHubRepoIssues } from "@/app/api/auth/callback/github/api"
import { getProjectById } from "./projects-queries"

export async function createIssue(
  data: Omit<InsertIssue, "userId">
): Promise<SelectIssue> {
  const userId = await getUserId()

  const [issue] = await db
    .insert(issuesTable)
    .values({ ...data, userId })
    .returning()
  revalidatePath("/")
  await updateProjectUpdatedAt(data.projectId)
  return issue
}

export async function getIssuesByProjectId(
  projectId: string
): Promise<SelectIssue[]> {
  return db.query.issues.findMany({
    where: and(eq(issuesTable.projectId, projectId)),
    orderBy: desc(issuesTable.createdAt)
  })
}

export async function getIssueById(
  id: string
): Promise<SelectIssue | undefined> {
  return db.query.issues.findFirst({
    where: eq(issuesTable.id, id)
  })
}

export async function updateIssue(
  id: string,
  data: Partial<InsertIssue>
): Promise<SelectIssue> {
  const updateQuery = db
    .update(issuesTable)
    .set(data)
    .where(eq(issuesTable.id, id))

  if (Object.keys(data).length === 0) {
    throw new Error("No fields provided to update")
  }

  const [updatedIssue] = await updateQuery.returning()
  revalidatePath("/")
  if (updatedIssue) {
    await updateProjectUpdatedAt(updatedIssue.projectId)
  }
  return updatedIssue
}

export async function deleteIssue(id: string): Promise<void> {
  const issue = await getIssueById(id)
  if (!issue) {
    throw new Error(`Issue with id ${id} not found`)
  }
  await db.delete(issuesTable).where(eq(issuesTable.id, id))
  revalidatePath("/")
  await updateProjectUpdatedAt(issue.projectId)
}

export async function updateIssuesFromGitHub(
  projectId: string
): Promise<SelectIssue[]> {
  const project = await getProjectById(projectId)
  if (!project || !project.githubRepoFullName) {
    return []
  }

  const ghIssues = await fetchGitHubRepoIssues(project.githubRepoFullName)
  const existing = await getIssuesByProjectId(projectId)
  const existingTitles = new Set(existing.map(i => i.name))
  const userId = await getUserId()

  const created: SelectIssue[] = []
  for (const ghIssue of ghIssues) {
    if (existingTitles.has(ghIssue.title)) continue
    const [issue] = await db
      .insert(issuesTable)
      .values({
        projectId,
        userId,
        name: ghIssue.title,
        content: ghIssue.body || "No content provided."
      })
      .returning()
    created.push(issue)
  }

  if (created.length > 0) {
    revalidatePath("/")
    await updateProjectUpdatedAt(projectId)
  }

  return created
}

async function updateProjectUpdatedAt(projectId: string): Promise<void> {
  try {
    await db
      .update(projectsTable)
      .set({ updatedAt: new Date() })
      .where(eq(projectsTable.id, projectId))
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error)
    throw error
  }
}
