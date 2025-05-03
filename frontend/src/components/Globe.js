import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import '../styles/GlobeStyles.css';

// High-resolution Earth day texture
const EARTH_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-day.jpg';
// Normal map for terrain
const EARTH_NORMAL_MAP = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
// Water mask for better ocean effect
const EARTH_WATER_MASK = 'https://unpkg.com/three-globe/example/img/earth-water.png';

const GlobeComponent = ({ dataPoints = [], isLoading, onPointClick }) => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [countries, setCountries] = useState({ features: [] });
  const [highlightedCountry, setHighlightedCountry] = useState(null);

  // Create stars for background
  const stars = useMemo(() => {
    const starsArray = [];
    // Create 100 small stars
    for (let i = 0; i < 100; i++) {
      starsArray.push({
        id: `star-small-${i}`,
        size: 1 + Math.random(),
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        twinkle: Math.random() > 0.7
      });
    }
    // Create 30 medium stars
    for (let i = 0; i < 30; i++) {
      starsArray.push({
        id: `star-medium-${i}`,
        size: 2 + Math.random(),
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        twinkle: Math.random() > 0.5
      });
    }
    return starsArray;
  }, []);

  // Create cloud elements
  const clouds = useMemo(() => {
    const cloudsArray = [];
    for (let i = 0; i < 8; i++) {
      cloudsArray.push({
        id: `cloud-${i}`,
        size: 50 + Math.random() * 100,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: 0.2 + Math.random() * 0.3
      });
    }
    return cloudsArray;
  }, []);

  // Debug log for dataPoints
  useEffect(() => {
    console.log("Globe component received dataPoints:", dataPoints ? dataPoints.length : 0);
  }, [dataPoints]);

  // Load country data
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
      })
      .catch(err => console.error("Failed to load countries data:", err));
  }, []);

  // Set up globe on mount with enhanced features
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

      // Configure globe material
      const globeMaterial = globeEl.current.globeMaterial();
      if (globeMaterial) {
        // Enhance globe material properties
        globeMaterial.bumpScale = 10;
        new THREE.TextureLoader().load(EARTH_NORMAL_MAP, texture => {
          globeMaterial.normalMap = texture;
          globeMaterial.normalScale = new THREE.Vector2(0.1, 0.1);
          globeMaterial.needsUpdate = true;
        });
        
        // Add water mask for better ocean reflections
        new THREE.TextureLoader().load(EARTH_WATER_MASK, texture => {
          globeMaterial.roughnessMap = texture;
          globeMaterial.metalness = 0.1;
          globeMaterial.roughness = 0.8;
          globeMaterial.needsUpdate = true;
        });
      }

      // Configure lighting for better 3D effect
      const scene = globeEl.current.scene();
      if (scene) {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Add directional light for shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Add soft light from opposite direction
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-1, 0.5, -1);
        scene.add(fillLight);
      }

      // Configure globe controls
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.minDistance = 200;
        controls.maxDistance = 800;
        controls.dampingFactor = 0.1;
        controls.enableDamping = true;
        
        // Initial position focused on Bangladesh
        globeEl.current.pointOfView({ lat: 23.6850, lng: 90.3563, altitude: 2.5 }, 1000);
        
        // Stop auto-rotation on user interaction
        controls.addEventListener('start', function() {
          controls.autoRotate = false;
        });

        // Re-enable auto-rotation after a period of inactivity
        let rotationTimeout;
        controls.addEventListener('end', function() {
          clearTimeout(rotationTimeout);
          rotationTimeout = setTimeout(() => {
            controls.autoRotate = true;
          }, 10000); // 10 seconds of inactivity
        });
      }

      // Mark globe as ready
      setIsGlobeReady(true);
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
    setHoveredPoint(point);
  }, []);

  // Handle point click with console logs and callback
  const handlePointClick = useCallback((point) => {
    if (point && onPointClick) {
      onPointClick(point);
    }
  }, [onPointClick]);

  // Custom country polygons configuration
  const countryPolygonsData = useMemo(() => {
    if (!countries.features) return [];
    return countries.features.map(feature => ({
      ...feature,
      name: feature.properties.name
    }));
  }, [countries]);

  // Country polygon hover handler
  const handleCountryHover = useCallback((polygon) => {
    setHighlightedCountry(polygon !== null ? polygon.properties.name : null);
  }, []);

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
      {/* Space-themed background (daylight version) */}
      <div className="space-background">
        {/* Stars */}
        {stars.map(star => (
          <div
            key={star.id}
            className={`star ${star.twinkle ? 'twinkle' : ''}`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: star.top,
              left: star.left,
              animationDelay: star.animationDelay
            }}
          />
        ))}
        
        {/* Clouds */}
        {clouds.map(cloud => (
          <div
            key={cloud.id}
            className="cloud"
            style={{
              width: `${cloud.size}px`,
              height: `${cloud.size}px`,
              top: cloud.top,
              left: cloud.left,
              opacity: cloud.opacity
            }}
          />
        ))}
      </div>
      
      {/* Main Globe */}
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        
        // Enhanced configuration
        globeImageUrl={EARTH_TEXTURE_URL}
        backgroundColor="rgba(0,0,0,0)"
        
        // Points data (academics)
        pointsData={dataPoints}
        pointColor={() => "#16a34a"}
        pointAltitude={0.1}
        pointRadius={0.6}
        pointResolution={32}
        pointsMerge={false}
        
        // Country polygons
        polygonsData={countryPolygonsData}
        polygonCapColor={() => 'rgba(200, 200, 200, 0.0)'}
        polygonSideColor={() => 'rgba(150, 150, 150, 0.3)'}
        polygonStrokeColor={() => '#16a34a'}
        polygonAltitude={0.005}
        onPolygonHover={handleCountryHover}
        
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
      
      {/* Country tooltip */}
      {highlightedCountry && !hoveredPoint && (
        <div className="globe-tooltip" style={{
          left: mousePosition.x,
          top: mousePosition.y - 10,
        }}>
          <div className="tooltip-content">
            <div className="tooltip-name">{highlightedCountry}</div>
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
      
      {/* Loading overlay if globe is not ready yet */}
      {!isGlobeReady && (
        <div className="globe-loading">
          <div className="globe-loading-spinner"></div>
          <p className="mt-4 text-green-600">Preparing visualization...</p>
        </div>
      )}
      
      {/* Debug counter - can be removed in production */}
      <div className="absolute bottom-2 left-2 text-xs text-green-600 bg-white bg-opacity-50 px-2 py-1 rounded">
        {dataPoints ? dataPoints.length : 0} academics loaded
      </div>
    </div>
  );
};

export default GlobeComponent;