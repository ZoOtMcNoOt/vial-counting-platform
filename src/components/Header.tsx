import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import DarkModeToggle from './DarkModeToggle';

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
          {/* Logo and Enhanced Title */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-white dark:text-gray-200 font-bold text-2xl">VialGuard Pro</h1>
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
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {/* Dark Mode Toggle for Mobile */}
            <DarkModeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 text-white dark:text-gray-200 hover:text-yellow-300 dark:hover:text-yellow-400 focus:outline-none focus:text-yellow-300 dark:focus:text-yellow-400"
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
    </header>
  );
};

export default Header;