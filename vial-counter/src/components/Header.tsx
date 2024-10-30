import React from 'react';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-red-600 dark:bg-red-700 py-4 shadow">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-white dark:text-gray-100 text-2xl font-bold">
          Please Give Me A Job 3000
        </h1>
        <nav className="flex space-x-4">
          
          {/* Add more navigation links here if needed */}
        </nav>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
