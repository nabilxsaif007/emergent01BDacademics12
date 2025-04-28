import React, { useState } from 'react';

const WelcomeOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="max-w-2xl p-8 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Bangladesh Academic Mentor Network
        </h1>
        <p className="text-gray-300 text-xl mb-8">
          Explore Bangladeshi academics and researchers worldwide using our interactive 3D globe
        </p>
        <div className="mb-10">
          <ul className="text-left text-gray-300 space-y-3 max-w-md mx-auto">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Navigate the globe by dragging to rotate and scrolling to zoom</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Click on points to view detailed information about academics</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Use the search and filter options to find specific academics or research fields</span>
            </li>
          </ul>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="bg-blue-600 px-8 py-3 rounded-full text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
