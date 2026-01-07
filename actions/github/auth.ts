"use server"

import { Octokit } from "@octokit/rest"

export async function getAuthenticatedOctokit() {
  const auth = process.env.GITHUB_PAT!
  return new Octokit({ auth })
}
