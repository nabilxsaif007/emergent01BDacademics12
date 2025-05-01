import React, { useState } from 'react';

const ResearchInterestsStep = ({ formData, updateFormData, errors }) => {
  const [interest, setInterest] = useState('');
  
  // Example research areas (would be fetched from API in a real application)
  const suggestedInterests = [
    "Machine Learning", "Data Science", "Artificial Intelligence",
    "Climate Change", "Renewable Energy", "Public Health", 
    "Sustainable Development", "Education Policy", "Urban Planning",
    "Agricultural Engineering", "Computer Vision", "Natural Language Processing",
    "Biomedical Engineering", "Molecular Biology", "Genetics",
    "Quantum Physics", "Mathematics", "Civil Engineering"
  ];
  
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };
  
  const handleAddInterest = () => {
    if (interest.trim() && !formData.research_interests.includes(interest.trim())) {
      const updatedInterests = [...formData.research_interests, interest.trim()];
      updateFormData({ research_interests: updatedInterests });
      setInterest('');
    }
  };
  
  const handleRemoveInterest = (interestToRemove) => {
    const updatedInterests = formData.research_interests.filter(
      (item) => item !== interestToRemove
    );
    updateFormData({ research_interests: updatedInterests });
  };
  
  const handleSuggestionClick = (suggestion) => {
    if (!formData.research_interests.includes(suggestion)) {
      const updatedInterests = [...formData.research_interests, suggestion];
      updateFormData({ research_interests: updatedInterests });
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Research Interests & Bio</h3>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Research Interests *
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Add a research interest"
            className="flex-grow p-3 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Add
          </button>
        </div>
        
        {errors.research_interests && (
          <p className="text-red-500 text-xs mt-1">{errors.research_interests}</p>
        )}
        
        {/* Display selected interests */}
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.research_interests.map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(item)}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {/* Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Suggested research areas:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedInterests.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`text-xs px-2 py-1 rounded-full ${
                  formData.research_interests.includes(suggestion)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={formData.research_interests.includes(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
          Research Bio *
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          rows="6"
          placeholder="Describe your research background, interests, and goals"
          className={`w-full p-3 border rounded-md ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
        ></textarea>
        {errors.bio && (
          <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          Minimum 50 characters. Write about your research focus, methodologies, and achievements.
        </p>
      </div>
    </div>
  );
};

export default ResearchInterestsStep;