"use server"

import { getAuthenticatedOctokit } from "./auth"

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

export const listBranches = async (
  repoFullName: string
): Promise<string[]> => {
  try {
    const octokit = await getAuthenticatedOctokit()
    const [owner, repo] = repoFullName.split("/")
    let page = 1
    const allBranches: string[] = []

    while (true) {
      const { data } = await fetchWithBackoff(() =>
        octokit.repos.listBranches({
          owner,
          repo,
          per_page: 100,
          page
        })
      )

      if (!data || data.length === 0) {
        break
      }

      allBranches.push(...data.map(branch => branch.name))
      page += 1
    }

    return allBranches
  } catch (error: any) {
    console.error("Error fetching branches:", error)
    return []
  }
}
