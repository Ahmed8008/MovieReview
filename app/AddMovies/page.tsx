"use client";
import React, { useState, useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Ensure this path is correct


export default function Movies() {
  const [movieName, setMovieName] = useState("");
  const [movieDescription, setMovieDescription] = useState("");
  const [genres, setGenres] = useState("");
  const [category, setCategory] = useState("");
  const [movieType, setMovieType] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session && session.user && typeof session.user.id === "string") {
        setUserId(session.user.id);

        // Check if user has an admin role
        const userRole = session.user.role; 
        if (userRole === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push("/LoginIn");
        }
      } else {
        setUserId(null);
        setIsAdmin(false);
        router.push("/LoginIn");
      }
    };

    fetchSession();

    const interval = setInterval(fetchSession, 10 * 60 * 1000); // Refresh session every 10 minutes

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !movieName ||
      !movieDescription ||
      !genres ||
      !category ||
      !movieType ||
      !image ||
      !userId
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // Proceed with movie data submission
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MovieName: movieName,
          MovieDescription: movieDescription,
          Genres: genres,
          Category: category,
          MovieType: movieType,
          ImageUrl: imageUrl, // Use the Firebase Storage URL
          User_Id: userId,
        }),
      });

      if (response.ok) {
        setSuccess("Movie added successfully!");
        setMovieName("");
        setMovieDescription("");
        setGenres("");
        setCategory("");
        setMovieType("");
        setImage(null);
        alert("Movie added successfully!");
      } else {
        const { message } = await response.json();
        setError(message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error uploading movie data:", error);
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/LoginIn" });
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black text-white">
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

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="text-3xl font-bold mb-6 text-purple-500">Add Movies</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Movie Name"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={movieName}
              name="MovieName"
              onChange={(e) => setMovieName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Movie Description"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={movieDescription}
              name="MovieDescription"
              onChange={(e) => setMovieDescription(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Genres"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={genres}
              name="Genres"
              onChange={(e) => setGenres(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Category"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={category}
              name="Category"
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="MovieType"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={movieType}
              name="MovieType"
              onChange={(e) => setMovieType(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Enter Images</label>
            <input
              type="file"
              name="image"
              className="block w-full text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleImageChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Movie"}
          </button>
          {error && <div className="text-red-500 mt-4">{error}</div>}
          {success && <div className="text-green-500 mt-4">{success}</div>}
        </form>
      </div>
    </div>
  );
}
