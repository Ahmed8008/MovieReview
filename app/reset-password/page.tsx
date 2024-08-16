"use client";
import { useState, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

function ResetPasswordComponent() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // State for mobile menu
  const router = useRouter();
  const params = useSearchParams();
  
  // Ensure params is not null
  const token = params ? params.get('token') : null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!token) {
      setMessage('Invalid or missing token');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => router.push('/LoginIn'), 3000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen); // Function to toggle menu

  return (
    <>
     <header className="fixed top-0 left-0 right-0 bg-[#0F0F0F] z-50 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center sm:flex-row mr-7 ml-12">
            <img src="/logo1.png" alt="Logo" className="w-25 h-auto" />
          </div>

          {/* Mobile Menu Button */}
          <button className="sm:hidden text-white text-2xl" onClick={toggleMenu}>
            ☰
          </button>

          {/* Navigation Links */}
          <nav className={`flex sm:flex-row text-center flex-col ${menuOpen ? 'block' : 'hidden'} sm:space-x-4 py-2`} id="navMenu">
            <a href="/" className="text-white hover:text-yellow-400">Home</a>
            <a href="/BrowseMovies" className= "text-white hover:text-yellow-400">Browse Movies</a>
            <a href="/PopularMovies" className="text-white hover:text-yellow-400">Browse Popular Movies</a>
            <a href="/TopReiewedMovies" className="text-white hover:text-yellow-400">Browse Top Reviewed Movies</a>
          </nav>

          {/* Auth Buttons */}
          <div className="mt-4 sm:mt-0 sm:space-x-4 flex flex-col sm:flex-row w-1/2 ml-10 sm:w-auto mr-12">
          <button onClick={() => router.push('/LoginIn')} className="bg-pink-500 px-4 py-2 rounded-full text-white mb-2 sm:mb-0">Log In</button>
              <button onClick={() => router.push('/Registration')} className="bg-pink-500 px-4 py-2 rounded-full text-white">Sign Up</button>
   
          </div>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center bg-black p-4 sm:p-6 md:p-8 mt-16">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md transform transition-transform duration-300 hover:scale-105">
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-200">Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-400">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}
