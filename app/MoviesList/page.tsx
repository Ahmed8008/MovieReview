"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";

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

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingMovieId, setDeletingMovieId] = useState<number | null>(null);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionAndMovies = async () => {
      try {
        const session = await getSession();
        if (session && session.user && session.user.role === "admin") {
          setIsAdmin(true);

          // Fetch movies if the user is admin
          const response = await fetch("/api/movieslist");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setMovies(data);
        } else {
          setIsAdmin(false);
          router.push("/MoviesList"); // Redirect to login page if not admin
        }
      } catch (error) {
        console.error("Failed to fetch session or movies:", error);
        setError("Failed to fetch session or movies");
        router.push("/MoviesList"); // Redirect to login page on error
      }
    };

    fetchSessionAndMovies();
  }, [router]);

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
  };

  const handleDelete = async (movieId: number) => {
    setDeletingMovieId(movieId);

    try {
      const response = await fetch(`/api/movieslist?movie_id=${movieId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.movie_id !== movieId)
      );
      alert("Movie has been deleted successfully");
    } catch (error) {
      console.error("Failed to delete movie:", error);
      alert("Failed to delete movie");
    } finally {
      setDeletingMovieId(null);
    }
  };

  const handleSave = async () => {
    if (!editingMovie) return;

    try {
      const response = await fetch(
        `/api/movieslist?movie_id=${editingMovie.movie_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingMovie),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedMovie = await response.json();
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.movie_id === updatedMovie.movie_id ? updatedMovie : movie
        )
      );
      setEditingMovie(null);
      alert("Movie has been updated successfully");
    } catch (error) {
      console.error("Failed to update movie:", error);
      alert("Failed to update movie");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/LoginIn" }); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (!isAdmin) {
    return null; // Render nothing if not admin
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-4 hidden md:block">
        <div className="text-2xl font-bold text-purple-500">Admin Dashboard</div>
        <ul className="mt-8 space-y-4">
          <li>
            <a href="/AddMovies" className="block p-2 rounded hover:bg-gray-700 transition-colors">
              Add Movies
            </a>
          </li>
          <li>
            <a href="/MoviesList" className="block p-2 rounded hover:bg-gray-700 transition-colors">
              Movies List
            </a>
          </li>
          <li>
            <button onClick={handleLogout} className="block p-2 rounded hover:bg-gray-700 transition-colors">
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden p-4 relative">
        <button onClick={toggleMenu} className="text-xl focus:outline-none">
          ☰
        </button>
        {menuOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 text-white z-50 flex flex-col p-4">
            <button
              onClick={toggleMenu}
              className="text-2xl self-end mb-4 focus:outline-none"
            >
              &times;
            </button>
            <div className="text-2xl font-bold text-purple-500 mb-4">
              Admin Dashboard
            </div>
            <ul className="space-y-4">
              <li>
                <a href="/AddMovies" className="block p-2 rounded hover:bg-gray-700 transition-colors">
                  Add Movies
                </a>
              </li>
              <li>
                <a href="/MoviesList" className="block p-2 rounded hover:bg-gray-700 transition-colors">
                  Movies List
                </a>
              </li>
              <li>
                <button onClick={handleLogout} className="block p-2 rounded hover:bg-gray-700 transition-colors">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <main className="flex-1 md:ml-18 p-4">
        <h1 className="text-2xl font-bold mb-4">Movies List</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {movies.length === 0 ? (
            <p>No movies available</p>
          ) : (
            movies.map((movie) => (
              <div
                key={movie.movie_id}
                className="border border-gray-700 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105"
              >
                <img
                  src={movie.imagepath}
                  alt={movie.moviename}
                  className="w-full h-48 object-cover rounded-lg mb-4 transition-opacity duration-300 hover:opacity-80"
                />
                <div className="text-center">
                  {editingMovie && editingMovie.movie_id === movie.movie_id ? (
                    <div>
                      <input
                        type="text"
                        value={editingMovie.moviename}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            moviename: e.target.value,
                          })
                        }
                        className="mb-2 border border-gray-600 p-2 rounded w-full bg-gray-700"
                      />
                      <textarea
                        value={editingMovie.moviedescription}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            moviedescription: e.target.value,
                          })
                        }
                        className="mb-2 border border-gray-600 p-2 rounded w-full bg-gray-700"
                      />
                      <input
                        type="text"
                        value={editingMovie.genres}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            genres: e.target.value,
                          })
                        }
                        className="mb-2 border border-gray-600 p-2 rounded w-full bg-gray-700"
                      />
                      <input
                        type="text"
                        value={editingMovie.category}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            category: e.target.value,
                          })
                        }
                        className="mb-2 border border-gray-600 p-2 rounded w-full bg-gray-700"
                      />
                      <input
                        type="text"
                        value={editingMovie.movietype}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            movietype: e.target.value,
                          })
                        }
                        className="mb-2 border border-gray-600 p-2 rounded w-full bg-gray-700"
                      />
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={handleSave}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMovie(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold">{movie.moviename}</h2>
                      <p className="text-gray-300 mb-2">
                        {movie.moviedescription}
                      </p>
                      <p className="text-gray-400">Genres: {movie.genres}</p>
                      <p className="text-gray-400">Category: {movie.category}</p>
                      <p className="text-gray-400">Type: {movie.movietype}</p>
                    </div>
                  )}
                </div>
                {!editingMovie && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(movie.movie_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      disabled={deletingMovieId === movie.movie_id}
                    >
                      {deletingMovieId === movie.movie_id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MoviesPage;
