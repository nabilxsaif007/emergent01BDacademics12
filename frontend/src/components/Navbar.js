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
    { path: '/explore', label: 'Explore', isNewCombinedItem: true },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <SkipToContentLink />
      
      <nav
        className={`flex justify-between items-center py-4 px-6 sm:px-8 bg-background-primary transition-all duration-200 ${
          scrolled ? 'py-3' : 'py-4'
        }`}
        aria-label="Main navigation"
      >
        {/* Logo and primary navigation */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center text-cta-primary font-bold text-2xl mr-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta-primary focus-visible:ring-opacity-50 rounded-md"
            aria-label="Bangladesh Academic Network - Home"
          >
            <span className="text-cta-primary">B</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cta-primary to-cta-secondary hidden sm:inline">
              Academic Network
            </span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              item.hasDropdown ? (
                <NavDropdown 
                  key={item.path} 
                  label={item.label} 
                  isActive={isActive('/academics') || isActive('/researchers') || isActive('/countries')}
                />
              ) : (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  label={item.label} 
                  isActive={isActive(item.path)} 
                />
              )
            ))}
          </div>
        </div>
        
        {/* Right side - user controls */}
        <div className="flex items-center">
          {/* User or auth controls */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 text-text-primary hover:text-cta-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-cta-primary focus-visible:ring-opacity-50 rounded-full p-1"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
                onKeyDown={handleKeyDown}
              >
                <div className="h-8 w-8 rounded-full bg-cta-primary flex items-center justify-center text-white">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:block text-sm">{user.email}</span>
                <svg 
                  className={`h-5 w-5 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* User dropdown menu */}
              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-background-primary rounded-md shadow-lg border border-border-light overflow-hidden origin-top-right animate-fade-in"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-background-secondary focus:bg-background-secondary focus:outline-none transition-colors duration-200"
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-background-secondary focus:bg-background-secondary focus:outline-none transition-colors duration-200"
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-background-secondary focus:bg-background-secondary focus:outline-none transition-colors duration-200"
                      role="menuitem"
                    >
                      Settings
                    </Link>
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-background-secondary focus:bg-background-secondary focus:outline-none transition-colors duration-200"
                      role="menuitem"
                    >
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-status-error hover:bg-background-secondary focus:bg-background-secondary focus:outline-none transition-colors duration-200"
                      role="menuitem"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                to="/login" 
                className="text-text-primary hover:text-cta-primary text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200"
                aria-label="Log in to your account"
              >
                Log in
              </Link>
              <Button
                as={Link}
                to="/signup"
                variant="primary"
                size="sm"
              >
                Sign up
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden ml-4 text-text-primary hover:text-cta-primary p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cta-primary focus-visible:ring-opacity-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobile menu with animation */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-background-primary border-t border-border-light overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[80vh] shadow-lg' : 'max-h-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="px-4 py-3 space-y-2">
          {navigationItems.map((item) => (
            item.hasDropdown ? (
              <div key={item.path}>
                <button
                  className="flex justify-between items-center w-full text-left px-3 py-2 text-text-primary hover:text-cta-primary rounded-md"
                  aria-expanded="false"
                >
                  <span>{item.label}</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="pl-4 py-1 space-y-1">
                  <Link 
                    to="/academics" 
                    className="block px-3 py-2 text-text-secondary hover:text-cta-primary hover:bg-background-secondary rounded-md"
                  >
                    All Academics
                  </Link>
                  <Link 
                    to="/researchers" 
                    className="block px-3 py-2 text-text-secondary hover:text-cta-primary hover:bg-background-secondary rounded-md"
                  >
                    Researchers
                  </Link>
                  <Link 
                    to="/countries" 
                    className="block px-3 py-2 text-text-secondary hover:text-cta-primary hover:bg-background-secondary rounded-md"
                  >
                    By Country
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md ${
                  isActive(item.path)
                    ? 'text-cta-primary font-medium'
                    : 'text-text-primary hover:text-cta-primary hover:bg-background-secondary'
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
          
          {/* Additional mobile links for user dashboard or auth */}
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/dashboard')
                    ? 'text-cta-primary font-medium'
                    : 'text-text-primary hover:text-cta-primary hover:bg-background-secondary'
                }`}
              >
                Dashboard
              </Link>
              <hr className="my-2 border-border-light" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-status-error hover:bg-background-secondary rounded-md"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                as={Link}
                to="/login"
                variant="outline"
                size="sm"
                fullWidth
              >
                Log in
              </Button>
              <Button
                as={Link}
                to="/signup"
                variant="primary"
                size="sm"
                fullWidth
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
      className={`text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 ${
        isActive
          ? 'text-cta-primary after:block after:h-0.5 after:bg-cta-primary after:mt-0.5'
          : 'text-text-secondary hover:text-cta-primary hover:bg-background-secondary'
      }`}
      aria-current={isActive ? 'page' : undefined}
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
            ? 'text-gray-900 after:block after:h-0.5 after:bg-coral-500 after:mt-0.5'
            : 'text-gray-700 hover:text-coral-500 hover:bg-gray-50'
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
              Network
            </div>
            <Link
              to="/academics"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-coral-500"
              role="menuitem"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              All Academics
            </Link>
            <Link
              to="/researchers"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-coral-500"
              role="menuitem"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Researchers
            </Link>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Locations
            </div>
            <Link
              to="/countries"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-coral-500"
              role="menuitem"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Browse by Country
            </Link>
            <Link
              to="/map"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-coral-500"
              role="menuitem"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Interactive Map
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;