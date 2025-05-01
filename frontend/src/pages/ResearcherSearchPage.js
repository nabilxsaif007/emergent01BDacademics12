import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ApprovalStatusBadge from '../components/ApprovalStatusBadge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResearcherSearchPage = () => {
  const [researchers, setResearchers] = useState([]);
  const [filteredResearchers, setFilteredResearchers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    academic_titles: [],
    institutions: [],
    countries: [],
    cities: [],
    research_interests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    academic_title: [],
    institution_name: [],
    country: [],
    city: [],
    research_interests: []
  });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchResearchers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all researchers with approved profiles
        const response = await axios.get(`${API}/researchers/search`);
        setResearchers(response.data);
        setFilteredResearchers(response.data);
        
        // Calculate total pages
        setTotalPages(Math.ceil(response.data.length / resultsPerPage));
        
        // Fetch filter options
        const filtersResponse = await axios.get(`${API}/researchers/filters`);
        setFilterOptions(filtersResponse.data);
      } catch (err) {
        console.error('Error fetching researchers:', err);
        setError('Failed to load researchers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResearchers();
  }, [resultsPerPage]);
  
  // Apply search and filters
  useEffect(() => {
    const applyFilters = () => {
      let results = [...researchers];
      
      // Apply text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(researcher => 
          (researcher.academic_title && researcher.academic_title.toLowerCase().includes(query)) ||
          (researcher.institution_name && researcher.institution_name.toLowerCase().includes(query)) ||
          (researcher.department && researcher.department.toLowerCase().includes(query)) ||
          (researcher.bio && researcher.bio.toLowerCase().includes(query))
        );
      }
      
      // Apply active filters
      Object.entries(activeFilters).forEach(([filterType, filterValues]) => {
        if (filterValues.length > 0) {
          if (filterType === 'research_interests') {
            // For research interests, check if any of the researcher's interests match any of the filter values
            results = results.filter(researcher => 
              researcher.research_interests && 
              researcher.research_interests.some(interest => 
                filterValues.includes(interest)
              )
            );
          } else {
            // For other filters, check if the researcher's value matches any of the filter values
            results = results.filter(researcher => 
              researcher[filterType] && filterValues.includes(researcher[filterType])
            );
          }
        }
      });
      
      setFilteredResearchers(results);
      setTotalPages(Math.ceil(results.length / resultsPerPage));
      setCurrentPage(1); // Reset to first page when filters change
    };
    
    applyFilters();
  }, [searchQuery, activeFilters, researchers, resultsPerPage]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // The search is applied by the useEffect above
  };
  
  const toggleFilterSelection = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [value]: !prev[filterType]?.[value]
      }
    }));
  };
  
  const applyFilters = () => {
    // Convert selected filters to active filters array format
    const newActiveFilters = Object.entries(selectedFilters).reduce((acc, [filterType, values]) => {
      const selectedValues = Object.entries(values)
        .filter(([_, isSelected]) => isSelected)
        .map(([value]) => value);
      
      acc[filterType] = selectedValues;
      return acc;
    }, {});
    
    setActiveFilters(newActiveFilters);
    setShowFilterPanel(false);
  };
  
  const resetFilters = () => {
    setSelectedFilters({});
    setActiveFilters({
      academic_title: [],
      institution_name: [],
      country: [],
      city: [],
      research_interests: []
    });
  };
  
  // Get current page of researchers
  const getCurrentResearchers = () => {
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    return filteredResearchers.slice(indexOfFirstResult, indexOfLastResult);
  };
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gray-900 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Discover Researchers</h1>
        
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                className="bg-gray-800 text-white w-full pl-10 pr-4 py-2 rounded-l-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Search by name, institution, research interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="bg-gray-700 text-white px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Search
            </button>
          </form>
          
          {/* Filter tags */}
          {Object.entries(activeFilters).some(([_, values]) => values.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([filterType, values]) => 
                values.map(value => (
                  <span 
                    key={`${filterType}-${value}`}
                    className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {filterType.replace('_', ' ')}: {value}
                    <button
                      onClick={() => {
                        // Remove this filter
                        const newFilterValues = activeFilters[filterType].filter(v => v !== value);
                        setActiveFilters({
                          ...activeFilters,
                          [filterType]: newFilterValues
                        });
                        
                        // Also update selectedFilters
                        setSelectedFilters(prev => ({
                          ...prev,
                          [filterType]: {
                            ...prev[filterType],
                            [value]: false
                          }
                        }));
                      }}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </span>
                ))
              )}
              {Object.values(activeFilters).some(values => values.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="text-yellow-500 hover:text-yellow-400 text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mb-6 p-4 bg-gray-800 rounded-md border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Academic Title */}
              <div>
                <h3 className="text-white font-medium mb-2">Academic Title</h3>
                <div className="max-h-40 overflow-y-auto">
                  {filterOptions.academic_titles.map(title => (
                    <div key={title} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`title-${title}`}
                        checked={selectedFilters.academic_title?.[title] || false}
                        onChange={() => toggleFilterSelection('academic_title', title)}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
                      />
                      <label htmlFor={`title-${title}`} className="ml-2 block text-sm text-gray-300">
                        {title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Institution */}
              <div>
                <h3 className="text-white font-medium mb-2">Institution</h3>
                <div className="max-h-40 overflow-y-auto">
                  {filterOptions.institutions.map(institution => (
                    <div key={institution} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`inst-${institution}`}
                        checked={selectedFilters.institution_name?.[institution] || false}
                        onChange={() => toggleFilterSelection('institution_name', institution)}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
                      />
                      <label htmlFor={`inst-${institution}`} className="ml-2 block text-sm text-gray-300">
                        {institution}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Research Interests */}
              <div>
                <h3 className="text-white font-medium mb-2">Research Interests</h3>
                <div className="max-h-40 overflow-y-auto">
                  {filterOptions.research_interests.map(interest => (
                    <div key={interest} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`interest-${interest}`}
                        checked={selectedFilters.research_interests?.[interest] || false}
                        onChange={() => toggleFilterSelection('research_interests', interest)}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
                      />
                      <label htmlFor={`interest-${interest}`} className="ml-2 block text-sm text-gray-300">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowFilterPanel(false)}
                className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={resetFilters}
                className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        ) : filteredResearchers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No researchers found matching your criteria.</p>
            {(searchQuery || Object.values(activeFilters).some(values => values.length > 0)) && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-4">Found {filteredResearchers.length} researchers</p>
            
            <div className="space-y-4">
              {getCurrentResearchers().map(researcher => (
                <div key={researcher.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-yellow-600 transition-colors">
                  <div className="flex flex-col md:flex-row">
                    {/* Profile Image or Placeholder */}
                    <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold text-white">
                        {researcher.first_name ? researcher.first_name.charAt(0).toUpperCase() : '?'}
                      </div>
                    </div>
                    
                    {/* Researcher Info */}
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h2 className="text-xl font-semibold text-white">
                          <Link to={`/researchers/${researcher.id}`} className="hover:text-yellow-500">
                            {researcher.academic_title ? `${researcher.academic_title} ` : ''}
                            {researcher.first_name || 'Researcher'} {researcher.last_name || ''}
                          </Link>
                          <ApprovalStatusBadge status={researcher.status} />
                        </h2>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-gray-300">
                          {researcher.institution_name && <span className="mr-3">{researcher.institution_name}</span>}
                          {researcher.department && <span className="text-gray-400">({researcher.department})</span>}
                        </p>
                        {researcher.country && (
                          <p className="text-gray-400 text-sm">
                            {researcher.city && `${researcher.city}, `}{researcher.country}
                          </p>
                        )}
                      </div>
                      
                      {researcher.research_interests && researcher.research_interests.length > 0 && (
                        <div className="mb-3">
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Research Interests:</h3>
                          <div className="flex flex-wrap gap-2">
                            {researcher.research_interests.map((interest, index) => (
                              <span 
                                key={index} 
                                className="bg-gray-700 text-gray-200 px-2 py-1 rounded-full text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {researcher.bio && (
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {researcher.bio}
                        </p>
                      )}
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link 
                          to={`/researchers/${researcher.id}`}
                          className="px-3 py-1 bg-yellow-700 hover:bg-yellow-600 text-white text-sm rounded-full"
                        >
                          View Profile
                        </Link>
                        <button 
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-full"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md ${
                      currentPage === 1
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around the current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`px-3 py-1 ${
                          currentPage === pageNum
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md ${
                      currentPage === totalPages
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResearcherSearchPage;