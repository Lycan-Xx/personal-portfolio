/**
 * YouTube Data API Proxy for Cloudflare Pages
 * Handles YouTube API requests to avoid CORS issues and hide API keys
 * 
 * Usage: GET /api/youtube/videos?channelId=...&maxResults=3
 */

// YouTube Data API endpoint
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Cloudflare Pages Function handler
 * @param {Request} request - The incoming request
 * @param {Object} context - Cloudflare Pages function context
 */
export async function onRequest(request) {
  // Only handle GET requests
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get the YouTube API key from environment variables
    const apiKey = process.env.YOUTUBE_API_KEY
      || process.env.VITE_YOUTUBE_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'YouTube API key not configured' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const channelId = url.searchParams.get('channelId') || 'UCcGgfqebSy8yIGlnhW0qT_g';
    const maxResults = url.searchParams.get('maxResults') || '3';
    const part = url.searchParams.get('part') || 'snippet,id';

    // Build the YouTube API URL
    const youtubeUrl = `${YOUTUBE_API_BASE}/search?key=${apiKey}&channelId=${channelId}&part=${part}&order=date&maxResults=${maxResults}&type=video`;

    // Forward the request to YouTube API
    const response = await fetch(youtubeUrl);

    // Get the response
    const data = await response.json();

    // Return the response with proper CORS headers
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}