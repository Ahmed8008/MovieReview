// pages/api/getRating.js
import pool from '@/Database/db'; // Adjust the import path if necessary

export default async function handler(req:any, res:any) {
  const { movie_id } = req.query;

  if (req.method === 'GET') {
    try {
      // Query to fetch all ratings for the movie
      const result = await pool.query(
        'SELECT stars FROM ratings WHERE movie_id = $1',
        [movie_id]
      );

      const ratings = result.rows;

      if (ratings.length > 0) {
        // Calculate average rating
        const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
        const averageRating = (totalStars / ratings.length).toFixed(1);
        res.status(200).json({ success: true, averageRating: averageRating });
      } else {
        res.status(200).json({ success: true, averageRating: 'N/A' });
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch ratings' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
