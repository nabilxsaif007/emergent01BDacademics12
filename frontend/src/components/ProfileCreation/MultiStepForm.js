import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../ui/Input';
import Button from '../ui/Button';

const MultiStepForm = ({ user }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    academic_title: '',
    institution_name: '',
    department: '',
    research_interests: [],
    bio: '',
    country: '',
    city: '',
    contact_email: user?.email || '',
    public_email: true,
    website: '',
    linkedin: '',
    twitter: '',
    researchgate: '',
    orcid: ''
  });
  
  const totalSteps = 5;

  // Calculate completion percentage
  useEffect(() => {
    // Define required fields for each step
    const requiredFields = {
      step1: ['academic_title', 'institution_name', 'department'],
      step2: ['bio'], // research_interests is an array, checking separately
      step3: ['country', 'city'],
      step4: ['contact_email'],
      step5: [] // No required fields in step 5
    };
    
    let completedFields = 0;
    let totalRequiredFields = 0;
    
    // Check each step's required fields
    Object.values(requiredFields).forEach(fields => {
      fields.forEach(field => {
        totalRequiredFields++;
        if (formData[field] && formData[field].trim() !== '') {
          completedFields++;
        }
      });
    });
    
    // Add research interests separately
    totalRequiredFields++; // Count as 1 field
    if (formData.research_interests.length > 0) {
      completedFields++;
    }
    
    // Calculate percentage
    const percentage = Math.round((completedFields / totalRequiredFields) * 100);
    setCompletionPercentage(percentage);
  }, [formData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear field-specific error when editing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const handleResearchAreaChange = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newArea = e.target.value.trim();
      if (!formData.research_interests.includes(newArea)) {
        setFormData({
          ...formData,
          research_interests: [...formData.research_interests, newArea]
        });
        
        // Clear research interests error if it exists
        if (formErrors.research_interests) {
          setFormErrors({
            ...formErrors,
            research_interests: null
          });
        }
      }
      e.target.value = '';
    }
  };
  
  const removeResearchArea = (area) => {
    setFormData({
      ...formData,
      research_interests: formData.research_interests.filter(item => item !== area)
    });
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const validateStep = () => {
    setError(null);
    let errors = {};
    let isValid = true;
    
    // Simple validation for current step
    switch(step) {
      case 1: // Basic Info
        if (!formData.academic_title) {
          errors.academic_title = 'Academic title is required';
          isValid = false;
        }
        if (!formData.institution_name) {
          errors.institution_name = 'Institution name is required';
          isValid = false;
        }
        if (!formData.department) {
          errors.department = 'Department is required';
          isValid = false;
        }
        break;
      case 2: // Research Interests
        if (formData.research_interests.length === 0) {
          errors.research_interests = 'Add at least one research interest';
          isValid = false;
        }
        if (!formData.bio) {
          errors.bio = 'Bio is required';
          isValid = false;
        }
        break;
      case 3: // Location
        if (!formData.country) {
          errors.country = 'Country is required';
          isValid = false;
        }
        if (!formData.city) {
          errors.city = 'City is required';
          isValid = false;
        }
        break;
      case 4: // Contact
        if (!formData.contact_email) {
          errors.contact_email = 'Contact email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
          errors.contact_email = 'Enter a valid email address';
          isValid = false;
        }
        break;
      default:
        break;
    }
    
    if (!isValid) {
      setFormErrors(errors);
    }
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format the data for the API
      const profileData = {
        ...formData,
        social_links: {
          website: formData.website,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          researchgate: formData.researchgate,
          orcid: formData.orcid
        }
      };
      
      // Remove individual social link fields from the root object
      delete profileData.website;
      delete profileData.linkedin;
      delete profileData.twitter;
      delete profileData.researchgate;
      delete profileData.orcid;
      
      const response = await axios.post('/api/profiles', profileData);
      
      setLoading(false);
      
      // Redirect to the profile page
      navigate(`/profile/${response.data.id}`);
    } catch (err) {
      setLoading(false);
      console.error('Error creating profile:', err);
      setError(err.response?.data?.detail || 'An error occurred creating your profile. Please try again.');
    }
  };
  
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Basic Information</h3>
            
            <div>
              <Input
                label="Academic Title *"
                type="text"
                name="academic_title"
                value={formData.academic_title}
                onChange={handleChange}
                placeholder="Professor, Associate Professor, etc."
                fullWidth
                error={formErrors.academic_title}
              />
            </div>
            
            <div>
              <Input
                label="Institution Name *"
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="University or research institution"
                fullWidth
                error={formErrors.institution_name}
              />
            </div>
            
            <div>
              <Input
                label="Department *"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department or faculty"
                fullWidth
                error={formErrors.department}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Research Profile</h3>
            
            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">
                Research Interests *
              </label>
              
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Type and press Enter to add"
                  onKeyDown={handleResearchAreaChange}
                  className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:ring-opacity-50 focus:border-brand-emerald"
                />
              </div>
              
              {formErrors.research_interests && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {formErrors.research_interests}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.research_interests.map((area, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 bg-brand-emerald bg-opacity-10 text-brand-emerald-dark rounded-full text-sm"
                  >
                    {area}
                    <button 
                      type="button" 
                      onClick={() => removeResearchArea(area)}
                      className="ml-2 text-brand-emerald-dark focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">
                Bio *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief description of your academic background and research focus"
                className={`w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:ring-opacity-50 focus:border-brand-emerald ${
                  formErrors.bio ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                rows={4}
              />
              {formErrors.bio && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {formErrors.bio}
                </p>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Location</h3>
            
            <div>
              <Input
                label="Country *"
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Your country"
                fullWidth
                error={formErrors.country}
              />
            </div>
            
            <div>
              <Input
                label="City *"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
                fullWidth
                error={formErrors.city}
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Contact Information</h3>
            
            <div>
              <Input
                label="Contact Email *"
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="Your academic email address"
                fullWidth
                error={formErrors.contact_email}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="public_email"
                name="public_email"
                checked={formData.public_email}
                onChange={handleChange}
                className="h-4 w-4 text-brand-emerald focus:ring-brand-emerald border-gray-300 rounded"
              />
              <label htmlFor="public_email" className="ml-2 block text-text-secondary text-sm">
                Make my email publicly visible
              </label>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">External Profiles</h3>
            
            <div>
              <Input
                label="Personal Website"
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                fullWidth
              />
            </div>
            
            <div>
              <Input
                label="LinkedIn"
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                fullWidth
              />
            </div>
            
            <div>
              <Input
                label="Twitter"
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/yourusername"
                fullWidth
              />
            </div>
            
            <div>
              <Input
                label="ResearchGate"
                type="url"
                name="researchgate"
                value={formData.researchgate}
                onChange={handleChange}
                placeholder="https://researchgate.net/profile/yourprofile"
                fullWidth
              />
            </div>
            
            <div>
              <Input
                label="ORCID"
                type="url"
                name="orcid"
                value={formData.orcid}
                onChange={handleChange}
                placeholder="https://orcid.org/0000-0000-0000-0000"
                fullWidth
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Celebrate completion milestone when percentage changes
  useEffect(() => {
    if (completionPercentage === 100) {
      // Could add animation or notification here
      console.log('Profile completion reached 100%!');
    }
  }, [completionPercentage]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Profile completion meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-text-secondary">Profile Completion</h4>
          <span className="text-sm font-medium text-brand-emerald">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              completionPercentage < 50 
                ? 'bg-brand-gold' 
                : completionPercentage < 100 
                  ? 'bg-brand-emerald-light' 
                  : 'bg-brand-emerald'
            }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        {completionPercentage === 100 && (
          <div className="mt-2 text-xs text-brand-emerald flex items-center justify-end animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your profile is complete!
          </div>
        )}
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="relative">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  i + 1 === step 
                    ? 'bg-brand-emerald text-white ring-4 ring-brand-emerald ring-opacity-20' 
                    : i + 1 < step 
                      ? 'bg-brand-emerald-light text-white' 
                      : 'bg-gray-100 text-text-secondary'
                }`}
              >
                {i + 1 < step ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium ${
                i + 1 === step ? 'text-brand-emerald' : 'text-text-tertiary'
              }`}>
                {i === 0 ? 'Basic Info' : 
                  i === 1 ? 'Research' : 
                  i === 2 ? 'Location' : 
                  i === 3 ? 'Contact' : 'Profiles'}
              </span>
            </div>
          ))}

          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-100">
            <div 
              className="h-full bg-brand-emerald transition-all duration-300 ease-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-8">
        {/* Show error if any */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-md border border-red-100 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        {/* Form step content */}
        <div className="transition-opacity duration-200 animate-fadeIn">
          {renderStep()}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              size="md"
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              variant="primary"
              size="md"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Profile...
                </>
              ) : (
                'Create Profile'
              )}
            </Button>
          )}
        </div>
      </form>

      {/* Contextual suggestions for incomplete sections */}
      {completionPercentage < 100 && step === 1 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-medium text-text-primary mb-2">Suggestions to complete your profile:</h4>
          <ul className="text-sm text-text-secondary space-y-2">
            {!formData.academic_title && (
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Add your academic title to help others recognize your position
              </li>
            )}
            {!formData.institution_name && (
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-4.419L6.581 16.814A1 1 0 015 16V4z" clipRule="evenodd" />
                </svg>
                Share your institution to connect with colleagues
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;