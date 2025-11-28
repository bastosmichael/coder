"use server"

import { getUserId } from "@/actions/auth/auth"
import { getUserGithubToken } from "@/db/queries/user-github-tokens-queries"

export async function checkUserGitHubConnection(): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_APP_MODE === "simple") {
    return !!process.env.GITHUB_PAT
  }

  try {
    const userId = await getUserId()
    const userToken = await getUserGithubToken(userId)
    return !!userToken?.accessToken
  } catch (error) {
    return false
  }
}