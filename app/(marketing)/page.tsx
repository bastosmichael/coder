import MainSection from "@/components/marketing/main-section"

export default async function MarketingPage() {
  return (
    <div className="relative mx-auto mt-24 max-w-7xl px-6 md:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,theme(colors.primary/20),transparent)]" />
      <MainSection />
    </div>
  )
}
