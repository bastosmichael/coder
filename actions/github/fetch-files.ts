"use server"

import { GitHubFile, GitHubFileContent } from "@/types/github"
import { getAuthenticatedOctokit } from "./auth"
import { fetchWithRetry } from "./fetch-codebase"
import { sanitizeFileContent } from "@/lib/utils"

export async function fetchFiles(
  installationId: number | null,
  files: GitHubFile[]
) {
  // List of file extensions to exclude
  const excludedExtensions = [
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".tiff", ".webp", ".ico", ".heic", ".raw"
  ]

  // List of files to exclude
  const excludedFiles = ["package-lock.json"]

  // List of directories to exclude
  const excludedDirs = ["public", "migrations", "node_modules"]

  // Filter out unwanted files or directories based on excludedFiles, excludedDirs, and excludedExtensions
  const filteredFiles = files.filter(
    (file: any) =>
      !excludedFiles.includes(file.name) &&
      !excludedDirs.some(dir => file.path.includes(dir)) &&
      !excludedExtensions.some(extension => file.name.endsWith(extension))
  )

  const octokit = await getAuthenticatedOctokit(installationId)

  // Process files in batches to avoid overwhelming the API
  const BATCH_SIZE = 10
  const results: (GitHubFileContent | null)[] = []

  for (let i = 0; i < filteredFiles.length; i += BATCH_SIZE) {
    const batch = filteredFiles.slice(i, i + BATCH_SIZE)
    
    const batchPromises = batch.map(async (file: GitHubFile) => {
      try {
        const { data } = await fetchWithRetry(octokit, {
          owner: file.owner,
          repo: file.repo,
          path: file.path,
          ref: file.ref
        })

        if (Array.isArray(data) || !("content" in data)) {
          throw new Error(`Unexpected response for ${file.path}`)
        }

        const content = Buffer.from(data.content, "base64").toString("utf-8")
        const sanitizedContent = sanitizeFileContent(content)

        return {
          name: file.name,
          path: file.path,
          content: sanitizedContent
        }
      } catch (error) {
        console.error("Error fetching file:", file, error)
        // Return null for failed files instead of throwing
        return null
      }
    })

    // Wait for current batch to complete before starting next batch
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
    
    // Small delay between batches to be respectful to GitHub API
    if (i + BATCH_SIZE < filteredFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  const filesContent = results

  // Filter out null results (failed fetches)
  return filesContent.filter((file): file is GitHubFileContent => file !== null)
}
