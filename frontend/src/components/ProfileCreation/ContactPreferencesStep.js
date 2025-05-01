import React from 'react';

const ContactPreferencesStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      updateFormData({ [name]: checked });
    } else {
      updateFormData({ [name]: value });
    }
  };
  
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    
    // Update social links object
    const updatedSocialLinks = {
      ...formData.social_links,
      [name]: value
    };
    
    updateFormData({ social_links: updatedSocialLinks });
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Contact Preferences</h3>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_email">
          Contact Email *
        </label>
        <input
          id="contact_email"
          name="contact_email"
          type="email"
          value={formData.contact_email || ''}
          onChange={handleChange}
          placeholder="Your preferred contact email"
          className={`w-full p-3 border rounded-md ${errors.contact_email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.contact_email && (
          <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex items-center">
          <input
            id="public_email"
            name="public_email"
            type="checkbox"
            checked={formData.public_email || false}
            onChange={handleChange}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700" htmlFor="public_email">
            Make my email publicly visible on my profile
          </label>
        </div>
        <p className="text-gray-500 text-xs mt-1 ml-6">
          If unchecked, other researchers will need to request permission to contact you
        </p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Social & Professional Links</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedin">
              LinkedIn
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.social_links?.linkedin || ''}
              onChange={handleSocialLinkChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="twitter">
              Twitter/X
            </label>
            <input
              id="twitter"
              name="twitter"
              type="url"
              value={formData.social_links?.twitter || ''}
              onChange={handleSocialLinkChange}
              placeholder="https://twitter.com/yourusername"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="researchgate">
              ResearchGate
            </label>
            <input
              id="researchgate"
              name="researchgate"
              type="url"
              value={formData.social_links?.researchgate || ''}
              onChange={handleSocialLinkChange}
              placeholder="https://researchgate.net/profile/yourprofile"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orcid">
              ORCID
            </label>
            <input
              id="orcid"
              name="orcid"
              type="url"
              value={formData.social_links?.orcid || ''}
              onChange={handleSocialLinkChange}
              placeholder="https://orcid.org/your-id"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPreferencesStep;