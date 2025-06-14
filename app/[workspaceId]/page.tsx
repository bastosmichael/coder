import { getWorkspaceById } from "@/db/queries/workspaces-queries"

export const revalidate = 0

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{
    workspaceId: string
  }>
}) {
  // await to unwrap the actual workspaceId
  const { workspaceId } = await params

  const workspace = await getWorkspaceById(workspaceId)
  if (!workspace) {
    return <div>Workspace not found</div>
  }

  return <div>{workspace.name}</div>
}
