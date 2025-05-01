import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [academics, setAcademics] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [activeSection, setActiveSection] = useState('academics');
  const [users, setUsers] = useState({});
  
  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For profiles, we need to map the activeTab to the ProfileStatus enum values
      let statusParam = "";
      if (activeTab === "pending") {
        statusParam = "pending_approval";
      } else if (activeTab === "approved") {
        statusParam = "approved";
      } else if (activeTab === "rejected") {
        statusParam = "draft"; // Rejected profiles are set back to draft with feedback
      }
      
      // Fetch profiles from admin endpoint
      const response = await axios.get(`${API}/admin/profiles${statusParam ? `?status=${statusParam}` : ''}`);
      setProfiles(response.data);
      
      // Fetch user details for each profile
      const userIds = response.data.map(profile => profile.user_id);
      const uniqueUserIds = [...new Set(userIds)];
      
      const userDetails = { ...users };
      await Promise.all(uniqueUserIds.map(async (userId) => {
        // Skip if we already have this user's details
        if (userDetails[userId]) return;
        
        try {
          const userResponse = await axios.get(`${API}/admin/users/${userId}`);
          userDetails[userId] = userResponse.data;
        } catch (err) {
          console.error(`Error fetching user ${userId}:`, err);
        }
      }));
      
      setUsers(userDetails);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAcademics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch academics from admin endpoint
        const response = await axios.get(`${API}/admin/academics?approval_status=${activeTab}`);
        setAcademics(response.data);
        
        // Fetch user details for each academic
        const userIds = response.data.map(academic => academic.user_id);
        const uniqueUserIds = [...new Set(userIds)];
        
        const userDetails = {};
        await Promise.all(uniqueUserIds.map(async (userId) => {
          try {
            const userResponse = await axios.get(`${API}/admin/users/${userId}`);
            userDetails[userId] = userResponse.data;
          } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
          }
        }));
        
        setUsers(userDetails);
      } catch (err) {
        console.error('Error fetching academics:', err);
        setError(err.message || 'Failed to load academics');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.is_admin) {
      if (activeSection === 'academics') {
        fetchAcademics();
      } else if (activeSection === 'profiles') {
        fetchProfiles();
      }
    }
  }, [user, activeTab, activeSection]);
  
  const handleApprove = async (academicId) => {
    try {
      await axios.put(`${API}/admin/academics/${academicId}/approve`);
      
      // Remove this academic from the list
      setAcademics(academics.filter(a => a.id !== academicId));
      
      // Show success message
      alert('Academic profile approved successfully!');
    } catch (err) {
      console.error('Error approving academic:', err);
      alert('Failed to approve academic profile. Please try again.');
    }
  };

  const handleReject = async (academicId, reason) => {
    try {
      await axios.put(`${API}/admin/academics/${academicId}/reject`, { reason });
      
      // Remove this academic from the list
      setAcademics(academics.filter(a => a.id !== academicId));
      
      // Show success message
      alert('Academic profile rejected successfully!');
    } catch (err) {
      console.error('Error rejecting academic:', err);
      alert('Failed to reject academic profile. Please try again.');
    }
  };
  
  const handleApproveProfile = async (profileId) => {
    try {
      await axios.put(`${API}/admin/profiles/${profileId}/approve`);
      
      // Remove this profile from the list
      setProfiles(profiles.filter(p => p.id !== profileId));
      
      // Show success message
      alert('Researcher profile approved successfully!');
    } catch (err) {
      console.error('Error approving profile:', err);
      alert('Failed to approve researcher profile. Please try again.');
    }
  };

  const handleRejectProfile = async (profileId, feedback) => {
    try {
      await axios.put(`${API}/admin/profiles/${profileId}/reject`, feedback);
      
      // Remove this profile from the list
      setProfiles(profiles.filter(p => p.id !== profileId));
      
      // Show success message
      alert('Researcher profile feedback sent successfully!');
    } catch (err) {
      console.error('Error rejecting profile:', err);
      alert('Failed to send feedback for researcher profile. Please try again.');
    }
  };
  
  const getUserInfo = (userId) => {
    return users[userId] || { name: 'Loading...', email: 'Loading...' };
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rejected
            </button>
          </nav>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : academics.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No {activeTab} academic profiles found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {academics.map((academic) => {
              const userInfo = getUserInfo(academic.user_id);
              
              return (
                <li key={academic.id}>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {userInfo.name}
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500 mt-1">
                          {academic.university} | {academic.city}, {academic.country}
                        </p>
                      </div>
                      
                      {activeTab === 'pending' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleApprove(academic.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(academic.id)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Research Field</p>
                        <p className="mt-1 text-sm text-gray-900">{academic.research_field}</p>
                        {academic.sub_field && (
                          <p className="mt-1 text-sm text-gray-900">
                            <span className="font-medium">Sub-field:</span> {academic.sub_field}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Information</p>
                        <p className="mt-1 text-sm text-gray-900">
                          Email: {academic.contact_email}
                        </p>
                      </div>
                    </div>
                    
                    {academic.keywords && academic.keywords.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Keywords</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {academic.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {academic.bio && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Biography</p>
                        <p className="mt-1 text-sm text-gray-900">{academic.bio}</p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
