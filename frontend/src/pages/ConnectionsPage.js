import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ConnectionsPage = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('connections');
  const [userProfiles, setUserProfiles] = useState({});
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all connections
        const response = await axios.get(`${API}/connections`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Separate into established, pending received, and pending sent
        const established = [];
        const pending = [];
        const sent = [];
        
        response.data.forEach(conn => {
          if (conn.status === 'accepted') {
            established.push(conn);
          } else if (conn.status === 'pending') {
            if (conn.recipient_id === user.id) {
              pending.push(conn);
            } else {
              sent.push(conn);
            }
          }
        });
        
        setConnections(established);
        setPendingRequests(pending);
        setSentRequests(sent);
        
        // Fetch connection suggestions
        const suggestionsResponse = await axios.get(`${API}/connections/suggestions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setSuggestions(suggestionsResponse.data);
        
        // Fetch user profiles for all connections
        const userIds = new Set();
        [...established, ...pending, ...sent].forEach(conn => {
          userIds.add(conn.requester_id);
          userIds.add(conn.recipient_id);
        });
        
        suggestionsResponse.data.forEach(profile => {
          userIds.add(profile.user_id);
        });
        
        // Remove current user's ID
        userIds.delete(user.id);
        
        // Get profiles for all these users
        const profilesData = {};
        
        await Promise.all([...userIds].map(async (userId) => {
          try {
            const profileResponse = await axios.get(`${API}/profiles/by-user/${userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (profileResponse.data) {
              profilesData[userId] = profileResponse.data;
            }
          } catch (err) {
            console.error(`Error fetching profile for user ${userId}:`, err);
          }
        }));
        
        setUserProfiles(profilesData);
      } catch (err) {
        console.error('Error fetching connections:', err);
        setError('Failed to load connections data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchConnections();
    }
  }, [user]);
  
  const handleAcceptRequest = async (connectionId) => {
    try {
      await axios.put(`${API}/connections/${connectionId}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Find the connection in pending requests
      const connection = pendingRequests.find(c => c.id === connectionId);
      
      // Remove from pending and add to established
      setPendingRequests(prev => prev.filter(c => c.id !== connectionId));
      setConnections(prev => [...prev, { ...connection, status: 'accepted' }]);
    } catch (err) {
      console.error('Error accepting connection:', err);
      alert('Failed to accept connection request');
    }
  };
  
  const handleRejectRequest = async (connectionId) => {
    try {
      await axios.put(`${API}/connections/${connectionId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Remove from pending
      setPendingRequests(prev => prev.filter(c => c.id !== connectionId));
    } catch (err) {
      console.error('Error rejecting connection:', err);
      alert('Failed to reject connection request');
    }
  };
  
  const handleSendRequest = async (recipientId) => {
    try {
      const response = await axios.post(`${API}/connections`, {
        recipient_id: recipientId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Add to sent requests
      setSentRequests(prev => [...prev, response.data]);
      
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => s.user_id !== recipientId));
      
      alert('Connection request sent successfully!');
    } catch (err) {
      console.error('Error sending connection request:', err);
      alert(err.response?.data?.detail || 'Failed to send connection request');
    }
  };
  
  const getUserName = (userId) => {
    const profile = userProfiles[userId];
    if (!profile) return 'Unknown Researcher';
    
    let name = '';
    if (profile.academic_title) {
      name += `${profile.academic_title} `;
    }
    name += profile.first_name || '';
    if (profile.last_name) {
      name += ` ${profile.last_name}`;
    }
    return name || 'Unknown Researcher';
  };
  
  // Filter connections based on active tab
  const getTabContent = () => {
    switch (activeTab) {
      case 'connections':
        return (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Your Connections</h2>
            {connections.length === 0 ? (
              <p className="text-gray-400">You don't have any connections yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map(connection => {
                  const otherUserId = connection.requester_id === user.id 
                    ? connection.recipient_id 
                    : connection.requester_id;
                  
                  const profile = userProfiles[otherUserId];
                  
                  return (
                    <div key={connection.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          {profile?.profile_picture_url ? (
                            <img 
                              src={profile.profile_picture_url} 
                              alt={getUserName(otherUserId)} 
                              className="h-12 w-12 rounded-full"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {getUserName(otherUserId).charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {getUserName(otherUserId)}
                          </h3>
                          {profile && (
                            <p className="text-sm text-gray-400">
                              {profile.institution_name || 'Independent Researcher'}
                              {profile.department && ` • ${profile.department}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Link 
                          to={`/researchers/${profile?.id}`}
                          className="px-3 py-1 bg-yellow-700 text-white text-sm rounded-full hover:bg-yellow-600"
                        >
                          View Profile
                        </Link>
                        <button
                          className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600"
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      case 'requests':
        return (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Connection Requests</h2>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-400">You don't have any pending connection requests.</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(request => {
                  const profile = userProfiles[request.requester_id];
                  
                  return (
                    <div key={request.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          {profile?.profile_picture_url ? (
                            <img 
                              src={profile.profile_picture_url} 
                              alt={getUserName(request.requester_id)} 
                              className="h-12 w-12 rounded-full"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {getUserName(request.requester_id).charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-white">
                            {getUserName(request.requester_id)}
                          </h3>
                          {profile && (
                            <p className="text-sm text-gray-400">
                              {profile.institution_name || 'Independent Researcher'}
                              {profile.department && ` • ${profile.department}`}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Sent request on {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-full hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-full hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                      {request.message && (
                        <div className="mt-2 p-2 bg-gray-700 rounded-md">
                          <p className="text-sm text-gray-300">{request.message}</p>
                        </div>
                      )}
                      <div className="mt-3">
                        <Link 
                          to={`/researchers/${profile?.id}`}
                          className="text-yellow-500 hover:text-yellow-400 text-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {sentRequests.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-3">Sent Requests</h3>
                <div className="space-y-3">
                  {sentRequests.map(request => {
                    const profile = userProfiles[request.recipient_id];
                    
                    return (
                      <div key={request.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            {profile?.profile_picture_url ? (
                              <img 
                                src={profile.profile_picture_url} 
                                alt={getUserName(request.recipient_id)} 
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {getUserName(request.recipient_id).charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-white">
                              {getUserName(request.recipient_id)}
                            </h3>
                            {profile && (
                              <p className="text-xs text-gray-400">
                                {profile.institution_name || 'Independent Researcher'}
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            Pending
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'suggestions':
        return (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Suggested Connections</h2>
            {suggestions.length === 0 ? (
              <p className="text-gray-400">No connection suggestions available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map(profile => (
                  <div key={profile.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 mr-3">
                        {profile.profile_picture_url ? (
                          <img 
                            src={profile.profile_picture_url} 
                            alt={`${profile.academic_title || ''} ${profile.first_name || ''} ${profile.last_name || ''}`} 
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {profile.first_name ? profile.first_name.charAt(0) : '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {profile.academic_title && `${profile.academic_title} `}
                          {profile.first_name || ''} {profile.last_name || ''}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {profile.institution_name || 'Independent Researcher'}
                        </p>
                      </div>
                    </div>
                    
                    {profile.research_interests && profile.research_interests.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Research interests:</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.research_interests.slice(0, 3).map((interest, index) => (
                            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                              {interest}
                            </span>
                          ))}
                          {profile.research_interests.length > 3 && (
                            <span className="text-gray-500 text-xs">
                              +{profile.research_interests.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSendRequest(profile.user_id)}
                        className="flex-1 px-3 py-1.5 bg-yellow-700 text-white text-sm rounded-md hover:bg-yellow-600"
                      >
                        Connect
                      </button>
                      <Link 
                        to={`/researchers/${profile.id}`}
                        className="flex-1 px-3 py-1.5 bg-gray-700 text-center text-white text-sm rounded-md hover:bg-gray-600"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gray-900 shadow rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-4">Please log in to view your connections.</p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gray-900 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Your Network</h1>
        
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              className={`pb-4 px-1 ${
                activeTab === 'connections'
                  ? 'border-b-2 border-yellow-500 text-yellow-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('connections')}
            >
              Connections
              {connections.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-700 text-white rounded-full text-xs">
                  {connections.length}
                </span>
              )}
            </button>
            
            <button
              className={`pb-4 px-1 ${
                activeTab === 'requests'
                  ? 'border-b-2 border-yellow-500 text-yellow-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-600 text-white rounded-full text-xs">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            
            <button
              className={`pb-4 px-1 ${
                activeTab === 'suggestions'
                  ? 'border-b-2 border-yellow-500 text-yellow-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('suggestions')}
            >
              Suggestions
            </button>
          </nav>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        ) : (
          getTabContent()
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;