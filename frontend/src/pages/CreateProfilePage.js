import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GOOGLE_MAPS_API_KEY = '';  // Will need to be updated with actual key

const CreateProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const existingProfile = location.state?.profile;
  
  const [formData, setFormData] = useState({
    university: existingProfile?.university || '',
    research_field: existingProfile?.research_field || '',
    sub_field: existingProfile?.sub_field || '',
    keywords: existingProfile?.keywords || [],
    bio: existingProfile?.bio || '',
    country: existingProfile?.country || '',
    city: existingProfile?.city || '',
    latitude: existingProfile?.latitude || null,
    longitude: existingProfile?.longitude || null,
    contact_email: existingProfile?.contact_email || user?.email || '',
    profile_picture_url: existingProfile?.profile_picture_url || '',
  });
  
  const [keywordInput, setKeywordInput] = useState('');
  const [allKeywords, setAllKeywords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [geocodeError, setGeocodeError] = useState('');
  
  // Load existing keywords
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get(`${API}/keywords`);
        setAllKeywords(response.data);
      } catch (error) {
        console.error('Error loading keywords:', error);
      }
    };
    
    fetchKeywords();
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // If changing location details, clear geocoded coordinates
    if (name === 'city' || name === 'country') {
      setFormData(prev => ({
        ...prev,
        latitude: null,
        longitude: null,
      }));
    }
  };
  
  // Handle keyword input
  const handleKeywordInputChange = (e) => {
    setKeywordInput(e.target.value);
  };
  
  // Add keyword to the list
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };
  
  // Remove keyword from the list
  const removeKeyword = (keywordToRemove) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(keyword => keyword !== keywordToRemove),
    });
  };
  
  // Handle Enter key in keyword input
  const handleKeywordKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };
  
  // Geocode the address to get coordinates
  const geocodeAddress = async () => {
    const { city, country } = formData;
    if (!city || !country) {
      setGeocodeError('Both city and country are required for location');
      return false;
    }
    
    setGeocodeError('');
    try {
      const address = `${city}, ${country}`;
      
      // Mock geocoding for MVP since we don't have a real API key yet
      // In production, you would use the Google Maps Geocoding API
      let mockLatitude, mockLongitude;
      
      // Some predefined locations for example
      if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'united states') {
        mockLatitude = 37.0902;
        mockLongitude = -95.7129;
      } else if (country.toLowerCase() === 'uk' || country.toLowerCase() === 'united kingdom') {
        mockLatitude = 55.3781;
        mockLongitude = -3.4360;
      } else if (country.toLowerCase() === 'bangladesh') {
        mockLatitude = 23.6850;
        mockLongitude = 90.3563;
      } else {
        // Random coordinates for other locations
        mockLatitude = 10 + Math.random() * 40;
        mockLongitude = -10 - Math.random() * 150;
      }
      
      setFormData({
        ...formData,
        latitude: mockLatitude,
        longitude: mockLongitude,
      });
      
      return true;
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocodeError('Failed to geocode address. Please check your city and country.');
      return false;
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.university || !formData.research_field || !formData.country || !formData.city || !formData.contact_email) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    // Geocode the address if coordinates aren't set
    if (!formData.latitude || !formData.longitude) {
      const geocoded = await geocodeAddress();
      if (!geocoded) {
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      const profileData = {
        ...formData,
        user_id: user.id,
      };
      
      // Create or update profile
      if (existingProfile) {
        await axios.put(`${API}/academics/${existingProfile.id}`, profileData);
      } else {
        await axios.post(`${API}/academics`, profileData);
      }
      
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(
        error.response?.data?.detail || 
        'Failed to save your profile. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {existingProfile ? 'Edit' : 'Create'} Academic Profile
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* University */}
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                  University/Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Research Field */}
              <div>
                <label htmlFor="research_field" className="block text-sm font-medium text-gray-700 mb-1">
                  Research Field <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="research_field"
                  name="research_field"
                  value={formData.research_field}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Sub Field */}
              <div>
                <label htmlFor="sub_field" className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Field/Specialization
                </label>
                <input
                  type="text"
                  id="sub_field"
                  name="sub_field"
                  value={formData.sub_field}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={handleKeywordInputChange}
                    onKeyDown={handleKeywordKeyDown}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a keyword"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-200"
                  >
                    Add
                  </button>
                </div>
                
                {formData.keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-blue-200"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {allKeywords.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Popular keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {allKeywords.slice(0, 10).map((keyword) => (
                        <button
                          key={keyword.id}
                          type="button"
                          onClick={() => {
                            if (!formData.keywords.includes(keyword.name)) {
                              setFormData({
                                ...formData,
                                keywords: [...formData.keywords, keyword.name],
                              });
                            }
                          }}
                          disabled={formData.keywords.includes(keyword.name)}
                          className={`text-xs px-2 py-1 rounded-full ${
                            formData.keywords.includes(keyword.name)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {keyword.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Biography
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about your academic journey, research interests, and how you can help others"
                ></textarea>
              </div>
              
              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              {geocodeError && (
                <div className="text-red-500 text-sm">{geocodeError}</div>
              )}
              
              {/* Contact Email */}
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  This email will be visible to people who view your profile.
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
