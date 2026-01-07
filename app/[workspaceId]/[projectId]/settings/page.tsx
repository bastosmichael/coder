import { listRepos } from "@/actions/github/list-repos"
import { ProjectSetup } from "@/components/projects/project-setup"
import { getProjectById } from "@/db/queries/projects-queries"
import { getWorkspaceById } from "@/db/queries/workspaces-queries"
import { GitHubRepository } from "@/types/github"

export const revalidate = 0

export default async function SettingsPage({
  params
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
  }>
}) {
  // unwrap the promise to get actual route values
  const { workspaceId, projectId } = await params

  const project = await getProjectById(projectId)
  if (!project) {
    return <div>Project not found</div>
  }

  const workspace = await getWorkspaceById(workspaceId)
  if (!workspace) {
    return <div>Workspace not found</div>
  }

  const organizationId = workspace.githubOrganizationName ?? null

  const repos: GitHubRepository[] = await listRepos(organizationId)

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center">
      <ProjectSetup className="mt-6" project={project} repos={repos} />
    </div>
  )
}
