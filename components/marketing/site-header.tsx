"use client"

import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link className="text-md flex items-center" href="/">
          Coder
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/onboarding" className="hover:text-foreground">
            Go to onboarding
          </Link>
        </nav>
      </div>
    </header>
  )
}
