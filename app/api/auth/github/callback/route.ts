import { getUserId } from "@/actions/auth/auth"
import { upsertUserGithubToken } from "@/db/queries/user-github-tokens-queries"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.json({ error: "Authorization code not provided" }, { status: 400 })
  }

  try {
    // Get the current user from Clerk
    const userId = await getUserId()

    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code for token: ${tokenResponse.statusText}`)
    }

    const tokenData = await tokenResponse.json()
    
    if (tokenData.error) {
      throw new Error(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`)
    }

    // Store the user's GitHub token
    await upsertUserGithubToken({
      userId,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenType: tokenData.token_type || "bearer",
      scope: tokenData.scope,
    })

    // Redirect back to the appropriate page
    const redirectUrl = state ? decodeURIComponent(state) : "/projects"
    return NextResponse.redirect(new URL(redirectUrl, request.url))

  } catch (error) {
    console.error("GitHub OAuth callback error:", error)
    return NextResponse.json(
      { error: "Failed to complete GitHub authentication" },
      { status: 500 }
    )
  }
}