
import { createClient } from '@supabase/supabase-js';

// Use the environment variables from the project
const supabaseUrl = 'https://bkdsmabwjubylpoddfxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZHNtYWJ3anVieWxwb2RkZnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzY0OTYsImV4cCI6MjA2ODA1MjQ5Nn0.PAyP9d-Y6_ublPeiw1Ofx72ikBIzzoFbxoBiffpuxyA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type User = {
  id: string;
  email: string;
  school_url: string;
  created_at: string;
  last_login: string;
  device_token?: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  notification_type: 'homework' | 'event' | 'message' | 'payment' | 'alert';
  priority: 'low' | 'normal' | 'high';
};

// Authentication functions
export const signUp = async (email: string, password: string, schoolUrl: string) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  if (authData.user) {
    // Create a user record in our users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        school_url: schoolUrl,
      });

    if (userError) throw userError;
  }

  return authData;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Update last login time
  if (data.user) {
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// Get user profile data
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
};

// Update device token for push notifications
export const updateDeviceToken = async (userId: string, deviceToken: string) => {
  const { error } = await supabase
    .from('users')
    .update({ device_token: deviceToken })
    .eq('id', userId);

  if (error) throw error;
};

// Notification functions
export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Notification[];
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
};

export const deleteNotification = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
};

export const getUnreadNotificationCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
};