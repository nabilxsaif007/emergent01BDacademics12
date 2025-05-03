import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ArtisticGlobe = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const sphereRef = useRef(null);
  
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
    
    // Create artistic globe (abstract shape)
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    
    // Stylized material for abstract art globe
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("#16a34a") },  // Primary green
        color2: { value: new THREE.Color("#22c55e") },  // Secondary green
        color3: { value: new THREE.Color("#86efac") },  // Light green
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec2 resolution;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                             0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                             -0.577350269189626,  // -1.0 + 2.0 * C.x
                             0.024390243902439); // 1.0 / 41.0
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          // Calculate normalized coordinates
          vec2 st = gl_FragCoord.xy / resolution;
          
          // Spherical coordinates based on position
          float phi = acos(vPosition.y / length(vPosition));
          float theta = atan(vPosition.z, vPosition.x);
          
          // Use noise to create organic patterns
          float noise1 = snoise(vec2(theta * 3.0, phi * 3.0 + time * 0.05)) * 0.5 + 0.5;
          float noise2 = snoise(vec2(theta * 5.0 - time * 0.03, phi * 5.0)) * 0.5 + 0.5;
          float noise3 = snoise(vec2(theta * 8.0, phi * 8.0 - time * 0.07)) * 0.5 + 0.5;
          
          // Create gradient based on position
          float gradientY = vPosition.y * 0.5 + 0.5; // -1 to 1 mapped to 0 to 1
          
          // Mix colors based on noise and position
          vec3 color = mix(color1, color2, noise1);
          color = mix(color, color3, noise2 * 0.6);
          
          // Add subtle brightness variation based on position
          float brightness = 0.8 + 0.2 * noise3;
          color *= brightness;
          
          // Add subtle highlight at the top
          float highlight = smoothstep(0.7, 0.9, gradientY) * 0.3;
          color = mix(color, vec3(1.0), highlight);
          
          // Add subtle edge effect
          float edge = 1.0 - smoothstep(0.8, 1.0, length(vPosition) / 1.5);
          color *= edge;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true
    });
    
    materialRef.current = material;
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    let lastTime = 0;
    const animate = (time) => {
      const normalizedTime = time * 0.001; // Convert to seconds
      
      // Update time uniform
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = normalizedTime;
      }
      
      // Gentle rotation
      if (sphereRef.current) {
        sphereRef.current.rotation.y = normalizedTime * 0.1;
        sphereRef.current.rotation.z = Math.sin(normalizedTime * 0.05) * 0.05;
        sphereRef.current.rotation.x = Math.cos(normalizedTime * 0.07) * 0.05;
      }
      
      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate(0);
    
    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        
        // Update resolution uniform
        if (materialRef.current) {
          materialRef.current.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Dispose of resources
      if (sphereRef.current) {
        sphereRef.current.geometry.dispose();
        sphereRef.current.material.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100vh', 
        background: 'transparent' 
      }} 
    />
  );
};

export default ArtisticGlobe;