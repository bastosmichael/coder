"use server"

import { createAppAuth } from "@octokit/auth-app"
import { Octokit } from "@octokit/rest"
import { getUserId } from "@/actions/auth/auth"
import { getUserGithubToken } from "@/db/queries/user-github-tokens-queries"

export async function getAuthenticatedOctokit(installationId: number | null) {
  let auth = ""

  if (process.env.NEXT_PUBLIC_APP_MODE === "simple") {
    auth = process.env.GITHUB_PAT!
  } else {
    const appAuth = createAppAuth({
      appId: process.env.NEXT_PUBLIC_GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_PRIVATE_KEY!,
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    })

    if (!installationId) {
      throw new Error("Installation ID is required for app authentication")
    }

    const { token } = await appAuth({ type: "installation", installationId })
    auth = token
  }

  return new Octokit({ auth })
}

export async function getUserAuthenticatedOctokit() {
  if (process.env.NEXT_PUBLIC_APP_MODE === "simple") {
    return new Octokit({ auth: process.env.GITHUB_PAT! })
  }

  const userId = await getUserId()
  const userToken = await getUserGithubToken(userId)
  
  if (!userToken) {
    throw new Error("User GitHub token not found. Please reconnect your GitHub account.")
  }

  return new Octokit({ auth: userToken.accessToken })
}
