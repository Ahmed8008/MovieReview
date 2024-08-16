"use client";
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { FaStar, FaSignOutAlt } from 'react-icons/fa';
import Modal from '@/Components/Modal';
import { useRouter } from 'next/navigation';
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
  const [inTheaterMovies, setInTheaterMovies] = useState<Movie[]>([]);
  const [onTVMovies, setOnTVMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // State for dropdown visibility
  const [averageRatings, setAverageRatings] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movieslist');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data);

        // Filter movies by category
        setInTheaterMovies(data.filter((movie: Movie) => movie.category === 'In Theater'));
        setOnTVMovies(data.filter((movie: Movie) => movie.category === 'On TV'));

        // Fetch average ratings for each movie
        const ratings = await Promise.all(
          data.map(async (movie: any) => {
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

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Redirect to home after logout
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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

        {/* Slider for Top Movies */}
        <div className="p-8 max-w-7xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            navigation
            loop={true}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
              1280: { slidesPerView: 4, spaceBetween: 30 }
            }}
          >
            {movies.slice(0, 5).map((movie) => (
              <SwiperSlide key={movie.movie_id} onClick={() => handleSlideClick(movie)}>
                <div className="flex flex-col items-center">
                  <img 
                    src={movie.imagepath} 
                    alt={movie.moviename} 
                    className="w-full max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-lg cursor-pointer" 
                  />
                  <div className="text-center mt-2">
                    <div className="text-lg font-bold">{movie.moviename}</div>
                    <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                      <FaStar color="#FFD700" />
                      <span>{averageRatings[movie.movie_id] || 'N/A'}</span> {/* Display average rating or 'N/A' */}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Sections */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">In Theater</h2>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              navigation
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
                1280: { slidesPerView: 4, spaceBetween: 30 }
              }}
            >
              {movies.slice().reverse().slice(0, 5).map((movie) => (
                <SwiperSlide key={movie.movie_id} onClick={() => handleSlideClick(movie)}>
                  <div className="flex flex-col items-center">
                    <img 
                      src={movie.imagepath} 
                      alt={movie.moviename} 
                      className="w-full max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-lg cursor-pointer" 
                    />
                    <div className="text-center mt-2">
                      <div className="text-lg font-bold">{movie.moviename}</div>
                      <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                        <FaStar color="#FFD700" />
                        <span>{averageRatings[movie.movie_id] || 'N/A'}</span> {/* Display average rating or 'N/A' */}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">On TV</h2>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              navigation
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
                1280: { slidesPerView: 4, spaceBetween: 30 }
              }}
            >
              {movies.slice(0, 5).map((movie) => (
                <SwiperSlide key={movie.movie_id} onClick={() => handleSlideClick(movie)}>
                  <div className="flex flex-col items-center">
                    <img 
                      src={movie.imagepath} 
                      alt={movie.moviename} 
                      className="w-full max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-lg cursor-pointer" 
                    />
                    <div className="text-center mt-2">
                      <div className="text-lg font-bold">{movie.moviename}</div>
                      <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                        <FaStar color="#FFD700" />
                        <span>{averageRatings[movie.movie_id] || 'N/A'}</span> {/* Display average rating or 'N/A' */}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
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
