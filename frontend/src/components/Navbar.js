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
    { path: '/academics', label: 'Researchers', hasDropdown: true }, 
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
          isActive
            ? 'text-cta-primary after:block after:h-0.5 after:bg-cta-primary after:mt-0.5'
            : 'text-text-secondary hover:text-cta-primary hover:bg-background-secondary'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <svg
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-background-primary border border-border-light overflow-hidden animate-fade-in"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            <Link
              to="/academics"
              className="block px-4 py-2 text-sm text-text-primary hover:bg-background-secondary hover:text-cta-primary"
              role="menuitem"
            >
              All Academics
            </Link>
            <Link
              to="/researchers"
              className="block px-4 py-2 text-sm text-text-primary hover:bg-background-secondary hover:text-cta-primary"
              role="menuitem"
            >
              Researchers
            </Link>
            <Link
              to="/countries"
              className="block px-4 py-2 text-sm text-text-primary hover:bg-background-secondary hover:text-cta-primary"
              role="menuitem"
            >
              Browse by Country
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;