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
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 bg-white">
      <div className="relative overflow-hidden mb-16 rounded-2xl bg-green-50 border border-green-200">
        <div className="absolute inset-0 bg-green-200 opacity-10"></div>
        <div className="relative z-10 px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-4 tracking-tight">
                Bangladeshi Academic Directory
              </h1>
              <p className="text-xl text-green-700 leading-relaxed">
                Browse our network of <span className="font-bold text-green-800">{academics.length}</span> Bangladeshi academics working across the globe. Connect, collaborate, and build meaningful partnerships.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/about" className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                  Learn More
                  <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link to="/" className="inline-flex items-center px-5 py-3 border border-green-300 text-base font-medium rounded-md text-green-700 bg-transparent hover:bg-green-50 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Globe View
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="absolute animate-spin-slow opacity-20" width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="128" cy="128" r="120" stroke="#22c55e" strokeWidth="16" strokeDasharray="16 32" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white backdrop-blur-sm rounded-xl border border-green-100 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-green-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-green-800">Search & Filter</h2>
          <button 
            onClick={() => { 
              setSearchTerm(''); 
              setSelectedField(''); 
              setSelectedCountry(''); 
            }}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Clear Filters
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="search" className="block text-gray-700 text-sm font-medium mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by name, university..."
                  className="w-full bg-white border border-green-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="field" className="block text-gray-700 text-sm font-medium mb-2">
                Field of Study
              </label>
              <div className="relative">
                <select
                  id="field"
                  value={selectedField}
                  onChange={e => setSelectedField(e.target.value)}
                  className="w-full bg-white border border-green-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
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
              <label htmlFor="country" className="block text-gray-700 text-sm font-medium mb-2">
                Country
              </label>
              <div className="relative">
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="w-full bg-white border border-green-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2a2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <h2 className="text-green-800 font-medium">
          {loading ? 'Searching...' : `Showing ${displayedAcademics.length} results`}
        </h2>
        
        {displayedAcademics.length > 0 && (
          <div className="text-gray-600 text-sm">
            Sorted by field
          </div>
        )}
      </div>
      
      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          <span className="ml-4 text-green-600 text-lg">Searching academics...</span>
        </div>
      ) : displayedAcademics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedAcademics.map(academic => (
            <div 
              key={academic.id}
              className="group bg-white backdrop-blur-lg rounded-xl overflow-hidden border border-green-100 hover:border-green-300 hover:shadow-green-700/10 hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300"
            >
              <div className="relative overflow-hidden h-24 bg-gradient-to-r from-green-600 to-green-500">
                <div className="absolute inset-0 bg-green-500 mix-blend-overlay opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-green-800 opacity-30"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-300 rounded-full opacity-20 mix-blend-multiply blur-2xl"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200 rounded-full opacity-20 mix-blend-multiply blur-2xl"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold tracking-tight">{academic.name}</h3>
                  <p className="text-green-100 text-sm font-medium">{getDesignation(academic.field)}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg transform -mt-12 border-4 border-white group-hover:scale-110 transition-transform">
                    {academic.name.charAt(0)}
                  </div>
                  <div className="ml-4 mt-2">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span className="text-gray-700">{academic.field}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <span className="text-gray-700">{academic.university}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">{academic.city}, {academic.country}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-green-100 flex justify-between items-center">
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center transition-colors">
                    <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contact
                  </button>
                  <Link 
                    to={`/academics/${academic.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    View Profile
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white backdrop-blur-sm rounded-xl border border-green-100 shadow-sm p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-lg mb-4">No academics match your search criteria.</p>
          <button 
            onClick={() => { 
              setSearchTerm(''); 
              setSelectedField(''); 
              setSelectedCountry(''); 
            }}
            className="px-6 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 transition-colors font-medium"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};

export default AcademicsPage;