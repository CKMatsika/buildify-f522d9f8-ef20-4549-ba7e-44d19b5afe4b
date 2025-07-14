
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, BookOpen, CreditCard, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'homework' | 'event' | 'payment' | 'alert' | 'message';
  read: boolean;
  actionUrl?: string;
}

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onNotificationClick 
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No notifications</h3>
        <p className="text-muted-foreground">You're all caught up!</p>
      </div>
    );
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'homework':
        return <BookOpen className="h-5 w-5" />;
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'payment':
        return <CreditCard className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'message':
        return <Bell className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'homework':
        return 'bg-blue-100 text-blue-800';
      case 'event':
        return 'bg-purple-100 text-purple-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'message':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card 
          key={notification.id}
          className={cn(
            "cursor-pointer transition-colors hover:bg-muted/50",
            !notification.read && "border-l-4 border-primary"
          )}
          onClick={() => onNotificationClick(notification)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={cn("p-2 rounded-full", getNotificationColor(notification.type))}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className={cn("font-medium", !notification.read && "font-bold")}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                {!notification.read && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    New
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;