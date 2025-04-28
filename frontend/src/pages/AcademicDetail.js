import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Using a placeholder key for development purposes
// In production, this should be replaced with a valid API key and stored in environment variables
const GOOGLE_MAPS_API_KEY = 'AIzaSyD2ye0BEvMZZEMQ9LKQl6XQxLw7UiRZYXM'; // Mock API key for demonstration

const AcademicDetail = () => {
  const { id } = useParams();
  const [academic, setAcademic] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    const fetchAcademic = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch academic details
        const academicResponse = await axios.get(`${API}/academics/${id}`);
        setAcademic(academicResponse.data);
        
        // Fetch user details
        try {
          const userResponse = await axios.get(`${API}/users/${academicResponse.data.user_id}`);
          setUser(userResponse.data);
        } catch (err) {
          console.error('Error fetching user details:', err);
          setUser({ 
            name: 'Academic Mentor', 
            email: academicResponse.data.contact_email 
          });
        }
      } catch (err) {
        console.error('Error fetching academic details:', err);
        setError('Failed to load academic details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAcademic();
  }, [id]);
  
  const mapContainerStyle = {
    width: '100%',
    height: '300px',
  };
  
  const handleMapLoad = () => {
    setMapLoaded(true);
    console.log("Google Maps loaded successfully in AcademicDetail");
  };
  
  const handleMapError = (error) => {
    console.error("Error loading Google Maps in AcademicDetail:", error);
    setMapLoaded(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !academic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Academic profile not found'}
          </div>
          <Link to="/search" className="text-blue-600 hover:text-blue-800">
            &larr; Back to search
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/search" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
          </svg>
          Back to Search
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.name || 'Academic Mentor'}</h1>
                <p className="text-xl text-gray-600">{academic.university}</p>
              </div>
              <a
                href={`mailto:${academic.contact_email}`}
                className="mt-4 md:mt-0 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Contact
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Research Field</h3>
                    <p className="text-gray-900">{academic.research_field}</p>
                  </div>
                  
                  {academic.sub_field && (
                    <div>
                      <h3 className="font-medium text-gray-700">Sub Field</h3>
                      <p className="text-gray-900">{academic.sub_field}</p>
                    </div>
                  )}
                  
                  {academic.keywords && academic.keywords.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-700">Keywords</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {academic.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Contact</h3>
                    <p className="text-gray-900">{academic.contact_email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <p className="mb-4">{academic.city}, {academic.country}</p>
                
                {academic.latitude && academic.longitude && (
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <LoadScript 
                      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                      onLoad={() => console.log("Google Maps Script loaded in AcademicDetail")}
                      onError={handleMapError}
                    >
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={{
                          lat: academic.latitude,
                          lng: academic.longitude
                        }}
                        zoom={8}
                        onLoad={handleMapLoad}
                      >
                        {mapLoaded && (
                          <Marker
                            position={{
                              lat: academic.latitude,
                              lng: academic.longitude
                            }}
                          />
                        )}
                      </GoogleMap>
                    </LoadScript>
                  </div>
                )}
              </div>
            </div>
            
            {academic.bio && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Biography</h2>
                <p className="text-gray-700 whitespace-pre-line">{academic.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDetail;
