
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bell, Smartphone, School, Users, Shield, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary-foreground/10 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Betterlink SchoolConnect
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Stay connected with your school's updates, even when you're on the go.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Bell className="h-10 w-10" />}
              title="Real-Time Notifications"
              description="Get instant alerts for homework, events, fees, and important school announcements."
            />
            
            <FeatureCard 
              icon={<Smartphone className="h-10 w-10" />}
              title="Mobile Companion"
              description="Works alongside your school's web app to keep you informed on your mobile device."
            />
            
            <FeatureCard 
              icon={<School className="h-10 w-10" />}
              title="School Integration"
              description="Connects to any school using the Betterlink web platform via a simple URL."
            />
            
            <FeatureCard 
              icon={<Users className="h-10 w-10" />}
              title="For Everyone"
              description="Designed for parents, teachers, students, and school administrators."
            />
            
            <FeatureCard 
              icon={<Shield className="h-10 w-10" />}
              title="Secure Access"
              description="Encrypted login and secure session management to protect your data."
            />
            
            <FeatureCard 
              icon={<Zap className="h-10 w-10" />}
              title="Offline Support"
              description="Notification queuing ensures you never miss important updates."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">1</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Download & Login</h3>
                <p className="text-muted-foreground">Download the app and log in with your existing school web app credentials.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">2</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Enter School URL</h3>
                <p className="text-muted-foreground">Connect to your school's instance by entering the web app URL.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">3</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Receive Notifications</h3>
                <p className="text-muted-foreground">Get real-time alerts for important school updates and activities.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">4</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Take Action</h3>
                <p className="text-muted-foreground">Tap notifications to open the relevant section in the web app view.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Stay Connected?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Never miss an important school update again. Get started with SchoolConnect today.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate('/login')}
          >
            Connect Now
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;