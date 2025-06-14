import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"

const isSimpleMode = process.env.NEXT_PUBLIC_APP_MODE === "simple"

const isProtectedRoute = createRouteMatcher(["/onboarding(.*)", "/projects(.*)"])
const uuidRegex =
  /^\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\/.*)?$/

const clerkAuthMiddleware = clerkMiddleware((auth, req) => {
    const { userId, redirectToSignIn } = auth()
    const path = req.nextUrl.pathname

    const isProtected = isProtectedRoute(req) || uuidRegex.test(path)

    if (!userId && isProtected) {
      return redirectToSignIn({ returnBackUrl: "/login" })
    }

    return NextResponse.next()
  })

export default function middleware(req: NextRequest) {
  if (isSimpleMode) {
    return NextResponse.next()
  }

  return clerkAuthMiddleware(req)
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
