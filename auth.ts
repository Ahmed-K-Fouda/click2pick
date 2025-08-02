import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProivder from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mergeGuestCartWithUser } from "@/lib/actions/cart.actions";

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
        token.id = user.id;
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

        // Enhanced cart merging logic for sign in/sign up
        if (trigger === "signIn" || trigger === "signUp") {
          try {
            await mergeGuestCartWithUser(user.id);
          } catch (error) {
            console.error("Error merging guest cart:", error);
          }
        }
      }

      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // protect path with regex
      const protectedPath = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      // get path name from req url obj
      const { pathname } = request.nextUrl;

      // check if user not authenticated and access prtotect path
      if (!auth && protectedPath.some((p) => p.test(pathname))) return false;
      // check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        // clone the req headers
        const newReqHeaders = new Headers(request.headers);
        // create new res and add new header
        const response = NextResponse.next({
          request: {
            headers: newReqHeaders,
          },
        });

        // set new genrated session cart id in res session
        response.cookies.set("sessionCartId", sessionCartId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
