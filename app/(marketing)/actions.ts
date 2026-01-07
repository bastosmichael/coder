"use server"

import { upsertAppConfig } from "@/db/queries/app-config-queries"

interface SaveAppConfigState {
  message: string
  status: "success" | "error"
}

export async function saveAppConfig(
  _prevState: SaveAppConfigState | null,
  formData: FormData
): Promise<SaveAppConfigState> {
  const anthropicApiKey = String(formData.get("anthropicApiKey") ?? "").trim()
  const openaiApiKey = String(formData.get("openaiApiKey") ?? "").trim()
  const grokApiKey = String(formData.get("grokApiKey") ?? "").trim()
  const githubPat = String(formData.get("githubPat") ?? "").trim()

  if (!anthropicApiKey || !openaiApiKey || !grokApiKey || !githubPat) {
    return {
      status: "error",
      message: "Please fill in all required fields."
    }
  }

  try {
    await upsertAppConfig({
      anthropicApiKey,
      openaiApiKey,
      grokApiKey,
      githubPat
    })

    return {
      status: "success",
      message: "Config saved. Redirecting to onboarding..."
    }
  } catch (error) {
    console.error(error)
    return {
      status: "error",
      message: "Failed to save config. Please try again."
    }
  }
}
