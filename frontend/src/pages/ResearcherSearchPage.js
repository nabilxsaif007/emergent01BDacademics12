import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ApprovalStatusBadge from '../components/ApprovalStatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

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
  
  // Filter researchers based on search query and active filters
  useEffect(() => {
    if (researchers.length > 0) {
      let results = [...researchers];
      
      // Apply text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(researcher => {
          return (
            (researcher.first_name && researcher.first_name.toLowerCase().includes(query)) ||
            (researcher.last_name && researcher.last_name.toLowerCase().includes(query)) ||
            (researcher.institution_name && researcher.institution_name.toLowerCase().includes(query)) ||
            (researcher.department && researcher.department.toLowerCase().includes(query)) ||
            (researcher.bio && researcher.bio.toLowerCase().includes(query)) ||
            (researcher.research_interests && 
              researcher.research_interests.some(interest => 
                interest.toLowerCase().includes(query)
              ))
          );
        });
      }
      
      // Apply filters
      Object.entries(activeFilters).forEach(([filterType, values]) => {
        if (values.length > 0) {
          if (filterType === 'research_interests') {
            // Special handling for research interests (array field)
            results = results.filter(researcher => 
              values.some(value => 
                researcher.research_interests && 
                researcher.research_interests.includes(value)
              )
            );
          } else {
            // For other fields (string fields)
            results = results.filter(researcher => 
              values.includes(researcher[filterType])
            );
          }
        }
      });
      
      setFilteredResearchers(results);
      setTotalPages(Math.ceil(results.length / resultsPerPage));
      
      // Reset to first page when filters change
      setCurrentPage(1);
    }
  }, [researchers, searchQuery, activeFilters, resultsPerPage]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search already applied in the useEffect
  };
  
  const handleFilterChange = (filterType, value, isChecked) => {
    // Update the selected filters object
    setSelectedFilters({
      ...selectedFilters,
      [filterType]: {
        ...selectedFilters[filterType],
        [value]: isChecked
      }
    });
    
    // Update active filters array
    if (isChecked) {
      setActiveFilters({
        ...activeFilters,
        [filterType]: [...activeFilters[filterType], value]
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        [filterType]: activeFilters[filterType].filter(v => v !== value)
      });
    }
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
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Discover Researchers</h1>
        
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-l-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:ring-opacity-50 focus:border-brand-emerald shadow-sm transition-all duration-200"
                placeholder="Search by name, institution, research interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-brand-emerald" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`px-4 py-3 border border-gray-200 focus:outline-none ${showFilterPanel ? 'bg-gray-100 text-brand-emerald' : 'bg-white text-text-secondary'} transition-colors duration-200`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="submit"
              className="bg-brand-emerald hover:bg-brand-emerald-light text-white font-medium px-4 py-3 rounded-r-md focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:ring-offset-2 shadow-sm transition-all duration-200"
            >
              Search
            </button>
          </form>
          
          {/* Filter chips */}
          {Object.entries(activeFilters).some(([_, values]) => values.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2 animate-fadeIn">
              {Object.entries(activeFilters).map(([filterType, values]) => 
                values.map(value => (
                  <span
                    key={`${filterType}-${value}`}
                    className="bg-gray-100 text-text-secondary px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <span className="font-medium text-brand-emerald">{filterType.replace('_', ' ')}:</span> <span className="ml-1">{value}</span>
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
                      className="ml-2 text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))
              )}
              {Object.values(activeFilters).some(values => values.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="text-brand-emerald hover:text-brand-emerald-dark text-sm font-medium transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-100 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Academic Title */}
              <div>
                <h3 className="text-text-primary font-medium mb-3">Academic Title</h3>
                <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                  {filterOptions.academic_titles.map(title => (
                    <div key={title} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`title-${title}`}
                        checked={selectedFilters.academic_title?.[title] || false}
                        onChange={(e) => handleFilterChange('academic_title', title, e.target.checked)}
                        className="h-4 w-4 text-brand-emerald focus:ring-brand-emerald border-gray-300 rounded"
                      />
                      <label htmlFor={`title-${title}`} className="ml-2 block text-text-secondary text-sm">
                        {title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Institutions */}
              <div>
                <h3 className="text-text-primary font-medium mb-3">Institution</h3>
                <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                  {filterOptions.institutions.map(institution => (
                    <div key={institution} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`institution-${institution}`}
                        checked={selectedFilters.institution_name?.[institution] || false}
                        onChange={(e) => handleFilterChange('institution_name', institution, e.target.checked)}
                        className="h-4 w-4 text-brand-emerald focus:ring-brand-emerald border-gray-300 rounded"
                      />
                      <label htmlFor={`institution-${institution}`} className="ml-2 block text-text-secondary text-sm">
                        {institution}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Research Interests */}
              <div>
                <h3 className="text-text-primary font-medium mb-3">Research Interest</h3>
                <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                  {filterOptions.research_interests.map(interest => (
                    <div key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`interest-${interest}`}
                        checked={selectedFilters.research_interests?.[interest] || false}
                        onChange={(e) => handleFilterChange('research_interests', interest, e.target.checked)}
                        className="h-4 w-4 text-brand-emerald focus:ring-brand-emerald border-gray-300 rounded"
                      />
                      <label htmlFor={`interest-${interest}`} className="ml-2 block text-text-secondary text-sm">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="loading-spinner mb-4"></div>
            <p className="text-text-secondary">Loading researchers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg p-6">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 5.63a7 7 0 110 14 7 7 0 010-14z" />
              </svg>
            </div>
            <p className="text-text-primary font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-emerald text-white rounded-md hover:bg-brand-emerald-light transition-colors shadow-sm"
            >
              Retry
            </button>
          </div>
        ) : filteredResearchers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg p-6">
            <p className="text-text-secondary mb-4">No researchers found matching your criteria.</p>
            {(searchQuery || Object.values(activeFilters).some(values => values.length > 0)) && (
              <Button
                onClick={resetFilters}
                variant="primary"
                size="md"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-text-secondary mb-6 font-medium">Found {filteredResearchers.length} researchers</p>
            
            <div className="space-y-4">
              {getCurrentResearchers().map(researcher => (
                <Card 
                  key={researcher.id} 
                  className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-brand-emerald"
                  hover
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Profile Image or Placeholder */}
                    <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
                      <div className="bg-gradient-to-br from-brand-emerald to-brand-emerald-light rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold text-white shadow-sm">
                        {researcher.first_name ? researcher.first_name.charAt(0).toUpperCase() : '?'}
                      </div>
                    </div>
                    
                    {/* Researcher Info */}
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h2 className="text-xl font-semibold text-text-primary">
                          <Link to={`/researchers/${researcher.id}`} className="hover:text-brand-emerald transition-colors">
                            {researcher.academic_title ? `${researcher.academic_title} ` : ''}
                            {researcher.first_name || 'Researcher'} {researcher.last_name || ''}
                          </Link>
                          <ApprovalStatusBadge status={researcher.status} />
                        </h2>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-text-primary">
                          {researcher.institution_name && <span className="mr-3">{researcher.institution_name}</span>}
                          {researcher.department && <span className="text-text-secondary">({researcher.department})</span>}
                        </p>
                        {researcher.country && (
                          <p className="text-text-tertiary text-sm mt-1">
                            {researcher.city && `${researcher.city}, `}{researcher.country}
                          </p>
                        )}
                      </div>
                      
                      {researcher.research_interests && researcher.research_interests.length > 0 && (
                        <div className="mb-3">
                          <h3 className="text-sm font-medium text-text-secondary mb-1">Research Interests:</h3>
                          <div className="flex flex-wrap gap-2">
                            {researcher.research_interests.map((interest, index) => (
                              <span
                                key={index}
                                className="bg-brand-emerald bg-opacity-10 text-brand-emerald-dark px-2 py-1 rounded-full text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {researcher.bio && (
                        <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                          {researcher.bio}
                        </p>
                      )}
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          to={`/researchers/${researcher.id}`}
                          className="px-4 py-1.5 bg-brand-emerald hover:bg-brand-emerald-light text-white text-sm rounded-md shadow-sm transition-all duration-200"
                        >
                          View Profile
                        </Link>
                        <button
                          className="px-4 py-1.5 bg-white border border-brand-emerald text-brand-emerald hover:bg-brand-emerald hover:bg-opacity-10 text-sm rounded-md shadow-sm transition-all duration-200"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-l-md border border-r-0 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-text-tertiary cursor-not-allowed'
                        : 'bg-white text-text-primary hover:bg-gray-50 transition-colors'
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
                        className={`px-3 py-2 border-t border-b text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-brand-emerald text-white'
                            : 'bg-white text-text-primary hover:bg-gray-50 transition-colors'
                        } ${i !== 0 ? 'border-l' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-r-md border text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-text-tertiary cursor-not-allowed'
                        : 'bg-white text-text-primary hover:bg-gray-50 transition-colors'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ResearcherSearchPage;