import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if user has an academic profile
        const response = await axios.get(`${API}/academics`);
        const userProfile = response.data.find(academic => academic.user_id === user.id);
        
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch your profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleEditProfile = () => {
    navigate('/create-profile', { state: { profile } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!profile ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Academic Profile Found</h2>
            <p className="mb-6 text-gray-600">
              You haven't created an academic profile yet. Create a profile to join the Bangladesh Academic Mentor Network.
            </p>
            <Link
              to="/create-profile"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Profile
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
                  <p className="text-gray-600">{profile.university}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    profile.approval_status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : profile.approval_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.approval_status.charAt(0).toUpperCase() + profile.approval_status.slice(1)}
                  </span>
                </div>
              </div>

              {profile.approval_status === 'pending' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Your profile is awaiting approval from an administrator. You'll be notified once it's approved.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Research Field</h3>
                  <p>{profile.research_field}</p>
                </div>
                {profile.sub_field && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Sub Field</h3>
                    <p>{profile.sub_field}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                  <p>{profile.city}, {profile.country}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Contact Email</h3>
                  <p>{profile.contact_email}</p>
                </div>
              </div>

              {profile.bio && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-2">Biography</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              )}

              {profile.keywords && profile.keywords.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleEditProfile}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
