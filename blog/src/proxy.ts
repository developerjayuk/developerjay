import { NextResponse } from "next/server";

// TODO(PB-0002): pass-through only — real session + email-allowlist check lands in PB-0002.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
