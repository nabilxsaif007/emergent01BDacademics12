import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualization = ({ dataPoints = [], isLoading, onPointClick }) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  // Set initial globe configuration after it's loaded
  useEffect(() => {
    if (!isLoading && globeEl.current) {
      // Set initial rotation and camera position
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      
      // Start with a zoomed out view
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
      
      setIsGlobeReady(true);
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
        // Fallback to empty array if fetch fails
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

  const handlePointHover = (point, event) => {
    if (point) {
      setHoveredPoint(point);
      
      // Calculate tooltip position based on mouse or touch event
      const x = event?.clientX || (event?.touches && event.touches[0] ? event.touches[0].clientX : window.innerWidth / 2);
      const y = event?.clientY || (event?.touches && event.touches[0] ? event.touches[0].clientY : window.innerHeight / 2);
      
      setTooltipPosition({ x, y });
    } else {
      setHoveredPoint(null);
    }
  };

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
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        width={window.innerWidth}
        height={window.innerHeight}
        lineHoverPrecision={0}
        
        // Country polygons
        hexPolygonsData={countries}
        hexPolygonResolution={3} // Lower values are faster
        hexPolygonMargin={0.3}
        hexPolygonColor={() => `rgba(255, 255, 255, ${isGlobeReady ? 0.1 : 0})`}
        
        // Render points
        pointsData={dataPoints}
        pointColor={() => '#4285F4'}
        pointAltitude={0.01}
        pointRadius={0.25}
        pointsMerge={false}
        pointResolution={12} // Lower values are faster but less smooth
        onPointClick={(point, event) => onPointClick(point)}
        onPointHover={(point, event) => handlePointHover(point, event)}
        
        // Atmosphere
        atmosphereColor="rgba(255, 255, 255, 0.3)"
        atmosphereAltitude={0.15}
        
        // Performance optimizations
        rendererConfig={{ antialias: false, alpha: true }}
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
