import React from 'react';

const InfoPanel = ({ isVisible, academic, onClose }) => {
  if (!isVisible || !academic) return null;

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="bg-black bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg border border-gray-700 p-6 animate-fade-in-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-start">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold text-white">
            {academic.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h3 className="text-white text-lg font-semibold">{academic.name}</h3>
            <p className="text-gray-300 text-sm">{academic.field}</p>
            <p className="text-gray-400 text-xs">{academic.university}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-gray-400 text-xs uppercase">Location</h4>
              <p className="text-white">{academic.city}, {academic.country}</p>
            </div>
            <div>
              <h4 className="text-gray-400 text-xs uppercase">Email</h4>
              <a href={`mailto:${academic.name.toLowerCase().replace(' ', '.')}@example.com`} className="text-blue-400 hover:text-blue-300">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-gray-400 text-xs uppercase">Research Keywords</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {['research', 'keywords', 'would', 'appear', 'here'].map((keyword, i) => (
                <span key={i} className="bg-blue-900 bg-opacity-50 text-blue-200 text-xs px-2 py-1 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
          View Full Profile
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;
