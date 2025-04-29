import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 w-full fixed top-0 z-50 bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg border-b border-gray-800 shadow-lg">
      <div className="flex items-center">
        <Link to="/" className="text-white font-bold text-2xl mr-10">
          <span className="text-blue-500">B</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
            Academic Network
          </span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <NavLink to="/" label="Home" isActive={isActive('/')} />
          <NavLink to="/academics" label="Academics" isActive={isActive('/academics')} />
          <NavLink to="/countries" label="Countries" isActive={isActive('/countries')} />
          <NavLink to="/about" label="About" isActive={isActive('/about')} />
          {user && (
            <NavLink to="/dashboard" label="Dashboard" isActive={isActive('/dashboard')} />
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="hidden md:inline text-gray-300 text-sm">
              {user.email}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="hidden md:block bg-transparent text-white hover:text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-gray-700 transition-colors">
              Sign Up
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
              Login
            </Link>
          </>
        )}
        
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
        <div className="fixed top-[60px] left-0 right-0 bg-black bg-opacity-95 backdrop-blur-lg border-t border-gray-800 md:hidden shadow-lg z-40 max-h-[calc(100vh-60px)] overflow-y-auto">
          <div className="flex flex-col p-4 space-y-3">
            <NavLink to="/" label="Home" isActive={isActive('/')} />
            <NavLink to="/academics" label="Academics" isActive={isActive('/academics')} />
            <NavLink to="/countries" label="Countries" isActive={isActive('/countries')} />
            <NavLink to="/about" label="About" isActive={isActive('/about')} />
            {user ? (
              <>
                <NavLink to="/dashboard" label="Dashboard" isActive={isActive('/dashboard')} />
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-full mt-2 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="bg-transparent text-white hover:text-blue-300 px-4 py-2 text-sm font-medium border border-gray-700 rounded-full mt-2 text-left">
                  Sign Up
                </Link>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors rounded-full mt-2 text-left">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label, isActive = false }) => {
  return (
    <Link 
      to={to}
      className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
    >
      {label}
    </Link>
  );
};

export default Navbar;