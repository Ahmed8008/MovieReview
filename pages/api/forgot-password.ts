import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import pool from '@/Database/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      const result = await pool.query('SELECT * FROM accounttable WHERE Email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Email not found' });
      }

      const token = crypto.randomBytes(20).toString('hex');
      const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now in ISO format

      await pool.query(
        'UPDATE accounttable SET ResetPasswordToken = $1, ResetPasswordTokenExpiry = $2 WHERE Email = $3',
        [token, expiry, email]
      );

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      try {
        await transporter.sendMail({
          to: email,
          from: process.env.EMAIL_USER,
          subject: 'Password Reset',
          text: `Click the following link to reset your password: movie-review-green-eight.vercel.app/reset-password?token=${token}`,
        });
        res.status(200).json({ message: 'Password reset link sent' });
      } catch (emailError) {
        console.error('Email error:', emailError);
        return res.status(500).json({ error: 'Failed to send email' });
      }

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
