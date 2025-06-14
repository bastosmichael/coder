import { Integrations } from "@/components/integrations/integrations"
import { NotFound } from "@/components/utility/not-found"
import { getProjectById, getWorkspaceById } from "@/db/queries"

export const revalidate = 0

export default async function IntegrationsPage({
  params,
}: {
  // params is now a Promise of your dynamic segments
  params: Promise<{
    workspaceId: string
    projectId: string
  }>
}) {
  // unwrap the promise to extract your actual route values
  const { workspaceId, projectId } = await params

  const workspace = await getWorkspaceById(workspaceId)
  if (!workspace) {
    return <NotFound message="Workspace not found" />
  }

  const project = await getProjectById(projectId)
  if (!project) {
    return <NotFound message="Project not found" />
  }

  const isGitHubConnected = !!project.githubInstallationId
  return <Integrations isGitHubConnected={isGitHubConnected} />
}
