import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { username } = await req.json();

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!TWITTER_BEARER_TOKEN) {
      console.error('Twitter Bearer Token not found');
      return new Response(JSON.stringify({ error: 'Twitter API not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Remove @ if present
    const cleanUsername = username.replace('@', '');

    // Fetch user data from Twitter API v2
    const twitterResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=id,name,username,description,public_metrics,profile_image_url,verified`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!twitterResponse.ok) {
      const error = await twitterResponse.text();
      console.error('Twitter API error:', error);
      
      if (twitterResponse.status === 404) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'Failed to fetch user data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const twitterData = await twitterResponse.json();
    
    if (!twitterData.data) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userData = {
      id: twitterData.data.id,
      username: twitterData.data.username,
      display_name: twitterData.data.name,
      description: twitterData.data.description || '',
      followers_count: twitterData.data.public_metrics?.followers_count || 0,
      following_count: twitterData.data.public_metrics?.following_count || 0,
      tweet_count: twitterData.data.public_metrics?.tweet_count || 0,
      avatar_url: twitterData.data.profile_image_url?.replace('_normal', '_400x400') || '',
      verified: twitterData.data.verified || false,
    };

    return new Response(JSON.stringify(userData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in twitter-user function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});