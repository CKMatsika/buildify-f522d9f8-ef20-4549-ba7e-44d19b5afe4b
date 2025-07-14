
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">BetterLink</span>
              <span className="text-xl font-bold ml-1">SchoolConnect</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Home
            </Link>
            {isLoggedIn && (
              <Link to="/dashboard" className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Dashboard
              </Link>
            )}
          </nav>
          
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/login?tab=signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;