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
    <nav className="flex justify-between items-center py-3 px-6 w-full fixed top-0 z-50 bg-white shadow-md">
      <div className="flex items-center">
        <Link to="/" className="text-brand-emerald-dark font-bold text-2xl mr-10">
          <span className="text-brand-emerald">B</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-emerald to-brand-emerald-dark">
            Academic Network
          </span>
        </Link>
        
        <div className="hidden md:flex space-x-2">
          <NavLink to="/" label="Home" isActive={isActive('/')} />
          <NavLink to="/academics" label="Academics" isActive={isActive('/academics')} />
          <NavLink to="/researchers" label="Researchers" isActive={isActive('/researchers')} />
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
            <span className="hidden md:inline text-text-secondary text-sm">
              {user.email}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="hidden md:block bg-white text-brand-emerald hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium border border-brand-emerald transition-colors shadow-sm">
              Sign Up
            </Link>
            <Link to="/login" className="bg-brand-emerald text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-emerald-light transition-colors shadow-sm">
              Login
            </Link>
          </>
        )}
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-brand-emerald p-1"
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
        <div className="fixed top-[56px] left-0 right-0 bg-white border-t border-gray-100 md:hidden shadow-lg z-40 max-h-[calc(100vh-56px)] overflow-y-auto">
          <div className="flex flex-col p-4 space-y-2">
            <NavLink to="/" label="Home" isActive={isActive('/')} />
            <NavLink to="/academics" label="Academics" isActive={isActive('/academics')} />
            <NavLink to="/researchers" label="Researchers" isActive={isActive('/researchers')} />
            <NavLink to="/countries" label="Countries" isActive={isActive('/countries')} />
            <NavLink to="/about" label="About" isActive={isActive('/about')} />
            {user ? (
              <>
                <NavLink to="/dashboard" label="Dashboard" isActive={isActive('/dashboard')} />
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 text-sm font-medium rounded-md shadow-sm mt-2 text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="bg-white text-brand-emerald hover:bg-gray-50 px-4 py-2 text-sm font-medium border border-brand-emerald rounded-md shadow-sm mt-2 text-center w-full">
                  Sign Up
                </Link>
                <Link to="/login" className="bg-brand-emerald text-white px-4 py-2 text-sm font-medium hover:bg-brand-emerald-light transition-colors rounded-md shadow-sm mt-2 text-center w-full">
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
      className={`text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 ${
        isActive 
          ? 'text-brand-emerald border-b-2 border-brand-emerald bg-gray-50' 
          : 'text-text-secondary hover:text-brand-emerald-dark hover:bg-gray-50'
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;