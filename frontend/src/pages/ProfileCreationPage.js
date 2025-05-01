import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MultiStepForm from '../components/ProfileCreation/MultiStepForm';
import { useAuth } from '../context/AuthContext';

const ProfileCreationPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Create Your Researcher Profile</h1>
      
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        <MultiStepForm user={user} />
      </div>
    </div>
  );
};

export default ProfileCreationPage;