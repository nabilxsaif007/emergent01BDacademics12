import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, academics = [] }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Generate suggestions based on query
  useEffect(() => {
    if (query.trim().length > 1) {
      const lowercaseQuery = query.toLowerCase();
      const filteredSuggestions = academics
        .filter(
          academic => 
            academic.name.toLowerCase().includes(lowercaseQuery) ||
            academic.field.toLowerCase().includes(lowercaseQuery) ||
            academic.university.toLowerCase().includes(lowercaseQuery) ||
            academic.country.toLowerCase().includes(lowercaseQuery)
        )
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, academics]);

  // Handle clicks outside the suggestion box
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-xl px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            placeholder="Search academics, fields, or universities..."
            className="w-full py-3 px-6 bg-black bg-opacity-60 backdrop-blur-md border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none"
          >
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Search suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionRef}
            className="absolute top-full left-0 right-0 mt-2 bg-black bg-opacity-90 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg overflow-hidden z-20"
          >
            <ul>
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-700 last:border-0"
                >
                  <div className="flex items-start">
                    <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center text-white font-medium flex-shrink-0">
                      {suggestion.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">{suggestion.name}</p>
                      <p className="text-gray-400 text-sm">{suggestion.field} • {suggestion.university}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;