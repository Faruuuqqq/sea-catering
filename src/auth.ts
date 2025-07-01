import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        if ('role' in user) {
          token.role = (user as unknown as { role: string }).role;
        }
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (typeof credentials?.email !== 'string' || typeof credentials?.password !== 'string') {
          return null;
        }

        const dbUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!dbUser) return null;

        const isPasswordMatch = await bcrypt.compare(credentials.password, dbUser.password);

        if (!isPasswordMatch) return null;

        return {
            id: String(dbUser.id),
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
        };
      },
    }),
  ],
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);