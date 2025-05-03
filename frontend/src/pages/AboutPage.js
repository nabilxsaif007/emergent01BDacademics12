import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  // Stats for the about page
  const stats = [
    { label: "Academics", value: "350+", description: "Worldwide" },
    { label: "Countries", value: "25+", description: "Represented" },
    { label: "Universities", value: "120+", description: "Top institutions" },
    { label: "Research Fields", value: "40+", description: "Areas of expertise" }
  ];
  
  // Team members
  const team = [
    { name: "Dr. Rahim Ali", role: "Founder", university: "University of Oxford", image: "https://source.unsplash.com/random/300x300/?man,professional,1" },
    { name: "Prof. Nusrat Ahmed", role: "Co-Founder", university: "Stanford University", image: "https://source.unsplash.com/random/300x300/?woman,professional,1" },
    { name: "Dr. Kamal Hossain", role: "Scientific Director", university: "MIT", image: "https://source.unsplash.com/random/300x300/?man,professional,2" },
    { name: "Dr. Ayesha Khan", role: "Community Lead", university: "University of Cambridge", image: "https://source.unsplash.com/random/300x300/?woman,professional,2" }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 bg-white">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden border border-green-600 mb-16">
        <div className="absolute inset-0 bg-green-50 backdrop-filter backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/40 to-green-200/40"></div>
        
        {/* Animated particles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-300 rounded-full opacity-20 mix-blend-multiply blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-400 rounded-full opacity-20 mix-blend-multiply blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 mb-6 tracking-tight">
              About Bangladesh Academic Network
            </h1>
            <p className="text-xl text-green-700 mb-8 leading-relaxed">
              Connecting Bangladeshi academics across the globe with students and researchers seeking guidance and mentorship. Building bridges for knowledge transfer and collaboration.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/" className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center shadow-lg hover:shadow-green-700/30">
                <span>Explore Map</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <Link to="/academics" className="bg-transparent border border-green-500 text-green-600 py-3 px-8 rounded-lg hover:bg-green-50 transition-colors shadow-lg hover:shadow-green-700/30">
                Find Academics
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10"></div>
            <img 
              src="https://source.unsplash.com/random/800x600/?bangladesh,university" 
              alt="Bangladesh academics" 
              className="w-full h-full object-cover opacity-90 md:h-full transition-transform duration-10000 hover:scale-110"
            />
            
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-32 h-32 md:w-48 md:h-48 relative">
                <svg className="absolute animate-spin-slow opacity-80" width="100%" height="100%" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="128" cy="128" r="120" stroke="#22c55e" strokeWidth="8" strokeDasharray="16 32" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-24 md:w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-green-50 rounded-2xl"></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-green-300 rounded-full opacity-10 mix-blend-multiply blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-green-400 rounded-full opacity-10 mix-blend-multiply blur-2xl"></div>
        
        <div className="relative py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-12">Platform Statistics</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white backdrop-blur-xl rounded-xl border border-green-200 p-8 flex flex-col items-center text-center group transition-all duration-300 hover:border-green-500 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-green-700/20"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  {index === 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                </div>
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-xl font-medium text-green-800 mb-2">{stat.label}</div>
                <div className="text-green-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white backdrop-blur-sm rounded-xl overflow-hidden border border-green-100 shadow-sm">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Our Mission</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700">
                The Bangladesh Academic Mentor Network is an interactive platform that connects Bangladeshi academics and researchers worldwide with those seeking mentorship and guidance. Our mission is to create a robust network that facilitates knowledge transfer, collaboration, and mentorship opportunities.
              </p>
              <p className="text-gray-700">
                We believe that by providing easy access to Bangladeshi experts across various fields, we can inspire the next generation of scholars, foster cross-border collaborations, and contribute to the advancement of research and education in Bangladesh and beyond.
              </p>
              <p className="text-gray-700">
                The platform serves as a bridge, allowing students and early-career researchers to find mentors who share their cultural background and understand the unique challenges they face, while also providing established academics a way to give back to their community.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white backdrop-blur-sm rounded-xl overflow-hidden border border-green-100 shadow-sm">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Our Values</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-green-800">Accessibility</h3>
                </div>
                <p className="text-gray-700 ml-10">
                  Knowledge and mentorship should be accessible to all, regardless of location or resources.
                </p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-green-800">Community</h3>
                </div>
                <p className="text-gray-700 ml-10">
                  Fostering a global network of support and collaboration among Bangladeshi academics.
                </p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-green-800">Excellence</h3>
                </div>
                <p className="text-gray-700 ml-10">
                  Promoting academic excellence and innovation through mentorship and knowledge sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="bg-white backdrop-blur-sm rounded-xl overflow-hidden border border-green-100 shadow-sm mb-12">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 border border-green-200">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-2">1. Find a Mentor</h3>
              <p className="text-gray-700">
                Use our interactive globe to locate Bangladeshi academics in your field across the world.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 border border-green-200">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-2">2. Connect Directly</h3>
              <p className="text-gray-700">
                Reach out to academics through their contact information to discuss mentorship opportunities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 border border-green-200">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-2">3. Join the Network</h3>
              <p className="text-gray-700">
                If you're a Bangladeshi academic, create your profile to become part of our growing network.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="bg-white backdrop-blur-sm rounded-xl overflow-hidden border border-green-100 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:border-green-500">
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="text-green-800 font-bold text-lg">{member.name}</h3>
                <p className="text-green-600">{member.role}</p>
                <p className="text-gray-500 text-sm mt-1">{member.university}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="bg-white backdrop-blur-sm rounded-xl overflow-hidden border border-green-100 shadow-sm mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Contact Us</h2>
            <p className="text-gray-700 mb-6">
              Have questions or need assistance? Reach out to our team using the form or through our contact information.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-green-800 font-medium">Email</p>
                  <a href="mailto:contact@bdacademicnetwork.org" className="text-green-600 hover:text-green-700">
                    contact@bdacademicnetwork.org
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-green-800 font-medium">Location</p>
                  <p className="text-gray-700">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-green-800 mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h4.5c.5 0 .5-.297.5-.5v-5.5c0-.203-.203-.5-.5-.5h-2c-.297 0-.5-.297-.5-.5v-3c0-.203.203-.5.5-.5h2c.297 0 .5-.297.5-.5v-3.5c0-3.5 2-5.5 5.5-5.5h3.5c.297 0 .5.203.5.5v3c0 .203-.203.5-.5.5h-3.5c-.297 0-.5.297-.5.5v3c0 .203.203.5.5.5h3.5c.297 0 .5.297.469.594l-.5 3c-.031.297-.234.406-.469.406h-3c-.297 0-.5.297-.5.5v5.5c0 .203.203.5.5.5h7.5c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5z"/>
                  </svg>
                </a>
                <a href="#" className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-green-50">
            <form className="space-y-4">
              <div>
                <label className="block text-green-800 text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-green-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-green-800 text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  className="w-full bg-white border border-green-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-green-800 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  className="w-full bg-white border border-green-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors w-full"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center">
        <Link to="/" className="bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-8 rounded-full hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl inline-flex items-center">
          <span className="mr-2">Explore the Interactive Globe</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;