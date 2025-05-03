import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

const GlobeComponent = ({ dataPoints = [], isLoading, onPointClick }) => {
  const globeRef = useRef();
  const tooltipRef = useRef();
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  // Debug log for dataPoints
  useEffect(() => {
    console.log("Globe component received dataPoints:", dataPoints ? dataPoints.length : 0);
  }, [dataPoints]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Call once on mount
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Custom tooltip handler with mouse position
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

  // Handle point click with proper event handling
  const handlePointClick = useCallback((point) => {
    console.log("Point clicked:", point);
    if (point && point.id) {
      if (onPointClick) {
        onPointClick(point);
      }
    }
  }, [onPointClick]);

  // Handle the globe ready event
  const handleGlobeReady = useCallback(() => {
    setGlobeReady(true);
    
    if (globeRef.current) {
      // Setup globe controls
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.minDistance = 200;
      controls.maxDistance = 600;
      
      // Stop auto-rotation on user interaction
      controls.addEventListener('start', function() {
        controls.autoRotate = false;
      });
      
      // Custom atmosphere effect with green hue
      try {
        const atmosphereMaterial = globeRef.current.globeMaterial();
        if (atmosphereMaterial && atmosphereMaterial.uniforms) {
          atmosphereMaterial.uniforms.glowColor.value = new THREE.Color('#22c55e');
        }
      } catch (e) {
        console.error("Error applying custom atmosphere:", e);
      }
    }
  }, []);

  // Custom tooltip component
  const CustomTooltip = useMemo(() => {
    if (!hoveredPoint) return null;
    
    return (
      <div 
        ref={tooltipRef}
        className="fixed z-50 bg-white backdrop-blur-md px-4 py-3 rounded-lg shadow-lg border border-green-300 text-gray-700 pointer-events-none"
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

  // Earth image
  const earthImg = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

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
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={earthImg}
        backgroundColor="rgba(255,255,255,0)"
        
        // Point rendering
        pointsData={dataPoints}
        pointLabel={null} // We'll use our custom tooltip
        pointColor={() => '#22c55e'}
        pointAltitude={0.1}
        pointRadius={0.6}
        pointResolution={32}
        pointsMerge={false}
        
        // Hover and click events
        onPointHover={handlePointHover}
        onPointClick={handlePointClick}
        
        // Atmosphere
        atmosphereColor="rgba(34, 197, 94, 0.15)"
        atmosphereAltitude={0.25}
        
        // Performance
        rendererConfig={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        
        // Styles
        globeMaterial={{
          opacity: 0.95,
          roughness: 0.7,
          metalness: 0.1
        }}
        
        // Initialize callback
        onGlobeReady={handleGlobeReady}
      />
      
      {/* Enhanced tooltip display */}
      {CustomTooltip}
      
      {/* Status indicator when globe isn't ready */}
      {!globeReady && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="animate-pulse">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Development markers to show the globe container is rendering */}
      <div className="absolute top-0 left-0 p-2 text-xs text-green-600 opacity-20">
        {globeReady ? 'Globe Ready' : 'Initializing...'}
      </div>
    </div>
  );
};

export default GlobeComponent;