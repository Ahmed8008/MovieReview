import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/Database/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { MovieName, MovieDescription, Genres, Category, MovieType, ImageUrl, User_Id } = req.body;

    if (!MovieName || !MovieDescription || !Genres || !Category || !MovieType || !ImageUrl || !User_Id) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO movies (MovieName, MovieDescription, Genres, Category, MovieType, ImagePath, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [MovieName, MovieDescription, Genres, Category, MovieType, ImageUrl, User_Id]
      );

      res.status(200).json({ message: 'Movie added successfully', result });
    } catch (error) {
      console.error('Error adding movie:', error);
      res.status(500).json({ message: 'Error adding movie', error: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
