// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Replace with your real credential check
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        // Compare hashed passwords in real apps!
        if (user && user.password === credentials?.password) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // or 'database' if you prefer sessions in DB
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  // Add secret + other config as needed:
  secret: process.env.NEXTAUTH_SECRET,
};
