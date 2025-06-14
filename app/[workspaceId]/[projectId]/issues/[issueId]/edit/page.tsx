import { EditIssueForm } from "@/components/issues/edit-issue-form"
import { getIssueById } from "@/db/queries/issues-queries"

export const revalidate = 0

export default async function EditIssuePage({
  params,
}: {
  // params is now a Promise of all your dynamic segments
  params: Promise<{
    workspaceId: string
    projectId: string
    issueId: string
  }>
}) {
  // await to unwrap the actual route values
  const { issueId } = await params

  const issue = await getIssueById(issueId)
  if (!issue) {
    return <div>Issue not found</div>
  }

  return <EditIssueForm issue={issue} />
}
