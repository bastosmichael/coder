import { IssuesList } from "@/components/issues/issues-list"
import { getIssuesByProjectId } from "@/db/queries/issues-queries"

export const revalidate = 0

export default async function IssuesPage({
  params,
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
  }>
}) {
  // unwrap the promise to get the real params
  const { projectId } = await params

  const issues = await getIssuesByProjectId(projectId)
  return <IssuesList issues={issues} />
}
