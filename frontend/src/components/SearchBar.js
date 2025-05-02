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
    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            placeholder="Search academics, fields, or universities..."
            className="w-full py-3.5 pl-12 pr-16 bg-white border border-gray-200 rounded-full shadow-md text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:ring-opacity-30 focus:border-brand-emerald transition-all"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-emerald">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-emerald p-2.5 rounded-full hover:bg-brand-emerald-light transition-colors focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:ring-offset-2 shadow-sm"
          >
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
        
        {/* Search suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-20 animate-fadeIn"
          >
            <ul>
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="bg-brand-emerald rounded-full h-9 w-9 flex items-center justify-center text-white font-medium flex-shrink-0 shadow-sm">
                      {suggestion.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-text-primary font-medium">{suggestion.name}</p>
                      <p className="text-text-tertiary text-sm">{suggestion.field} • {suggestion.university}</p>
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