import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma / bcrypt imports). Used by the middleware
 * to gate routes, and extended in auth.ts with the Credentials provider.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isProtected =
        path.startsWith("/app") || path.startsWith("/onboarding");

      if (isProtected) return isLoggedIn;

      // Bounce logged-in users away from the auth pages.
      if ((path === "/login" || path === "/register") && isLoggedIn) {
        return Response.redirect(new URL("/app", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
