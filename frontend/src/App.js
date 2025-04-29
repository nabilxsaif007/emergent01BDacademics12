import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import WelcomeOverlay from './components/WelcomeOverlay';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import GlobeVisualization from './components/GlobeVisualization';
import InfoPanel from './components/InfoPanel';
import AcademicsPage from './pages/AcademicsPage';
import AcademicDetailPage from './pages/AcademicDetailPage';
import CountriesPage from './pages/CountriesPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Define API URL from environment variables
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Main content component that uses location
function AppContent() {
  const [dataPoints, setDataPoints] = useState([]);
  const [filteredDataPoints, setFilteredDataPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAcademic, setSelectedAcademic] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const location = useLocation();

  // Only show globe on certain pages
  const showGlobe = ['/'].includes(location.pathname);

  // Simulate fetching data points (academics in our case)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from API
        const response = await axios.get(`${API}/globe-data`);
        
        // If API returns data, use it
        if (response.data && response.data.length > 0) {
          console.log("Using API data:", response.data.length, "data points");
          setDataPoints(response.data);
          setFilteredDataPoints(response.data);
        } else {
          // Otherwise, use sample data
          console.log("API returned no data, using sample data");
          const sampleData = generateSampleAcademics();
          setDataPoints(sampleData);
          setFilteredDataPoints(sampleData);
        }
      } catch (error) {
        console.error('Error fetching globe data:', error);
        // Fall back to sample data
        console.log("Error fetching data, using sample data");
        const sampleData = generateSampleAcademics();
        setDataPoints(sampleData);
        setFilteredDataPoints(sampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Generate sample academic data
  const generateSampleAcademics = () => {
    // List of universities in Bangladesh
    const bangladeshiUniversities = [
      "University of Dhaka", "Bangladesh University of Engineering and Technology", 
      "Chittagong University of Engineering and Technology", "Jahangirnagar University",
      "Rajshahi University", "Khulna University", "BRAC University", "North South University"
    ];
    
    // Universities in other countries
    const internationalUniversities = {
      "USA": ["Harvard University", "MIT", "Stanford University", "UC Berkeley"],
      "UK": ["University of Oxford", "University of Cambridge", "Imperial College London"],
      "Australia": ["University of Sydney", "University of Melbourne", "Australian National University"],
      "Canada": ["University of Toronto", "McGill University", "University of British Columbia"],
      "Germany": ["TU Munich", "Humboldt University", "Heidelberg University"],
      "Japan": ["University of Tokyo", "Kyoto University", "Osaka University"]
    };
    
    // Research fields
    const fields = [
      "Computer Science", "Medicine", "Physics", "Bioengineering", 
      "Environmental Science", "Civil Engineering", "Literature", "Robotics",
      "Psychology", "Economics"
    ];
    
    // Generate academics in Bangladesh
    const bangladeshAcademics = bangladeshiUniversities.flatMap(university => {
      return Array(3).fill().map((_, idx) => {
        const field = fields[Math.floor(Math.random() * fields.length)];
        return {
          id: `bd-${university.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
          name: `Dr. ${['Rahim', 'Karim', 'Anika', 'Farida', 'Mohammad', 'Taslima'][Math.floor(Math.random() * 6)]} ${['Ahmed', 'Khan', 'Rahman', 'Begum', 'Chowdhury', 'Islam'][Math.floor(Math.random() * 6)]}`,
          university,
          field,
          country: "Bangladesh",
          city: ["Dhaka", "Chittagong", "Rajshahi", "Khulna"][Math.floor(Math.random() * 4)],
          lat: 23.6850 + (Math.random() - 0.5) * 2,
          lng: 90.3563 + (Math.random() - 0.5) * 2
        };
      });
    });
    
    // Generate academics worldwide
    const internationalAcademics = Object.entries(internationalUniversities).flatMap(([country, universities]) => {
      return universities.flatMap(university => {
        return Array(2).fill().map((_, idx) => {
          const field = fields[Math.floor(Math.random() * fields.length)];
          const latlng = {
            "USA": [37.7749, -122.4194],
            "UK": [51.5074, -0.1278],
            "Australia": [-33.8688, 151.2093],
            "Canada": [43.6532, -79.3832],
            "Germany": [52.5200, 13.4050],
            "Japan": [35.6762, 139.6503]
          }[country];
          
          return {
            id: `int-${country.toLowerCase()}-${university.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
            name: `Dr. ${['John', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia'][Math.floor(Math.random() * 6)]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'][Math.floor(Math.random() * 6)]}`,
            university,
            field,
            country,
            city: university.includes("Oxford") ? "Oxford" : 
                  university.includes("Cambridge") ? "Cambridge" :
                  university.includes("Tokyo") ? "Tokyo" :
                  university.includes("MIT") || university.includes("Harvard") ? "Boston" :
                  university.includes("Stanford") ? "Stanford" : "Unknown",
            lat: latlng[0] + (Math.random() - 0.5) * 2,
            lng: latlng[1] + (Math.random() - 0.5) * 5
          };
        });
      });
    });
    
    // Combine Bangladesh and international academics
    return [...bangladeshAcademics, ...internationalAcademics];
  };

  const handleGlobePointClick = (point) => {
    console.log("Globe point clicked, setting selected academic:", point);
    setSelectedAcademic(point);
    setShowInfoPanel(true);
    
    // Debug check to ensure we're getting the right data
    if (!point) {
      console.error("No point data received in handleGlobePointClick");
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredDataPoints(dataPoints);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const results = dataPoints.filter(
      point => 
        point.name.toLowerCase().includes(lowercaseQuery) ||
        point.university.toLowerCase().includes(lowercaseQuery) ||
        point.field.toLowerCase().includes(lowercaseQuery) ||
        point.country.toLowerCase().includes(lowercaseQuery) ||
        point.city.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredDataPoints(results);
  };

  const handleFilter = (filters) => {
    let results = [...dataPoints];
    
    if (filters.field) {
      results = results.filter(point => 
        point.field.toLowerCase() === filters.field.toLowerCase()
      );
    }
    
    if (filters.country) {
      results = results.filter(point => 
        point.country.toLowerCase() === filters.country.toLowerCase()
      );
    }
    
    if (filters.university) {
      results = results.filter(point => 
        point.university.toLowerCase().includes(filters.university.toLowerCase())
      );
    }
    
    setFilteredDataPoints(results);
  };

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <WelcomeOverlay />
            <div className="absolute top-24 left-0 right-0 z-10 px-6 md:px-10">
              <div className="max-w-3xl mx-auto bg-black bg-opacity-70 backdrop-blur-xl rounded-xl p-6 border border-blue-900">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Bangladesh Academic Mentor Network
                </h1>
                <p className="text-gray-300 text-lg mb-4">
                  Explore Bangladeshi academics and researchers worldwide using our interactive 3D globe
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-blue-900 bg-opacity-40 rounded-lg px-3 py-2 text-sm text-blue-200 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span>Drag to rotate</span>
                  </div>
                  <div className="bg-blue-900 bg-opacity-40 rounded-lg px-3 py-2 text-sm text-blue-200 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Scroll to zoom</span>
                  </div>
                  <div className="bg-blue-900 bg-opacity-40 rounded-lg px-3 py-2 text-sm text-blue-200 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Click points for details</span>
                  </div>
                </div>
                
                {/* Search bar moved inside the info box */}
                <div className="mt-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleSearch(document.getElementById('search-input').value); }} className="relative">
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search academics, fields, or universities..."
                      className="w-full py-3 px-6 bg-black bg-opacity-60 backdrop-blur-md border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none"
                    >
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Original SearchBar hidden but still functional for state management */}
            <div className="hidden">
              <SearchBar onSearch={handleSearch} academics={dataPoints} />
            </div>
            
            {/* Debug info and testing button */}
            <div className="absolute bottom-4 left-4 z-20">
              <button 
                onClick={() => {
                  if (dataPoints.length > 0) {
                    console.log("Test showing academic:", dataPoints[0]);
                    handleGlobePointClick(dataPoints[0]);
                  } else {
                    console.error("No academics data available");
                  }
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition-colors"
              >
                Show Sample Profile
              </button>
              <div className="text-xs text-gray-400 mt-1">
                {dataPoints.length} academics loaded
              </div>
            </div>
            
            <FilterPanel onFilter={handleFilter} />
            <div className="globe-container">
              <GlobeVisualization 
                dataPoints={filteredDataPoints} 
                isLoading={isLoading} 
                onPointClick={handleGlobePointClick}
              />
            </div>
            <InfoPanel 
              isVisible={showInfoPanel} 
              academic={selectedAcademic} 
              onClose={() => setShowInfoPanel(false)}
            />
          </>
        } />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/academics" element={<AcademicsPage academics={dataPoints} />} />
        <Route path="/academics/:id" element={<AcademicDetailPage academics={dataPoints} />} />
        <Route path="/countries" element={<CountriesPage academics={dataPoints} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

// Main App component that provides context
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;