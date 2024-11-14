import React, { useState } from 'react';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Upload', path: '/upload' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Team', path: '/team' },
];

const Header: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="w-full bg-red-600 py-4 shadow fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-white font-bold text-xl">Vial Counting Platform</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`block text-white px-3 py-2 rounded-md text-base font-medium ${
                  router.pathname === link.path
                    ? 'underline'
                    : 'hover:text-yellow-300 hover:underline' // Updated hover color for better contrast
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Dark Mode Toggle */}
          <div className="hidden md:block">
            <DarkModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <DarkModeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 p-2 rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
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
      <Transition
        show={isMobileMenuOpen}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {(ref) => (
          <nav ref={ref} className="md:hidden bg-red-600 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-white px-3 py-2 rounded-md text-base font-medium ${
                  router.pathname === link.path
                    ? 'underline'
                    : 'hover:text-yellow-300 hover:underline' // Updated hover color for better contrast
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}
      </Transition>
    </header>
  );
};

export default Header;