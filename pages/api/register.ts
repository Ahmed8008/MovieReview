import type { NextApiRequest, NextApiResponse } from 'next';

import bcrypt from 'bcrypt'; // Import bcrypt for hashing

import pool from '@/Database/db';

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { UserName, FirstName, LastName, Email, Password, Role, ResetPasswordToken, ResetPasswordTokenExpiry } = req.body;

    if (!UserName || !FirstName || !LastName || !Password || !Email) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Set default values if not provided
    const roleValue = Role || 'user';
    const resetPasswordTokenValue = ResetPasswordToken || 'none';
    const resetPasswordTokenExpiryValue = ResetPasswordTokenExpiry || null;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(Password, saltRounds);

      // Insert the user data into the database
      const result = await pool.query(
        'INSERT INTO accounttable (UserName, FirstName, LastName, Email, Password, Role, ResetPasswordToken, ResetPasswordTokenExpiry) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [UserName, FirstName, LastName, Email, hashedPassword, roleValue, resetPasswordTokenValue, resetPasswordTokenExpiryValue]
      );

      res.status(200).json({ message: 'User registered successfully', result });
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
