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
  const [showSurpriseAnimation, setShowSurpriseAnimation] = useState(false);
  const navigate = useNavigate();

  // Enhance globe with custom texture and effects for Airbnb-inspired bright appearance
  useEffect(() => {
    if (!isLoading && globeEl.current) {
      // Set initial rotation and camera position
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3; // Even slower for a more elegant rotation
      globeEl.current.pointOfView({ lat: 23.6850, lng: 90.3563, altitude: 2.5 }); // Center on Bangladesh
      
      // Get the scene
      const scene = globeEl.current.scene();
      
      // Clear existing lights
      scene.children
        .filter(child => child instanceof THREE.Light)
        .forEach(light => scene.remove(light));
      
      // Enhanced lighting for bright, crisp daytime appearance
      // Main sunlight - brighter and more directional
      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
      directionalLight.position.set(0.5, 1, 0.5);
      scene.add(directionalLight);
      
      // Secondary light for fill lighting - subtle blue tint to simulate sky reflection
      const secondaryLight = new THREE.DirectionalLight(0xCCDDFF, 0.5);
      secondaryLight.position.set(-0.5, 0.5, -0.5);
      scene.add(secondaryLight);
      
      // Ambient light for overall illumination - warmer tone for more inviting feel
      const ambientLight = new THREE.AmbientLight(0xE0E0E0, 0.7);
      scene.add(ambientLight);
       
      // Soft rim light for edge definition
      const rimLight = new THREE.DirectionalLight(0xFFFFDD, 0.3);
      rimLight.position.set(0, -1, 0);
      scene.add(rimLight);
      
      // Set background color to very light blue instead of black
      scene.background = new THREE.Color(0xF8FBFD);
      
      // Get access to the globe material for customization
      if (globeEl.current.globeMaterial) {
        const globeMaterial = globeEl.current.globeMaterial();
        if (globeMaterial) {
          // Reduce bump mapping for a smoother appearance
          globeMaterial.bumpScale = 0.4;
          
          // Add subtle specular highlights with warmer tone
          globeMaterial.specular = new THREE.Color(0xFFFFEE);
          globeMaterial.shininess = 25;
          
          // Optional: Add subtle environment map for reflectivity
          // This would require preloading an env map
        }
      }
      
      setIsGlobeReady(true);
      
      // Stop auto rotation when user interacts with the globe
      const controls = globeEl.current.controls();
      controls.addEventListener('start', () => {
        controls.autoRotate = false;
      });
      
      // Resume auto rotation after inactivity (4 seconds)
      let inactivityTimer;
      controls.addEventListener('end', () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          controls.autoRotate = true;
        }, 4000);
      });
      
      // Enhanced touch support for mobile
      controls.enableDamping = true;
      controls.dampingFactor = 0.12;
      controls.rotateSpeed = 0.4; // Slightly slower for more precise control
      controls.enablePan = false; // Disable panning for better UX
      controls.enableZoom = true; // Enable zoom
      controls.minDistance = 120; // Prevent zooming too close
      controls.maxDistance = 400; // Prevent zooming too far out
      
      // Improved mobile pinch-to-zoom feel
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    }
    
    // Clean up function
    return () => {
      if (globeEl.current) {
        const controls = globeEl.current.controls();
        if (controls) {
          // Clean up event listeners if component unmounts
          controls.dispose();
        }
      }
    };
  }, [isLoading]);

  // Load country data for globe
  useEffect(() => {
    // Mock country data structure for basic visualization
    const mockCountryData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Bangladesh" },
          geometry: {
            type: "Polygon",
            coordinates: [[[92.6727, 22.0412], [92.6523, 21.3240], [92.3032, 21.4755], [92.3686, 20.6709], [92.0829, 21.1922], [92.0252, 21.7016], [91.8349, 22.1829], [91.4171, 22.7650], [90.4960, 22.8050], [90.5870, 22.3928], [90.2730, 21.8364], [89.8475, 22.0391], [89.7021, 21.8571], [89.4189, 21.9662], [89.0320, 22.0557], [88.8763, 22.8791], [88.5298, 23.6311], [88.6999, 24.2337], [88.0844, 24.5017], [88.3064, 24.8661], [88.9316, 25.2387], [88.2098, 25.7681], [88.5630, 26.4465], [89.3551, 26.0144], [89.8325, 25.9651], [89.9207, 25.2698], [90.8722, 25.1326], [91.7996, 25.1474], [92.3762, 24.9767], [91.9151, 24.1304], [91.4677, 24.0726], [91.1590, 23.5035], [91.7065, 22.9853], [91.8699, 23.6243], [92.1460, 23.6275], [92.6727, 22.0412]]]
          }
        },
        {
          type: "Feature",
          properties: { name: "United States" },
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [[[-155.54211, 19.08999], [-155.68817, 18.91619], [-155.93665, 19.05939], [-155.90806, 19.33888], [-156.07347, 19.70294], [-156.02368, 19.81422], [-155.85008, 19.97729], [-155.91907, 20.17395], [-155.86108, 20.26721], [-155.78505, 20.2487], [-155.40214, 20.07975], [-155.22452, 19.99302], [-155.06226, 19.8591], [-154.80741, 19.50871], [-154.83147, 19.45328], [-155.22217, 19.23972], [-155.54211, 19.08999]]]
            ]
          }
        },
        {
          type: "Feature",
          properties: { name: "United Kingdom" },
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [[[-5.661949, 54.554603], [-6.197885, 53.867565], [-6.95373, 54.073702], [-7.572168, 54.059956], [-7.366031, 54.595841], [-7.572168, 55.131622], [-6.733847, 55.17286], [-5.661949, 54.554603]]]
            ]
          }
        }
      ]
    };
    
    setCountries(mockCountryData.features);
    
    // Also try to fetch real data, but rely on mock if it fails
    fetch('https://unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          setCountries(data.features);
          console.log("Loaded real country data");
        }
      })
      .catch(error => {
        console.log("Using mock country data due to fetch error");
      });
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // No need to manually resize - the Globe component will handle this internally
      // The width and height props are already bound to window.innerWidth/Height
      // This prevents the "width is not a function" error
      if (globeEl.current) {
        // Force a re-render of the globe on resize if needed
        globeEl.current.camera().updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle point hover for tooltip display
  const handlePointHover = useCallback((point) => {
    setHoveredPoint(point);
  }, []);

  // "Surprise Me" functionality - select a random researcher
  const handleSurpriseMe = useCallback(() => {
    if (dataPoints && dataPoints.length > 0) {
      // Show animation effect
      setShowSurpriseAnimation(true);
      
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * dataPoints.length);
      const randomPoint = dataPoints[randomIndex];
      
      // Animate to the selected point
      if (globeEl.current && randomPoint) {
        // First rotate globe to the point
        const { lat, lng } = randomPoint;
        globeEl.current.pointOfView({ lat, lng, altitude: 2.5 }, 1000);
        
        // Then select it after a slight delay
        setTimeout(() => {
          setSelectedPoints([randomPoint]);
          
          // Call parent handler
          if (onPointClick && typeof onPointClick === 'function') {
            onPointClick(randomPoint);
          }
          
          // Hide animation after a delay
          setTimeout(() => {
            setShowSurpriseAnimation(false);
          }, 1500);
        }, 1200);
      }
    }
  }, [dataPoints, onPointClick]);
  
  // Handle multi-selection with modifier keys
  const handlePointClick = useCallback((point) => {
    if (point) {
      // Check if Shift or Ctrl/Cmd key is pressed for multi-selection
      const isModifierKeyPressed = 
        window.event && (window.event.shiftKey || window.event.ctrlKey || window.event.metaKey);
      
      if (isModifierKeyPressed) {
        // Add to selection if not already selected, otherwise remove
        setSelectedPoints(prevPoints => {
          const pointExists = prevPoints.find(p => p.id === point.id);
          if (pointExists) {
            return prevPoints.filter(p => p.id !== point.id);
          } else {
            return [...prevPoints, point];
          }
        });
      } else {
        // Normal click - replace selection
        setSelectedPoints([point]);
      }
    }
  }, []);

  // Navigate to academic's profile on double click
  const handlePointDoubleClick = useCallback((point) => {
    if (point && point.id) {
      navigate(`/academics/${point.id}`);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-400">Loading globe data...</p>
      </div>
    );
  }

  return (
    <div className="globe-container" style={{width: '100%', height: '100%', position: 'relative'}}>
      {/* Surprise Me Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSurpriseMe}
          className="flex items-center justify-center bg-white text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500"
          style={{
            fontFamily: "'Circular', 'Inter', -apple-system, sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="#FF5A5F" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
            <path d="M15 3h6v6"></path>
            <path d="M10 14L21 3"></path>
          </svg>
          Surprise Me
        </button>
      </div>
      
      {/* Selection Info Badge */}
      {selectedPoints.length > 0 && (
        <div className="absolute top-20 right-6 z-10">
          <div 
            className="bg-white text-gray-700 px-3 py-2 rounded-full shadow-md" 
            style={{
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {selectedPoints.length} {selectedPoints.length === 1 ? 'researcher' : 'researchers'} selected
          </div>
        </div>
      )}
      
      {/* Confetti Animation for Surprise Me */}
      {showSurpriseAnimation && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <div className="surprise-confetti-container">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i}
                className="surprise-confetti"
                style={{
                  backgroundColor: ['#FF5A5F', '#00A699', '#FC642D', '#4D67FF', '#FFB400'][i % 5],
                  left: `${Math.random() * 100}%`,
                  width: `${5 + Math.random() * 7}px`,
                  height: `${5 + Math.random() * 7}px`,
                  opacity: Math.random(),
                  animation: `surprise-confetti-fall ${1 + Math.random() * 2}s linear forwards, 
                             surprise-confetti-shake ${0.5 + Math.random() * 1}s ease-in-out infinite alternate`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {isLoading ? (
                console.error("Error zooming out:", err);
              }
            }
          }}
          className="bg-white p-3 rounded-full border border-border-light text-cta-primary hover:shadow-md transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cta-primary focus-visible:ring-opacity-50"
          title="Zoom out"
          type="button"
          aria-label="Zoom out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        
        {/* Surprise Me button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (dataPoints && dataPoints.length > 0) {
              // Select a random researcher
              const randomIndex = Math.floor(Math.random() * dataPoints.length);
              const randomResearcher = dataPoints[randomIndex];
              
              // Animate to this researcher's location
              if (globeEl.current && randomResearcher) {
                globeEl.current.pointOfView({ 
                  lat: randomResearcher.lat, 
                  lng: randomResearcher.lng, 
                  altitude: 1.5
                }, 1500);
                
                // Trigger the click handler after animation completes
                setTimeout(() => {
                  if (onPointClick && typeof onPointClick === 'function') {
                    onPointClick(randomResearcher);
                  }
                }, 1600);
              }
            }
          }}
          className="bg-cta-primary p-3 rounded-full text-white hover:bg-cta-hover shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
          title="Surprise Me"
          type="button"
          aria-label="Show random researcher profile"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16.8c-2.65 0-4.8-2.15-4.8-4.8 0-2.65 2.15-4.8 4.8-4.8 2.65 0 4.8 2.15 4.8 4.8 0 2.65-2.15 4.8-4.8 4.8zm0-8.4c-1.98 0-3.6 1.62-3.6 3.6s1.62 3.6 3.6 3.6 3.6-1.62 3.6-3.6-1.62-3.6-3.6-3.6z"/>
            <path d="M12 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm0-18.8c-4.85 0-8.8 3.95-8.8 8.8s3.95 8.8 8.8 8.8 8.8-3.95 8.8-8.8-3.95-8.8-8.8-8.8z"/>
            <path d="M12.94 7.94c-.47 0-.85-.38-.85-.85s.38-.85.85-.85c.47 0 .85.38.85.85s-.38.85-.85.85zM8.67 18.02c-.47 0-.85-.38-.85-.85s.38-.85.85-.85c.47 0 .85.38.85.85s-.38.85-.85.85zM17.78 14.95c-.47 0-.85-.38-.85-.85s.38-.85.85-.85c.47 0 .85.38.85.85s-.38.85-.85.85z"/>
          </svg>
        </button>
      </div>
      
      {isLoading ? (
        <div className="globe-loading flex items-center justify-center h-screen bg-white">
          <div className="text-center">
            <div className="spinner inline-block w-10 h-10 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>
              Loading Global Network...
            </p>
          </div>
        </div>
      ) : (
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg" // Bright daytime earth
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl={null} // Remove the starry background for clean white look
        width={window.innerWidth}
        height={window.innerHeight}
        lineHoverPrecision={0}
        
        // Enable user interaction
        enablePointerInteraction={true}
        
        // Country polygons with improved colors and labels
        hexPolygonsData={countries}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => `rgba(255, 90, 95, ${isGlobeReady ? 0.08 : 0})`} // Very subtle Airbnb coral
        hexPolygonLabel={d => `
          <div style="
            background-color: white; 
            color: #484848; 
            padding: 8px 12px; 
            border-radius: 12px; 
            font-size: 14px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
            font-family: 'Circular', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            border: 1px solid #EBEBEB;
            transform: scale(1);
            transition: transform 0.2s ease-out;
          ">
            <div style="font-weight: 600; color: #484848;">${d.properties.name}</div>
          </div>
        `}
        
        // Country labels for better geographic context
        labelsData={countries.filter(d => d.properties.name && d.properties.name.length < 20)}
        labelLat={d => {
          // Extract center point of the country for label placement
          if (d.geometry.type === 'Polygon') {
            const coords = d.geometry.coordinates[0];
            return coords.reduce((sum, p) => sum + p[1], 0) / coords.length;
          }
          return 0; // Fallback
        }}
        labelLng={d => {
          if (d.geometry.type === 'Polygon') {
            const coords = d.geometry.coordinates[0];
            return coords.reduce((sum, p) => sum + p[0], 0) / coords.length;
          }
          return 0; // Fallback
        }}
        labelText={d => d.properties.name}
        labelSize={d => 0.5 + Math.min(d.properties.name.length * 0.08, 1.2)}
        labelColor={() => '#555555'}
        labelDotRadius={0.4}
        labelAltitude={0.01}
        labelResolution={1}
        
        // Render points with Airbnb color scheme
        pointsData={dataPoints}
        pointColor={(d) => d === hoveredPoint ? '#FF5A5F' : '#00A699'} // Airbnb coral for hover, teal for default
        pointAltitude={0.12}
        pointRadius={(d) => d === hoveredPoint ? 0.7 : 0.5}
        pointResolution={24} // Higher resolution for smoother points
        pointsMerge={false}
        pointLabel={(d) => `
          <div style="
            background-color: white; 
            color: #484848; 
            padding: 12px 16px; 
            border-radius: 12px; 
            font-size: 14px; 
            box-shadow: 0 6px 20px rgba(0,0,0,0.1); 
            font-family: 'Circular', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            border: 1px solid #EBEBEB;
            max-width: 280px;
            transform: translateY(-4px);
            transition: all 0.2s ease-out;
          ">
            <div style="font-weight: 700; color: #FF5A5F; margin-bottom: 6px; font-size: 16px;">${d.name}</div>
            <div style="margin-bottom: 4px; font-weight: 500;">${d.university}</div>
            <div style="font-size: 13px; color: #717171; display: flex; align-items: center;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#717171" stroke-width="2" fill="none" style="margin-right: 5px;">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${d.city}, ${d.country}
            </div>
            <div style="margin-top: 8px; font-size: 13px; color: #008489; font-weight: 500;">Click for details</div>
          </div>
        `}
        onPointClick={(point, event) => {
          console.log('Direct point click:', point);
          // Ensure the click handler works by calling both the local function and parent callback
          handlePointClick(point);
          
          // Also directly call the parent handler as a fallback
          if (onPointClick && typeof onPointClick === 'function') {
            setTimeout(() => onPointClick(point), 50);
          }
        }}
        onPointRightClick={handlePointDoubleClick}
        onPointHover={handlePointHover}
        
        // Atmosphere with subtle effect - using Airbnb colors
        atmosphereColor="rgba(255, 90, 95, 0.1)" // Very subtle Airbnb coral atmosphere
        atmosphereAltitude={0.17}
        
        // Performance optimizations
        rendererConfig={{ 
          antialias: true, 
          alpha: true,
          precision: 'highp',
          powerPreference: 'high-performance'
        }}
      />
      )}
      
      {/* Enhanced Tooltip */}
      {hoveredPoint && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 bg-black bg-opacity-85 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-blue-500 text-white transform -translate-x-1/2 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 40
          }}
        >
          <div className="font-bold text-blue-300 text-base">{hoveredPoint.name}</div>
          <div className="text-sm text-white">{hoveredPoint.university}</div>
          <div className="text-xs text-gray-300">{hoveredPoint.field} • {hoveredPoint.city}, {hoveredPoint.country}</div>
          <div className="text-xs text-blue-400 mt-1">Click for details</div>
        </div>
      )}
      
      {/* Overlay effect for better readability */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)'
        }}
      ></div>
      
      {/* User instruction removed as requested */}
      
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
    </div>
  );
};

export default GlobeVisualization;