import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/Database/db'; // Ensure this path is correct for your database module

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM movies');
      res.status(200).json(result.rows);
    
    } catch (error) {
      res.status(500).json({ message: 'Error fetching movies', error });
    }
  } else if (req.method === 'DELETE') {
    const { movie_id } = req.query;

    if (typeof movie_id !== 'string') {
      return res.status(400).json({ message: 'Invalid movie_id' });
    }

    try {
      const result = await pool.query('DELETE FROM movies WHERE movie_id = $1 RETURNING *', [movie_id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.status(200).json({ message: 'Movie deleted successfully', deletedMovie: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting movie', error });
    }
  } else if (req.method === 'PUT') {
    const { movie_id } = req.query;
    const { moviename, moviedescription, genres, category, movietype } = req.body;

    if (typeof movie_id !== 'string') {
      return res.status(400).json({ message: 'Invalid movie_id' });
    }

    try {
      const result = await pool.query(
        'UPDATE movies SET moviename = $1, moviedescription = $2, genres = $3, category = $4, movietype = $5 WHERE movie_id = $6 RETURNING *',
        [moviename, moviedescription, genres, category, movietype, movie_id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      res.status(200).json({ message: 'Movie updated successfully', updatedMovie: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error updating movie', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
