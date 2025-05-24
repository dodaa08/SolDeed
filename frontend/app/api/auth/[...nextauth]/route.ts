// If you see type errors, run: npm install --save-dev @types/next-auth
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/app/utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

interface Credentials {
  name?: string;
  email: string;
  wallet_address: string;
  isSignUp?: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        wallet_address: { label: "Wallet Address", type: "text" },
        isSignUp: { label: "Sign Up", type: "hidden" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;
        const { name, email, wallet_address, isSignUp } = credentials as unknown as Credentials;
        if (isSignUp === "true") {
          // Sign Up: Insert user
          const { data, error } = await supabase
            .from("users")
            .insert([{ name, email, wallet_address }])
            .select()
            .single();
          if (error) throw new Error(error.message);
          return data as User;
        } else {
          // Sign In: Find user
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("wallet_address", wallet_address)
            .single();
          if (error || !data) throw new Error("Invalid credentials");
          return data as User;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: { session: Session; token: any; user?: User }) {
      session.user = user || token?.user || session.user;
      return session;
    },
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) token.user = user;
      return token;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
} as NextAuthOptions);

export { handler as GET, handler as POST }; 