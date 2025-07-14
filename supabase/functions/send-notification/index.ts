
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method === 'POST') {
      const { userId, title, message, link, notificationType, priority } = await req.json()

      if (!userId || !title || !message || !notificationType) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        )
      }

      // Insert notification into database
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          link,
          notification_type: notificationType,
          priority: priority || 'normal'
        })
        .select()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        )
      }

      // In a real implementation, you would send a push notification to the user's device
      // using their device token stored in the users table
      // This would typically involve using a service like Firebase Cloud Messaging (FCM)

      return new Response(
        JSON.stringify({ success: true, notification: data[0] }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})