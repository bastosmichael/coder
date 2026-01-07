"use client"

import { FC } from "react"

export const Integrations: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">Integrations</div>
      <div className="text-muted-foreground text-sm">
        GitHub access is configured with the <code>GITHUB_PAT</code> environment
        variable. Update it in your deployment settings to change integrations.
      </div>
    </div>
  )
}
