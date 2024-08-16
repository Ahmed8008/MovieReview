"use client";
import React, { useEffect, useState } from 'react';
import { FaStar,FaSignOutAlt  } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Modal from '@/Components/Modal';

import { useSession, signOut } from 'next-auth/react';
interface Movie {
  movie_id: number;
  moviename: string;
  moviedescription: string;
  genres: string;
  category: string;
  movietype: string;
  imagepath: string;
  user_id: number;
}

const Page = () => {
  const { data: session } = useSession(); // Retrieve session data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [averageRatings, setAverageRatings] = useState<{ [key: number]: string }>({});
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // State for dropdown visibility
  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Redirect to home after logout
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movieslist');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data);

        // Fetch average ratings for each movie
        const ratings = await Promise.all(
          data.map(async (movie: Movie) => {
            const ratingResponse = await fetch(`/api/getRating?movie_id=${movie.movie_id}`);
            const ratingData = await ratingResponse.json();
            return { movie_id: movie.movie_id, averageRating: ratingData.averageRating };
          })
        );

        // Store average ratings in state
        setAverageRatings(
          ratings.reduce((acc, { movie_id, averageRating }) => {
            acc[movie_id] = averageRating;
            return acc;
          }, {} as { [key: number]: string })
        );
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        setError('Failed to fetch movies');
      }
    };

    fetchMovies();
  }, []);

  const handleSlideClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickLogin = () => {
    router.push('/LoginIn'); // Replace with your desired path
  };

  const handleClickRegister = () => {
    router.push('/Registration'); // Replace with your desired path
  };

  return (
    <div className="bg-[#0A0A0A] text-white font-sans min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0F0F0F] z-50 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center sm:flex-row mr-7 ml-12">
            <img
              src="/logo1.png"
              alt="Logo"
              className="w-25 h-auto" // Adjust width and height as needed
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-white text-2xl"
            onClick={toggleMenu}
          >
            ☰
          </button>

          {/* Navigation Links */}
          <nav className={`flex sm:flex-row text-center flex-col ${menuOpen ? 'block' : 'hidden'} sm:space-x-4 py-2`} id="navMenu">
            <a href="/" className="hover:text-yellow-400">Home</a>
            <a href="/BrowseMovies" className="hover:text-yellow-400">Browse Movies</a>
            <a href="/PopularMovies" className="hover:text-yellow-400">Browse Popular Movies</a>
            <a href="/TopReiewedMovies" className="hover:text-yellow-400">Browse Top Reviewed Movies</a>
          </nav>

          {/* Auth Buttons */}
          <div className="mt-4 sm:mt-0 sm:space-x-4 flex flex-col sm:flex-row w-1/2 ml-10 sm:w-auto mr-12">
            {session ? (
              session.user?.role === 'user' ? (
                <div className="relative">
                  <button 
                    className="bg-pink-500 px-4 py-2 rounded-full text-white" 
                    onClick={toggleDropdown}
                  >
                    {session.user?.username}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-gray-800 rounded shadow-lg">
                      <button onClick={handleLogout} className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-700">
                        <FaSignOutAlt className="mr-2" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={handleClickLogin} className="bg-pink-500 px-4 py-2 rounded-full text-white mb-2 sm:mb-0">Log In</button>
                  <button onClick={handleClickRegister} className="bg-pink-500 px-4 py-2 rounded-full text-white">Sign Up</button>
                </>
              )
            ) : (
              <>
                <button onClick={handleClickLogin} className="bg-pink-500 px-4 py-2 rounded-full text-white mb-2 sm:mb-0">Log In</button>
                <button onClick={handleClickRegister} className="bg-pink-500 px-4 py-2 rounded-full text-white">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>


      {/* Add padding to ensure content is visible below the fixed header */}
      <div className={`pt-48 sm:pt-40 ${menuOpen ? 'pt-96' : ''} md:pt-32 lg:pt-20`}>
        <br />

        {/* Movie Grid */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6 ml-4">Popular Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.slice().reverse().slice(0, 5).map((movie) => (
              <div key={movie.movie_id} className="rounded-lg p-4 mb-8" onClick={() => handleSlideClick(movie)}>
                <img
                  src={movie.imagepath}
                  alt={movie.moviename}
                  className="w-full h-80 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xs font-bold text-center mb-2">{movie.moviename}</h3>
                <div className="flex items-center justify-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{averageRatings[movie.movie_id] || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Movie Details */}
        {selectedMovie && (
          <Modal
            movie={selectedMovie}
            userId={session?.user?.id || 0}
            userRole={session?.user?.role || ''}
            username={session?.user?.username || ''}
            averageRatings={averageRatings} // Pass averageRatings
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
