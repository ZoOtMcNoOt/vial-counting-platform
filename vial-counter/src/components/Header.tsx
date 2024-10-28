import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-red-600 py-4 shadow">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-white text-2xl font-bold">Vial Counting Platform</h1>
      </div>
    </header>
  );
};

export default Header;
