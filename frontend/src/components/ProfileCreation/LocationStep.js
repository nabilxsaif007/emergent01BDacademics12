import React from 'react';

const LocationStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update the location object
    const updatedLocation = {
      ...formData.location,
      [name]: value
    };
    
    updateFormData({ location: updatedLocation });
  };

  // In a real application, this would use a proper map component
  // like Google Maps or Mapbox with geocoding functionality
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Location Information</h3>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
          Country *
        </label>
        <input
          id="country"
          name="country"
          type="text"
          value={formData.location?.country || ''}
          onChange={handleChange}
          placeholder="Your country"
          className={`w-full p-3 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country}</p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
          City *
        </label>
        <input
          id="city"
          name="city"
          type="text"
          value={formData.location?.city || ''}
          onChange={handleChange}
          placeholder="Your city"
          className={`w-full p-3 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="institution_address">
          Institution Address (Optional)
        </label>
        <textarea
          id="institution_address"
          name="institution_address"
          value={formData.location?.institution_address || ''}
          onChange={handleChange}
          rows="3"
          placeholder="Address of your institution"
          className="w-full p-3 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div className="mb-6">
        <p className="block text-gray-700 text-sm font-bold mb-2">Map Location</p>
        <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
          {/* In a real application, a map component would be integrated here */}
          <p className="text-gray-500">Map integration would be available here</p>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          In a production application, a map would be displayed here to select your precise location
        </p>
      </div>
    </div>
  );
};

export default LocationStep;