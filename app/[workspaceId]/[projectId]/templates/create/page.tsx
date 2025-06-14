import { CRUDPage } from "@/components/dashboard/reusable/crud-page"
import NewTemplateForm from "@/components/templates/new-template-form"
import { getInstructionsByProjectId } from "@/db/queries/instructions-queries"

export const revalidate = 0

export default async function CreateTemplatePage({
  params,
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
  }>
}) {
  // unwrap the route params promise
  const { projectId } = await params

  const instructions = await getInstructionsByProjectId(projectId)

  return (
    <CRUDPage
      pageTitle="New template"
      backText="Back to templates"
      backLink="../templates"
    >
      <NewTemplateForm instructions={instructions} />
    </CRUDPage>
  )
}
