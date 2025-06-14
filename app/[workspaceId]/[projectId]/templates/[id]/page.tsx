import { Template } from "@/components/templates/template"
import { NotFound } from "@/components/utility/not-found"
import { getTemplateWithInstructionById } from "@/db/queries/templates-queries"

export const revalidate = 0

export default async function TemplatePage({
  params,
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
    id: string
  }>
}) {
  // unwrap the route params
  const { id } = await params

  const template = await getTemplateWithInstructionById(id)
  if (!template) {
    return <NotFound message="Template not found" />
  }

  return <Template template={template} />
}
