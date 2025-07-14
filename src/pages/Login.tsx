
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const [schoolUrl, setSchoolUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate URL format
      if (!schoolUrl.startsWith('https://')) {
        throw new Error('School URL must start with https://');
      }

      // In a real app, this would be an actual API call to the school's web app
      // For now, we'll simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store authentication data
      localStorage.setItem('authToken', 'sample-token-123');
      localStorage.setItem('schoolUrl', schoolUrl);
      localStorage.setItem('username', username);
      
      // Register for push notifications (would be implemented with FCM or similar)
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BLJ_PuA3-mBKvzT_2W3vp3XnTKe3nL8UjGEpMep-yWmHx4Gbu9irOJ1Sj-ScYGlolUgJTpVdmjx9ZbDXTl7bDQA' // This would be your actual VAPID public key
          });
          
          // In a real app, you would send this subscription to your server
          console.log('Push subscription successful:', subscription);
        } catch (err) {
          console.error('Push subscription failed:', err);
        }
      }

      toast({
        title: "Login successful",
        description: "You've been logged in to your school account.",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">SchoolConnect Login</CardTitle>
            <CardDescription className="text-center">
              Connect to your school's web application
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolUrl">School URL</Label>
                <Input
                  id="schoolUrl"
                  type="url"
                  placeholder="https://school.betterlink.app"
                  value={schoolUrl}
                  onChange={(e) => setSchoolUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full URL of your school's web application
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect to School"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;