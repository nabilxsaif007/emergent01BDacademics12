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
  const [websiteContent, setWebsiteContent] = useState({
    heroTitle: "Explore Bangladesh's Global Academic Network",
    heroSubtitle: "Connect with researchers and academics worldwide",
    featuredCountries: ["Bangladesh", "USA", "UK", "Canada", "Australia"],
    featuredCities: ["Dhaka", "New York", "London", "Toronto", "Sydney"],
    stats: {
      researchers: "250+",
      countries: "45",
      institutions: "120+"
    },
    aboutText: "The Bangladesh Academic Network connects researchers and academics worldwide, facilitating collaboration and knowledge sharing across borders."
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Function to get user name from the users object
  const getUserName = (userId) => {
    if (!users[userId]) return 'Unknown User';
    return users[userId].name || users[userId].email || 'Unknown';
  };
  
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
  
  // State for feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackReason, setFeedbackReason] = useState('incomplete');

  const openFeedbackModal = (profile) => {
    setSelectedProfile(profile);
    setFeedbackMessage('');
    setFeedbackReason('incomplete');
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!selectedProfile) return;
    
    handleRejectProfile(selectedProfile.id, {
      message: feedbackMessage,
      reason: feedbackReason
    });
    
    setShowFeedbackModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-900 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
        
        {/* Section Tabs */}
        <div className="mb-6">
          <div className="flex space-x-8 border-b border-gray-700 pb-2">
            <button
              className={`pb-2 px-1 ${
                activeSection === 'academics'
                  ? 'border-b-2 border-green-500 text-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveSection('academics')}
            >
              Academic Profiles
            </button>
            <button
              className={`pb-2 px-1 ${
                activeSection === 'profiles'
                  ? 'border-b-2 border-green-500 text-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveSection('profiles')}
            >
              Researcher Profiles
            </button>
            <button
              className={`pb-2 px-1 ${
                activeSection === 'website'
                  ? 'border-b-2 border-green-500 text-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveSection('website')}
            >
              Website Content
            </button>
          </div>
        </div>
        
        {/* Status Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex space-x-8">
            <button
              className={`pb-4 px-1 ${
                activeTab === 'pending'
                  ? 'border-b-2 border-green-500 text-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Approval
            </button>
            <button
              className={`pb-4 px-1 ${
                activeTab === 'approved'
                  ? 'border-b-2 border-green-500 text-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
            </button>
            <button
              className={`pb-4 px-1 ${
                activeTab === 'rejected'
                  ? 'border-b-2 border-green-500 text-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : activeSection === 'academics' ? (
        academics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No academics found for this status.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {academics.map(academic => (
              <div key={academic.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-white">
                      {getUserName(academic.user_id) || 'Loading...'}
                    </h3>
                    <p className="text-gray-400 text-sm">{academic.expertise || 'No expertise listed'}</p>
                    <p className="text-gray-500 text-xs mt-1">Submitted: {new Date(academic.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <button
                      onClick={() => handleApprove(academic.id)}
                      className="px-4 py-2 bg-green-700 text-white text-sm rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejection:');
                        if (reason) handleReject(academic.id, reason);
                      }}
                      className="px-4 py-2 bg-red-700 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    <a
                      href={`/academics/${academic.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
                    >
                      View Detail
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Researcher Profiles Section
        profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No researcher profiles found for this status.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {profiles.map(profile => (
              <div key={profile.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-white">
                      {getUserName(profile.user_id) || 'Loading...'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <p className="text-gray-400 text-sm mr-4">
                        <span className="font-semibold">Title:</span> {profile.academic_title || 'Not specified'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold">Institution:</span> {profile.institution_name || 'Not specified'}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold">Research Areas:</span>{' '}
                        {profile.research_interests && profile.research_interests.length > 0
                          ? profile.research_interests.join(', ')
                          : 'Not specified'}
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Profile Completion</span>
                          <span>{profile.completion_percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full">
                          <div
                            className="h-full bg-yellow-600 rounded-full"
                            style={{ width: `${profile.completion_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">Submitted: {new Date(profile.updated_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <button
                      onClick={() => handleApproveProfile(profile.id)}
                      className="px-4 py-2 bg-green-700 text-white text-sm rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openFeedbackModal(profile)}
                      className="px-4 py-2 bg-red-700 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => {
                        // View full profile details
                        alert('View profile details - to be implemented');
                      }}
                      className="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Provide Feedback</h3>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Reason for Requesting Changes
                </label>
                <select
                  value={feedbackReason}
                  onChange={(e) => setFeedbackReason(e.target.value)}
                  className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="incomplete">Profile is Incomplete</option>
                  <option value="inaccurate">Information is Inaccurate</option>
                  <option value="inappropriate">Content is Inappropriate</option>
                  <option value="formatting">Formatting Issues</option>
                  <option value="verification">Requires Verification</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Detailed Feedback
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows="5"
                  placeholder="Provide specific feedback on what needs to be changed..."
                  className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitFeedback}
                  disabled={!feedbackMessage.trim()}
                  className={`px-4 py-2 bg-yellow-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    !feedbackMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
                  }`}
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
