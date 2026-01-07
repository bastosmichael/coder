import { AppConfigForm } from "@/components/marketing/app-config-form"
import { getAppConfigByUserId } from "@/db/queries/app-config-queries"

export default async function MarketingPage() {
  const appConfig = await getAppConfigByUserId()

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16 md:px-8">
      <div className="w-full">
        <AppConfigForm
          defaultValues={
            appConfig
              ? {
                  anthropicApiKey: appConfig.anthropicApiKey,
                  openaiApiKey: appConfig.openaiApiKey,
                  grokApiKey: appConfig.grokApiKey,
                  githubPat: appConfig.githubPat
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}
