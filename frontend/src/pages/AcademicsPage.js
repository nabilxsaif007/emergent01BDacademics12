import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AcademicsPage = ({ academics = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [displayedAcademics, setDisplayedAcademics] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Get unique fields and countries for filters
  const fields = [...new Set(academics.map(a => a.field))].sort();
  const countries = [...new Set(academics.map(a => a.country))].sort();
  
  // Filter academics based on search and filters
  useEffect(() => {
    setLoading(true);
    
    // Simulate an API request with a slight delay
    setTimeout(() => {
      const filtered = academics.filter(academic => {
        const matchesSearch = searchTerm === '' || 
          academic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          academic.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
          academic.field.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesField = selectedField === '' || academic.field === selectedField;
        const matchesCountry = selectedCountry === '' || academic.country === selectedCountry;
        
        return matchesSearch && matchesField && matchesCountry;
      });
      
      setDisplayedAcademics(filtered);
      setTotalCount(filtered.length);
      setLoading(false);
    }, 300);
  }, [academics, searchTerm, selectedField, selectedCountry]);
  
  // Generate a position title based on the field
  const getDesignation = (field) => {
    const designations = {
      "Computer Science": "Associate Professor",
      "Medicine": "Senior Researcher",
      "Physics": "Professor",
      "Bioengineering": "Research Fellow",
      "Environmental Science": "Assistant Professor",
      "Civil Engineering": "Professor",
      "Literature": "Associate Professor",
      "Robotics": "Lead Researcher",
      "Psychology": "Professor",
      "Economics": "Department Head"
    };
    
    return designations[field] || "Researcher";
  };
  
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Bangladeshi Academic Directory
          </h1>
          <p className="text-gray-300">
            Browse our network of {academics.length} Bangladeshi academics working across the globe
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Globe View
          </Link>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Search & Filter</h2>
          <button 
            onClick={() => { 
              setSearchTerm(''); 
              setSelectedField(''); 
              setSelectedCountry(''); 
            }}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Clear Filters
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="search" className="block text-gray-300 text-sm font-medium mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name, university..."
                  className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="field" className="block text-gray-300 text-sm font-medium mb-2">
                Field of Study
              </label>
              <div className="relative">
                <select
                  id="field"
                  value={selectedField}
                  onChange={e => setSelectedField(e.target.value)}
                  className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">All Fields</option>
                  {fields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="country" className="block text-gray-300 text-sm font-medium mb-2">
                Country
              </label>
              <div className="relative">
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-medium">
          {loading ? 'Searching...' : `Showing ${displayedAcademics.length} results`}
        </h2>
        
        {displayedAcademics.length > 0 && (
          <div className="text-gray-400 text-sm">
            Sorted by field
          </div>
        )}
      </div>
      
      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : displayedAcademics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAcademics.map(academic => (
            <Link 
              key={academic.id} 
              to={`/academics/${academic.id}`}
              className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                    {academic.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white text-lg font-bold">{academic.name}</h3>
                    <p className="text-blue-300 text-sm">{getDesignation(academic.field)}</p>
                    <p className="text-gray-300 mt-1">{academic.field}</p>
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <p className="text-gray-400 text-sm">{academic.university}</p>
                      <div className="flex items-center mt-1">
                        <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-500 text-sm">{academic.city}, {academic.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-blue-400 text-sm flex items-center">
                    View Profile
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-800 p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-400 text-lg mb-4">No academics match your search criteria.</p>
          <button 
            onClick={() => { 
              setSearchTerm(''); 
              setSelectedField(''); 
              setSelectedCountry(''); 
            }}
            className="px-6 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};

export default AcademicsPage;