import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD2ye0BEvMZZEMQ9LKQl6XQxLw7UiRZYXM'; // Mock API key for demonstration

const AcademicDetailPage = ({ academics = [] }) => {
  const { id } = useParams();
  const [academic, setAcademic] = useState(null);
  const navigate = useNavigate();
  
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
    // Find the academic by ID
    const foundAcademic = academics.find(a => a.id === parseInt(id));
    
    if (foundAcademic) {
      setAcademic(foundAcademic);
    }
  }, [id, academics]);
  
  if (!academic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-black bg-opacity-60 backdrop-blur-md p-8 rounded-xl border border-gray-800 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Academic Not Found</h2>
          <p className="text-gray-300 mb-6">The academic profile you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/academics"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Academics
          </Link>
        </div>
      </div>
    );
  }
  
  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px',
  };
  
  // Generate academic interests based on field
  const generateKeywords = (field) => {
    const baseKeywords = ['bangladesh', 'academic', 'research', 'mentor'];
    const fieldSpecificKeywords = {
      "Computer Science": ['artificial intelligence', 'machine learning', 'data science', 'algorithms'],
      "Medicine": ['epidemiology', 'clinical research', 'healthcare', 'medical science'],
      "Physics": ['quantum mechanics', 'theoretical physics', 'particle physics', 'astrophysics'],
      "Bioengineering": ['genetic engineering', 'biomaterials', 'tissue engineering', 'synthetic biology'],
      "Environmental Science": ['climate change', 'sustainability', 'ecology', 'conservation'],
      "Civil Engineering": ['structural engineering', 'urban planning', 'construction', 'infrastructure'],
      "Literature": ['comparative literature', 'literary theory', 'cultural studies', 'postcolonial studies'],
      "Robotics": ['automation', 'artificial intelligence', 'computer vision', 'mechanical engineering'],
      "Psychology": ['cognitive psychology', 'clinical psychology', 'behavioral science', 'neuroscience'],
      "Economics": ['development economics', 'international trade', 'macroeconomics', 'economic policy']
    };
    
    return [...baseKeywords, ...(fieldSpecificKeywords[field] || []), field.toLowerCase()];
  };
  
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to results
      </button>
      
      <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl h-32 w-32 flex items-center justify-center text-5xl font-bold text-white mb-6 md:mb-0 md:mr-8 flex-shrink-0">
              {academic.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              {/* Header with name and designation */}
              <div className="border-b border-gray-700 pb-5 mb-6">
                <h1 className="text-3xl font-bold text-white mb-1">{academic.name}</h1>
                <p className="text-blue-300 text-xl mb-2">{getDesignation(academic.field)} of {academic.field}</p>
                <p className="text-gray-400">{academic.university}</p>
                <p className="text-gray-500">{academic.city}, {academic.country}</p>
              </div>
              
              {/* About section with character limit */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-5 border border-gray-800">
                  <p className="text-gray-300">
                    {`${academic.name} is a ${academic.field} specialist at ${academic.university}. Their research focuses on advanced topics with real-world applications.`.substring(0, 150)}
                  </p>
                </div>
              </div>
              
              {/* Detailed Description section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-5 border border-gray-800">
                  <p className="text-gray-300">
                    {academic.name} is a {academic.field} researcher and {getDesignation(academic.field).toLowerCase()} at {academic.university}. 
                    {academic.country === 'Bangladesh' 
                      ? ' They are currently based in Bangladesh and are part of our network of academic mentors.'
                      : ` Originally from Bangladesh, they are currently working in ${academic.city}, ${academic.country}.`
                    }
                  </p>
                  <p className="text-gray-300 mt-4">
                    Their research focuses on advanced topics in {academic.field} with applications in both academic and industry settings. {academic.name.split(' ')[0]} has published numerous papers in reputable journals and is actively involved in mentoring students from Bangladesh.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Research Keywords Section */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Research Keywords</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {generateKeywords(academic.field).map((keyword, i) => (
                      <span key={i} className="bg-blue-900 bg-opacity-50 text-blue-200 px-3 py-1 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  {/* Contact Information */}
                  <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                  <div className="space-y-3 bg-gray-900 bg-opacity-50 rounded-lg p-5 border border-gray-800">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${academic.name.toLowerCase().replace(' ', '.')}@example.com`} className="text-blue-400 hover:text-blue-300">
                        {academic.name.toLowerCase().replace(' ', '.')}@example.com
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        University Website
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        Research Profile
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        Schedule a Meeting
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
                  <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700 mb-6">
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={{ lat: academic.lat, lng: academic.lng }}
                        zoom={10}
                        options={{
                          styles: [
                            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                            {
                              featureType: "administrative.locality",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#d59563" }],
                            },
                            {
                              featureType: "poi",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#d59563" }],
                            },
                            {
                              featureType: "poi.park",
                              elementType: "geometry",
                              stylers: [{ color: "#263c3f" }],
                            },
                            {
                              featureType: "poi.park",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#6b9a76" }],
                            },
                            {
                              featureType: "road",
                              elementType: "geometry",
                              stylers: [{ color: "#38414e" }],
                            },
                            {
                              featureType: "road",
                              elementType: "geometry.stroke",
                              stylers: [{ color: "#212a37" }],
                            },
                            {
                              featureType: "road",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#9ca5b3" }],
                            },
                            {
                              featureType: "road.highway",
                              elementType: "geometry",
                              stylers: [{ color: "#746855" }],
                            },
                            {
                              featureType: "road.highway",
                              elementType: "geometry.stroke",
                              stylers: [{ color: "#1f2835" }],
                            },
                            {
                              featureType: "road.highway",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#f3d19c" }],
                            },
                            {
                              featureType: "transit",
                              elementType: "geometry",
                              stylers: [{ color: "#2f3948" }],
                            },
                            {
                              featureType: "transit.station",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#d59563" }],
                            },
                            {
                              featureType: "water",
                              elementType: "geometry",
                              stylers: [{ color: "#17263c" }],
                            },
                            {
                              featureType: "water",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#515c6d" }],
                            },
                            {
                              featureType: "water",
                              elementType: "labels.text.stroke",
                              stylers: [{ color: "#17263c" }],
                            },
                          ],
                        }}
                      >
                        <Marker position={{ lat: academic.lat, lng: academic.lng }} />
                      </GoogleMap>
                    </LoadScript>
                    <div className="bg-gray-900 bg-opacity-80 px-4 py-3 text-center">
                      <p className="text-white font-medium">{academic.city}, {academic.country}</p>
                    </div>
                  </div>
                  
                  {/* City image visualization */}
                  <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700 h-48 relative">
                    <img 
                      src={`https://source.unsplash.com/featured/?${academic.city},skyline`} 
                      alt={`${academic.city} cityscape`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-white text-xl font-bold">{academic.city}</h3>
                      <p className="text-gray-300">{academic.country}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form Section */}
              <div className="mt-10 border-t border-gray-800 pt-10">
                <h2 className="text-xl font-semibold text-white mb-6">Contact {academic.name}</h2>
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        placeholder="Write your message here..."
                      ></textarea>
                    </div>
                  </div>
                  <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDetailPage;