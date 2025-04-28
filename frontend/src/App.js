import React, { useState, useEffect } from 'react';
import GlobeVisualization from './components/GlobeVisualization';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [dataPoints, setDataPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data points (academics in our case)
  useEffect(() => {
    // This would be replaced with actual API call in production
    const fetchData = async () => {
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          // Sample data for academic locations
          const sampleData = [
            { id: 1, name: "Dr. Arif Rahman", lat: 42.3601, lng: -71.0942, university: "MIT", field: "Computer Science" },
            { id: 2, name: "Dr. Fatima Begum", lat: 51.7520, lng: -1.2577, university: "Oxford University", field: "Medicine" },
            { id: 3, name: "Dr. Kamal Hossain", lat: 1.3521, lng: 103.8198, university: "National University of Singapore", field: "Physics" },
            { id: 4, name: "Dr. Anisur Rahman", lat: 37.4419, lng: -122.1430, university: "Stanford University", field: "Bioengineering" },
            { id: 5, name: "Dr. Tahmina Ahmed", lat: 43.6532, lng: -79.3832, university: "University of Toronto", field: "Environmental Science" },
            // Add more sample data as needed
            { id: 6, name: "Dr. Salim Khan", lat: 23.8103, lng: 90.4125, university: "BUET", field: "Civil Engineering" },
            { id: 7, name: "Dr. Nusrat Jahan", lat: 48.8566, lng: 2.3522, university: "Sorbonne University", field: "Literature" },
            { id: 8, name: "Dr. Zahir Uddin", lat: 35.7128, lng: 139.7669, university: "University of Tokyo", field: "Robotics" },
            { id: 9, name: "Dr. Nasreen Akter", lat: -37.8136, lng: 144.9631, university: "University of Melbourne", field: "Psychology" },
            { id: 10, name: "Dr. Jamal Uddin", lat: 25.2048, lng: 55.2708, university: "UAE University", field: "Economics" },
          ];
          setDataPoints(sampleData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGlobePointClick = (point) => {
    console.log("Selected academic:", point);
    // In a complete implementation, this could open a modal or redirect to a profile page
    alert(`Selected: ${point.name} at ${point.university}\nField: ${point.field}`);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="globe-container">
        <GlobeVisualization 
          dataPoints={dataPoints} 
          isLoading={isLoading} 
          onPointClick={handleGlobePointClick}
        />
      </div>
    </div>
  );
}

export default App;
