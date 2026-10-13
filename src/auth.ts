import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

const SUPER_ADMIN_EMAIL = "marufsalauddinofficial@gmail.com";
const SUPER_ADMIN_PASS = "AdminPassword@123";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const inputEmail = (credentials?.email as string)?.trim().toLowerCase();
        const inputPassword = credentials?.password as string;

        if (!inputEmail || !inputPassword) return null;

        await connectDB();

        // 🌟 Auto Super Admin Login & Creation (গ্যারান্টিড লগইন)
        if (inputEmail === SUPER_ADMIN_EMAIL && inputPassword === SUPER_ADMIN_PASS) {
          let superAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });
          const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASS, 10);

          if (!superAdmin) {
            superAdmin = await User.create({
              name: "Maruf Salauddin",
              email: SUPER_ADMIN_EMAIL,
              password: hashedPassword,
              role: "superadmin",
            });
          } else if (superAdmin.role !== "superadmin" || !superAdmin.password) {
            superAdmin.role = "superadmin";
            superAdmin.password = hashedPassword;
            await superAdmin.save();
          }

          return {
            id: superAdmin._id.toString(),
            name: superAdmin.name,
            email: superAdmin.email,
            role: "superadmin",
          };
        }

        // সাধারণ ইউজার/এডমিন লগইন চেকিং
        const user = await User.findOne({ email: inputEmail });
        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(inputPassword, user.password);
        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});