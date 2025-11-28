"use server"

import { GitHubRepository } from "@/types/github"
import { getAuthenticatedOctokit, getUserAuthenticatedOctokit } from "./auth"

const MAX_RETRIES = 5

async function fetchWithBackoff<T>(fn: () => Promise<T>, retries = 0): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    if (
      error.status === 403 &&
      error.message?.includes("secondary rate limit") &&
      retries < MAX_RETRIES
    ) {
      const delay = 1000 * Math.pow(2, retries)
      console.warn(`Hit secondary rate limit. Retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return fetchWithBackoff(fn, retries + 1)
    }
    throw error
  }
}

export const listRepos = async (
  installationId: number | null,
  organizationId: string | null,
  /**
   * Optionally limit the number of repositories returned. If omitted, all
   * repositories are included.
   */
  fetchCount?: number
): Promise<GitHubRepository[]> => {
  try {
    let octokit
    let repositories: any[] = []
    let page = 1
    const per_page = 100 // Max allowed by GitHub API

    // In advanced mode, prefer user authentication when available
    if (process.env.NEXT_PUBLIC_APP_MODE === "advanced") {
      try {
        octokit = await getUserAuthenticatedOctokit()
      } catch (error) {
        // Fall back to installation auth if user token is not available
        octokit = await getAuthenticatedOctokit(installationId)
      }
    } else {
      octokit = await getAuthenticatedOctokit(installationId)
    }

    while (true) {
      let response: any

      if (installationId && process.env.NEXT_PUBLIC_APP_MODE !== "advanced") {
        // Use installation endpoints for simple mode
        response = await fetchWithBackoff(() =>
          octokit.apps.listReposAccessibleToInstallation({
            per_page,
            page
          })
        )
        repositories = repositories.concat(response.data.repositories)
      } else {
        // Use user endpoints for advanced mode or when no installation ID
        response = await fetchWithBackoff(() =>
          octokit.request("GET /user/repos", {
            per_page,
            page,
            sort: "updated",
            direction: "desc"
          })
        )
        repositories = repositories.concat(response.data)
      }

      if (response.data.length < per_page) break
      page++
    }

    // Filter repositories by organization ID
    if (organizationId) {
      repositories = repositories.filter(
        repo => repo.owner && repo.owner.login === organizationId
      )
    }

    // Sort by updated_at and optionally limit the number returned
    repositories.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    if (fetchCount !== undefined) {
      repositories = repositories.slice(0, fetchCount)
    }

    return repositories
      .map(repo => ({
        description: repo.description,
        full_name: repo.full_name,
        html_url: repo.html_url,
        id: repo.id,
        name: repo.name,
        private: repo.private
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch (error: any) {
    throw new Error(error)
  }
}
