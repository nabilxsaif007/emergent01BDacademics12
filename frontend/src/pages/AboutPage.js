import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">About Our Network</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Connecting Bangladeshi academics worldwide with aspiring students and researchers
        </p>
      </div>
      
      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 mb-12">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-gray-300 mb-4">
            The Bangladesh Academic Mentor Network is an interactive platform that connects Bangladeshi academics and researchers worldwide with those seeking mentorship and guidance. Our mission is to create a robust network that facilitates knowledge transfer, collaboration, and mentorship opportunities.
          </p>
          <p className="text-gray-300 mb-4">
            We believe that by providing easy access to Bangladeshi experts across various fields, we can inspire the next generation of scholars, foster cross-border collaborations, and contribute to the advancement of research and education in Bangladesh and beyond.
          </p>
          <p className="text-gray-300">
            The platform serves as a bridge, allowing students and early-career researchers to find mentors who share their cultural background and understand the unique challenges they face, while also providing established academics a way to give back to their community.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
            <ul className="space-y-6">
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Find a Mentor</h3>
                  <p className="text-gray-300">
                    Use our interactive globe or search functionality to locate Bangladeshi academics in your field of interest across the world.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Connect Directly</h3>
                  <p className="text-gray-300">
                    Reach out to academics through their provided contact information to discuss potential mentorship or collaboration.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Join the Network</h3>
                  <p className="text-gray-300">
                    If you're a Bangladeshi academic, create your profile to become part of our growing network and help guide the next generation.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Our Values</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Accessibility</h3>
                <p className="text-gray-300">
                  We believe knowledge and mentorship should be accessible to all, regardless of location or resources. Our platform breaks down geographical barriers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Community</h3>
                <p className="text-gray-300">
                  We foster a sense of community among Bangladeshi academics globally, creating a network of support and collaboration.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Excellence</h3>
                <p className="text-gray-300">
                  We promote academic excellence and innovation by connecting those seeking knowledge with those who can guide them effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 mb-12">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
          <p className="text-gray-300 mb-6">
            If you have any questions, suggestions, or need assistance, please feel free to reach out to our team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium text-white mb-4">Get in Touch</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <a href="mailto:contact@bdacademicnetwork.org" className="text-blue-400 hover:text-blue-300">
                      contact@bdacademicnetwork.org
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">Location</p>
                    <p className="text-gray-300">Dhaka, Bangladesh</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-blue-600 text-white p-3 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-600 text-white p-3 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-600 text-white p-3 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h4.5c.5 0 .5-.297.5-.5v-5.5c0-.203-.203-.5-.5-.5h-2c-.297 0-.5-.297-.5-.5v-3c0-.203.203-.5.5-.5h2c.297 0 .5-.297.5-.5v-3.5c0-3.5 2-5.5 5.5-5.5h3.5c.297 0 .5.203.5.5v3c0 .203-.203.5-.5.5h-3.5c-.297 0-.5.297-.5.5v3c0 .203.203.5.5.5h3.5c.297 0 .5.297.469.594l-.5 3c-.031.297-.234.406-.469.406h-3c-.297 0-.5.297-.5.5v5.5c0 .203.203.5.5.5h7.5c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-600 text-white p-3 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link to="/" className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
          Explore the Network
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;