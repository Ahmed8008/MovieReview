import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import pool from '@/Database/db';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        try {
          const { rows } = await pool.query(
            'SELECT * FROM accounttable WHERE email = $1',
            [email]
          );

          if (rows.length === 0) {
            throw new Error('Invalid credentials');
          }

          const user = rows[0];
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid credentials');
          }

          return { id: user.user_id.toString(), name: user.name, email: user.email, username: user.username, role: user.role }; // Include username
        } catch (error) {
          console.error('Error during authorization:', error);
          throw new Error('Invalid Email or Password');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      if (token?.id) {
        session.user.id = token.id;
      }
      if (token?.username) {
        session.user.username = token.username; // Add username to the session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
});
