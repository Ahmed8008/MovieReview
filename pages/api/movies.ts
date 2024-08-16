import type { NextApiRequest, NextApiResponse } from 'next';



import pool from '@/Database/db';

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { MovieName, MovieDescription, Genres, Category, MovieType, ImagePath, User_Id} = req.body;

    if (!MovieName || !MovieDescription || !Genres || !Category || !MovieType || !ImagePath || !User_Id) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    
      const result = await pool.query(
        'INSERT INTO movies (MovieName, MovieDescription, Genres, Category, MovieType, ImagePath,User_Id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [MovieName, MovieDescription, Genres, Category, MovieType, ImagePath, User_Id]
      );

      res.status(200).json({ message: 'Movie added successfully', result });
    }
}
