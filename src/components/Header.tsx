import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Upload', path: '/upload' },
  { name: 'Gallery', path: '/gallery' },
  // 'Team' link has been removed as per the requirement
];

const Header: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="w-full bg-red-600 dark:bg-gray-800 shadow fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-white dark:text-gray-200 font-bold text-2xl">Vial Counting Platform</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path}>
                <a
                  className={`text-white dark:text-gray-200 hover:text-yellow-300 dark:hover:text-yellow-400 transition-colors duration-300 ${
                    router.pathname === link.path ? 'font-semibold text-yellow-300 dark:text-yellow-400' : ''
                  }`}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white dark:text-gray-200 hover:text-yellow-300 dark:hover:text-yellow-400 focus:outline-none focus:text-yellow-300 dark:focus:text-yellow-400"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-red-600 dark:bg-gray-800 shadow-lg">
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.path}>
                  <a
                    className={`block px-3 py-2 rounded-md text-base font-medium text-white dark:text-gray-200 hover:text-yellow-300 dark:hover:text-yellow-400 hover:bg-red-700 dark:hover:bg-gray-700 transition-colors duration-300 ${
                      router.pathname === link.path ? 'font-semibold text-yellow-300 dark:text-yellow-400' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;