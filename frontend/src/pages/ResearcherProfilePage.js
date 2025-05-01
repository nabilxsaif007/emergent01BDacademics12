import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ApprovalStatusBadge from '../components/ApprovalStatusBadge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResearcherProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [researcher, setResearcher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('none'); // none, pending, connected, self
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the researcher profile
        const response = await axios.get(`${API}/profiles/${id}`);
        setProfile(response.data);
        
        // If this is the current user's profile
        if (user && response.data.user_id === user.id) {
          setConnectionStatus('self');
        } else {
          // In a real app, would check connection status
          // For now, we'll just use a random status
          const statuses = ['none', 'pending', 'connected'];
          setConnectionStatus(statuses[Math.floor(Math.random() * statuses.length)]);
        }
        
        // Fetch the user data for this profile
        try {
          const userResponse = await axios.get(`${API}/admin/users/${response.data.user_id}`);
          setResearcher(userResponse.data);
        } catch (userErr) {
          console.error('Error fetching user details:', userErr);
          // Continue with just the profile data
        }
        
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load researcher profile. It may not exist or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProfile();
    }
  }, [id, user]);
  
  const handleConnect = async () => {
    // In a real app, this would send a connection request
    // For now, just simulate the request
    setConnectionStatus('pending');
    alert('Connection request sent!');
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gray-900 shadow rounded-lg p-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gray-900 shadow rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/researchers"
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Back to Researchers
          </Link>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gray-900 shadow rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-4">Researcher profile not found.</p>
          <Link
            to="/researchers"
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Back to Researchers
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gray-900 shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={`${researcher?.first_name || 'Researcher'} ${researcher?.last_name || ''}`}
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-900"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-gray-900">
                  {researcher?.first_name ? researcher.first_name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center">
                <h1 className="text-3xl font-bold text-white">
                  {profile.academic_title ? `${profile.academic_title} ` : ''}
                  {researcher?.first_name || 'Researcher'} {researcher?.last_name || ''}
                </h1>
                <div className="ml-0 md:ml-3 mt-2 md:mt-0">
                  <ApprovalStatusBadge status={profile.status} />
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-xl text-gray-300">
                  {profile.institution_name || 'Independent Researcher'}
                  {profile.department && <span className="text-gray-400"> • {profile.department}</span>}
                </p>
                {profile.country && (
                  <p className="text-gray-400">
                    {profile.city && `${profile.city}, `}{profile.country}
                  </p>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {connectionStatus === 'none' && (
                  <button
                    onClick={handleConnect}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                  >
                    Connect
                  </button>
                )}
                
                {connectionStatus === 'pending' && (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-600 text-white rounded-md cursor-not-allowed"
                  >
                    Connection Pending
                  </button>
                )}
                
                {connectionStatus === 'connected' && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                  >
                    Connected
                  </button>
                )}
                
                {connectionStatus === 'self' && (
                  <Link
                    to="/profile/edit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Edit Your Profile
                  </Link>
                )}
                
                {profile.public_email && profile.contact_email && (
                  <a
                    href={`mailto:${profile.contact_email}`}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                  >
                    Contact
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Bio & Research Interests */}
            <div className="lg:col-span-2">
              {/* Bio */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                {profile.bio ? (
                  <p className="text-gray-300 whitespace-pre-line">{profile.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio provided</p>
                )}
              </div>
              
              {/* Research Interests */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Research Interests</h2>
                {profile.research_interests && profile.research_interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.research_interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No research interests listed</p>
                )}
              </div>
              
              {/* Publications */}
              {profile.publications && profile.publications.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Publications</h2>
                  <div className="space-y-4">
                    {profile.publications.map((pub, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-md">
                        <h3 className="font-medium text-white">{pub.title}</h3>
                        <p className="text-gray-400 text-sm">{pub.authors}</p>
                        <p className="text-gray-500 text-xs mt-1">{pub.journal} • {pub.year}</p>
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500 hover:text-yellow-400 text-sm mt-2 inline-block"
                          >
                            DOI: {pub.doi}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar - Education, Contact, Social Links */}
            <div>
              {/* Education */}
              <div className="bg-gray-800 p-4 rounded-md mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">Education</h2>
                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index}>
                        <p className="font-medium text-white">{edu.degree}</p>
                        <p className="text-gray-400">{edu.institution}</p>
                        <p className="text-gray-500 text-sm">{edu.field}, {edu.year}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No education history listed</p>
                )}
              </div>
              
              {/* Contact Information */}
              <div className="bg-gray-800 p-4 rounded-md mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
                {profile.public_email && profile.contact_email ? (
                  <p className="text-gray-300 mb-2">
                    <span className="text-gray-500">Email:</span>{' '}
                    <a href={`mailto:${profile.contact_email}`} className="text-yellow-500 hover:text-yellow-400">
                      {profile.contact_email}
                    </a>
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    Contact information is private
                  </p>
                )}
                
                {profile.phone && (
                  <p className="text-gray-300">
                    <span className="text-gray-500">Phone:</span> {profile.phone}
                  </p>
                )}
              </div>
              
              {/* Social & Professional Links */}
              {profile.social_links && Object.values(profile.social_links).some(link => link) && (
                <div className="bg-gray-800 p-4 rounded-md">
                  <h2 className="text-lg font-semibold text-white mb-3">Links</h2>
                  <div className="space-y-2">
                    {profile.social_links.website && (
                      <a
                        href={profile.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-yellow-500 hover:text-yellow-400"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"></path>
                        </svg>
                        Website
                      </a>
                    )}
                    
                    {profile.social_links.linkedin && (
                      <a
                        href={profile.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-yellow-500 hover:text-yellow-400"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-1-.02-2.285-1.39-2.285-1.39 0-1.6 1.087-1.6 2.21v4.253h-2.666V8.07h2.56v1.17h.03c.355-.675 1.227-1.387 2.524-1.387 2.7 0 3.2 1.778 3.2 4.092v4.393h.01zm-11.11-9.438a1.54 1.54 0 01-1.536-1.536A1.536 1.536 0 015.23 3.83a1.536 1.536 0 011.534 1.537c0 .845-.69 1.533-1.536 1.533zm1.338 9.438H3.9V8.07h2.666v8.268zM17.668 1H2.332C1.596 1 1 1.58 1 2.298v15.404C1 18.42 1.596 19 2.332 19h15.336c.737 0 1.332-.58 1.332-1.298V2.298C19 1.58 18.404 1 17.668 1z" clipRule="evenodd"></path>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    
                    {profile.social_links.twitter && (
                      <a
                        href={profile.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-yellow-500 hover:text-yellow-400"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.615 11.615 0 006.29 1.84"></path>
                        </svg>
                        Twitter
                      </a>
                    )}
                    
                    {profile.social_links.researchgate && (
                      <a
                        href={profile.social_links.researchgate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-yellow-500 hover:text-yellow-400"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.586 0H4.414C1.971 0 0 1.971 0 4.414v15.172C0 22.029 1.971 24 4.414 24h15.172C22.029 24 24 22.029 24 19.586V4.414C24 1.971 22.029 0 19.586 0zM4.557 14.887c.318 0 .601.012.875-.021 1.206-.129 2.094-.989 2.163-2.209.055-.968-.433-1.957-1.771-2.273a3.376 3.376 0 0 0-.492-.085c-.094-.011-.185-.027-.341-.05v4.638zm0-7.696a42.9 42.9 0 0 0 1.544.034c.844-.031 1.562.52 1.661 1.365.107.916-.412 1.756-1.289 1.933-.843.171-1.29.085-1.917-.023V7.191zm6.11 7.784V7.192h2.69v7.783h-2.69zm6.079-10.436c-.867 1.213-1.694 2.358-2.543 3.538h3.253v-3.538h-.71zm.71 10.436h-3.253l2.543 3.538h.71v-3.538z"/>
                        </svg>
                        ResearchGate
                      </a>
                    )}
                    
                    {profile.social_links.orcid && (
                      <a
                        href={profile.social_links.orcid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-yellow-500 hover:text-yellow-400"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm6.79 19.51c-1.121 0-1.908-.905-1.908-2.012 0-1.106.787-2.011 1.908-2.011 1.122 0 1.909.905 1.909 2.011 0 1.107-.788 2.012-1.909 2.012zM7.21 8.16c.507 0 .933.192 1.275.578.343.385.514.855.514 1.41v5.442H6.142V10.15c0-.28-.082-.511-.246-.696a.874.874 0 0 0-.678-.279.98.98 0 0 0-.783.343c-.193.232-.289.506-.289.825v5.044H1.29V6.172h2.856v1.121c.197-.352.455-.636.772-.852a1.99 1.99 0 0 1 1.108-.323c.413 0 .794.1 1.146.296.35.199.632.467.844.805a2.607 2.607 0 0 1 1.148-.82c.438-.193.9-.29 1.39-.29.798 0 1.45.234 1.959.703.507.47.761 1.134.761 1.994v6.783h-2.856v-5.488c0-.246-.083-.456-.251-.63a.834.834 0 0 0-.655-.263.941.941 0 0 0-.758.343c-.191.23-.288.507-.288.832v5.206h-2.856V9.93c0-.34-.091-.631-.274-.87a.949.949 0 0 0-.78-.363 1.077 1.077 0 0 0-.404.076z"/>
                        </svg>
                        ORCID
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherProfilePage;