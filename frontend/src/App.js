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
    // This would be replaced with actual API call in production
    const fetchData = async () => {
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          // Sample data for academic locations
          const sampleData = [
            { id: 1, name: "Dr. Arif Rahman", lat: 42.3601, lng: -71.0942, university: "MIT", field: "Computer Science", city: "Cambridge", country: "USA" },
            { id: 2, name: "Dr. Fatima Begum", lat: 51.7520, lng: -1.2577, university: "Oxford University", field: "Medicine", city: "Oxford", country: "UK" },
            { id: 3, name: "Dr. Kamal Hossain", lat: 1.3521, lng: 103.8198, university: "National University of Singapore", field: "Physics", city: "Singapore", country: "Singapore" },
            { id: 4, name: "Dr. Anisur Rahman", lat: 37.4419, lng: -122.1430, university: "Stanford University", field: "Bioengineering", city: "Palo Alto", country: "USA" },
            { id: 5, name: "Dr. Tahmina Ahmed", lat: 43.6532, lng: -79.3832, university: "University of Toronto", field: "Environmental Science", city: "Toronto", country: "Canada" },
            // Add more sample data for Bangladesh and various global locations
            { id: 6, name: "Dr. Salim Khan", lat: 23.8103, lng: 90.4125, university: "BUET", field: "Civil Engineering", city: "Dhaka", country: "Bangladesh" },
            { id: 7, name: "Dr. Nusrat Jahan", lat: 48.8566, lng: 2.3522, university: "Sorbonne University", field: "Literature", city: "Paris", country: "France" },
            { id: 8, name: "Dr. Zahir Uddin", lat: 35.7128, lng: 139.7669, university: "University of Tokyo", field: "Robotics", city: "Tokyo", country: "Japan" },
            { id: 9, name: "Dr. Nasreen Akter", lat: -37.8136, lng: 144.9631, university: "University of Melbourne", field: "Psychology", city: "Melbourne", country: "Australia" },
            { id: 10, name: "Dr. Jamal Uddin", lat: 25.2048, lng: 55.2708, university: "UAE University", field: "Economics", city: "Dubai", country: "UAE" },
            { id: 11, name: "Dr. Sabina Ahmed", lat: 13.0827, lng: 80.2707, university: "IIT Madras", field: "Chemical Engineering", city: "Chennai", country: "India" },
            { id: 12, name: "Dr. Rashid Khan", lat: 39.9042, lng: 116.4074, university: "Peking University", field: "Artificial Intelligence", city: "Beijing", country: "China" },
            { id: 13, name: "Dr. Farhana Islam", lat: 59.3293, lng: 18.0686, university: "KTH Royal Institute", field: "Sustainable Energy", city: "Stockholm", country: "Sweden" },
            { id: 14, name: "Dr. Imran Hossain", lat: 55.7558, lng: 37.6173, university: "Moscow State University", field: "Mathematics", city: "Moscow", country: "Russia" },
            { id: 15, name: "Dr. Shahana Rahman", lat: -33.8688, lng: 151.2093, university: "University of Sydney", field: "Marine Biology", city: "Sydney", country: "Australia" },
            // More academics in Bangladesh
            { id: 16, name: "Dr. Mahmud Ali", lat: 23.7000, lng: 90.3500, university: "University of Dhaka", field: "Economics", city: "Dhaka", country: "Bangladesh" },
            { id: 17, name: "Dr. Farida Akhter", lat: 23.7200, lng: 90.4100, university: "BRAC University", field: "Public Health", city: "Dhaka", country: "Bangladesh" },
            { id: 18, name: "Dr. Ashraf Uddin", lat: 22.3569, lng: 91.7832, university: "Chittagong University", field: "Marine Science", city: "Chittagong", country: "Bangladesh" },
            { id: 19, name: "Dr. Rafiq Islam", lat: 24.3636, lng: 88.6241, university: "Rajshahi University", field: "Agriculture", city: "Rajshahi", country: "Bangladesh" },
            { id: 20, name: "Dr. Sultana Begum", lat: 24.8949, lng: 91.8687, university: "Sylhet Agricultural University", field: "Environmental Science", city: "Sylhet", country: "Bangladesh" },
          ];
          setDataPoints(sampleData);
          setFilteredDataPoints(sampleData);
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
    setSelectedAcademic(point);
    setShowInfoPanel(true);
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
              </div>
            </div>
            <SearchBar onSearch={handleSearch} academics={dataPoints} />
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