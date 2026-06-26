import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// The middleware uses only the edge-safe config (no DB / bcrypt).
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.svg|manifest.webmanifest|sw.js|offline.html|icons|.*\\.png$).*)",
  ],
};
