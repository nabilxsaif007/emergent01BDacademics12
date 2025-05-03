import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = ({ dataPoints = [], isLoading, onPointClick }) => {
  const globeEl = useRef();
  const tooltipRef = useRef();
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  // Debug log for dataPoints
  useEffect(() => {
    console.log("Globe component received dataPoints:", dataPoints ? dataPoints.length : 0);
  }, [dataPoints]);

  // Set up globe on mount
  useEffect(() => {
    // Update dimensions based on container size
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ 
        width: width || 800, 
        height: height || 800 
      });
    }

    // Set up auto-rotation
    if (globeEl.current) {
      // Add auto-rotation
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      
      // Stop auto-rotation on user interaction
      controls.addEventListener('start', function() {
        controls.autoRotate = false;
      });
    }
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial call
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle point hover
  const handlePointHover = useCallback((point, event) => {
    setHoveredPoint(point);
    
    if (point && event) {
      // Use mouse position directly from event
      setTooltipPosition({ 
        x: event.clientX, 
        y: event.clientY 
      });
    }
  }, []);

  // Handle point click
  const handlePointClick = useCallback((point) => {
    console.log("Point clicked:", point);
    if (point && onPointClick) {
      onPointClick(point);
    }
  }, [onPointClick]);

  // Custom tooltip component
  const CustomTooltip = useMemo(() => {
    if (!hoveredPoint) return null;
    
    return (
      <div 
        ref={tooltipRef}
        className="fixed z-50 bg-white px-4 py-3 rounded-lg shadow-lg border border-green-300 text-gray-700 pointer-events-none"
        style={{
          left: tooltipPosition.x + 10,
          top: tooltipPosition.y - 10,
        }}
      >
        <div className="font-bold text-green-700 text-base mb-1">{hoveredPoint.name}</div>
        <div className="text-sm text-gray-700 mb-1">{hoveredPoint.university}</div>
        <div className="text-xs text-gray-600 mb-1">{hoveredPoint.field}</div>
        <div className="text-xs text-gray-600">{hoveredPoint.city}, {hoveredPoint.country}</div>
        <div className="text-xs text-green-600 mt-2 font-medium">Click for details</div>
      </div>
    );
  }, [hoveredPoint, tooltipPosition]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-600">Loading globe data...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        
        // Basic configuration
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(255,255,255,0)"
        
        // Points data
        pointsData={dataPoints}
        pointColor={() => "#22c55e"}
        pointAltitude={0.1}
        pointRadius={0.5}
        pointsMerge={false}
        
        // Hover and click events
        onPointHover={handlePointHover}
        onPointClick={handlePointClick}
        
        // Green atmosphere
        atmosphereColor="rgba(34, 197, 94, 0.2)"
        atmosphereAltitude={0.15}
      />
      
      {/* Tooltip */}
      {CustomTooltip}
    </div>
  );
};

export default GlobeComponent;