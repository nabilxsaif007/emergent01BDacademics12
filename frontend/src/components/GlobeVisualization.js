import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

const GlobeVisualization = ({ dataPoints = [], isLoading, onPointClick }) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const navigate = useNavigate();

  // Enhance globe with custom texture and effects
  useEffect(() => {
    if (!isLoading && globeEl.current) {
      // Set initial rotation and camera position
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ lat: 23.6850, lng: 90.3563, altitude: 2.5 }); // Center on Bangladesh
      
      // Add directional light for 3D effect
      const directionalLight = new THREE.DirectionalLight(0x3a9dc4, 0.6);
      directionalLight.position.set(1, 1, 1);
      globeEl.current.scene().add(directionalLight);
      
      // Add ambient light for better visibility
      const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.3);
      globeEl.current.scene().add(ambientLight);
      
      setIsGlobeReady(true);
      
      // Stop auto rotation when user interacts with the globe
      const controls = globeEl.current.controls();
      controls.addEventListener('start', () => {
        controls.autoRotate = false;
      });
    }
  }, [isLoading]);

  // Load country data for globe
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then(data => {
        if (data.features) {
          setCountries(data.features);
        }
      })
      .catch(error => {
        console.error("Error loading countries data:", error);
        setCountries([]);
      });
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (globeEl.current) {
        globeEl.current.width(window.innerWidth);
        globeEl.current.height(window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointHover = useCallback((point, event) => {
    if (point) {
      setHoveredPoint(point);
      
      // Calculate tooltip position based on mouse or touch event
      const x = event?.clientX || (event?.touches && event.touches[0] ? event.touches[0].clientX : window.innerWidth / 2);
      const y = event?.clientY || (event?.touches && event.touches[0] ? event.touches[0].clientY : window.innerHeight / 2);
      
      setTooltipPosition({ x, y });
    } else {
      setHoveredPoint(null);
    }
  }, []);

  const handlePointClick = useCallback((point) => {
    if (point) {
      // Focus camera on clicked point
      if (globeEl.current) {
        globeEl.current.pointOfView({
          lat: point.lat,
          lng: point.lng,
          altitude: 1.5
        }, 1000); // 1000ms animation duration
      }
      
      // Call the provided click handler
      onPointClick(point);
    }
  }, [onPointClick]);

  // Navigate to academic's profile on double click
  const handlePointDoubleClick = useCallback((point) => {
    if (point && point.id) {
      navigate(`/academics/${point.id}`);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading globe visualization...</p>
      </div>
    );
  }

  return (
    <>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        width={window.innerWidth}
        height={window.innerHeight}
        lineHoverPrecision={0}
        
        // Country polygons
        hexPolygonsData={countries}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => `rgba(255, 255, 255, ${isGlobeReady ? 0.1 : 0})`}
        
        // Render points
        pointsData={dataPoints}
        pointColor={() => '#4285F4'}
        pointAltitude={0.01}
        pointRadius={0.25}
        pointsMerge={false}
        pointResolution={12}
        onPointClick={handlePointClick}
        onPointRightClick={handlePointDoubleClick}
        onPointHover={handlePointHover}
        
        // Atmosphere
        atmosphereColor="rgba(51, 153, 255, 0.3)"
        atmosphereAltitude={0.15}
        
        // Performance optimizations
        rendererConfig={{ antialias: true, alpha: true }}
      />
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div 
          ref={tooltipRef}
          className="tooltip"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 10
          }}
        >
          <div className="font-bold">{hoveredPoint.name}</div>
          <div className="text-xs">{hoveredPoint.university}</div>
          <div className="text-xs">{hoveredPoint.field}</div>
        </div>
      )}
      
      {/* Overlay effect for better readability */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)'
        }}
      ></div>
      
      {/* User instruction */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-white text-center opacity-70 hover:opacity-100 transition-opacity">
        Click a point to view details • Double-click to view full profile • Drag to rotate • Scroll to zoom
      </div>
      
      {/* Attribution */}
      <div className="attribution">
        <a 
          href="https://www.mapbox.com/" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-white opacity-60 hover:opacity-100"
        >
          © Mapbox
        </a>
      </div>
    </>
  );
};

export default GlobeVisualization;