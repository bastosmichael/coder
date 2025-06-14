import { AIFileInfo, AIParsedResponse } from "@/types/ai"

export function parseAIResponse(response: string): AIParsedResponse {
  const files: AIFileInfo[] = []

  const fileListMatch = response.match(/<file_list>([\s\S]*?)<\/file_list>/)
  const fileList = fileListMatch
    ? fileListMatch[1]
        .trim()
        .split("\n")
        .map(file => file.trim())
    : []

  const fileBlocks = response.match(/<file>[\s\S]*?<\/file>/g) || []
  for (const block of fileBlocks) {
    const path = block.match(/<file_path>(.*?)<\/file_path>/)?.[1].trim() || ""
    const status =
      (block.match(/<file_status>(.*?)<\/file_status>/)?.[1].trim() ??
        "modified") as "new" | "modified" | "deleted"
    const contentMatch = block.match(
      /<file_content language="(.*?)">([\s\S]*?)<\/file_content>/
    )

    let language = ""
    let content = ""
    if (contentMatch) {
      language = contentMatch[1].trim()
      content = contentMatch[2].trim()
      if (!content.endsWith("\n")) {
        content += "\n"
      }
    }

    files.push({ path, language, content, status })
  }

  const prTitleMatch = response.match(/<pr_title>([\s\S]*?)<\/pr_title>/)
  const prTitle = prTitleMatch ? prTitleMatch[1].trim() : ""
  const prDescriptionMatch = response.match(
    /<pr_description>([\s\S]*?)<\/pr_description>/
  )
  const prDescription = prDescriptionMatch ? prDescriptionMatch[1].trim() : ""

  return { fileList, files, prTitle, prDescription }
}
