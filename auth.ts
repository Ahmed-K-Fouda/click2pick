import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProivder from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
export const config = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProivder({
      credentials: {
        email: { type: "email" },
        password: { type: "email" },
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        // find user ind db
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        // check if user exist and password is mathches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          //   if password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // if user dos not exist || pass not match, return null
        return null;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      // set user id from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      console.log(token);

      //   if udpate set user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, session, trigger }: any) {
      // assign user field to token
      if (user) {
        token.role = user.role;

        // if user has no name
        if (user.name === "NO-NAME") {
          token.name = user.email!.split("@")[0];

          // update database to reflect token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
