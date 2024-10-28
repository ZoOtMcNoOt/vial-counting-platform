import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 py-4 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} #OpenForHire. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
