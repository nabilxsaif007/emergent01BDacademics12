import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/MapComponent';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [academics, setAcademics] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    country: searchParams.get('country') || '',
    city: searchParams.get('city') || '',
    field: searchParams.get('field') || '',
    keywords: searchParams.get('keywords') ? searchParams.get('keywords').split(',') : [],
  });
  
  // Fetch all keywords for filter options
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get(`${API}/keywords`);
        setKeywords(response.data);
      } catch (err) {
        console.error('Error fetching keywords:', err);
      }
    };
    
    fetchKeywords();
  }, []);
  
  // Fetch academics based on filters
  useEffect(() => {
    const fetchAcademics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        if (filters.country) params.append('country', filters.country);
        if (filters.city) params.append('city', filters.city);
        if (filters.field) params.append('research_field', filters.field);
        if (filters.keywords && filters.keywords.length > 0) {
          filters.keywords.forEach(keyword => {
            params.append('keywords', keyword);
          });
        }
        
        const response = await axios.get(`${API}/academics?${params.toString()}`);
        
        // Fetch user details for each academic
        const academicsWithUserDetails = await Promise.all(
          response.data.map(async (academic) => {
            try {
              const userResponse = await axios.get(`${API}/users/${academic.user_id}`);
              return {
                ...academic,
                name: userResponse.data.name,
                email: userResponse.data.email,
              };
            } catch (err) {
              console.error(`Error fetching user details for academic ${academic.id}:`, err);
              return {
                ...academic,
                name: 'Unknown User',
              };
            }
          })
        );
        
        setAcademics(academicsWithUserDetails);
      } catch (err) {
        console.error('Error fetching academics:', err);
        setError('Failed to fetch academics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAcademics();
    
    // Update search params in URL
    const newSearchParams = new URLSearchParams();
    if (filters.country) newSearchParams.set('country', filters.country);
    if (filters.city) newSearchParams.set('city', filters.city);
    if (filters.field) newSearchParams.set('field', filters.field);
    if (filters.keywords && filters.keywords.length > 0) {
      newSearchParams.set('keywords', filters.keywords.join(','));
    }
    
    setSearchParams(newSearchParams);
  }, [filters, setSearchParams]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleKeywordChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => {
      if (checked) {
        return {
          ...prev,
          keywords: [...prev.keywords, value]
        };
      } else {
        return {
          ...prev,
          keywords: prev.keywords.filter(k => k !== value)
        };
      }
    });
  };
  
  const clearFilters = () => {
    setFilters({
      country: '',
      city: '',
      field: '',
      keywords: []
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Bangladeshi Academic Mentors</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Filters panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filter Results</h2>
            
            {/* Country filter */}
            <div className="mb-4">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any country"
              />
            </div>
            
            {/* City filter */}
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any city"
              />
            </div>
            
            {/* Research field filter */}
            <div className="mb-4">
              <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
                Research Field
              </label>
              <input
                type="text"
                id="field"
                name="field"
                value={filters.field}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any field"
              />
            </div>
            
            {/* Keywords filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                {keywords.length > 0 ? (
                  keywords.map((keyword) => (
                    <div key={keyword.id} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`keyword-${keyword.id}`}
                        value={keyword.name}
                        checked={filters.keywords.includes(keyword.name)}
                        onChange={handleKeywordChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`keyword-${keyword.id}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {keyword.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No keywords available</p>
                )}
              </div>
            </div>
            
            {/* Clear filters button */}
            <button
              onClick={clearFilters}
              className="w-full mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {/* Map and results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {academics.length} {academics.length === 1 ? 'Result' : 'Results'}
                </h2>
                <div className="text-sm text-gray-600">
                  Use the map to explore academics by location
                </div>
              </div>
              
              <MapComponent academics={academics} />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {academics.map((academic) => (
                  <div key={academic.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{academic.name}</h3>
                      <p className="text-gray-600 mb-1">{academic.university}</p>
                      <p className="text-gray-600 mb-1">
                        {academic.city}, {academic.country}
                      </p>
                      <p className="text-gray-600 mb-3">
                        <span className="font-medium">Field:</span> {academic.research_field}
                        {academic.sub_field && ` (${academic.sub_field})`}
                      </p>
                      
                      {academic.keywords && academic.keywords.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2">
                            {academic.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <a
                        href={`mailto:${academic.contact_email}`}
                        className="inline-block mt-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
