import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;     
      role?: string;      // optional if we want tenant roles later
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
  }
}
