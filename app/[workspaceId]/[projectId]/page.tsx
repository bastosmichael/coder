import { getProjectById } from "@/db/queries/projects-queries"

export const revalidate = 0

export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    workspaceId: string
    projectId: string
  }>
}) {
  // unwrap the route params promise
  const { projectId } = await params

  const project = await getProjectById(projectId)
  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="text-2xl font-semibold">{project.name}</div>
    </div>
  )
}
