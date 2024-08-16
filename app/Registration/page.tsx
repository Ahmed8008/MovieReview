"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/Components/Footer';

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    UserName: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
  });
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        alert('Registration successful');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      alert('An error occurred during registration');
    }
  };

  return (
    <>
    <br></br>
    <br></br>
    
      <div className= {`pt-8 sm:pt-8 ${menuOpen ? 'pt-44' : ''} md:"bg-black text-white font-sans min-h-screen`}>
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
            <button className="sm:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
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
              <button onClick={() => router.push('/LoginIn')} className="bg-pink-500 px-4 py-2 rounded-full text-white mb-2 sm:mb-0">Log In</button>
              <button onClick={() => router.push('/Registration')} className="bg-pink-500 px-4 py-2 rounded-full text-white">Sign Up</button>
            </div>
          </div>
        </header>

        <div className="min-h-screen flex items-center justify-center bg-black p-4 sm:p-6 md:p-8">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md transform transition-transform duration-300 hover:scale-105">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-200">Register</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="UserName" className="block text-sm font-medium mb-2 text-gray-400">UserName</label>
                <input
                  type="text"
                  id="UserName"
                  name="UserName"
                  value={formData.UserName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="FirstName" className="block text-sm font-medium mb-2 text-gray-400">First Name</label>
                <input
                  type="text"
                  id="FirstName"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="LastName" className="block text-sm font-medium mb-2 text-gray-400">Last Name</label>
                <input
                  type="text"
                  id="LastName"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="Email" className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
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
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
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
                {loading ? "Registering..." : "Register"}
              </button>
              <div className="mt-6 text-center">
                <a href="/LoginIn" className="text-blue-400 hover:underline">
                  Already have an account? Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}
