import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AcademicsPage = ({ academics = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  
  // Get unique fields and countries for filters
  const fields = [...new Set(academics.map(a => a.field))].sort();
  const countries = [...new Set(academics.map(a => a.country))].sort();
  
  // Filter academics based on search and filters
  const filteredAcademics = academics.filter(academic => {
    const matchesSearch = searchTerm === '' || 
      academic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      academic.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      academic.field.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesField = selectedField === '' || academic.field === selectedField;
    const matchesCountry = selectedCountry === '' || academic.country === selectedCountry;
    
    return matchesSearch && matchesField && matchesCountry;
  });
  
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Academic Mentors Directory
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Browse our network of Bangladeshi academics working at institutions worldwide. Connect with experts in your field of interest.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl mb-8 border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-gray-300 text-sm font-medium mb-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, university..."
              className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="field" className="block text-gray-300 text-sm font-medium mb-2">
              Field of Study
            </label>
            <select
              id="field"
              value={selectedField}
              onChange={e => setSelectedField(e.target.value)}
              className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Fields</option>
              {fields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="country" className="block text-gray-300 text-sm font-medium mb-2">
              Country
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAcademics.length > 0 ? (
          filteredAcademics.map(academic => (
            <Link 
              key={academic.id} 
              to={`/academics/${academic.id}`}
              className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                    {academic.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white text-lg font-semibold">{academic.name}</h3>
                    <p className="text-blue-300">{academic.field}</p>
                    <p className="text-gray-400 text-sm">{academic.university}</p>
                    <p className="text-gray-500 text-sm">{academic.city}, {academic.country}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">No academics match your search criteria.</p>
            <button 
              onClick={() => { 
                setSearchTerm(''); 
                setSelectedField(''); 
                setSelectedCountry(''); 
              }}
              className="mt-4 px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicsPage;