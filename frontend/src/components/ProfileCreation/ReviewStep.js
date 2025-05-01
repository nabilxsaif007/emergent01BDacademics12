import React from 'react';

const ReviewStep = ({ formData, onSubmit, error }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Review Your Profile</h3>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Academic Title</p>
              <p className="font-medium">{formData.academic_title}</p>
            </div>
            {formData.profile_picture_url && (
              <div className="flex justify-end">
                <img 
                  src={formData.profile_picture_url} 
                  alt="Profile" 
                  className="h-20 w-20 object-cover rounded-full" 
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Academic Background</h4>
          <div className="mb-3">
            <p className="text-sm text-gray-600">Institution</p>
            <p className="font-medium">{formData.institution_name}</p>
          </div>
          <div className="mb-3">
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-medium">{formData.department}</p>
          </div>
          {formData.education && formData.education.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">Education</p>
              <ul className="list-disc list-inside">
                {formData.education.map((edu, index) => (
                  <li key={index} className="mt-1">
                    {edu.degree} in {edu.field}, {edu.institution} ({edu.year})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Research Interests & Bio</h4>
          <div className="mb-3">
            <p className="text-sm text-gray-600">Research Interests</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.research_interests.map((interest, index) => (
                <span key={index} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bio</p>
            <p className="mt-1">{formData.bio}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Location</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Country</p>
              <p className="font-medium">{formData.location.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">City</p>
              <p className="font-medium">{formData.location.city}</p>
            </div>
          </div>
          {formData.location.institution_address && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">Institution Address</p>
              <p className="mt-1">{formData.location.institution_address}</p>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h4>
          <div className="mb-3">
            <p className="text-sm text-gray-600">Contact Email</p>
            <p className="font-medium">{formData.contact_email}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formData.public_email ? 'Visible to all users' : 'Only visible through contact requests'}
            </p>
          </div>
          
          {Object.entries(formData.social_links).some(([_, value]) => value) && (
            <div>
              <p className="text-sm text-gray-600">Social & Professional Links</p>
              <ul className="mt-1">
                {formData.social_links.linkedin && (
                  <li className="text-emerald-600 hover:underline">
                    <a href={formData.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </li>
                )}
                {formData.social_links.twitter && (
                  <li className="text-emerald-600 hover:underline">
                    <a href={formData.social_links.twitter} target="_blank" rel="noopener noreferrer">
                      Twitter/X
                    </a>
                  </li>
                )}
                {formData.social_links.researchgate && (
                  <li className="text-emerald-600 hover:underline">
                    <a href={formData.social_links.researchgate} target="_blank" rel="noopener noreferrer">
                      ResearchGate
                    </a>
                  </li>
                )}
                {formData.social_links.orcid && (
                  <li className="text-emerald-600 hover:underline">
                    <a href={formData.social_links.orcid} target="_blank" rel="noopener noreferrer">
                      ORCID
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700">
          By submitting your profile, you agree to the terms and conditions of the Bangladesh Academic Network.
          Your profile will be visible to other researchers once it's verified and approved.
        </p>
      </div>
      
      <button
        type="button"
        onClick={onSubmit}
        className="w-full py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700"
      >
        Submit Profile
      </button>
    </div>
  );
};

export default ReviewStep;