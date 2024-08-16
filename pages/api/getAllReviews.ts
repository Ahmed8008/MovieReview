import pool from '@/Database/db'; // Adjust the import path if necessary

export default async function handler(req:any, res:any) {
  const { movie_id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT user_id, stars, review, ratedon,username FROM ratings WHERE movie_id = $1 ORDER BY ratedon DESC',
        [movie_id]
      );

      res.status(200).json({ success: true, reviews: result.rows });
    } catch (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
