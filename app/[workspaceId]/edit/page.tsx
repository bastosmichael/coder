import { NotFound } from "@/components/utility/not-found"
import { EditWorkspaceClient } from "@/components/workspaces/edit-workspace-client"
import { getWorkspaceById } from "@/db/queries/workspaces-queries"

export const revalidate = 0

export default async function EditWorkspace({
  params,
}: {
  params: Promise<{
    workspaceId: string
  }>
}) {
  // unwrap the promise to get the actual workspaceId
  const { workspaceId } = await params

  const workspace = await getWorkspaceById(workspaceId)
  if (!workspace) {
    return <NotFound message="Workspace not found" />
  }

  return (
    <EditWorkspaceClient
      workspace={workspace}
      workspaceId={workspaceId}
    />
  )
}
