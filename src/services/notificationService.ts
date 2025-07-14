
import { supabase, Notification as NotificationType, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getUnreadNotificationCount } from '@/lib/supabase';

// Register the service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  } else {
    throw new Error('Service workers are not supported in this browser');
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support desktop notification');
  }

  let permission = Notification.permission;
  
  if (permission !== 'granted') {
    permission = await Notification.requestPermission();
  }
  
  return permission;
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (userId: string) => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if push is supported
    if (!registration.pushManager) {
      throw new Error('Push notifications are not supported');
    }
    
    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      ),
    });
    
    // Store the subscription on the server
    // In a real app, you would send this to your server
    console.log('Push subscription:', subscription);
    
    // For now, we'll just store it in localStorage
    localStorage.setItem('pushSubscription', JSON.stringify(subscription));
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
};

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Show a notification
export const showNotification = async (notification: NotificationType) => {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notification');
    return;
  }

  if (Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    
    registration.showNotification(notification.title, {
      body: notification.message,
      icon: '/icons/notification-icon.png',
      badge: '/icons/badge-icon.png',
      data: {
        url: notification.link || window.location.origin,
        notificationId: notification.id
      },
      tag: notification.id, // Prevents duplicate notifications
      renotify: true,
      actions: [
        {
          action: 'view',
          title: 'View',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        }
      ]
    });
  }
};

// Send a test notification
export const sendTestNotification = async (userId: string) => {
  try {
    const response = await fetch(`${supabase.functions.url}/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.getSession()}`
      },
      body: JSON.stringify({
        userId,
        title: 'Test Notification',
        message: 'This is a test notification from the SchoolConnect app.',
        link: window.location.origin,
        notificationType: 'alert',
        priority: 'normal'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send test notification');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
};

// Export the Supabase notification functions
export {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount
};