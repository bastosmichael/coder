import { Dashboard } from "@/components/dashboard/dashboard"
import { getProjectsByWorkspaceId } from "@/db/queries/projects-queries"
import { getWorkspacesByUserId } from "@/db/queries/workspaces-queries"

export const revalidate = 0

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{
    workspaceId: string
    projectId?: string
  }>
}) {
  // unwrap the params promise
  const { workspaceId, projectId } = await params

  const workspaces = await getWorkspacesByUserId()
  const projects = await getProjectsByWorkspaceId(workspaceId)

  const IntegrationStatus = {
    isGitHubConnected: false,
  }

  return (
    <Dashboard
      IntegrationStatus={IntegrationStatus}
      workspaces={workspaces}
      workspaceId={workspaceId}
      projectId={projectId}
      projects={projects}
    >
      {children}
    </Dashboard>
  )
}
