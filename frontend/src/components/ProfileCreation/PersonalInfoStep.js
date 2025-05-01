import React from 'react';

const PersonalInfoStep = ({ formData, updateFormData, errors }) => {
  const academicTitles = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Senior Lecturer",
    "Lecturer",
    "Research Fellow",
    "Post-doctoral Researcher",
    "PhD Candidate",
    "Other"
  ];

  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        updateFormData({ profile_picture_url: reader.result });
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="academic_title">
          Academic Title *
        </label>
        <select
          id="academic_title"
          name="academic_title"
          value={formData.academic_title}
          onChange={handleChange}
          className={`w-full p-3 border rounded-md ${errors.academic_title ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select your academic title</option>
          {academicTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
        {errors.academic_title && (
          <p className="text-red-500 text-xs mt-1">{errors.academic_title}</p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_picture">
          Profile Picture
        </label>
        <div className="flex items-center space-x-6">
          <div className="shrink-0">
            {formData.profile_picture_url ? (
              <img
                className="h-16 w-16 object-cover rounded-full"
                src={formData.profile_picture_url}
                alt="Profile preview"
              />
            ) : (
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-50 file:text-emerald-700
                hover:file:bg-emerald-100
              "
            />
          </label>
        </div>
        <p className="text-gray-500 text-xs mt-1">Upload a professional profile picture (optional)</p>
      </div>
    </div>
  );
};

export default PersonalInfoStep;