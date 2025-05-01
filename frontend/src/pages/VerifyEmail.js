import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setVerificationStatus('error');
          setMessage('Verification token is missing.');
          return;
        }
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setVerificationStatus('success');
          setMessage(data.message || 'Your email has been verified successfully!');
        } else {
          setVerificationStatus('error');
          setMessage(data.detail || 'Failed to verify email.');
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('An error occurred during verification. Please try again later.');
      }
    };
    
    verifyEmail();
  }, [token]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Email Verification</h2>
        
        {verificationStatus === 'verifying' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}
        
        {verificationStatus === 'success' && (
          <div className="text-center">
            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-md mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="font-medium">{message}</p>
            </div>
            <p className="text-gray-600 mb-6">
              Your email address has been verified successfully. You can now create your researcher profile or log in to your account.
            </p>
            <div className="flex flex-col space-y-3">
              <Link
                to="/create-profile"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-center"
              >
                Create Profile
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-center"
              >
                Log In
              </Link>
            </div>
          </div>
        )}
        
        {verificationStatus === 'error' && (
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="font-medium">{message}</p>
            </div>
            <p className="text-gray-600 mb-6">
              Your verification link may have expired or is invalid. Please request a new verification email.
            </p>
            <div className="flex flex-col space-y-3">
              <Link
                to="/request-verification"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-center"
              >
                Request New Verification
              </Link>
              <Link
                to="/"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-center"
              >
                Go Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;