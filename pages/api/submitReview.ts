// pages/api/submitReview.js
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/Database/db';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { movie_id, user_id, stars, review, username } = req.body;
   
    try {
      // Check if a review from this user for this movie already exists
      const existingReview = await pool.query(
        'SELECT * FROM ratings WHERE movie_id = $1 AND user_id = $2',
        [movie_id, user_id]
      );

      if (existingReview.rows.length > 0) {
        // Review exists, update it
        await pool.query(
          'UPDATE ratings SET stars = $1, review = $2, ratedon = NOW(), username = $3 WHERE movie_id = $4 AND user_id = $5',
          [stars, review, username, movie_id, user_id]
        );
      } else {
        // No review exists, insert new one
        await pool.query(
          'INSERT INTO ratings (movie_id, user_id, stars, ratedon, review, username) VALUES ($1, $2, $3, NOW(), $4, $5)',
          [movie_id, user_id, stars, review, username]
        );
      }

      res.status(200).json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
      console.error('Error processing review:', error);
      res.status(500).json({ success: false, message: 'Failed to process review' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
