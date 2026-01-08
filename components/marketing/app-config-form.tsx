"use client"

import { useEffect } from "react"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { saveAppConfig } from "@/app/(marketing)/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AppConfigFormProps {
  defaultValues?: {
    anthropicApiKey: string
    openaiApiKey: string
    grokApiKey: string
    githubPat: string
  }
}

const initialState = {
  message: "",
  status: "success" as const
}

export function AppConfigForm({ defaultValues }: AppConfigFormProps) {
  const router = useRouter()
  const [state, formAction] = useFormState(saveAppConfig, initialState)

  useEffect(() => {
    if (state.status === "success" && state.message) {
      const timeout = window.setTimeout(() => {
        router.push("/onboarding")
      }, 800)

      return () => window.clearTimeout(timeout)
    }
  }, [router, state.message, state.status])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect your APIs</CardTitle>
        <CardDescription>
          Store your API credentials securely before we start onboarding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="anthropicApiKey">Anthropic API key</Label>
            <Input
              id="anthropicApiKey"
              name="anthropicApiKey"
              type="password"
              autoComplete="off"
              required
              defaultValue={defaultValues?.anthropicApiKey}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="openaiApiKey">OpenAI API key</Label>
            <Input
              id="openaiApiKey"
              name="openaiApiKey"
              type="password"
              autoComplete="off"
              required
              defaultValue={defaultValues?.openaiApiKey}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="grokApiKey">Grok API key</Label>
            <Input
              id="grokApiKey"
              name="grokApiKey"
              type="password"
              autoComplete="off"
              required
              defaultValue={defaultValues?.grokApiKey}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="githubPat">GitHub PAT</Label>
            <Input
              id="githubPat"
              name="githubPat"
              type="password"
              autoComplete="off"
              required
              defaultValue={defaultValues?.githubPat}
            />
          </div>
          {state.message ? (
            <p
              className={`text-sm ${state.status === "success" ? "text-emerald-600" : "text-destructive"
                }`}
            >
              {state.message}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Save and continue
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
