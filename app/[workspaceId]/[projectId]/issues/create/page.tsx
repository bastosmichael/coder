import { CRUDPage } from "@/components/dashboard/reusable/crud-page"
import { IssueCreation } from "@/components/issues/issue-creation"

export const revalidate = 0

export default async function CreateIssuePage({
  params,
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
  }>
}) {
  // unwrap the promise to get your route values
  const { projectId } = await params

  return (
    <CRUDPage
      pageTitle="New issue"
      backText="Back to issues"
      backLink="../issues"
    >
      <IssueCreation projectId={projectId} />
    </CRUDPage>
  )
}
