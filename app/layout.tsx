import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/utility/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
})

export const metadata: Metadata = {
  title: "Coder",
  description: "Build software with AI."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
