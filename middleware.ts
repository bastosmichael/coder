import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server"

export default function middleware(
  _req: NextRequest,
  _ev: NextFetchEvent
) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
