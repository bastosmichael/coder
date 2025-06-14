import { CRUDPage } from "@/components/dashboard/reusable/crud-page"
import EditTemplateForm from "@/components/templates/edit-template-form"
import { NotFound } from "@/components/utility/not-found"
import { getInstructionsByProjectId } from "@/db/queries/instructions-queries"
import { getTemplateWithInstructionById } from "@/db/queries/templates-queries"

export const revalidate = 0

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
    id: string
  }>
}) {
  // unwrap the promise to get your route params
  const { id, projectId } = await params

  const template = await getTemplateWithInstructionById(id)
  if (!template) {
    return <NotFound message="Template not found" />
  }

  const instructions = await getInstructionsByProjectId(projectId)

  return (
    <CRUDPage
      pageTitle="Edit template"
      backText="Back to templates"
      backLink=".."
    >
      <EditTemplateForm
        templateWithInstructions={template}
        instructions={instructions}
      />
    </CRUDPage>
  )
}
