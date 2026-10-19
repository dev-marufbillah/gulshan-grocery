import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        try {
          await connectDB();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const user = (await User.findOne({ email }).lean()) as any;

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(password, String(user.password));

          if (!isValid) return null;

          return {
            id: String(user._id),
            name: String(user.name || "User"),
            email: String(user.email || ""),
            role: String(user.role || "user"),
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id || "";
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "gulshan_grocery_super_secret_key_12345",
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextAuthHandler = NextAuth(authOptions) as any;

// Next.js 15/16 Async Params & Turbopack JSON Fetch Fix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authHandler(req: NextRequest, context: any) {
  try {
    const rawParams = context?.params ? await context.params : {};
    let nextauthParams = rawParams?.nextauth;

    // Dynamic Route parsing fallback
    if (!nextauthParams || !Array.isArray(nextauthParams)) {
      const pathname = req.nextUrl.pathname;
      nextauthParams = pathname.replace(/^\/api\/auth\/?/, "").split("/").filter(Boolean);
    }

    const response = await nextAuthHandler(req, { params: { nextauth: nextauthParams } });

    // Handle empty JSON responses cleanly
    if (response && response.status === 200) {
      const clonedRes = response.clone();
      const text = await clonedRes.text();
      if (!text || text.trim() === "") {
        return NextResponse.json({ user: null });
      }
    }

    return response;
  } catch (error) {
    console.error("NextAuth Route Handler Exception:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

export { authHandler as GET, authHandler as POST };