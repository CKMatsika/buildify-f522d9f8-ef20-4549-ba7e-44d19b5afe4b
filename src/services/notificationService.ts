
// This service handles push notification registration and processing

// Type definition for notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'homework' | 'event' | 'payment' | 'alert' | 'message';
  read: boolean;
  actionUrl?: string;
}

// Function to register service worker for push notifications
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  console.warn('Service Workers are not supported in this browser');
  return null;
};

// Function to request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }
  
  if (Notification.permission !== 'granted') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
};

// Function to subscribe to push notifications
export const subscribeToPushNotifications = async (
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // In a real app, this would be your actual VAPID public key
      applicationServerKey: 'BLJ_PuA3-mBKvzT_2W3vp3XnTKe3nL8UjGEpMep-yWmHx4Gbu9irOJ1Sj-ScYGlolUgJTpVdmjx9ZbDXTl7bDQA'
    });
    
    console.log('User is subscribed to push notifications:', subscription);
    
    // In a real app, you would send this subscription to your server
    // sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
};

// Function to handle incoming notifications
export const registerNotificationHandlers = (
  onNotification: (notification: Notification) => void
): (() => void) | undefined => {
  if (!('serviceWorker' in navigator)) {
    return undefined;
  }
  
  // Listen for messages from service worker
  const messageHandler = (event: MessageEvent) => {
    if (event.data && event.data.type === 'NOTIFICATION') {
      const notification: Notification = {
        id: event.data.id || Date.now().toString(),
        title: event.data.title,
        message: event.data.message,
        timestamp: event.data.timestamp || new Date().toISOString(),
        type: event.data.notificationType || 'message',
        read: false,
        actionUrl: event.data.actionUrl
      };
      
      onNotification(notification);
    }
  };
  
  navigator.serviceWorker.addEventListener('message', messageHandler);
  
  // Return a function to unregister the handler
  return () => {
    navigator.serviceWorker.removeEventListener('message', messageHandler);
  };
};

// Function to simulate receiving a push notification (for testing)
export const simulateIncomingNotification = (
  onNotification: (notification: Notification) => void
): void => {
  const notificationTypes: Array<Notification['type']> = [
    'homework', 'event', 'payment', 'alert', 'message'
  ];
  
  const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
  
  const titles = {
    homework: 'New Homework Assignment',
    event: 'Upcoming School Event',
    payment: 'Payment Reminder',
    alert: 'Important School Alert',
    message: 'New Message Received'
  };
  
  const messages = {
    homework: 'You have a new homework assignment due next week.',
    event: 'There is a school event scheduled for tomorrow.',
    payment: 'Your school fee payment is due this Friday.',
    alert: 'Classes will be dismissed early today due to weather.',
    message: 'You have received a new message from your teacher.'
  };
  
  const notification: Notification = {
    id: Date.now().toString(),
    title: titles[randomType],
    message: messages[randomType],
    timestamp: new Date().toISOString(),
    type: randomType,
    read: false,
    actionUrl: `/action/${randomType}`
  };
  
  onNotification(notification);
};