import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toString(),
          },
        });

        if (!user) {
          return null;
        }

        const passwordIsValid = await bcrypt.compare(
          credentials.password.toString(),
          user.password
        );

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      /*
       * Refresh the user's role from the database.
       *
       * This prevents an old JWT session from continuing
       * to use CUSTOMER after the account has been changed
       * to SUPPORT or ADMIN.
       */
      if (token.id) {
        const databaseUser = await prisma.user.findUnique({
          where: {
            id: Number(token.id),
          },
          select: {
            id: true,
            role: true,
            name: true,
            email: true,
          },
        });

        if (databaseUser) {
          token.id = databaseUser.id.toString();
          token.role = databaseUser.role;
          token.name = databaseUser.name;
          token.email = databaseUser.email;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;

        if (token.name) {
          session.user.name = token.name;
        }

        if (token.email) {
          session.user.email = token.email;
        }
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};