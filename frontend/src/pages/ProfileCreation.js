import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiStepForm from '../components/ProfileCreation/MultiStepForm';

const ProfileCreation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/create-profile' } });
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isAuthenticated ? (
        <MultiStepForm />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-700">
            Please log in to create your researcher profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileCreation;