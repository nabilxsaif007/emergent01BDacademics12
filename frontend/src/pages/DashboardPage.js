import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileStatusBanner from '../components/ProfileStatusBanner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [academics, setAcademics] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    profileViews: 0,
    connections: 0,
    messages: 0
  });

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get user's academic profile if they have one
        const profileResponse = await axios.get(`${API}/users/${user.id}/profile`);
        setProfile(profileResponse.data || null);

        // Get general stats for the dashboard
        const statsResponse = await axios.get(`${API}/users/${user.id}/stats`);
        setStats(statsResponse.data || {
          profileViews: Math.floor(Math.random() * 100),
          connections: Math.floor(Math.random() * 25),
          messages: Math.floor(Math.random() * 10)
        });

        // Get some recommended connections
        const academicsResponse = await axios.get(`${API}/academics?limit=5`);
        setAcademics(academicsResponse.data || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Fallback to demo data if API fails
        setAcademics([
          {
            id: "1",
            name: "Dr. Anika Rahman",
            university: "University of Dhaka",
            research_field: "Climate Science",
            country: "Bangladesh",
            city: "Dhaka",
            keywords: ["Climate Adaptation", "Coastal Ecosystems"],
            bio: "Specialized in climate adaptation strategies for vulnerable communities"
          },
          {
            id: "2",
            name: "Dr. Mohammad Hasan",
            university: "BUET",
            research_field: "Renewable Energy",
            country: "Bangladesh",
            city: "Dhaka",
            keywords: ["Solar Power", "Energy Policy"],
            bio: "Working on sustainable energy solutions for rural Bangladesh"
          },
          {
            id: "3",
            name: "Dr. Sarah Johnson",
            university: "University of Cambridge",
            research_field: "Public Health",
            country: "United Kingdom",
            city: "Cambridge",
            keywords: ["Epidemiology", "Global Health"],
            bio: "Researching infectious disease control in developing countries"
          }
        ]);
        
        setStats({
          profileViews: 78,
          connections: 12,
          messages: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Your Dashboard</h1>
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-brand-emerald transition-shadow hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-brand-emerald bg-opacity-10 text-brand-emerald mr-4 shadow-sm">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Profile Views</p>
              <p className="text-2xl font-bold text-text-primary">{stats.profileViews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-brand-gold transition-shadow hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-brand-gold bg-opacity-10 text-brand-gold-dark mr-4 shadow-sm">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Connections</p>
              <p className="text-2xl font-bold text-text-primary">{stats.connections}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-brand-emerald-light transition-shadow hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-brand-emerald-light bg-opacity-10 text-brand-emerald-dark mr-4 shadow-sm">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">Messages</p>
              <p className="text-2xl font-bold text-text-primary">{stats.messages}</p>
            </div>
          </div>
        </div>
      </div>

      {!profile ? (
        // No profile yet - Show create profile button
        <div className="bg-white shadow rounded-lg p-8 mb-8 text-center">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Create Your Academic Profile</h2>
          <p className="text-gray-600 mb-6">Set up your profile to connect with other academics and share your research interests.</p>
          <Link 
            to="/profile/create" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Profile
          </Link>
        </div>
      ) : (
        // Profile exists - show status banner
        <div>
          <ProfileStatusBanner 
            profile={profile} 
            onProfileUpdate={(updatedProfile) => setProfile(updatedProfile)} 
          />
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 mr-4">
                  {user.name ? user.name.charAt(0) : profile.name ? profile.name.charAt(0) : "A"}
                </div>
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-1">Your Academic Profile</h2>
                  <p className="text-gray-600">{profile.university} | {profile.city}, {profile.country}</p>
                  <p className="text-sm text-gray-500 mt-2">{profile.research_field || profile.field}</p>
                </div>
              </div>
              <Link
                to={`/profile/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">About</h3>
                <p className="text-sm text-gray-600">{profile.bio || "Add a short bio describing your research interests and expertise."}</p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Edit</button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                <div className="text-sm">
                  <div className="flex items-center mb-1">
                    <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">{profile.email || user.email || "Add your email"}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{profile.phone || "Add your phone number"}</span>
                  </div>
                </div>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Edit</button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Research Keywords</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.keywords ? profile.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {keyword}
                  </span>
                )) : profile.research_areas ? profile.research_areas.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {keyword}
                  </span>
                )) : (
                  <span className="text-sm text-gray-500">Add research keywords to help others find you</span>
                )}
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">Edit Keywords</button>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Publications</h3>
              <div className="text-sm text-gray-600">
                {profile.publications ? `${profile.publications} published works` : "Add your publication information"}
              </div>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Add Publications</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-900">Recommended Connections</h2>
          <Link
            to="/connections"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academics.map((academic) => (
            <div key={academic.id} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-1">{academic.name}</h3>
              <p className="text-sm text-gray-500">{academic.university}</p>
              <p className="text-sm text-gray-500">{academic.city}, {academic.country}</p>
              
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">{academic.research_field}</p>
                {academic.keywords && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {academic.keywords.slice(0, 2).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-between">
                <Link
                  to={`/academics/${academic.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Profile
                </Link>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-900">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/search"
            className="bg-white shadow rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-800 font-medium">Search Academics</span>
          </Link>
          
          <Link
            to="/countries"
            className="bg-white shadow rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-800 font-medium">Explore by Country</span>
          </Link>
          
          <Link
            to="/messages"
            className="bg-white shadow rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-gray-800 font-medium">Messages</span>
          </Link>
          
          <Link
            to="/events"
            className="bg-white shadow rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-800 font-medium">Upcoming Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
