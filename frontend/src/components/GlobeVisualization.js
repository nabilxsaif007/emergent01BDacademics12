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
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2 md:hidden">
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
          className="bg-blue-600 p-2 rounded-full border border-blue-700 text-white hover:bg-blue-700 transition-all shadow-lg"
          title="Reset view"
          type="button"
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
          className="bg-blue-600 p-2 rounded-full border border-blue-700 text-white hover:bg-blue-700 transition-all shadow-lg"
          title="Zoom in"
          type="button"
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
          className="bg-blue-600 p-2 rounded-full border border-blue-700 text-white hover:bg-blue-700 transition-all shadow-lg"
          title="Zoom out"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
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
        pointColor={(d) => d === hoveredPoint ? '#ff8800' : '#4285F4'}
        pointAltitude={0.1} // Increased from 0.07
        pointRadius={(d) => d === hoveredPoint ? 0.6 : 0.4} // Increased from 0.4/0.25
        pointResolution={12}
        pointsMerge={false}
        pointLabel={(d) => `${d.name} (${d.university})`}
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
        
        // Atmosphere
        atmosphereColor="rgba(51, 153, 255, 0.3)"
        atmosphereAltitude={0.15}
        
        // Performance optimizations
        rendererConfig={{ antialias: true, alpha: true }}
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