import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InfoPanel = ({ isVisible, academic, onClose }) => {
  const navigate = useNavigate();
  // Add hooks at the top level - before any conditional returns
  const [loading, setLoading] = useState(false);
  
  // Set loading effect when academic changes
  useEffect(() => {
    if (isVisible && academic) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible, academic]);
  
  // Early return - after all hooks have been called
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
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:inset-auto sm:bottom-10 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:w-full sm:max-w-md sm:px-4 md:max-w-lg">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fade-in-up w-full h-full overflow-y-auto sm:h-auto sm:max-h-[80vh]" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-2xl z-10 backdrop-filter backdrop-blur-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-coral-500 border-t-transparent mr-3"></div>
            <p className="text-gray-700 font-medium" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>Loading profile...</p>
          </div>
        )}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 p-2 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-opacity-50 transition-all duration-200"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Profile Header */}
        <div className="flex items-start">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-full h-20 w-20 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-md">
            {academic.name.charAt(0)}
          </div>
          <div className="ml-5">
            <h3 className="text-gray-800 text-xl font-bold" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>{academic.name}</h3>
            <p className="text-coral-500 text-sm font-medium" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>{getDesignation(academic.field)}</p>
            <p className="text-gray-700 text-sm mt-1">{academic.field}</p>
            <p className="text-gray-500 text-sm">{academic.university}</p>
          </div>
        </div>
        
        {/* About Section - Limited to 150 chars */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <h4 className="text-gray-700 text-sm font-semibold mb-2" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>About</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {getAboutText()}
          </p>
        </div>
        
        {/* Research Keywords Section */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <h4 className="text-gray-700 text-sm font-semibold mb-3" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>Research Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {generateKeywords(academic.field).map((keyword, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200 hover:border-coral-200 hover:bg-gray-100 transition-colors duration-200"
                style={{ 
                  fontFamily: "'Circular', 'Inter', -apple-system, sans-serif",
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>Location</h4>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-coral-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-700 font-medium">{academic.city}, {academic.country}</p>
              </div>
            </div>
            <div>
              <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>Email</h4>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-coral-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${academic.name.toLowerCase().replace(' ', '.')}@example.com`} className="text-teal-600 hover:text-teal-700 transition-colors duration-200 font-medium">
                  {academic.name.toLowerCase().replace(' ', '.')}@example.com
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* View Profile Button */}
        <button 
          onClick={handleViewProfile}
          className="mt-6 w-full bg-gradient-to-r from-coral-500 to-coral-400 hover:from-coral-600 hover:to-coral-500 text-white py-3.5 rounded-xl transition-all duration-300 font-medium flex items-center justify-center hover:shadow-md transform hover:translate-y-[-2px]"
          style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
        >
          <span>View Full Profile</span>
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
        
        {/* Connect Button */}
        <button 
          className="mt-3 w-full bg-white text-coral-500 border border-coral-200 hover:border-coral-400 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center hover:bg-gray-50"
          style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Connect with Researcher</span>
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;
