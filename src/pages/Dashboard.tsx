
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, LogOut, RefreshCw, CheckCheck } from 'lucide-react';
import NotificationList from '@/components/NotificationList';
import WebViewFrame from '@/components/WebViewFrame';
import { supabase, getCurrentUser, getUserProfile, User, Notification as NotificationType } from '@/lib/supabase';
import { 
  getNotifications, 
  markAllNotificationsAsRead, 
  getUnreadNotificationCount,
  registerServiceWorker,
  subscribeToPushNotifications,
  sendTestNotification
} from '@/services/notificationService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is logged in
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        // Get user profile
        const profile = await getUserProfile(currentUser.id);
        setUser(profile);

        // Register service worker
        await registerServiceWorker();

        // Subscribe to push notifications
        await subscribeToPushNotifications(currentUser.id);

        // Load notifications
        await loadNotifications(currentUser.id);
      } catch (error) {
        console.error('Error initializing app:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (event === 'SIGNED_IN' && session) {
          const profile = await getUserProfile(session.user.id);
          setUser(profile);
          await loadNotifications(session.user.id);
        }
      }
    );

    // Set up notification refresh interval
    const refreshInterval = setInterval(() => {
      if (user) {
        loadNotifications(user.id);
      }
    }, 60000); // Refresh every minute

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [navigate]);

  const loadNotifications = async (userId: string) => {
    try {
      const notificationData = await getNotifications(userId);
      setNotifications(notificationData);
      
      const count = await getUnreadNotificationCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      await loadNotifications(user.id);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      await loadNotifications(user.id);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSendTestNotification = async () => {
    if (!user) return;
    
    try {
      await sendTestNotification(user.id);
      setTimeout(() => {
        handleRefresh();
      }, 1000);
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">SchoolConnect</h1>
            {user && (
              <span className="ml-4 text-sm text-gray-500 truncate max-w-[200px]">
                {user.school_url}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="notifications" className="relative">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 absolute -top-2 -right-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="webview">School Web App</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              {activeTab === 'notifications' && (
                <>
                  <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSendTestNotification}>
                    <Bell className="h-4 w-4 mr-2" />
                    Test Notification
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <TabsContent value="notifications" className="mt-2">
            <NotificationList 
              notifications={notifications} 
              onNotificationsChange={() => user && loadNotifications(user.id)} 
            />
          </TabsContent>
          
          <TabsContent value="webview" className="mt-2">
            {user && <WebViewFrame url={user.school_url} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;