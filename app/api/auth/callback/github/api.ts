import { Octokit } from "@octokit/rest"

// Initialize Octokit with environment variable
const octokit = new Octokit({
  auth: process.env.GITHUB_PAT
})

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let attempt = 0
  while (attempt < maxRetries) {
    try {
      attempt++
      return await fn()
    } catch (error) {
      // If we're not at the last attempt, back off exponentially
      if (attempt < maxRetries) {
        const backoffDelay = 1000 * Math.pow(2, attempt - 1) // 1s, 2s, 4s, etc.
        console.warn(
          `Attempt #${attempt} failed. Retrying in ${backoffDelay}ms...`,
          error
        )
        await new Promise(resolve => setTimeout(resolve, backoffDelay))
      } else {
        // Re-throw on the final failed attempt
        throw error
      }
    }
  }
  // Should never get here, but just in case
  throw new Error("fetchWithRetry: Max retries exceeded.")
}

export async function fetchGitHubOrganizations(): Promise<any[]> {
  try {
    const organizations = await fetchWithRetry(async () => {
      const { data } = await octokit.orgs.listForAuthenticatedUser()
      return data
    })
    return organizations
  } catch (error) {
    console.error("Error fetching GitHub organizations:", error)
    throw new Error("Failed to fetch GitHub organizations")
  }
}

export async function fetchUserGitHubAccount(): Promise<any> {
  try {
    const user = await fetchWithRetry(async () => {
      const { data } = await octokit.users.getAuthenticated()
      return data
    })
    return {
      id: user.id,
      login: user.login
    }
  } catch (error) {
    console.error("Error fetching GitHub user account:", error)
    throw new Error("Failed to fetch GitHub user account")
  }
}

export async function fetchGitHubRepositories(orgId: string): Promise<any[]> {
  try {
    const repositories = await fetchWithRetry(async () => {
      const { data } = await octokit.repos.listForOrg({ org: orgId })
      return data
    })
    return repositories
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error)
    throw new Error("Failed to fetch GitHub repositories")
  }
}

export async function fetchGitHubRepoIssues(
  repoFullName: string
): Promise<any[]> {
  try {
    const [owner, repo] = repoFullName.split("/")

    const issues = await fetchWithRetry(async () => {
      const { data } = await octokit.issues.listForRepo({ owner, repo })
      return data.filter(issue => !issue.pull_request)
    })

    return issues
  } catch (error) {
    console.error("Error fetching GitHub repo issues:", error)
    throw new Error("Failed to fetch GitHub repo issues")
  }
}

export async function fetchOpenGitHubRepoIssues(
  repoFullName: string
): Promise<any[]> {
  try {
    const [owner, repo] = repoFullName.split("/")

    const data = await fetchWithRetry(async () => {
      const res = await octokit.issues.listForRepo({
        owner,
        repo,
        state: "open"
      })
      // Filter out any issues that are actually pull requests
      return res.data.filter(issue => !issue.pull_request)
    })

    return data
  } catch (error) {
    console.error("Error fetching open GitHub repo issues:", error)
    throw new Error("Failed to fetch open GitHub repo issues")
  }
}

export async function fetchOpenGitHubRepoPullRequests(
  repoFullName: string
): Promise<any[]> {
  try {
    const [owner, repo] = repoFullName.split("/")

    const data = await fetchWithRetry(async () => {
      const res = await octokit.pulls.list({
        owner,
        repo,
        state: "open"
      })
      return res.data
    })

    return data
  } catch (error) {
    console.error("Error fetching open GitHub repo pull requests:", error)
    throw new Error("Failed to fetch open GitHub repo pull requests")
  }
}
