// types/next-auth.d.ts
import NextAuth from 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// 1) Extend the `User` type to include anything you want on `session.user`
declare module 'next-auth' {
  interface User extends DefaultUser {
    id?: string;
    role?: string;
  }

  // 2) Add custom properties to `session`
  interface Session {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

// 3) Add custom properties to the `JWT` interface as well (if using JWT strategy)
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}
