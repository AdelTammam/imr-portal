/*
 * auth.ts
 * Date: August 2026
 * Description: NextAuth v5 configuration for the IMR portal.
 *   Inputs:  Email and password credentials submitted via the login form.
 *   Processing: Looks up the user in the in-memory store, verifies the
 *     bcrypt password hash, and attaches the role to the JWT session token.
 *     JWT callbacks persist the role so API routes can read it without
 *     an additional database query.
 *   Outputs: Session object containing id, email, and role fields.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { usersStore } from "@/lib/users-store";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = usersStore.findByEmail(credentials.email as string);
        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],

  callbacks: {
    // Persist role in the JWT so it's available on every request
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    // Expose role on the client-side session object
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/login" },
});
