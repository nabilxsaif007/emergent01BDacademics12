import React, { useState } from 'react';

const AcademicBackgroundStep = ({ formData, updateFormData, errors }) => {
  const [education, setEducation] = useState(formData.education || []);
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    field: '',
    year: ''
  });

  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleEducationChange = (e) => {
    setNewEducation({
      ...newEducation,
      [e.target.name]: e.target.value
    });
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.year) {
      const updatedEducation = [...education, { ...newEducation, id: Date.now() }];
      setEducation(updatedEducation);
      updateFormData({ education: updatedEducation });
      
      // Reset form
      setNewEducation({
        degree: '',
        institution: '',
        field: '',
        year: ''
      });
    }
  };

  const removeEducation = (id) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    setEducation(updatedEducation);
    updateFormData({ education: updatedEducation });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Academic Background</h3>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="institution_name">
          Current Institution *
        </label>
        <input
          id="institution_name"
          name="institution_name"
          type="text"
          value={formData.institution_name || ''}
          onChange={handleChange}
          placeholder="University or Research Institution"
          className={`w-full p-3 border rounded-md ${errors.institution_name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.institution_name && (
          <p className="text-red-500 text-xs mt-1">{errors.institution_name}</p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
          Department/Faculty *
        </label>
        <input
          id="department"
          name="department"
          type="text"
          value={formData.department || ''}
          onChange={handleChange}
          placeholder="Department or Faculty"
          className={`w-full p-3 border rounded-md ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.department && (
          <p className="text-red-500 text-xs mt-1">{errors.department}</p>
        )}
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Education History</h4>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="degree">
                Degree
              </label>
              <input
                id="degree"
                name="degree"
                type="text"
                value={newEducation.degree}
                onChange={handleEducationChange}
                placeholder="Ph.D., Masters, etc."
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="text"
                value={newEducation.year}
                onChange={handleEducationChange}
                placeholder="Year of completion"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="institution">
                Institution
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                value={newEducation.institution}
                onChange={handleEducationChange}
                placeholder="University name"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field">
                Field of Study
              </label>
              <input
                id="field"
                name="field"
                type="text"
                value={newEducation.field}
                onChange={handleEducationChange}
                placeholder="Field of study"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addEducation}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Add Education
          </button>
        </div>
        
        {education.length > 0 && (
          <div className="mt-4">
            <h5 className="text-md font-medium text-gray-800 mb-2">Education Entries</h5>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between bg-white p-3 border border-gray-200 rounded-md">
                  <div>
                    <p className="font-medium">{edu.degree} in {edu.field}</p>
                    <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicBackgroundStep;