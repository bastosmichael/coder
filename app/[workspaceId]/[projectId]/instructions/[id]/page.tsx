import { Instruction } from "@/components/instructions/instruction"
import { NotFound } from "@/components/utility/not-found"
import { getInstructionById } from "@/db/queries/instructions-queries"

export const revalidate = 0

export default async function InstructionPage({
  params,
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
    id: string
  }>
}) {
  // unwrap the promise to extract all three route params
  const { id } = await params

  const instruction = await getInstructionById(id)
  if (!instruction) {
    return <NotFound message="Instruction not found" />
  }

  return <Instruction instruction={instruction} />
}
