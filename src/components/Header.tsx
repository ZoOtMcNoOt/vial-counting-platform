import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ThemeContext } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface NavLink {
  name: string;
  path: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Upload', path: '/upload' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Team', path: '/team' },
  // Add more links as needed
];

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 w-10 h-10"
      aria-label="Toggle Dark Mode"
    >
      <div
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
          isDarkMode ? 'rotate-180' : 'rotate-0'
        }`}
      >
        {isDarkMode ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </div>
    </button>
  );
};

const Header: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-screen bg-red-600 dark:bg-gray-800 shadow z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo and Title */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-white dark:text-gray-200 font-bold text-2xl">VialGuard Pro</h1>
          </div>

          {/* Navigation Links (Hidden on Mobile) */}
          <div className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === link.path
                    ? 'text-white'
                    : 'text-gray-300 dark:text-gray-300'
                } hover:text-gray-400 dark:hover:text-gray-400`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={handleToggle}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? (
                // Close Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  router.pathname === link.path
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300'
                } hover:text-indigo-500 dark:hover:text-indigo-200`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;