import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = ({ dataPoints = [], isLoading, onPointClick }) => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Debug log for dataPoints
  useEffect(() => {
    console.log("Globe component received dataPoints:", dataPoints ? dataPoints.length : 0, dataPoints);
  }, [dataPoints]);

  // Set up globe on mount
  useEffect(() => {
    if (globeEl.current) {
      // Update dimensions
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ 
          width: width || 800, 
          height: Math.min(600, height || 600)
        });
      }

      // Add auto-rotation
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.enablePan = false;
        
        // Initial position focused on Bangladesh
        globeEl.current.pointOfView({ lat: 23.6850, lng: 90.3563, altitude: 2.5 }, 1000);
        
        // Stop auto-rotation on user interaction
        controls.addEventListener('start', function() {
          controls.autoRotate = false;
        });
      }
    }
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ 
          width: width || 800, 
          height: Math.min(600, height || 600)
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse position for tooltips
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle point hover with console logs for debugging
  const handlePointHover = useCallback((point) => {
    if (point) {
      console.log("Point hovered:", point.name, point.university);
    }
    setHoveredPoint(point);
  }, []);

  // Handle point click with console logs and callback
  const handlePointClick = useCallback((point) => {
    if (point) {
      console.log("Point clicked:", point.name, point.id);
      if (onPointClick) {
        onPointClick(point);
      }
    }
  }, [onPointClick]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-600">Loading globe data...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Main Globe */}
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        
        // Basic configuration
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(255,255,255,0)"
        
        // Points data
        pointsData={dataPoints}
        pointColor={() => "#16a34a"}
        pointAltitude={0.1}
        pointRadius={0.6}
        pointResolution={32}
        pointsMerge={false}
        
        // Events
        onPointHover={handlePointHover}
        onPointClick={handlePointClick}
        
        // Labels (needed for hover to work properly)
        pointLabel={(d) => d.name}
        
        // Atmosphere
        atmosphereColor="rgba(34, 197, 94, 0.2)"
        atmosphereAltitude={0.15}
      />
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div 
          className="fixed z-50 bg-white px-4 py-3 rounded-lg shadow-lg border border-green-300 text-gray-700 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            maxWidth: '300px'
          }}
        >
          <div className="font-bold text-green-700 text-base mb-1">{hoveredPoint.name}</div>
          <div className="text-sm text-gray-700 mb-1">{hoveredPoint.university}</div>
          <div className="text-xs text-gray-600 mb-1">{hoveredPoint.field}</div>
          <div className="text-xs text-gray-600">{hoveredPoint.city}, {hoveredPoint.country}</div>
          <div className="text-xs text-green-600 mt-2 font-medium">Click for details</div>
        </div>
      )}
      
      {/* Overlay gradient for better readability */}
      <div className="absolute inset-0 pointer-events-none" style={{ 
        background: 'radial-gradient(circle at center, transparent 40%, rgba(255,255,255,0.3) 100%)',
        opacity: 0.5
      }} />
      
      {/* Debug counter - can be removed in production */}
      <div className="absolute bottom-2 left-2 text-xs text-green-600 bg-white bg-opacity-50 px-2 py-1 rounded">
        {dataPoints ? dataPoints.length : 0} academics loaded
      </div>
    </div>
  );
};

export default GlobeComponent;