
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Never Miss Important School Updates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Betterlink SchoolConnect keeps you connected to your school's web app with real-time notifications, even when you're not logged in.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={handleGetStarted}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('https://friendly-code-request-bot.lovable.app/', '_blank')}>
                Visit School Demo
              </Button>
            </div>
            
            <div className="mt-12 bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Real-Time School Notifications</h3>
                  <p className="text-gray-600">
                    Get instant alerts for homework, events, messages, and more directly on your mobile device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Notifications</h3>
                <p className="text-gray-600">
                  Receive instant alerts for homework, events, messages, and important school announcements.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Connection</h3>
                <p className="text-gray-600">
                  Securely connect to your school's web app with your existing credentials and URL.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Integrated Web View</h3>
                <p className="text-gray-600">
                  Access your school's web app directly within the application for a seamless experience.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Offline Support</h3>
                <p className="text-gray-600">
                  View previously loaded notifications even when you're offline, with automatic syncing when you reconnect.
                </p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Action-Based Design</h3>
                <p className="text-gray-600">
                  Take immediate action on notifications with direct links to relevant sections of your school's web app.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Stay Connected?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of parents, teachers, and students who never miss important school updates.
            </p>
            <Button size="lg" onClick={handleGetStarted}>
              Get Started Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;