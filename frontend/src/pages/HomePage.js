import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [stats, setStats] = useState({
    totalAcademics: 0,
    topFields: [],
    topCities: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get academics by field
        const fieldResponse = await axios.get(`${API}/stats/academics-by-field`);
        
        // Get academics by city
        const cityResponse = await axios.get(`${API}/stats/academics-by-city`);
        
        // Count total academics (approved ones only)
        const academicsResponse = await axios.get(`${API}/academics`);
        
        setStats({
          totalAcademics: academicsResponse.data.length,
          topFields: fieldResponse.data.slice(0, 5), // Top 5 fields
          topCities: cityResponse.data.slice(0, 5)   // Top 5 cities
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bangladesh Academic Mentor Network
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connecting Bangladeshi academics and researchers worldwide with those seeking mentorship and guidance
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/search"
              className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Find a Mentor
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition-colors"
            >
              Join as an Academic
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Growing Network</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalAcademics}</div>
              <div className="text-gray-600">Bangladeshi Academics</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.topFields.length > 0 ? stats.topFields.length : '...'}
              </div>
              <div className="text-gray-600">Research Fields</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.topCities.length > 0 ? stats.topCities.length : '...'}
              </div>
              <div className="text-gray-600">Global Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Find a Mentor</h3>
              <p className="text-gray-600">
                Search our interactive map to find Bangladeshi academics and researchers worldwide in your field of interest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Connect Directly</h3>
              <p className="text-gray-600">
                View their profiles and connect via email to discuss mentorship opportunities, research collaboration, or advice.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Join the Network</h3>
              <p className="text-gray-600">
                Are you a Bangladeshi academic abroad? Register to create your profile and help guide the next generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fields Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Research Fields</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.topFields.length > 0 ? (
              stats.topFields.map((field, index) => (
                <Link 
                  key={index} 
                  to={`/search?field=${encodeURIComponent(field.field)}`}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{field.field}</h3>
                  <p className="text-gray-600 mb-4">
                    {field.count} {field.count === 1 ? 'academic' : 'academics'}
                  </p>
                  <div className="text-blue-600 font-medium">Find mentors &rarr;</div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Loading popular research fields...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start exploring our network of Bangladeshi academics and researchers worldwide.
          </p>
          <Link
            to="/search"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Explore the Network
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
