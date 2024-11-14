import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 dark:bg-gray-900 py-4 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-300 dark:text-gray-200 text-sm">
          © {new Date().getFullYear()} <Link 
          href="/team" 
          className="text-gray-300 hover:text-blue-600 transition-colors duration-200"
        >
          #openforhire
        </Link>. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;
