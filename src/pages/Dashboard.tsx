
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, LogOut, MessageSquare, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import NotificationList from '@/components/NotificationList';
import WebViewFrame from '@/components/WebViewFrame';
import { useToast } from '@/components/ui/use-toast';
import { registerNotificationHandlers } from '@/services/notificationService';

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    title: 'New Homework Posted',
    message: 'Math homework due next Monday',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    type: 'homework',
    read: false,
    actionUrl: '/homework/123'
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    message: 'Scheduled for Friday at 4:00 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: 'event',
    read: true,
    actionUrl: '/calendar/meeting/456'
  },
  {
    id: '3',
    title: 'Fee Payment Due',
    message: 'School fees for Q3 are due by the end of this week',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: 'payment',
    read: false,
    actionUrl: '/payments/789'
  },
  {
    id: '4',
    title: 'Class Canceled',
    message: 'Science class is canceled tomorrow due to teacher illness',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    type: 'alert',
    read: false,
    actionUrl: '/schedule/changes'
  }
];

const Dashboard = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('notifications');
  const [schoolUrl, setSchoolUrl] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const storedSchoolUrl = localStorage.getItem('schoolUrl');
    const storedUsername = localStorage.getItem('username');
    
    if (storedSchoolUrl) setSchoolUrl(storedSchoolUrl);
    if (storedUsername) setUsername(storedUsername);
    
    // Register notification handlers
    const unregister = registerNotificationHandlers((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      
      toast({
        title: newNotification.title,
        description: newNotification.message,
      });
    });
    
    return () => {
      if (unregister) unregister();
    };
  }, [toast]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('schoolUrl');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    // Navigate to the specific section in the web app
    setActiveTab('webview');
    // In a real app, we would navigate to the specific URL within the webview
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">SchoolConnect</h1>
            {schoolUrl && (
              <Badge variant="outline" className="bg-primary-foreground/10 text-primary-foreground">
                {new URL(schoolUrl).hostname}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('notifications')}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('settings')}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="webview">Web App</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <NotificationList 
              notifications={notifications} 
              onNotificationClick={handleNotificationClick} 
            />
          </TabsContent>
          
          <TabsContent value="webview">
            <h2 className="text-2xl font-bold mb-4">School Web App</h2>
            {schoolUrl ? (
              <WebViewFrame url={schoolUrl} />
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <p>No school URL configured. Please log out and log in again.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p><strong>Username:</strong> {username}</p>
                  <p><strong>School URL:</strong> {schoolUrl}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Homework Notifications</span>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Message Notifications</span>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Event Notifications</span>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>Alert Notifications</span>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="destructive" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted p-4 text-center text-sm">
        <p>© 2025 Betterlink SchoolConnect</p>
      </footer>
    </div>
  );
};

export default Dashboard;