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

  // Enhance globe with custom texture and effects for Airbnb-inspired bright appearance
  useEffect(() => {
    if (!isLoading && globeEl.current) {
      // Set initial rotation and camera position
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.4; // Slightly slower for a more elegant rotation
      globeEl.current.pointOfView({ lat: 23.6850, lng: 90.3563, altitude: 2.5 }); // Center on Bangladesh
      
      // Get the scene
      const scene = globeEl.current.scene();
      
      // Clear existing lights
      scene.children
        .filter(child => child instanceof THREE.Light)
        .forEach(light => scene.remove(light));
      
      // Add new lighting for bright daytime appearance
      // Main sunlight
      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
      directionalLight.position.set(0.5, 1, 0.5);
      scene.add(directionalLight);
      
      // Secondary light for fill lighting
      const secondaryLight = new THREE.DirectionalLight(0xCCDDFF, 0.4);
      secondaryLight.position.set(-0.5, 0.5, -0.5);
      scene.add(secondaryLight);
      
      // Ambient light for overall illumination
      const ambientLight = new THREE.AmbientLight(0xDDDDDD, 0.6);
      scene.add(ambientLight);
      
      // Set background color to very light blue instead of black
      scene.background = new THREE.Color(0xF8FBFD);
      
      // Get access to the globe material for customization
      if (globeEl.current.globeMaterial) {
        const globeMaterial = globeEl.current.globeMaterial();
        if (globeMaterial) {
          // Reduce bump mapping for a smoother appearance
          globeMaterial.bumpScale = 0.5;
          
          // Add subtle specular highlights
          globeMaterial.specular = new THREE.Color(0xFFFFFF);
          globeMaterial.shininess = 30;
        }
      }
      
      setIsGlobeReady(true);
      
      // Stop auto rotation when user interacts with the globe
      const controls = globeEl.current.controls();
      controls.addEventListener('start', () => {
        controls.autoRotate = false;
      });
      
      // Add support for touch gestures on mobile
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.5;
      controls.enablePan = false; // Disable panning for better UX
    }
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

  // Handle point click to focus on location and show info panel
  const handlePointClick = useCallback((point) => {
    console.log("Globe point clicked:", point); // Debug logging
    
    if (point && globeEl.current) {
      // Clear any existing hover state
      setHoveredPoint(null);
      
      // Animate to point location
      globeEl.current.pointOfView({
        lat: point.lat,
        lng: point.lng,
        altitude: 1.5
      }, 1000); // 1000ms animation duration
      
      // Call the provided click handler with a slight delay to allow animation to start
      setTimeout(() => {
        if (onPointClick && typeof onPointClick === 'function') {
          console.log("Calling onPointClick with:", point);
          onPointClick(point);
        } else {
          console.error("onPointClick is not a function:", onPointClick);
        }
      }, 100);
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
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-400">Loading globe data...</p>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* Responsive controls for mobile */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col space-y-3 md:hidden">
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            if (globeEl.current && globeEl.current.controls) {
              try {
                globeEl.current.controls().reset();
              } catch (err) {
                console.error("Error resetting controls:", err);
              }
            }
          }}
          className="bg-white p-3 rounded-full border border-border-light text-cta-primary hover:shadow-md transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cta-primary focus-visible:ring-opacity-50"
          title="Reset view"
          type="button"
          aria-label="Reset globe view"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (globeEl.current) {
              try {
                const controls = globeEl.current.controls();
                if (controls && controls.dollyIn) {
                  controls.dollyIn(1.2);
                  controls.update();
                }
              } catch (err) {
                console.error("Error zooming in:", err);
              }
            }
          }}
          className="bg-white p-3 rounded-full border border-border-light text-cta-primary hover:shadow-md transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cta-primary focus-visible:ring-opacity-50"
          title="Zoom in"
          type="button"
          aria-label="Zoom in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (globeEl.current) {
              try {
                const controls = globeEl.current.controls();
                if (controls && controls.dollyOut) {
                  controls.dollyOut(1.2);
                  controls.update();
                }
              } catch (err) {
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
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-blue-400">Loading globe data...</p>
        </div>
      ) : (
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl={null} // Remove the starry background for clean white look
        width={window.innerWidth}
        height={window.innerHeight}
        lineHoverPrecision={0}
        
        // Country polygons with lighter colors and labels
        hexPolygonsData={countries}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => `rgba(13, 148, 136, ${isGlobeReady ? 0.15 : 0})`} // Subtle emerald color
        hexPolygonLabel={d => `
          <div style="
            background-color: white; 
            color: #484848; 
            padding: 5px 10px; 
            border-radius: 5px; 
            font-size: 12px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            border: 1px solid #EBEBEB;
          ">
            <b>${d.properties.name}</b>
          </div>
        `}
        
        // Render points with Airbnb color scheme
        pointsData={dataPoints}
        pointColor={(d) => d === hoveredPoint ? '#FF5A5F' : '#0D9488'} // Airbnb coral for hover, emerald for default
        pointAltitude={0.1}
        pointRadius={(d) => d === hoveredPoint ? 0.6 : 0.4}
        pointResolution={12}
        pointsMerge={false}
        pointLabel={(d) => `
          <div style="
            background-color: white; 
            color: #484848; 
            padding: 8px 12px; 
            border-radius: 8px; 
            font-size: 13px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            border: 1px solid #EBEBEB;
            max-width: 250px;
          ">
            <div style="font-weight: 600; color: #FF5A5F; margin-bottom: 4px;">${d.name}</div>
            <div style="margin-bottom: 2px;">${d.university}</div>
            <div style="font-size: 12px; color: #717171;">${d.city}, ${d.country}</div>
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
        
        // Atmosphere with subtle effect
        atmosphereColor="rgba(0, 166, 153, 0.2)" // Subtle teal atmosphere
        atmosphereAltitude={0.15}
        
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