import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bangladesh Academic Network</h3>
            <p className="text-gray-300">
              Connecting Bangladeshi academics and researchers worldwide with those seeking mentorship and guidance.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-white">Find Mentors</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              If you have any questions or need assistance, please contact us at:
            </p>
            <p className="text-gray-300 mt-2">
              <a href="mailto:contact@bangladeshacademics.org" className="hover:text-white">
                contact@bangladeshacademics.org
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} Bangladesh Academic Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
