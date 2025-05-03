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
    <div className="relative">
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100vh', 
          background: 'transparent' 
        }} 
      />
      
      {/* Information tooltip for selected location */}
      {selectedCountry && (
        <div className="absolute top-6 right-6 z-10 bg-white p-4 rounded-lg shadow-md animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-green-600 font-bold text-lg">{selectedCountry.name}</h3>
            <button 
              onClick={() => setSelectedCountry(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-gray-700">
            <p>Lat: {selectedCountry.lat.toFixed(4)}</p>
            <p>Lng: {selectedCountry.lng.toFixed(4)}</p>
            <p className="mt-2 text-green-600 font-medium">10 researchers in this area</p>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-6 right-6 z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-md text-xs text-gray-600">
        <p>🔍 Click on blue markers to explore locations</p>
        <p>🖱️ Drag to rotate | Scroll to zoom</p>
      </div>
    </div>
  );
};

export default ArtisticGlobe;