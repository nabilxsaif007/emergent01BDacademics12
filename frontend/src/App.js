import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import WelcomeOverlay from './components/WelcomeOverlay';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import Globe from './components/Globe';
import InfoPanel from './components/InfoPanel';
import AcademicsPage from './pages/AcademicsPage';
import AcademicDetailPage from './pages/AcademicDetailPage';
import CountriesPage from './pages/CountriesPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfileCreationPage from './pages/ProfileCreationPage';
import VerificationPage from './pages/VerificationPage';
import ResearcherSearchPage from './pages/ResearcherSearchPage';
import ResearcherProfilePage from './pages/ResearcherProfilePage';
import ConnectionsPage from './pages/ConnectionsPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Define API URL from environment variables
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Main content component that uses location
function AppContent() {
  const { user, logout } = useAuth();
  
  const [dataPoints, setDataPoints] = useState([]);
  const [filteredDataPoints, setFilteredDataPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAcademic, setSelectedAcademic] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
      {/* Add padding for fixed navbar */}
      <div className="pt-20">
      <Routes>
          {/* For the homepage (globe view) */}
          <Route path="/" element={
            <>
              <div className="fixed inset-0 bg-white pointer-events-none" />
              <div className="relative z-10">
                <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>
                      Explore Bangladesh's <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">Global Academic Network</span>
                    </h1>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>
                      Connect with researchers and academics worldwide
                    </p>
                  </div>
                  
                  {/* New search input */}
                  <div className="relative mb-10 max-w-2xl mx-auto">
                    <input
                      type="text"
                      placeholder="Search by name, university, or research field"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Also update the hidden SearchBar component state
                        handleSearch(e.target.value);
                      }}
                      className="w-full py-3.5 px-6 bg-white border border-gray-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm hover:shadow-md"
                      style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-green-500 text-white p-2.5 rounded-full hover:from-green-700 hover:to-green-600 transition-all hover:shadow-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                    
                  {/* Removed the key facts boxes as requested */}
                </div>
              </div>
              
              {/* Original SearchBar hidden but still functional for state management */}
              <div className="hidden">
                <SearchBar onSearch={handleSearch} academics={dataPoints} />
              </div>
              
              {/* Enhanced filter bar */}
              <div className="mx-auto max-w-4xl px-4 py-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => handleFilter({ field: e.target.value })}
                      >
                        <option value="">All Fields</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Medical Science">Medical Science</option>
                        <option value="Physics">Physics</option>
                        <option value="Economics">Economics</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => handleFilter({ country: e.target.value })}
                      >
                        <option value="">All Countries</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="Bangladesh">Bangladesh</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => handleFilter({ university: e.target.value })}
                      >
                        <option value="">All Universities</option>
                        <option value="MIT">MIT</option>
                        <option value="Stanford">Stanford University</option>
                        <option value="Harvard">Harvard University</option>
                        <option value="Oxford">Oxford University</option>
                        <option value="Cambridge">Cambridge University</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Globe */}
              <div className="mx-auto max-w-6xl px-4 py-4">
                <div className="globe-container">
                  <Globe 
                    dataPoints={filteredDataPoints} 
                    isLoading={isLoading}
                    onPointClick={handleGlobePointClick} 
                  />
                </div>
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
          <Route path="/profile/create" element={<ProfileCreationPage />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route path="/researchers" element={<ResearcherSearchPage />} />
          <Route path="/researchers/:id" element={<ResearcherProfilePage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </div>
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