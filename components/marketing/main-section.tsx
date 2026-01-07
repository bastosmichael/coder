"use client"

import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import Image from "next/image"
import ShineBorder from "@/components/magicui/shine-border"

export default function MainSection() {
  return (
    <section className="relative isolate px-6 py-16">
      <ShineBorder
        borderRadius={12}
        borderWidth={2}
        color="#6366f1"
        className="bg-background/80 mx-auto flex max-w-5xl flex-col items-center gap-10 p-10 backdrop-blur md:flex-row"
      >
        <div className="flex-1 text-center md:text-left">
          <h1 className="from-primary to-primary/70 bg-gradient-to-br bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Accelerate Your Development
            <br className="hidden md:block" /> with Coder
          </h1>

          <p className="text-muted-foreground mb-8 text-lg md:text-xl">
            Integrate with GitHub,
            <br className="hidden md:block" />
            access your repositories with issues,
            <br className="hidden md:block" />
            and create ML-driven PRs effortlessly!
          </p>

          <Button asChild>
            <Link href="/onboarding">
              <span>Connect GitHub </span>
              <ArrowRightIcon className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
        <div className="flex-1">
          <Image
            src="/dashboard-light.png"
            alt="Coder dashboard screenshot"
            width={800}
            height={600}
            className="rounded shadow-lg dark:hidden"
          />
          <Image
            src="/dashboard-dark.png"
            alt="Coder dashboard screenshot"
            width={800}
            height={600}
            className="hidden rounded shadow-lg dark:block"
          />
        </div>
      </ShineBorder>
    </section>
  )
}
