import { Adapter } from "next-auth/adapters";
import primsaBase from "@/lib/db/prisma";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/lib/env";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(primsaBase) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      await mergeAnonymousCartIntoUserCart(user.id);
    },
  },
};

export default authOptions;
