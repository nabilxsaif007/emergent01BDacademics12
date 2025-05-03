import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ArtisticGlobe = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const globeRef = useRef(null);
  const markersRef = useRef([]);
  
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  useEffect(() => {
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Background color (white)
    scene.background = new THREE.Color('#FFFFFF');
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      50, // field of view
      window.innerWidth / window.innerHeight, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    camera.position.z = 4;
    cameraRef.current = camera;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add the renderer to the DOM
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add OrbitControls for interactive rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 2.5;
    controls.maxDistance = 10;
    controls.enablePan = false;
    controlsRef.current = controls;
    
    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('/earth-day-map.jpg', () => {
      // Fallback texture if the first one fails to load
      const fallbackTexture = textureLoader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg');
      if (globeRef.current) {
        globeRef.current.material.map = fallbackTexture;
        globeRef.current.material.needsUpdate = true;
      }
    });
    
    // Load bump map and specular map
    const bumpMap = textureLoader.load('/earth-topology.jpg');
    const specularMap = textureLoader.load('/earth-specular.jpg');
    
    // Create 3D globe
    const globeGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specularMap: specularMap,
      specular: new THREE.Color('#444444'),
      shininess: 10
    });
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
      
      {/* Countries, Regions, and Cities Labels */}
      <div className="absolute top-10 left-10 z-10 bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
        <h3 className="text-green-700 font-semibold mb-3">Featured Locations</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <p className="text-green-800 font-medium">Countries</p>
            <ul className="text-sm text-gray-700">
              <li>Bangladesh</li>
              <li>United States</li>
              <li>United Kingdom</li>
              <li>Canada</li>
              <li>Australia</li>
            </ul>
          </div>
          <div>
            <p className="text-green-800 font-medium">Cities</p>
            <ul className="text-sm text-gray-700">
              <li>Dhaka</li>
              <li>New York</li>
              <li>London</li>
              <li>Toronto</li>
              <li>Sydney</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisticGlobe;