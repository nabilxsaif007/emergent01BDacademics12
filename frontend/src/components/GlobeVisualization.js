import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeVisualization = ({ dataPoints, isLoading, onPointClick }) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!isLoading && globeEl.current) {
      // Set initial rotation and camera position
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      
      // Start with a zoomed out view
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
    }
  }, [isLoading]);

  // Load country data for globe
  useEffect(() => {
    fetch('/countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data.features);
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
      const x = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
      const y = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
      
      setTooltipPosition({ x, y });
    } else {
      setHoveredPoint(null);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading globe data...</p>
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
        polygonsData={countries}
        polygonCapColor={() => 'rgba(200, 200, 200, 0)'}
        polygonSideColor={() => 'rgba(150, 150, 150, 0.3)'}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.3)'}
        polygonAltitude={0.001}
        
        // Render points
        pointsData={dataPoints}
        pointColor={() => '#4285F4'}
        pointAltitude={0.02}
        pointRadius={0.25}
        pointsMerge={false}
        pointLabel={point => `
          <div class="text-sm font-bold">${point.name}</div>
          <div class="text-xs">${point.university}</div>
          <div class="text-xs">${point.field}</div>
        `}
        onPointClick={(point, event) => onPointClick(point)}
        onPointHover={(point, event) => handlePointHover(point, event)}
        
        // Atmosphere
        atmosphereColor="rgba(255, 255, 255, 0.3)"
        atmosphereAltitude={0.15}
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
      
      {/* Attribution similar to screenshot */}
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
