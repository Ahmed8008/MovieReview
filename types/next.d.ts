// types/next.d.ts
import 'next';
import { NextApiRequest } from 'next';
import { IncomingForm } from 'formidable';

// Extend NextApiRequest to include the file property
declare module 'next' {
  export interface NextApiRequest {
    file?: Express.Multer.File;
  }
}
