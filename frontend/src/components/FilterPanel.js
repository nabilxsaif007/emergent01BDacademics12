import React, { useState } from 'react';

const FilterPanel = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    field: '',
    country: '',
    university: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
    setIsOpen(false);
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-24 right-4 z-40 hidden">
      <button 
        onClick={togglePanel}
        className="filter-toggle-button bg-white p-3 rounded-full flex items-center justify-center transition-all border border-gray-200 shadow-md hover:shadow-lg"
        aria-label="Filter toggle"
      >
        <svg className="h-5 w-5 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-14 sm:right-0 sm:w-72 md:w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-5 mt-2 animate-dropdown-fade-in max-h-[90vh] overflow-y-auto sm:max-h-[80vh]" style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-semibold">Filter Academics</h3>
            <button 
              onClick={togglePanel}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filter panel"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Research Field</label>
              <select 
                name="field"
                value={filters.field}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
              >
                <option value="">All Fields</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Medicine">Medicine</option>
                <option value="Engineering">Engineering</option>
                <option value="Physics">Physics</option>
                <option value="Economics">Economics</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Country</label>
              <select 
                name="country"
                value={filters.country}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
              >
                <option value="">All Countries</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
                <option value="India">India</option>
              </select>
            </div>
            
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-1.5">University</label>
              <select 
                name="university"
                value={filters.university}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
              >
                <option value="">All Universities</option>
                <option value="BUET">BUET</option>
                <option value="MIT">MIT</option>
                <option value="Harvard">Harvard</option>
                <option value="Oxford">Oxford</option>
                <option value="Cambridge">Cambridge</option>
                <option value="Stanford">Stanford</option>
                <option value="NUS">NUS</option>
                <option value="IIT">IIT</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-coral-500 to-coral-400 hover:from-coral-600 hover:to-coral-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  const resetFilters = {
                    field: '',
                    country: '',
                    university: ''
                  };
                  setFilters(resetFilters);
                  onFilter(resetFilters);
                }}
                className="px-3 py-2.5 border border-gray-200 hover:border-coral-300 text-gray-700 hover:text-coral-500 rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
                style={{ fontFamily: "'Circular', 'Inter', -apple-system, sans-serif" }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
