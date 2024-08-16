import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import pool from '@/Database/db';

const saltRounds = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token, password } = req.body;

    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    try {
      const currentTimestamp = new Date(); // Current date and time
     

      const result = await pool.query(
        'SELECT ResetPasswordToken, ResetPasswordTokenExpiry FROM accounttable WHERE ResetPasswordToken = $1 AND ResetPasswordTokenExpiry > $2',
        [token, currentTimestamp]
      );

   

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await pool.query(
        'UPDATE accounttable SET Password = $1, ResetPasswordToken = NULL, ResetPasswordTokenExpiry = NULL WHERE ResetPasswordToken = $2',
        [hashedPassword, token]
      );

      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
