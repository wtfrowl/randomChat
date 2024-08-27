// components/Header.js
import React from 'react';

const Header = ({ totalUsers }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        {/* <img src="/path/to/logo.png" alt="Logo" className="h-8" /> */}
        <span className="ml-4 text-xl font-bold">BaatCheet</span>
      </div>
      <div className="text-lg">
        Online: <span className="font-bold">{totalUsers}</span>
      </div>
    </header>
  );
};

export default Header;
