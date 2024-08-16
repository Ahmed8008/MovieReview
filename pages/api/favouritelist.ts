import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import pool from '@/Database/db'; // Ensure this path is correct for your database module

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get session
      const session = await getSession({ req });

      // Check if session exists and user ID is available
      if (session && session.user && typeof session.user.id === 'string') {
        const userId = session.user.id;

        // Query database using the extracted user ID
        const result = await pool.query(
          `SELECT 
            m.Movie_Id, 
            m.MovieName, 
            m.Genres,
            m.MovieType,
            m.imagepath
          FROM 
            Movies m
          INNER JOIN 
            Favorites f ON f.Movie_Id = m.Movie_Id
          WHERE 
            f.User_Id = $1`,
          [userId]
        );

        res.status(200).json(result.rows);
      } else {
        res.status(401).json({ message: 'Unauthorized: No session found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching movies', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
