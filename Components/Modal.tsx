import React, { useState, useEffect } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';

interface Movie {
  movie_id: number;
  moviename: string;
  imagepath: string;
  genres: string;
  moviedescription: string;
}

interface Review {
  user_id: number;
  username: string;
  stars: number;
  review: string;
  ratedon: string;
}

interface ModalProps {
  movie: Movie | null;
  userId: number;
  userRole: string;
  username: string;
  onClose: () => void;
  averageRatings: { [key: number]: string }; // Pass averageRatings as a prop
}

const Modal: React.FC<ModalProps> = ({ movie, userId, userRole, username, onClose, averageRatings }) => {
  const [stars, setStars] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchRating = async () => {
      if (movie && userId) {
        try {
          const response = await fetch(`/api/getRating?movie_id=${movie.movie_id}&user_id=${userId}`);
          const result = await response.json();
          if (result.success) {
            setStars(result.rating);
            setReview(result.review || '');
          } else {
            console.error('Failed to fetch rating.');
          }
        } catch (err) {
          console.error('Error fetching rating:', err);
        }
      }
    };

    const fetchReviews = async () => {
      if (movie) {
        try {
          const response = await fetch(`/api/getAllReviews?movie_id=${movie.movie_id}`);
          const result = await response.json();
          if (result.success) {
            setReviews(result.reviews);
          } else {
            console.error('Failed to fetch reviews.');
          }
        } catch (err) {
          console.error('Error fetching reviews:', err);
        }
      }
    };

    fetchRating();
    fetchReviews();
  }, [movie, userId]);

  const handleSubmit = async () => {
    if (stars < 1 || stars > 10 || !review.trim()) {
      setError('Please provide a valid star rating (1-10) and review.');
      return;
    }

    setError(null); // Clear previous errors
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submitReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_id: movie?.movie_id, user_id: userId, stars, review, username }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Review submitted successfully!');
        onClose();
      } else {
        setError('Failed to submit review.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error submitting review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starValue: number) => {
    setStars(starValue);
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-[#2D2D2D] rounded-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[80vh] shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <img
            src={movie.imagepath}
            alt={movie.moviename}
            className="w-64 h-64 object-cover rounded-lg mb-4 shadow-md"
          />
          
          <h3 className="text-2xl font-bold text-white mb-2">{movie.moviename}</h3>
          <p className="flex items-center text-yellow-400 text-lg font-semibold mb-2">
            <FaStar /> {averageRatings[movie.movie_id] || 'N/A'}
          </p>
          <p className="text-gray-400 text-base">{movie.genres}</p>
          <p className="font-semibold text-white mt-4">Description</p>
          <p className="text-gray-300 mt-2">{movie.moviedescription}</p>

          {userRole === 'user' && (
            <>
              {/* Star Rating */}
              <div className="flex items-center space-x-1 mt-6 mb-4">
                {[...Array(10)].map((_, index) => {
                  const star = index + 1;
                  return (
                    <FaStar
                      key={star}
                      color={star <= stars ? "#FFD700" : "#444"}
                      size={28}
                      className="cursor-pointer transition-transform transform hover:scale-110"
                      onClick={() => handleStarClick(star)}
                    />
                  );
                })}
              </div>

              {/* Review Textarea */}
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full mb-4 p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              {error && <p className="text-red-500 mb-2">{error}</p>}

              <button
                onClick={handleSubmit}
                className={`bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                Submit Review
              </button>
            </>
          )}

          {/* Display all reviews */}
          <div className="mt-8 w-full">
            <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-gray-700 pb-2">All Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.user_id} className="bg-[#1A1A1A] rounded-lg p-6 mb-6 shadow-lg border border-gray-800">
                  <div className="flex-1 mb-4">
                    <div className="flex items-center mr-4">
                      <FaUser color="#FFD700" size={25} />
                      <p className="text-center m-2">{review.username}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {[...Array(review.stars)].map((_, i) => (
                          <FaStar key={i} color="#FFD700" size={24} />
                        ))}
                        {[...Array(10 - review.stars)].map((_, i) => (
                          <FaStar key={i + review.stars} color="#444" size={24} />
                        ))}
                      </div>
                      <p className="text-gray-300 text-base mb-2">{review.review}</p>
                      <p className="text-gray-500 text-sm">Rated on: {new Date(review.ratedon).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-300 text-lg">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
