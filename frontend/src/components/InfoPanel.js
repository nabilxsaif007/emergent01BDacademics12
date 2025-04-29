import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InfoPanel = ({ isVisible, academic, onClose }) => {
  const navigate = useNavigate();
  
  if (!isVisible || !academic) return null;

  const handleViewProfile = () => {
    navigate(`/academics/${academic.id}`);
  };
  
  // Generate a position title based on the field
  const getDesignation = (field) => {
    const designations = {
      "Computer Science": "Associate Professor",
      "Medicine": "Senior Researcher",
      "Physics": "Professor",
      "Bioengineering": "Research Fellow",
      "Environmental Science": "Assistant Professor",
      "Civil Engineering": "Professor",
      "Literature": "Associate Professor",
      "Robotics": "Lead Researcher",
      "Psychology": "Professor",
      "Economics": "Department Head"
    };
    
    return designations[field] || "Researcher";
  };

  // Generate research keywords based on field
  const generateKeywords = (field) => {
    const fieldSpecificKeywords = {
      "Computer Science": ['artificial intelligence', 'machine learning', 'data science', 'algorithms'],
      "Medicine": ['epidemiology', 'clinical research', 'healthcare', 'medical science'],
      "Physics": ['quantum mechanics', 'theoretical physics', 'particle physics', 'astrophysics'],
      "Bioengineering": ['genetic engineering', 'biomaterials', 'tissue engineering', 'synthetic biology'],
      "Environmental Science": ['climate change', 'sustainability', 'ecology', 'conservation'],
      "Civil Engineering": ['structural engineering', 'urban planning', 'construction', 'infrastructure'],
      "Literature": ['comparative literature', 'literary theory', 'cultural studies', 'postcolonial studies'],
      "Robotics": ['automation', 'artificial intelligence', 'computer vision', 'mechanical engineering'],
      "Psychology": ['cognitive psychology', 'clinical psychology', 'behavioral science', 'neuroscience'],
      "Economics": ['development economics', 'international trade', 'macroeconomics', 'economic policy']
    };
    
    // Return 3 keywords for the field
    return fieldSpecificKeywords[field] || ['research', 'academia', 'education'];
  };

  // Generate a limited-length about text
  const getAboutText = () => {
    return `${academic.name.split(' ')[0]} is a ${academic.field} specialist at ${academic.university}. Their research focuses on advanced topics with real-world applications.`.substring(0, 150);
  };

  // Generate a more detailed description
  const getDetailedDescription = () => {
    return `${academic.name.split(' ')[0]} is a ${academic.field} specialist focusing on advanced research at ${academic.university}. Their work combines theoretical insights with practical applications, particularly in ${generateKeywords(academic.field)[0]} and ${generateKeywords(academic.field)[1]}. They've published extensively in peer-reviewed journals and collaborate with institutions worldwide.`;
  };

  // Add loading and error states
  const [loading, setLoading] = useState(true);
  
  // Set loading effect when academic changes
  useEffect(() => {
    if (academic) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [academic]);
  
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 sm:max-w-lg md:max-w-xl">
      <div className="info-panel-backdrop rounded-lg shadow-xl border-2 border-blue-500 p-6 animate-fade-in-up">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg z-10 backdrop-filter backdrop-blur-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-blue-400">Loading profile...</p>
          </div>
        )}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Profile Header */}
        <div className="flex items-start">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {academic.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h3 className="text-white text-xl font-bold">{academic.name}</h3>
            <p className="text-blue-300 text-sm font-medium">{getDesignation(academic.field)}</p>
            <p className="text-gray-300 text-sm mt-1">{academic.field}</p>
            <p className="text-gray-400 text-sm">{academic.university}</p>
          </div>
        </div>
        
        {/* About Section - Limited to 150 chars */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-gray-200 text-sm font-semibold uppercase mb-2">About</h4>
          <p className="text-gray-300 text-sm">
            {getAboutText()}
          </p>
        </div>
        
        {/* Research Keywords Section */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-gray-200 text-sm font-semibold uppercase mb-2">Research Keywords</h4>
          <div className="flex flex-wrap">
            {generateKeywords(academic.field).map((keyword, index) => (
              <span 
                key={index} 
                className="keyword-tag animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
{/* Description section removed as per feedback */}
        
        {/* Contact Information */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-gray-400 text-xs uppercase">Location</h4>
              <div className="flex items-center mt-1">
                <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-white">{academic.city}, {academic.country}</p>
              </div>
            </div>
            <div>
              <h4 className="text-gray-400 text-xs uppercase">Email</h4>
              <div className="flex items-center mt-1">
                <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${academic.name.toLowerCase().replace(' ', '.')}@example.com`} className="text-blue-400 hover:text-blue-300">
                  {academic.name.toLowerCase().replace(' ', '.')}@example.com
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* View Profile Button */}
        <button 
          onClick={handleViewProfile}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center animate-pulse-glow hover:scale-105 transform"
        >
          <span>View Full Profile</span>
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;
