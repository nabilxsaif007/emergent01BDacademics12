import React, { useState, useEffect, useRef } from 'react';

const researchers = [
  {
    id: 1,
    name: "Dr. Ahmed Khan",
    position: "Professor, University of Cambridge",
    fields: ["Mathematics", "Theoretical Physics"],
    location: { lat: 52.2053, lng: 0.1218 }, // Cambridge, UK
    country: "United Kingdom"
  },
  {
    id: 2,
    name: "Dr. Maria Rodriguez",
    position: "Senior Researcher, CERN",
    fields: ["Particle Physics", "Quantum Mechanics"],
    location: { lat: 46.2324, lng: 6.0550 }, // CERN, Switzerland
    country: "Switzerland"
  },
  {
    id: 3,
    name: "Dr. Hiroshi Tanaka",
    position: "Director, Tokyo Institute of Technology",
    fields: ["Robotics", "Artificial Intelligence"],
    location: { lat: 35.6047, lng: 139.6822 }, // Tokyo, Japan
    country: "Japan"
  },
  {
    id: 4,
    name: "Dr. Sophia Chen",
    position: "Lead Scientist, Max Planck Institute",
    fields: ["Biochemistry", "Molecular Biology"],
    location: { lat: 48.1351, lng: 11.5820 }, // Munich, Germany
    country: "Germany"
  },
  {
    id: 5,
    name: "Dr. Rahman Ali",
    position: "Department Chair, University of Dhaka",
    fields: ["Computer Science", "Machine Learning"],
    location: { lat: 23.7461, lng: 90.3742 }, // Dhaka, Bangladesh
    country: "Bangladesh"
  },
  {
    id: 6,
    name: "Dr. Fatima Al-Zahrawi",
    position: "Research Director, Institut Pasteur",
    fields: ["Virology", "Immunology"],
    location: { lat: 48.8417, lng: 2.3130 }, // Paris, France
    country: "France"
  }
];

const ArtisticGlobe = () => {
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [mapRotation, setMapRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  
  // Function to convert lat/lng to SVG coordinates
  const latLngToCoordinates = (lat, lng, width, height) => {
    // Adjust longitude based on rotation
    const adjustedLng = (lng + mapRotation + 540) % 360 - 180;
    
    // Calculate visibility - if the point is on the visible side of Earth
    const isVisible = adjustedLng > -90 && adjustedLng < 90;
    
    // Calculate x position (0-1) from adjusted longitude
    const x = (adjustedLng + 180) / 360;
    
    // Calculate y position (0-1) from latitude
    const y = (90 - lat) / 180;
    
    // Calculate size based on longitude (simulating perspective)
    const distanceFromCenter = Math.abs(adjustedLng) / 90;
    const size = Math.max(5, 12 * (1 - distanceFromCenter * 0.6));
    
    // Calculate opacity based on longitude
    const opacity = 1 - Math.max(0, Math.abs(adjustedLng) - 60) / 30;
    
    return {
      x: x * width,
      y: y * height,
      isVisible,
      size,
      opacity
    };
  };
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    globeRef.current = globe;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add point light to enhance 3D effect
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);
    
    // Add location markers
    const addMarker = (lat, lng, name, color = '#3b82f6') => {
      // Convert lat,lng to 3D position
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      // Calculate position on sphere
      const radius = 1.52; // Slightly above globe surface
      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      // Create marker geometry
      const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: color });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      marker.position.set(x, y, z);
      marker.userData = { name, lat, lng };
      scene.add(marker);
      markersRef.current.push(marker);
      
      return marker;
    };
    
    // Add key cities
    addMarker(23.8103, 90.4125, 'Dhaka', '#FF5A5F'); // Bangladesh
    addMarker(40.7128, -74.0060, 'New York', '#3b82f6'); // USA
    addMarker(51.5074, -0.1278, 'London', '#3b82f6'); // UK
    addMarker(43.6532, -79.3832, 'Toronto', '#3b82f6'); // Canada
    addMarker(-33.8688, 151.2093, 'Sydney', '#3b82f6'); // Australia
    addMarker(28.6139, 77.2090, 'New Delhi', '#3b82f6'); // India
    addMarker(35.6762, 139.6503, 'Tokyo', '#3b82f6'); // Japan
    addMarker(1.3521, 103.8198, 'Singapore', '#3b82f6'); // Singapore
    
    // Raycaster for interactive marker selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const onMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const onClick = (event) => {
      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(markersRef.current);
      
      if (intersects.length > 0) {
        const selectedMarker = intersects[0].object;
        setSelectedCountry(selectedMarker.userData);
        
        // Rotate globe to center on this marker
        const { lat, lng } = selectedMarker.userData;
        rotateGlobeToLatLng(lat, lng);
      }
    };
    
    const rotateGlobeToLatLng = (lat, lng) => {
      if (!controlsRef.current) return;
      
      // Convert lat, lng to spherical coordinates
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      // Calculate the target position for the camera
      const radius = 4; // Distance from globe center
      const targetX = -radius * Math.sin(phi) * Math.cos(theta);
      const targetY = radius * Math.cos(phi);
      const targetZ = radius * Math.sin(phi) * Math.sin(theta);
      
      // Animate the camera position
      const duration = 1000; // ms
      const startTime = Date.now();
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(targetX, targetY, targetZ);
      
      const updateCameraPosition = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use an easing function for smoother animation
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        camera.position.lerpVectors(startPos, endPos, easeProgress);
        camera.lookAt(0, 0, 0);
        
        if (progress < 1) {
          requestAnimationFrame(updateCameraPosition);
        }
      };
      
      updateCameraPosition();
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update OrbitControls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      
      // Dispose of resources
      if (globeRef.current) {
        globeRef.current.geometry.dispose();
        globeRef.current.material.dispose();
      }
      
      // Dispose of markers
      markersRef.current.forEach(marker => {
        scene.remove(marker);
        marker.geometry.dispose();
        marker.material.dispose();
      });
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  return (
    <div className="relative">
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100vh', 
          background: 'transparent' 
        }} 
      />
      
      {/* Information tooltip for selected location */}
      {selectedCountry && (
        <div className="absolute top-6 right-6 z-10 bg-white p-4 rounded-lg shadow-md animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-green-600 font-bold text-lg">{selectedCountry.name}</h3>
            <button 
              onClick={() => setSelectedCountry(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-gray-700">
            <p>Lat: {selectedCountry.lat.toFixed(4)}</p>
            <p>Lng: {selectedCountry.lng.toFixed(4)}</p>
            <p className="mt-2 text-green-600 font-medium">10 researchers in this area</p>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-6 right-6 z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-md text-xs text-gray-600">
        <p>🔍 Click on blue markers to explore locations</p>
        <p>🖱️ Drag to rotate | Scroll to zoom</p>
      </div>
    </div>
  );
};

export default ArtisticGlobe;