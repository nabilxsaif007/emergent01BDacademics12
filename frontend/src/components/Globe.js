import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import '../styles/GlobeStyles.css';

// High-resolution Earth day texture with space background
const EARTH_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

const GlobeComponent = ({ dataPoints = [], isLoading, onPointClick }) => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Set up globe on mount - keeping this simple to ensure it works
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

      // Configure globe controls
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.enablePan = false;
        
        // Initial position focused on Bangladesh
        globeEl.current.pointOfView({ lat: 23.6850, lng: 90.3563, altitude: 2.5 }, 1000);
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

  // Handle point hover
  const handlePointHover = useCallback((point) => {
    setHoveredPoint(point);
  }, []);

  // Handle point click
  const handlePointClick = useCallback((point) => {
    if (point && onPointClick) {
      onPointClick(point);
    }
  }, [onPointClick]);

  // Configure academic points with rods
  const academicPoints = dataPoints.map(point => ({
    ...point,
    size: 20,
    color: '#16a34a',
    lat: point.lat,
    lng: point.lng,
    altitude: 0
  }));

  if (isLoading) {
    return (
      <div className="globe-loading">
        <div className="globe-loading-spinner"></div>
        <p className="mt-4 text-green-600">Loading globe data...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="globe-container">
      {/* Space-themed background */}
      <div className="space-background"></div>
      
      {/* Main Globe */}
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        
        // Globe configuration
        globeImageUrl={EARTH_TEXTURE_URL}
        backgroundColor="rgba(0,0,0,0)"
        
        // Academic rods (vertical location indicators)
        ringsData={academicPoints}
        ringColor={() => "#16a34a"}
        ringMaxRadius={0.5}
        ringPropagationSpeed={0.1}
        ringRepeatPeriod={1500}
        
        // Academic points
        hexBinPointsData={dataPoints}
        hexBinPointWeight="size"
        hexBinResolution={4}
        hexTopColor={() => "#16a34a"}
        hexSideColor={() => "#15803d"}
        hexBinMerge={true}
        
        // Regular points for tooltips and interaction
        pointsData={dataPoints}
        pointColor={() => "#16a34a"}
        pointAltitude={0.1}
        pointRadius={0.5}
        pointsMerge={false}
        
        // Events
        onPointHover={handlePointHover}
        onPointClick={handlePointClick}
        
        // Atmosphere
        atmosphereColor="rgba(34, 197, 94, 0.2)"
        atmosphereAltitude={0.15}
      />
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div className="globe-tooltip" style={{
          left: mousePosition.x,
          top: mousePosition.y - 10,
        }}>
          <div className="tooltip-content">
            <div className="tooltip-name">{hoveredPoint.name}</div>
            <div className="tooltip-university">{hoveredPoint.university}</div>
            <div className="tooltip-location">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {hoveredPoint.city}, {hoveredPoint.country}
            </div>
            <div className="tooltip-field">{hoveredPoint.field}</div>
          </div>
        </div>
      )}
      
      {/* Globe controls */}
      <div className="globe-controls">
        <button 
          className="globe-control-btn"
          onClick={() => {
            const controls = globeEl.current.controls();
            if (controls) {
              controls.zoomIn(1.2);
            }
          }}
        >
          +
        </button>
        <button 
          className="globe-control-btn"
          onClick={() => {
            const controls = globeEl.current.controls();
            if (controls) {
              controls.zoomOut(1.2);
            }
          }}
        >
          -
        </button>
        <button 
          className="globe-control-btn"
          onClick={() => {
            const controls = globeEl.current.controls();
            if (controls) {
              controls.autoRotate = !controls.autoRotate;
            }
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GlobeComponent;