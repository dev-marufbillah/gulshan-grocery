import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error token role
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error session role
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // এখানে খালি থাকবে, auth.ts এ প্রোভাইডার বসাবো
} satisfies NextAuthConfig;