import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: any;
      id?:any;
      username?: any
    
     
    };
  }

  interface User {
    role?: any;
    username?: any // Add the role property
    
  }
}
