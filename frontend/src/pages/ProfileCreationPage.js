import React from 'react';
import { useNavigate } from 'react-router-dom';
import MultiStepForm from '../components/ProfileCreation/MultiStepForm';

const ProfileCreationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Create Your Researcher Profile</h1>
      
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        <MultiStepForm />
      </div>
    </div>
  );
};

export default ProfileCreationPage;