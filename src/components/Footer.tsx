
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">BetterLink</span>
              <span className="text-xl font-bold ml-1">SchoolConnect</span>
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              The mobile notification companion for your school's web application. 
              Stay connected with real-time updates and never miss important information.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-base text-gray-600 hover:text-gray-900">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-base text-gray-600 hover:text-gray-900">
                  Get Started
                </Link>
              </li>
              <li>
                <a href="https://friendly-code-request-bot.lovable.app/" target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 hover:text-gray-900">
                  School Demo
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-500 text-center">
            &copy; {currentYear} BetterLink SchoolConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;