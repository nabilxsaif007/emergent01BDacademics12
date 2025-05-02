import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProfileStatusBanner = ({ profile, onProfileUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Determine the status color and message
  const getStatusInfo = () => {
    switch (profile.status) {
      case 'draft':
        return {
          color: 'bg-amber-50 border-brand-gold',
          textColor: 'text-amber-700',
          iconColor: 'text-brand-gold',
          title: 'Profile Not Submitted',
          message: profile.rejection_reason 
            ? 'Your profile needs changes before it can be approved.' 
            : 'Your profile is in draft mode. Complete it and submit for review.'
        };
      case 'pending_verification':
        return {
          color: 'bg-blue-50 border-blue-500',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-500',
          title: 'Email Verification Required',
          message: 'Please verify your email address to proceed with profile approval.'
        };
      case 'pending_approval':
        return {
          color: 'bg-indigo-50 border-indigo-500',
          textColor: 'text-indigo-700',
          iconColor: 'text-indigo-500',
          title: 'Profile Pending Approval',
          message: 'Your profile is currently under review by our administrators.'
        };
      case 'approved':
        return {
          color: 'bg-emerald-50 border-brand-emerald',
          textColor: 'text-emerald-700',
          iconColor: 'text-brand-emerald',
          title: 'Profile Approved',
          message: 'Your profile has been approved and is now visible to other researchers.'
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-300',
          textColor: 'text-text-secondary',
          iconColor: 'text-text-tertiary',
          title: 'Profile Status',
          message: 'Update your profile information and submit it for review.'
        };
    }
  };
  
  const { color, textColor, iconColor, title, message } = getStatusInfo();
  
  const handleSubmitProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${API}/profiles/me/submit`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the parent component with the new profile data
      if (onProfileUpdate) {
        onProfileUpdate(response.data);
      }
      
      // Show success message
      alert('Your profile has been submitted for approval!');
      
    } catch (err) {
      console.error('Error submitting profile:', err);
      setError(err.response?.data?.detail || 'Failed to submit profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`border-l-4 p-4 mb-6 ${color}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {profile.status === 'approved' ? (
            <svg className={`h-5 w-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : profile.status === 'pending_approval' ? (
            <svg className={`h-5 w-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className={`h-5 w-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-grow">
          <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
          <div className="mt-2 text-sm">
            <p className={textColor}>{message}</p>
            
            {/* Show admin feedback if any */}
            {profile.feedback && (
              <div className="mt-2 p-2 bg-white bg-opacity-50 rounded">
                <p className="font-medium text-sm">Admin Feedback:</p>
                <p className="mt-1 text-sm">{profile.feedback}</p>
              </div>
            )}
            
            {/* Show profile completion */}
            {profile.status !== 'approved' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Profile Completion</span>
                  <span>{profile.completion_percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${profile.completion_percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Action buttons based on status */}
            <div className="mt-3 flex space-x-3">
              {profile.status === 'draft' && (
                <>
                  <Link
                    to="/profile/edit"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md text-text-primary bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-emerald"
                  >
                    Edit Profile
                  </Link>
                  
                  {profile.completion_percentage >= 70 && (
                    <button
                      onClick={handleSubmitProfile}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-emerald hover:bg-brand-emerald-light transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-emerald-light disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit for Approval'}
                    </button>
                  )}
                </>
              )}
              
              {profile.status === 'pending_verification' && (
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => alert('Verification email has been resent.')}
                >
                  Resend Verification Email
                </button>
              )}
            </div>
            
            {/* Error message */}
            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatusBanner;