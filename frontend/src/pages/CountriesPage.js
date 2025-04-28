import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CountriesPage = ({ academics = [] }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  useEffect(() => {
    setLoading(true);
    
    // Ensure we have data to work with
    if (!academics || academics.length === 0) {
      console.log("No academics data available for Countries page");
      
      // Set some mock data if no academics are available
      const mockCountries = [
        {
          name: "Bangladesh",
          count: 5,
          flag: "🇧🇩",
          academics: Array(5).fill().map((_, i) => ({
            id: 100 + i,
            name: `Dr. Academic ${i+1}`,
            field: "Computer Science",
            university: "University of Dhaka",
            city: "Dhaka"
          }))
        },
        {
          name: "USA",
          count: 4,
          flag: "🇺🇸",
          academics: Array(4).fill().map((_, i) => ({
            id: 200 + i,
            name: `Dr. Academic ${i+6}`,
            field: "Physics",
            university: "MIT",
            city: "Cambridge"
          }))
        },
        {
          name: "UK",
          count: 3,
          flag: "🇬🇧",
          academics: Array(3).fill().map((_, i) => ({
            id: 300 + i,
            name: `Dr. Academic ${i+10}`,
            field: "Medicine",
            university: "Oxford University",
            city: "Oxford"
          }))
        },
        {
          name: "Canada",
          count: 2,
          flag: "🇨🇦",
          academics: Array(2).fill().map((_, i) => ({
            id: 400 + i,
            name: `Dr. Academic ${i+13}`,
            field: "Environmental Science",
            university: "University of Toronto",
            city: "Toronto"
          }))
        },
        {
          name: "Australia",
          count: 2,
          flag: "🇦🇺",
          academics: Array(2).fill().map((_, i) => ({
            id: 500 + i,
            name: `Dr. Academic ${i+15}`,
            field: "Marine Biology",
            university: "University of Sydney",
            city: "Sydney"
          }))
        },
        {
          name: "Singapore",
          count: 1,
          flag: "🇸🇬",
          academics: [
            {
              id: 600,
              name: "Dr. Academic 17",
              field: "Physics",
              university: "National University of Singapore",
              city: "Singapore"
            }
          ]
        },
        {
          name: "Japan",
          count: 1,
          flag: "🇯🇵",
          academics: [
            {
              id: 700,
              name: "Dr. Academic 18",
              field: "Robotics",
              university: "University of Tokyo",
              city: "Tokyo"
            }
          ]
        }
      ];
      
      setCountries(mockCountries);
      setSelectedCountry(mockCountries[0]);
      setLoading(false);
      return;
    }
    
    // Function to get flag emoji for country
    const getCountryFlag = (countryName) => {
      const flags = {
        "Bangladesh": "🇧🇩",
        "USA": "🇺🇸",
        "UK": "🇬🇧",
        "Australia": "🇦🇺",
        "Singapore": "🇸🇬",
        "Canada": "🇨🇦",
        "France": "🇫🇷",
        "Japan": "🇯🇵",
        "UAE": "🇦🇪",
        "India": "🇮🇳",
        "China": "🇨🇳",
        "Sweden": "🇸🇪",
        "Russia": "🇷🇺"
      };
      
      return flags[countryName] || "🌐";
    };
    
    // Get unique countries and count academics in each
    const countryData = academics.reduce((acc, academic) => {
      const country = academic.country;
      if (!acc[country]) {
        acc[country] = {
          name: country,
          flag: getCountryFlag(country),
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
    
    setLoading(false);
  }, [academics]);
  
  // Filter countries by search query
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Create stats for country visualization
  const countryStats = countries.length > 0 
    ? {
        totalCountries: countries.length,
        totalAcademics: countries.reduce((sum, country) => sum + country.count, 0),
        topCountry: countries[0]?.name,
        continents: ["Asia", "North America", "Europe", "Oceania"]
      }
    : null;
  
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Global Academic Presence
          </h1>
          <p className="text-gray-300">
            Explore Bangladeshi academics across {countries.length} countries worldwide
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
      
      {/* Stats Cards */}
      {countryStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-800 p-5 flex flex-col justify-between">
            <div className="text-gray-400 text-sm font-medium">Countries</div>
            <div className="text-3xl font-bold text-white mt-2">{countryStats.totalCountries}</div>
            <div className="text-blue-400 text-sm mt-2">Across 4 continents</div>
          </div>
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-800 p-5 flex flex-col justify-between">
            <div className="text-gray-400 text-sm font-medium">Academics</div>
            <div className="text-3xl font-bold text-white mt-2">{countryStats.totalAcademics}</div>
            <div className="text-blue-400 text-sm mt-2">In global institutions</div>
          </div>
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-800 p-5 flex flex-col justify-between">
            <div className="text-gray-400 text-sm font-medium">Top Country</div>
            <div className="text-3xl font-bold text-white mt-2">{countryStats.topCountry}</div>
            <div className="text-blue-400 text-sm mt-2">{countries[0]?.count} academics</div>
          </div>
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-800 p-5 flex flex-col justify-between">
            <div className="text-gray-400 text-sm font-medium">Coverage</div>
            <div className="text-3xl font-bold text-white mt-2">Global</div>
            <div className="text-blue-400 text-sm mt-2">6 continents represented</div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Country List */}
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 h-fit">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-white font-semibold">Countries</h2>
            <div className="text-sm text-gray-400">{countries.length} total</div>
          </div>
          
          {/* Search input */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search countries..."
                className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="p-4 max-h-96 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                <ul className="space-y-2">
                  {filteredCountries.map(country => (
                    <li key={country.name}>
                      <button
                        onClick={() => setSelectedCountry(country)}
                        className={`w-full text-left px-3 py-3 rounded-lg flex items-center ${
                          selectedCountry?.name === country.name
                            ? 'bg-blue-900 bg-opacity-50 border border-blue-700 text-white'
                            : 'text-gray-300 hover:bg-gray-800 border border-transparent'
                        }`}
                      >
                        <span className="text-xl mr-3">{country.flag}</span>
                        <span className="flex-1">{country.name}</span>
                        <span className="bg-gray-800 text-gray-300 rounded-full px-2 py-1 text-xs">
                          {country.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No countries match your search
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Country Details */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 p-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedCountry ? (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">{selectedCountry.flag}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        {selectedCountry.name}
                        <span className="ml-4 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                          {selectedCountry.count} {selectedCountry.count === 1 ? 'Academic' : 'Academics'}
                        </span>
                      </h2>
                      <p className="text-gray-400 mt-1">
                        {selectedCountry.name === 'Bangladesh' 
                          ? `Academics currently working in Bangladesh at various prestigious institutions.`
                          : `Bangladeshi academics working in ${selectedCountry.name} at various prestigious institutions.`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <img 
                      src={`https://source.unsplash.com/featured/?${selectedCountry.name},flag`}
                      alt={`${selectedCountry.name} flag`}
                      className="h-16 w-24 object-cover rounded-md shadow-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCountry.academics.map(academic => (
                    <Link 
                      key={academic.id} 
                      to={`/academics/${academic.id}`}
                      className="bg-gray-900 bg-opacity-60 rounded-lg p-4 border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all"
                    >
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                          {academic.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-white font-medium">{academic.name}</h3>
                          <p className="text-blue-300 text-sm">{getDesignation(academic.field)}</p>
                          <div className="mt-1 pt-1 border-t border-gray-700">
                            <p className="text-gray-400 text-sm">{academic.field}</p>
                            <p className="text-gray-500 text-sm">{academic.university}</p>
                            <div className="flex items-center mt-1">
                              <svg className="h-4 w-4 text-gray-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p className="text-gray-600 text-sm">{academic.city}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 p-12 flex items-center justify-center">
              <div className="text-center">
                <svg className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400">Select a country to view details of academics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountriesPage;