import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

const GlobeComponent = ({ dataPoints = [], isLoading, onPointClick }) => {
  const globeRef = useRef();
  const tooltipRef = useRef();
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [globeRadius, setGlobeRadius] = useState(100);
  const navigate = useNavigate();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        setGlobeRadius(Math.min(width, height) * 0.35);
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

  // Handle point hover
  const handlePointHover = useCallback((point) => {
    setHoveredPoint(point);
    
    if (point) {
      // Get tooltip position based on mouse event
      const el = globeRef.current.pointFromLngLat(point.lng, point.lat);
      if (el) {
        const { x, y } = el;
        setTooltipPosition({ x, y });
      }
    }
  }, []);

  // Handle point click
  const handlePointClick = useCallback((point) => {
    if (point && point.id) {
      const url = `/academics/${point.id}`;
      navigate(url);
    }
    if (onPointClick) {
      onPointClick(point);
    }
  }, [navigate, onPointClick]);

  // Customize Earth texture with green hues
  useEffect(() => {
    if (globeRef.current) {
      // Add custom atmosphere with subtle green glow
      const atmosphereMaterial = globeRef.current.globeMaterial();
      if (atmosphereMaterial) {
        atmosphereMaterial.uniforms.glowColor.value = new THREE.Color('#22c55e');
      }

      // Initial auto-rotation
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      
      // Turn off auto-rotation when user interacts with globe
      const controls = globeRef.current.controls();
      const originalHandler = controls.addEventListener('start', () => {
        controls.autoRotate = false;
      });
      
      return () => {
        controls.removeEventListener('start', originalHandler);
      };
    }
  }, []);

  // Earth image with adjusted saturation for green theme
  const earthImg = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
  
  // Use memoized globe element to reduce re-renders
  const globeElement = useMemo(() => (
    <Globe
      ref={globeRef}
      width={dimensions.width}
      height={dimensions.height}
      globeImageUrl={earthImg}
      backgroundImageUrl={null}
      backgroundColor="rgba(255,255,255,0)"
      
      pointsData={dataPoints}
      pointColor={(d) => d === hoveredPoint ? '#16a34a' : '#22c55e'} // Green colors
      pointAltitude={0.12}
      pointRadius={(d) => d === hoveredPoint ? 0.7 : 0.5}
      pointResolution={24}
      pointsMerge={false}
      
      onPointClick={handlePointClick}
      onPointHover={handlePointHover}
      
      atmosphereColor="rgba(34, 197, 94, 0.1)" // Subtle green atmosphere
      atmosphereAltitude={0.17}
      
      // Performance optimizations
      rendererConfig={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      }}
      
      // Aesthetics
      globeMaterial={{
        opacity: 0.95,
        roughness: 0.8,
        metalness: 0.2
      }}
    />
  ), [dataPoints, dimensions, handlePointClick, handlePointHover, hoveredPoint]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-600">Loading globe data...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
      style={{ width: '100%', height: '100%' }}
    >
      {globeElement}
      
      {/* Custom Tooltip */}
      {hoveredPoint && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 bg-white bg-opacity-95 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-green-300 text-gray-700 transform -translate-x-1/2 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 40
          }}
        >
          <div className="font-bold text-green-700 text-base">{hoveredPoint.name}</div>
          <div className="text-sm text-gray-700">{hoveredPoint.university}</div>
          <div className="text-xs text-gray-600">{hoveredPoint.field} • {hoveredPoint.city}, {hoveredPoint.country}</div>
          <div className="text-xs text-green-600 mt-1">Click for details</div>
        </div>
      )}
      
      {/* Overlay effect for better readability */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: 'radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.8) 100%)',
          opacity: 0.6 
        }} 
      />
    </div>
  );
};

export default GlobeComponent;