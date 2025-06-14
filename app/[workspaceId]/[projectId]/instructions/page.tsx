import { InstructionsList } from "@/components/instructions/instruction-list"
import { getInstructionsByProjectId } from "@/db/queries/instructions-queries"

export const revalidate = 0

export default async function InstructionListPage({
  params,
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
  }>
}) {
  // unwrap the promise to get your actual route values
  const { projectId } = await params

  const instructions = await getInstructionsByProjectId(projectId)
  return <InstructionsList instructions={instructions} />
}
