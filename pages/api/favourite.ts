import type { NextApiRequest, NextApiResponse } from 'next';



import pool from '@/Database/db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { movie_id, user_id} = req.body;

    if (!user_id || !user_id) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    
      const result = await pool.query(
        'INSERT INTO Favorites (movie_id, user_id) VALUES ($1, $2)',
        [movie_id, user_id]
      );

      res.status(200).json({ message: 'added successfully', result });
    }
}
