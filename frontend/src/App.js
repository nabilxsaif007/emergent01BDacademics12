import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import ProfileCreation from './pages/ProfileCreation';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    // Check if user is logged in based on token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserData(data);
      
      // Once we have user data, fetch their profile
      fetchUserProfile(token);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
    }
  };
  
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profiles/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
      
      // Even if the profile doesn't exist, we've completed loading
      setProfileLoaded(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // We still mark as loaded even if there was an error
      setProfileLoaded(true);
    }
  };

  const handleLogin = async (email, password) => {
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'username': email,
          'password': password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setIsLoggedIn(true);
      fetchUserData(data.access_token);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    setUserProfile(null);
    setProfileLoaded(false);
  };

  const handleRegister = async (userData) => {
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      setMessage('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-emerald-600 text-xl font-bold">Bangladesh Academic Network</Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link to="/" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Home
                  </Link>
                  {isLoggedIn && (
                    <Link to="/dashboard" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                {isLoggedIn ? (
                  <>
                    <span className="text-gray-700">
                      {userData ? `Welcome, ${userData.first_name}` : 'Welcome!'}
                    </span>
                    {!userProfile && profileLoaded && (
                      <Link to="/create-profile" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                        Create Profile
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                      Login
                    </Link>
                    <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route 
              path="/create-profile" 
              element={
                isLoggedIn ? <ProfileCreation /> : <Navigate to="/login" replace />
              } 
            />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route 
              path="/dashboard" 
              element={
                isLoggedIn ? (
                  <Dashboard 
                    userData={userData}
                    userProfile={userProfile}
                    profileLoaded={profileLoaded}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Home Page
function Home() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Bangladesh Academic Network</h1>
      <p className="mb-4">
        This platform connects researchers, professors, and academic professionals 
        across Bangladesh to foster collaboration and innovation in research.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Connect with Peers" 
          description="Find and connect with other researchers in your field of interest."
        />
        <FeatureCard 
          title="Showcase Research" 
          description="Share your research projects, publications, and academic achievements."
        />
        <FeatureCard 
          title="Collaboration Opportunities" 
          description="Discover collaboration opportunities with academics across the country."
        />
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ title, description }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Dashboard Page
function Dashboard({ userData, userProfile, profileLoaded }) {
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Researcher Dashboard</h2>
      
      {/* Profile status section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Status</h3>
        
        {!profileLoaded ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-600 mr-2"></div>
            <span>Loading profile data...</span>
          </div>
        ) : !userProfile ? (
          <div className="bg-yellow-100 p-4 rounded-md">
            <h4 className="font-medium text-yellow-800 mb-2">Profile Not Created</h4>
            <p className="text-yellow-700 mb-3">
              You haven't created your researcher profile yet. Create your profile to connect with other researchers.
            </p>
            <Link 
              to="/create-profile" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-block"
            >
              Create Profile
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-50 p-4 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-emerald-800">Profile Status</h4>
              <span className={`px-2 py-1 rounded-full text-xs ${
                userProfile.status === 'verified' || userProfile.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userProfile.status === 'draft' && 'Draft'}
                {userProfile.status === 'pending_verification' && 'Pending Verification'}
                {userProfile.status === 'verified' && 'Verified'}
                {userProfile.status === 'pending_approval' && 'Pending Approval'}
                {userProfile.status === 'approved' && 'Approved'}
              </span>
            </div>
            
            {/* Completion percentage */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Profile Completion</span>
                <span className="text-sm text-gray-600">{userProfile.completion_percentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${userProfile.completion_percentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Verification status */}
            {userData.email_verified ? (
              <div className="flex items-center text-sm text-emerald-600 mb-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Email Verified
              </div>
            ) : (
              <div className="flex items-center text-sm text-yellow-600 mb-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                Email Not Verified
              </div>
            )}
            
            <div className="flex mt-3">
              <Link 
                to={`/edit-profile`} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md text-sm font-medium mr-2"
              >
                Edit Profile
              </Link>
              <Link 
                to={`/profile/${userProfile.id}`} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
              >
                View Public Profile
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Account information section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{userData.first_name} {userData.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Login Page
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
          <Link to="/register" className="inline-block align-baseline font-bold text-sm text-emerald-600 hover:text-emerald-800">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}

// Register Page
function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_admin: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
          <Link to="/login" className="inline-block align-baseline font-bold text-sm text-emerald-600 hover:text-emerald-800">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default App;