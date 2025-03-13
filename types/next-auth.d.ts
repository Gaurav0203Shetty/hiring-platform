import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    // Ensure that these properties are always available
    id: string;
    role: string;
    skills?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      skills?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    skills?: string | null;
  }
}
