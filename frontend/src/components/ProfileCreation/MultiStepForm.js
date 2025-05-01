import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MultiStepForm = ({ user }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
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
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const validateStep = () => {
    setError(null);
    
    // Simple validation for current step
    switch(step) {
      case 1: // Basic Info
        if (!formData.academic_title || !formData.institution_name || !formData.department) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 2: // Research Interests
        if (formData.research_interests.length === 0 || !formData.bio) {
          setError('Please add at least one research interest and a bio');
          return false;
        }
        break;
      case 3: // Location
        if (!formData.country || !formData.city) {
          setError('Please fill in your location information');
          return false;
        }
        break;
      case 4: // Contact
        if (!formData.contact_email) {
          setError('Please provide a contact email');
          return false;
        }
        break;
      default:
        break;
    }
    
    return true;
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
        },
        location: {
          country: formData.country,
          city: formData.city
        }
      };
      
      // Remove redundant fields
      delete profileData.website;
      delete profileData.linkedin;
      delete profileData.twitter;
      delete profileData.researchgate;
      delete profileData.orcid;
      delete profileData.country;
      delete profileData.city;
      
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/profiles`, 
        profileData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 201 || response.status === 200) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.response?.data?.detail || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render the appropriate step content
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Academic Information</h3>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Academic Title *
              </label>
              <select 
                name="academic_title"
                value={formData.academic_title}
                onChange={handleChange}
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select your title</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Senior Lecturer">Senior Lecturer</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Researcher">Researcher</option>
                <option value="PhD Candidate">PhD Candidate</option>
                <option value="Master's Student">Master's Student</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Institution Name *
              </label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="Your university or research institution"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Department *
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Your department or faculty"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Research Interests</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Research Areas *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.research_interests.map((area, index) => (
                  <div key={index} className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full flex items-center">
                    <span>{area}</span>
                    <button
                      type="button"
                      className="ml-2 text-yellow-200 hover:text-white focus:outline-none"
                      onClick={() => removeResearchArea(area)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a research area and press Enter"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                onKeyDown={handleResearchAreaChange}
              />
              <p className="text-gray-400 text-xs mt-1">Press Enter to add each research area</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Bio *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write about your research background, interests, and goals"
                rows="5"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              ></textarea>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Location</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Your country"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="Your academic email address"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="public_email"
                name="public_email"
                checked={formData.public_email}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="public_email" className="ml-2 block text-gray-300 text-sm">
                Make my email publicly visible
              </label>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Professional Links</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Personal Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Twitter/X
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/yourusername"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                ResearchGate
              </label>
              <input
                type="url"
                name="researchgate"
                value={formData.researchgate}
                onChange={handleChange}
                placeholder="https://researchgate.net/profile/yourprofile"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                ORCID
              </label>
              <input
                type="url"
                name="orcid"
                value={formData.orcid}
                onChange={handleChange}
                placeholder="https://orcid.org/0000-0000-0000-0000"
                className="bg-gray-800 text-white w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`text-xs ${
                i + 1 === step ? 'text-yellow-400' : i + 1 < step ? 'text-white' : 'text-gray-500'
              }`}
            >
              Step {i + 1}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-yellow-600 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Show error if any */}
        {error && (
          <div className="mb-4 bg-red-900 text-red-200 p-3 rounded-md">
            {error}
          </div>
        )}
        
        {/* Form step content */}
        {renderStep()}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block mr-2 animate-spin">&#8635;</span>
                  Creating...
                </>
              ) : (
                'Create Profile'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;