"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [view, setView] = useState<'login' | 'forgotPassword'>('login'); // State to toggle between views
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleClickLogin = () => {
    router.push('/LoginIn'); // Replace with your desired path
  };

  const handleClickRegister = () => {
    router.push('/Registration'); // Replace with your desired path
  };

  const handleSubmitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      const session = await getSession();
      if (session?.user?.role === 'admin') {
        router.push('/AddMovies');
      } else if (session?.user?.role === 'user') {
        router.push('/');
      } else {
        router.push('/');
      }
    }
  };

  const handleSubmitForgotPassword = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setError(null); // Clear any previous error
        setEmail(""); // Clear the email field
        alert(data.message); // Display success message
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`pt-10 sm:pt-10 ${menuOpen ? 'pt-52' : ''} bg-black text-white font-sans min-h-screen`}>
      {/* Header */}
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
            <a href="/" className="hover:text-yellow-400">Home</a>
            <a href="/BrowseMovies" className="hover:text-yellow-400">Browse Movies</a>
            <a href="/PopularMovies" className="hover:text-yellow-400">Browse Popular Movies</a>
            <a href="/TopReiewedMovies" className="hover:text-yellow-400">Browse Top Reviewed Movies</a>
          </nav>

          {/* Auth Buttons */}
          <div className="mt-4 sm:mt-0 sm:space-x-4 flex flex-col sm:flex-row w-1/2 ml-10 sm:w-auto mr-12">
            <button onClick={() => setView('login')} className={`bg-pink-500 px-4 py-2 rounded-full text-white mb-2 sm:mb-0 ${view === 'login' ? 'bg-pink-600' : ''}`}>Log In</button>
            <button onClick={() => setView('forgotPassword')} className={`bg-pink-500 px-4 py-2 rounded-full text-white ${view === 'forgotPassword' ? 'bg-pink-600' : ''}`}>Forgot Password</button>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center bg-black p-4 sm:p-6 md:p-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md transform transition-transform duration-300 hover:scale-105">
          {view === 'login' ? (
            <>
              <h1 className="text-3xl font-semibold mb-6 text-center text-gray-200">Login</h1>
              <form onSubmit={handleSubmitLogin}>
                <div className="mb-4">
                  <label htmlFor="Email" className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                  <input
                    type="email"
                    id="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    disabled={loading}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="Password" className="block text-sm font-medium mb-2 text-gray-400">Password</label>
                  <input
                    type="password"
                    id="Password"
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
                  {loading ? "Logging in..." : "Login"}
                </button>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                <div className="mt-6 text-center">
                  <a href="#" onClick={() => setView('forgotPassword')} className="text-blue-400 hover:underline">
                    Forgot Password?
                  </a>
                  <p className="text-blue-400 mt-2">
                    Don't have an account? <a href="/Registration" className="hover:underline">Register</a>
                  </p>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-semibold mb-6 text-center text-gray-200">Forgot Password</h1>
              <form onSubmit={handleSubmitForgotPassword}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                <div className="mt-6 text-center">
                  <a href="#" onClick={() => setView('login')} className="text-blue-400 hover:underline">
                    Back to Login
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
