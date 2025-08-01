import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const hasCart = request.cookies.get("sessionCartId");

  if (!hasCart) {
    const sessionCartId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set("sessionCartId", sessionCartId);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
