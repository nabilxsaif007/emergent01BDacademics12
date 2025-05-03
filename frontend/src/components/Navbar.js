import React, { useState, useEffect, useRef } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Tooltip from './ui/Tooltip';

/**
 * Airbnb-inspired Navbar component with improved accessibility and mobile responsiveness
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Accessible keyboard handler for dropdown
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setUserMenuOpen(false);
    }
  };
  
  // Combine navigation items for reuse in mobile and desktop
  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/academics', label: 'All Academics' },
    { path: '/about', label: 'About' },
  ];
  
  // Skip to content link for accessibility
  const SkipToContentLink = () => (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-background-primary px-4 py-2 text-cta-primary font-medium rounded-md border border-cta-primary"
    >
      Skip to main content
    </a>
  );
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md bg-white' : 'shadow-sm bg-white'
      }`}
      style={{ borderBottom: '1px solid #f7f7f7' }}
    >
      <SkipToContentLink />
      
      <nav
        className={`flex justify-between items-center py-4 px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-4'
        }`}
        aria-label="Main navigation"
      >
        {/* Logo and primary navigation */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center font-bold text-2xl mr-6 focus:outline-none rounded-md"
            aria-label="Bangladesh Academic Network - Home"
            style={{ color: '#16a34a' }}
          >
            <span style={{ color: '#16a34a' }}>B</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 hidden sm:inline" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>
              Academic Network
            </span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                label={item.label} 
                isActive={isActive(item.path)} 
              />
            ))}
          </div>
        </div>
        
        {/* Right side - user controls */}
        <div className="flex items-center">
          {/* User or auth controls */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 text-gray-700 hover:text-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-opacity-30 rounded-full p-1.5"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
                onKeyDown={handleKeyDown}
                style={{ transition: 'all 0.2s ease' }}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white shadow-sm">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>
                  {user.email}
                </span>
                <svg 
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ strokeWidth: 2.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* User dropdown menu */}
              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden origin-top-right"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                  style={{ 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    animation: 'dropdown-fade-in 0.2s ease-out'
                  }}
                >
                  <div className="py-2">
                    <div className="px-4 pt-2 pb-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Academic Researcher</p>
                    </div>
                    
                    <div className="pt-2">
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-coral-500 transition-colors duration-150"
                        role="menuitem"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-coral-500 transition-colors duration-150"
                        role="menuitem"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-coral-500 transition-colors duration-150"
                        role="menuitem"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <Link 
                        to="/admin" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-coral-500 transition-colors duration-150 font-medium"
                        role="menuitem"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Admin Panel
                      </Link>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-coral-500 hover:bg-gray-50 transition-colors duration-150 font-medium"
                        role="menuitem"
                      >
                        <svg className="w-5 h-5 mr-3 text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-coral-500 text-sm font-medium py-2 px-3 rounded-full transition-colors duration-200"
                aria-label="Log in to your account"
                style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
              >
                Log in
              </Link>
              <Button
                as={Link}
                to="/signup"
                variant="primary"
                size="sm"
                className="rounded-full bg-gradient-to-r from-coral-500 to-coral-400 hover:shadow-md transition-all duration-300"
              >
                Sign up
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden ml-4 text-gray-700 hover:text-coral-500 p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-opacity-30"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            style={{ transition: 'all 0.2s ease' }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2.5 }}>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobile menu with animation */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[80vh] shadow-lg' : 'max-h-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="px-5 py-4 space-y-2.5">
          {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg ${
                  isActive(item.path)
                    ? 'text-green-600 font-medium bg-gray-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
                style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
              >
                {item.label === 'Home' ? (
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ) : item.label === 'About' ? (
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <span className="w-5 h-5 mr-3"></span>
                )}
                {item.label}
              </Link>
            )
          ))}
          
          {/* Additional mobile links for user dashboard or auth */}
          {user ? (
            <>
              <div className="border-t border-gray-100 my-3 pt-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center px-3 py-2.5 rounded-lg ${
                    isActive('/dashboard')
                      ? 'text-green-600 font-medium bg-gray-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2.5 rounded-lg ${
                    isActive('/profile')
                      ? 'text-coral-500 font-medium bg-gray-50'
                      : 'text-gray-700 hover:text-coral-500 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <Link
                  to="/admin"
                  className={`flex items-center px-3 py-2.5 rounded-lg ${
                    isActive('/admin')
                      ? 'text-coral-500 font-medium bg-gray-50'
                      : 'text-gray-700 hover:text-coral-500 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Admin Panel
                </Link>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-2.5 text-coral-500 hover:bg-gray-50 rounded-lg font-medium"
                  style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
                >
                  <svg className="w-5 h-5 mr-3 text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-4 pb-2 border-t border-gray-100 mt-3">
              <Button
                as={Link}
                to="/login"
                variant="outline"
                size="md"
                fullWidth
                className="rounded-xl hover:border-coral-300 hover:text-coral-500 transition-all duration-300"
              >
                Log in
              </Button>
              <Button
                as={Link}
                to="/signup"
                variant="primary"
                size="md"
                fullWidth
                className="rounded-xl bg-gradient-to-r from-coral-500 to-coral-400 hover:shadow-md transition-all duration-300"
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// NavLink component for navigation items
const NavLink = ({ to, label, isActive = false }) => {
  return (
    <Link
      to={to}
      className={`text-sm font-medium px-3 py-2 rounded-full transition-all duration-300 ${
        isActive
          ? 'text-gray-900 after:block after:h-0.5 after:bg-coral-500 after:mt-0.5'
          : 'text-gray-700 hover:text-coral-500 hover:bg-gray-50'
      }`}
      aria-current={isActive ? 'page' : undefined}
      style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
    >
      {label}
    </Link>
  );
};

// NavDropdown component for dropdown menus
const NavDropdown = ({ label, isActive = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center text-sm font-medium px-3 py-2 rounded-full transition-all duration-300 ${
          isActive || isOpen
            ? 'text-gray-900 after:block after:h-0.5 after:bg-green-600 after:mt-0.5'
            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
      >
        {label}
        <svg
          className={`ml-1.5 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ strokeWidth: 2.5 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-56 rounded-xl shadow-lg bg-white border border-gray-100 overflow-hidden animate-dropdown-fade-in"
          role="menu"
          aria-orientation="vertical"
          style={{ 
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transformOrigin: 'top center',
            animation: 'dropdown-fade-in 0.2s ease-out'
          }}
        >
          <div className="py-2">
            {/* Combined menu with clear categories */}
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Browse
            </div>
            <Link
              to="/academics"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
              role="menuitem"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              All Academics
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;