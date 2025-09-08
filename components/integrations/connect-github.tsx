"use client"

import { Github } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { FC, useState } from "react"
import { Integration } from "./integration"

interface ConnectGitHubProps {
  isGitHubConnected: boolean
}

export const ConnectGitHub: FC<ConnectGitHubProps> = ({
  isGitHubConnected
}) => {
  const router = useRouter()
  const params = useParams()

  const [isConnecting, setIsConnecting] = useState(false)

  const projectId = params.projectId as string

  const handleConnect = async () => {
    try {
      setIsConnecting(true)

      // In advanced mode, we need both OAuth and App Installation
      // First, handle OAuth for user token
      const workspaceId = params.workspaceId as string
      const redirectUrl = `/${workspaceId}/${projectId}/integrations`
      const state = encodeURIComponent(redirectUrl)
      
      if (process.env.NEXT_PUBLIC_APP_MODE === "advanced") {
        // Use OAuth flow for user authentication
        const oauthUrl = `https://github.com/login/oauth/authorize?` +
          `client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/github/callback`)}&` +
          `scope=repo,user:email,read:org&` +
          `state=${state}`
        
        router.push(oauthUrl)
      } else {
        // Simple mode - use GitHub App installation
        const appUrl = `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/select_target?state=${state}`
        router.push(appUrl)
      }
    } catch (error) {
      console.error("GitHub connection error:", error)
      router.push(`/projects`)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Integration
      name="GitHub"
      icon={<Github className="size-5" />}
      isConnecting={isConnecting}
      isConnected={isGitHubConnected}
      disabled={isConnecting || isGitHubConnected}
      onClick={handleConnect}
    />
  )
}
