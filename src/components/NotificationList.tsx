
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, MessageSquare, CreditCard, AlertTriangle, CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import { Notification as NotificationType, markNotificationAsRead, deleteNotification } from '@/lib/supabase';
import { format, formatDistanceToNow } from 'date-fns';

interface NotificationListProps {
  notifications: NotificationType[];
  onNotificationsChange: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onNotificationsChange 
}) => {
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      onNotificationsChange();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      onNotificationsChange();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'homework':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
        <p className="mt-1 text-sm text-gray-500">
          You're all caught up! Check back later for new notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`transition-all ${!notification.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                {getNotificationIcon(notification.notification_type)}
                <CardTitle className="text-lg">
                  {notification.title}
                </CardTitle>
              </div>
              {getPriorityBadge(notification.priority)}
            </div>
            <CardDescription className="flex justify-between items-center">
              <span>{formatDate(notification.created_at)}</span>
              <span className="text-xs">{getTimeAgo(notification.created_at)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{notification.message}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex space-x-2">
              {!notification.is_read && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
              )}
              {notification.link && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(notification.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </Button>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(notification.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;