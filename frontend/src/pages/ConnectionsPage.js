import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

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
  const [actionInProgress, setActionInProgress] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(null);
  
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
        
        // Remove current user id
        userIds.delete(user.id);
        
        // Fetch user profiles
        const profiles = {};
        await Promise.all(
          [...userIds].map(async userId => {
            try {
              const profileResponse = await axios.get(`${API}/profiles/user/${userId}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              });
              profiles[userId] = profileResponse.data;
            } catch (err) {
              console.error(`Failed to fetch profile for user ${userId}:`, err);
            }
          })
        );
        
        setUserProfiles(profiles);
      } catch (err) {
        console.error('Error fetching connections:', err);
        setError('Failed to load connections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchConnections();
    }
  }, [user]);
  
  const getUserName = (userId) => {
    const profile = userProfiles[userId];
    if (!profile) return 'Unknown User';
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.academic_title || 'Researcher';
  };
  
  const handleAcceptRequest = async (connectionId) => {
    setConfirmationDialog({
      title: "Accept Connection Request",
      message: "Are you sure you want to accept this connection request?",
      confirmText: "Accept",
      confirmAction: async () => {
        setActionInProgress(connectionId);
        try {
          await axios.post(`${API}/connections/${connectionId}/accept`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          // Update state
          const request = pendingRequests.find(req => req.id === connectionId);
          if (request) {
            setPendingRequests(pendingRequests.filter(req => req.id !== connectionId));
            setConnections([...connections, { ...request, status: 'accepted' }]);
          }
          
          setConfirmationDialog(null);
        } catch (err) {
          console.error('Error accepting connection request:', err);
          setError('Failed to accept connection request. Please try again.');
        } finally {
          setActionInProgress(null);
        }
      },
      cancelAction: () => setConfirmationDialog(null)
    });
  };
  
  const handleDeclineRequest = async (connectionId) => {
    setConfirmationDialog({
      title: "Decline Connection Request",
      message: "Are you sure you want to decline this connection request?",
      confirmText: "Decline",
      confirmAction: async () => {
        setActionInProgress(connectionId);
        try {
          await axios.delete(`${API}/connections/${connectionId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          // Update state
          setPendingRequests(pendingRequests.filter(req => req.id !== connectionId));
          
          setConfirmationDialog(null);
        } catch (err) {
          console.error('Error declining connection request:', err);
          setError('Failed to decline connection request. Please try again.');
        } finally {
          setActionInProgress(null);
        }
      },
      cancelAction: () => setConfirmationDialog(null)
    });
  };
  
  const handleCancelRequest = async (connectionId) => {
    setConfirmationDialog({
      title: "Cancel Connection Request",
      message: "Are you sure you want to cancel this connection request?",
      confirmText: "Cancel Request",
      confirmAction: async () => {
        setActionInProgress(connectionId);
        try {
          await axios.delete(`${API}/connections/${connectionId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          // Update state
          setSentRequests(sentRequests.filter(req => req.id !== connectionId));
          
          setConfirmationDialog(null);
        } catch (err) {
          console.error('Error canceling connection request:', err);
          setError('Failed to cancel connection request. Please try again.');
        } finally {
          setActionInProgress(null);
        }
      },
      cancelAction: () => setConfirmationDialog(null)
    });
  };
  
  const handleSendRequest = async (recipientId) => {
    setActionInProgress(recipientId);
    try {
      const response = await axios.post(`${API}/connections`, {
        recipient_id: recipientId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update state
      setSuggestions(suggestions.filter(s => s.user_id !== recipientId));
      setSentRequests([...sentRequests, response.data]);
    } catch (err) {
      console.error('Error sending connection request:', err);
      setError('Failed to send connection request. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'connections':
        return (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">My Connections</h2>
            {connections.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-tertiary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-text-secondary mb-3">You don't have any connections yet.</p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('suggestions')}
                >
                  Find Researchers
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map(connection => {
                  const otherUserId = connection.requester_id === user.id
                    ? connection.recipient_id
                    : connection.requester_id;
                    
                  const profile = userProfiles[otherUserId];
                  
                  return (
                    <Card key={connection.id} className="p-4" hover>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          {profile?.profile_picture_url ? (
                            <img 
                              src={profile.profile_picture_url} 
                              alt={getUserName(otherUserId)} 
                              className="h-12 w-12 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-emerald to-brand-emerald-light flex items-center justify-center text-white font-bold shadow-sm">
                              {getUserName(otherUserId).charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">
                            {getUserName(otherUserId)}
                          </h3>
                          {profile && (
                            <p className="text-sm text-text-secondary">
                              {profile.institution_name || 'Independent Researcher'}
                              {profile.department && ` • ${profile.department}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Link 
                          to={`/researchers/${profile?.id}`}
                          className="px-3 py-1.5 bg-brand-emerald text-white text-sm rounded-md hover:bg-brand-emerald-light transition-colors shadow-sm"
                        >
                          View Profile
                        </Link>
                        <button
                          className="px-3 py-1.5 bg-white border border-brand-emerald text-brand-emerald text-sm rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          Message
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      case 'requests':
        return (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Connection Requests</h2>
            {pendingRequests.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-tertiary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-text-secondary">You don't have any pending connection requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(request => {
                  const profile = userProfiles[request.requester_id];
                  
                  return (
                    <Card key={request.id} className="p-4 border-l-4 border-brand-gold animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <div className="flex-shrink-0 mr-4">
                            {profile?.profile_picture_url ? (
                              <img 
                                src={profile.profile_picture_url} 
                                alt={getUserName(request.requester_id)} 
                                className="h-12 w-12 rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-emerald to-brand-emerald-light flex items-center justify-center text-white font-bold shadow-sm">
                                {getUserName(request.requester_id).charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-text-primary">
                              {getUserName(request.requester_id)}
                            </h3>
                            {profile && (
                              <p className="text-sm text-text-secondary">
                                {profile.institution_name || 'Independent Researcher'}
                                {profile.department && ` • ${profile.department}`}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            disabled={actionInProgress === request.id}
                            className="px-4 py-1.5 bg-brand-emerald text-white text-sm font-medium rounded-md hover:bg-brand-emerald-light transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                          >
                            {actionInProgress === request.id ? (
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : "Accept"}
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.id)}
                            disabled={actionInProgress === request.id}
                            className="px-4 py-1.5 bg-white border border-gray-200 text-text-secondary text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                          >
                            {actionInProgress === request.id ? (
                              <svg className="animate-spin h-4 w-4 text-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : "Decline"}
                          </button>
                          <Link 
                            to={`/researchers/${profile?.id}`}
                            className="px-4 py-1.5 bg-white border border-gray-200 text-text-secondary text-sm rounded-md hover:bg-gray-50 transition-colors shadow-sm flex items-center"
                          >
                            <span>View Profile</span>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      case 'sent':
        return (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Sent Requests</h2>
            {sentRequests.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-tertiary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <p className="text-text-secondary">You haven't sent any connection requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sentRequests.map(request => {
                  const profile = userProfiles[request.recipient_id];
                  
                  return (
                    <Card key={request.id} className="p-4 border-l-4 border-brand-emerald-light">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <div className="flex-shrink-0 mr-4">
                            {profile?.profile_picture_url ? (
                              <img 
                                src={profile.profile_picture_url} 
                                alt={getUserName(request.recipient_id)} 
                                className="h-12 w-12 rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-emerald to-brand-emerald-light flex items-center justify-center text-white font-bold shadow-sm">
                                {getUserName(request.recipient_id).charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-text-primary">
                              {getUserName(request.recipient_id)}
                            </h3>
                            {profile && (
                              <p className="text-sm text-text-secondary">
                                {profile.institution_name || 'Independent Researcher'}
                                {profile.department && ` • ${profile.department}`}
                              </p>
                            )}
                            <p className="text-xs text-brand-emerald mt-0.5">Request sent</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            disabled={actionInProgress === request.id}
                            className="px-4 py-1.5 bg-white border border-gray-200 text-text-secondary text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                          >
                            {actionInProgress === request.id ? (
                              <svg className="animate-spin h-4 w-4 text-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : "Cancel"}
                          </button>
                          <Link 
                            to={`/researchers/${profile?.id}`}
                            className="px-4 py-1.5 bg-white border border-gray-200 text-text-secondary text-sm rounded-md hover:bg-gray-50 transition-colors shadow-sm flex items-center"
                          >
                            <span>View Profile</span>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      case 'suggestions':
        return (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Suggested Connections</h2>
            {suggestions.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-tertiary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-text-secondary">No suggestions available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map(suggestion => {
                  return (
                    <Card key={suggestion.id} className="p-4 border-l-4 border-brand-emerald-light">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {suggestion.profile_picture_url ? (
                            <img 
                              src={suggestion.profile_picture_url} 
                              alt={`${suggestion.first_name} ${suggestion.last_name}`} 
                              className="h-12 w-12 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-emerald to-brand-emerald-light flex items-center justify-center text-white font-bold shadow-sm">
                              {suggestion.first_name ? suggestion.first_name.charAt(0) : 'R'}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-text-primary">
                            {suggestion.academic_title ? `${suggestion.academic_title} ` : ''}
                            {suggestion.first_name} {suggestion.last_name}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {suggestion.institution_name || 'Independent Researcher'}
                            {suggestion.department && ` • ${suggestion.department}`}
                          </p>
                          
                          {suggestion.research_interests && suggestion.research_interests.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1 mb-2">
                                {suggestion.research_interests.slice(0, 3).map((interest, index) => (
                                  <span
                                    key={index}
                                    className="inline-block px-2 py-0.5 bg-brand-emerald bg-opacity-10 text-brand-emerald-dark rounded-full text-xs"
                                  >
                                    {interest}
                                  </span>
                                ))}
                                {suggestion.research_interests.length > 3 && (
                                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-text-tertiary rounded-full text-xs">
                                    +{suggestion.research_interests.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() => handleSendRequest(suggestion.user_id)}
                              disabled={actionInProgress === suggestion.user_id}
                              className="px-3 py-1.5 bg-brand-emerald text-white text-sm rounded-md hover:bg-brand-emerald-light transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                            >
                              {actionInProgress === suggestion.user_id ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : null}
                              Connect
                            </button>
                            <Link 
                              to={`/researchers/${suggestion.id}`}
                              className="px-3 py-1.5 bg-white border border-gray-200 text-text-secondary text-sm rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Connections</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('connections')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'connections'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            My Connections
            {connections.length > 0 && (
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">{connections.length}</span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'requests'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            Requests
            {pendingRequests.length > 0 && (
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-brand-gold text-white">{pendingRequests.length}</span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'sent'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            Sent
            {sentRequests.length > 0 && (
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">{sentRequests.length}</span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'suggestions'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            Suggestions
            {suggestions.length > 0 && (
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">{suggestions.length}</span>
            )}
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-text-secondary">Loading connections...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        renderTabContent()
      )}
      
      {/* Confirmation dialog */}
      {confirmationDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl animate-fadeIn">
            <h3 className="text-lg font-medium text-text-primary mb-2">{confirmationDialog.title}</h3>
            <p className="text-text-secondary mb-6">{confirmationDialog.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={confirmationDialog.cancelAction}
                className="px-4 py-2 border border-gray-300 text-text-secondary rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmationDialog.confirmAction}
                className="px-4 py-2 bg-brand-emerald text-white rounded-md text-sm font-medium hover:bg-brand-emerald-light transition-colors shadow-sm"
              >
                {confirmationDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;