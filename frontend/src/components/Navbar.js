import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center py-4 px-6 w-full absolute top-0 z-10">
      <div className="flex items-center">
        <div className="text-white font-bold text-2xl mr-10">
          <span className="text-blue-500">B</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
            Academic Network
          </span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <NavLink label="Home" isActive={true} />
          <NavLink label="Academics" />
          <NavLink label="Universities" />
          <NavLink label="About" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="hidden md:block bg-transparent text-white hover:text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-gray-700">
          Sign Up
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
          Login
        </button>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black bg-opacity-90 border-t border-gray-800 md:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <NavLink label="Home" isActive={true} />
            <NavLink label="Academics" />
            <NavLink label="Universities" />
            <NavLink label="About" />
            <button className="bg-transparent text-white hover:text-blue-300 px-4 py-2 text-sm font-medium border border-gray-700 rounded-full mt-2 text-left">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ label, isActive = false }) => {
  return (
    <a 
      href="#" 
      className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
    >
      {label}
    </a>
  );
};

export default Navbar;
