import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CountriesPage = ({ academics = [] }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  useEffect(() => {
    // Get unique countries and count academics in each
    const countryData = academics.reduce((acc, academic) => {
      const country = academic.country;
      if (!acc[country]) {
        acc[country] = {
          name: country,
          count: 0,
          academics: []
        };
      }
      acc[country].count += 1;
      acc[country].academics.push(academic);
      return acc;
    }, {});
    
    // Convert to array and sort by count (descending)
    const countriesArray = Object.values(countryData).sort((a, b) => b.count - a.count);
    setCountries(countriesArray);
    
    // Auto-select Bangladesh if exists
    const bangladeshData = countriesArray.find(c => c.name === 'Bangladesh');
    if (bangladeshData) {
      setSelectedCountry(bangladeshData);
    } else if (countriesArray.length > 0) {
      setSelectedCountry(countriesArray[0]);
    }
  }, [academics]);
  
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Countries with Bangladeshi Academics
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore Bangladeshi academics by country. Our network spans across the globe, with researchers and professors in various prestigious institutions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Country List */}
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 h-fit">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-white font-semibold">Countries</h2>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {countries.map(country => (
                <li key={country.name}>
                  <button
                    onClick={() => setSelectedCountry(country)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                      selectedCountry?.name === country.name
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span>{country.name}</span>
                    <span className="bg-gray-800 text-gray-300 rounded-full px-2 py-1 text-xs">
                      {country.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Country Details */}
        <div className="lg:col-span-3">
          {selectedCountry ? (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  {selectedCountry.name}
                  <span className="ml-4 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                    {selectedCountry.count} {selectedCountry.count === 1 ? 'Academic' : 'Academics'}
                  </span>
                </h2>
                <p className="text-gray-400 mt-2">
                  {selectedCountry.name === 'Bangladesh' 
                    ? `Academics currently working in Bangladesh at various prestigious institutions.`
                    : `Bangladeshi academics working in ${selectedCountry.name} at various prestigious institutions.`
                  }
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCountry.academics.map(academic => (
                    <Link 
                      key={academic.id} 
                      to={`/academics/${academic.id}`}
                      className="bg-gray-900 bg-opacity-60 rounded-lg p-4 hover:border-blue-500 transition-colors border border-gray-700"
                    >
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-10 w-10 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                          {academic.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-white font-medium">{academic.name}</h3>
                          <p className="text-blue-300 text-sm">{academic.field}</p>
                          <p className="text-gray-400 text-sm">{academic.university}</p>
                          <p className="text-gray-500 text-sm">{academic.city}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 p-6 flex items-center justify-center h-64">
              <p className="text-gray-400">Select a country to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountriesPage;