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
    <div className="fixed top-24 right-4 z-40">
      <button 
        onClick={togglePanel}
        className="bg-black bg-opacity-80 p-3 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all border border-blue-800 shadow-lg hover:shadow-blue-900/20"
        aria-label="Filter toggle"
      >
        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-14 right-0 w-72 md:w-80 bg-black bg-opacity-90 backdrop-blur-lg rounded-lg shadow-xl border border-blue-900 p-4 mt-2 animate-fade-in-up">
          <h3 className="text-white font-semibold mb-3">Filter Academics</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">Research Field</label>
              <select 
                name="field"
                value={filters.field}
                onChange={handleChange}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Field</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Medicine">Medicine</option>
                <option value="Physics">Physics</option>
                <option value="Bioengineering">Bioengineering</option>
                <option value="Environmental Science">Environmental Science</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block text-gray-300 text-sm mb-1">Country</label>
              <select 
                name="country"
                value={filters.country}
                onChange={handleChange}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Country</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Singapore">Singapore</option>
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">University</label>
              <input 
                type="text"
                name="university"
                value={filters.university}
                onChange={handleChange}
                placeholder="Type to filter..."
                className="w-full bg-gray-900 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    field: '',
                    country: '',
                    university: ''
                  });
                  onFilter({});
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
