import React, { useState, useEffect, useRef } from 'react';

const researchers = [
  {
    id: 1,
    name: "Dr. Ahmed Khan",
    position: "Professor, University of Cambridge",
    fields: ["Mathematics", "Theoretical Physics"],
    location: { lat: 52.2053, lng: 0.1218 }, // Cambridge, UK
    country: "United Kingdom"
  },
  {
    id: 2,
    name: "Dr. Maria Rodriguez",
    position: "Senior Researcher, CERN",
    fields: ["Particle Physics", "Quantum Mechanics"],
    location: { lat: 46.2324, lng: 6.0550 }, // CERN, Switzerland
    country: "Switzerland"
  },
  {
    id: 3,
    name: "Dr. Hiroshi Tanaka",
    position: "Director, Tokyo Institute of Technology",
    fields: ["Robotics", "Artificial Intelligence"],
    location: { lat: 35.6047, lng: 139.6822 }, // Tokyo, Japan
    country: "Japan"
  },
  {
    id: 4,
    name: "Dr. Sophia Chen",
    position: "Lead Scientist, Max Planck Institute",
    fields: ["Biochemistry", "Molecular Biology"],
    location: { lat: 48.1351, lng: 11.5820 }, // Munich, Germany
    country: "Germany"
  },
  {
    id: 5,
    name: "Dr. Rahman Ali",
    position: "Department Chair, University of Dhaka",
    fields: ["Computer Science", "Machine Learning"],
    location: { lat: 23.7461, lng: 90.3742 }, // Dhaka, Bangladesh
    country: "Bangladesh"
  },
  {
    id: 6,
    name: "Dr. Fatima Al-Zahrawi",
    position: "Research Director, Institut Pasteur",
    fields: ["Virology", "Immunology"],
    location: { lat: 48.8417, lng: 2.3130 }, // Paris, France
    country: "France"
  }
];

const ArtisticGlobe = () => {
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [mapRotation, setMapRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  
  // Function to convert lat/lng to SVG coordinates
  const latLngToCoordinates = (lat, lng, width, height) => {
    // Adjust longitude based on rotation
    const adjustedLng = (lng + mapRotation + 540) % 360 - 180;
    
    // Calculate visibility - if the point is on the visible side of Earth
    const isVisible = adjustedLng > -90 && adjustedLng < 90;
    
    // Calculate x position (0-1) from adjusted longitude
    const x = (adjustedLng + 180) / 360;
    
    // Calculate y position (0-1) from latitude
    const y = (90 - lat) / 180;
    
    // Calculate size based on longitude (simulating perspective)
    const distanceFromCenter = Math.abs(adjustedLng) / 90;
    const size = Math.max(5, 12 * (1 - distanceFromCenter * 0.6));
    
    // Calculate opacity based on longitude
    const opacity = 1 - Math.max(0, Math.abs(adjustedLng) - 60) / 30;
    
    return {
      x: x * width,
      y: y * height,
      isVisible,
      size,
      opacity
    };
  };
  
  // Auto-rotation animation
  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        setMapRotation(prev => (prev + 0.2) % 360);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging]);
  
  // Mouse event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    e.preventDefault();
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - startX;
      setMapRotation(prev => (prev - dx * 0.5) % 360);
      setStartX(e.clientX);
    }
    e.preventDefault();
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    if (isDragging) {
      const dx = e.touches[0].clientX - startX;
      setMapRotation(prev => (prev - dx * 0.5) % 360);
      setStartX(e.touches[0].clientX);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <div className="flex flex-col h-screen bg-white">
      <div
        className="flex-grow relative bg-white"
        ref={containerRef}
      >
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Map Background */}
          <div
            className="relative w-full h-full max-w-full max-h-full overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0) 40%, rgba(240,240,240,1) 100%)',
            }}
          >
            {/* World Map */}
            <div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
              style={{
                width: '70vmin',
                height: '70vmin',
                backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mercator_projection_Square.JPG/1280px-Mercator_projection_Square.JPG")',
                backgroundSize: '200% 100%',
                backgroundPosition: `${mapRotation / 360 * -100}% center`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              {/* Render researcher markers */}
              {researchers.map(researcher => {
                // Get marker position
                const coords = latLngToCoordinates(
                  researcher.location.lat,
                  researcher.location.lng,
                  100, // percentage-based width
                  100  // percentage-based height
                );
                
                // Skip if not visible
                if (!coords.isVisible) return null;
                
                return (
                  <button
                    key={researcher.id}
                    className="absolute rounded-full border-2 border-white shadow-md hover:bg-green-600 focus:outline-none transition-all duration-200"
                    style={{
                      left: `${coords.x}%`,
                      top: `${coords.y}%`,
                      width: coords.size,
                      height: coords.size,
                      backgroundColor: researcher.country === 'Bangladesh' ? '#16a34a' : '#3B82F6',
                      opacity: coords.opacity,
                      transform: 'translate(-50%, -50%)',
                      zIndex: Math.round(50 + coords.opacity * 50)
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResearcher(researcher);
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Researcher Info Popup */}
          {selectedResearcher && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-4 w-64 max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{selectedResearcher.name}</h3>
                  <p className="text-gray-700 text-sm">{selectedResearcher.position}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResearcher(null);
                  }}
                >
                  ×
                </button>
              </div>
              
              <div className="mt-2">
                {selectedResearcher.fields.map((field, index) => (
                  <span
                    key={index}
                    className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                  >
                    {field}
                  </span>
                ))}
              </div>
              
              <button className="mt-3 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded flex items-center justify-center w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-6 right-6 z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-md text-xs text-gray-600">
        <p>🔍 Click on markers to explore researchers</p>
        <p>🖱️ Drag to rotate the globe</p>
      </div>
    </div>
  );
};

export default ArtisticGlobe;