import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    academic_title: '',
    
    // Academic Background
    institution_name: '',
    department: '',
    education: [],
    
    // Research Interests
    research_interests: [],
    bio: '',
    
    // Location
    location: { country: '', city: '', coordinates: null },
    
    // Contact Preferences  
    contact_email: '',
    public_email: false,
    social_links: { linkedin: '', twitter: '', researchgate: '', orcid: '' }
  });
  
  const [errors, setErrors] = useState({});
  
  const updateFormData = (stepData) => {
    setFormData({ ...formData, ...stepData });
  };
  
  const handleNext = () => {
    // Validate the current step
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };
  
  const validateStep = (step) => {
    const stepErrors = {};
    
    switch (step) {
      case 1: // Personal Info
        if (!formData.academic_title) {
          stepErrors.academic_title = 'Academic title is required';
        }
        break;
        
      case 2: // Academic Background
        if (!formData.institution_name) {
          stepErrors.institution_name = 'Institution name is required';
        }
        if (!formData.department) {
          stepErrors.department = 'Department is required';
        }
        break;
        
      case 3: // Research Interests
        if (formData.research_interests.length === 0) {
          stepErrors.research_interests = 'At least one research interest is required';
        }
        if (!formData.bio || formData.bio.length < 50) {
          stepErrors.bio = 'Bio must be at least 50 characters';
        }
        break;
        
      case 4: // Location
        if (!formData.location.country) {
          stepErrors.country = 'Country is required';
        }
        if (!formData.location.city) {
          stepErrors.city = 'City is required';
        }
        break;
        
      case 5: // Contact Preferences
        if (!formData.contact_email) {
          stepErrors.contact_email = 'Contact email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
          stepErrors.contact_email = 'Invalid email format';
        }
        break;
        
      default:
        break;
    }
    
    return stepErrors;
  };
  
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to create a profile');
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create profile');
      }
      
      const profile = await response.json();
      
      // Redirect to dashboard or profile page
      window.location.href = '/dashboard';
      
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };
  
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors}
          />
        );
      case 2:
        return (
          <AcademicBackgroundStep 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors}
          />
        );
      case 3:
        return (
          <ResearchInterestsStep 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors}
          />
        );
      case 4:
        return (
          <LocationStep 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors}
          />
        );
      case 5:
        return (
          <ContactPreferencesStep 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors}
          />
        );
      case 6:
        return (
          <ReviewStep 
            formData={formData} 
            onSubmit={handleSubmit} 
            error={errors.submit}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Researcher Profile</h2>
        <p className="text-gray-600">Complete all steps to create your academic profile</p>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="text-xs text-gray-600">
                Step {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Form Content */}
      <div className="mb-8">
        {getStepContent()}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-md ${
            currentStep === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          Previous
        </button>
        
        {currentStep < 6 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Submit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;