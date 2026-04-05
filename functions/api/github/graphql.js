/**
 * GitHub GraphQL API Proxy for Cloudflare Pages
 * Handles GitHub GraphQL requests to avoid CORS issues and hide tokens
 * 
 * Usage: POST /api/github/graphql
 * Body: { "query": "..." }
 */

// GitHub GraphQL endpoint
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

/**
 * Cloudflare Pages Function handler
 * @param {Request} request - The incoming request
 * @param {Object} context - Cloudflare Pages function context
 */
export async function onRequest(request) {
  // Only handle POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get the GitHub token from environment variables
    const githubToken = request.headers.get('Authorization')?.replace('Bearer ', '')
      || import.meta.env.GITHUB_TOKEN
      || import.meta.env.VITE_GITHUB_TOKEN;

    if (!githubToken) {
      return new Response(JSON.stringify({ error: 'GitHub token not configured' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Forward the request to GitHub GraphQL API
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken.trim()}`,
      },
      body: JSON.stringify({ query }),
    });

    // Get the response
    const data = await response.json();

    // Return the response with proper CORS headers
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}