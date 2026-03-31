# Cloudflare Pages Deployment Guide

## Issue
The GitHub contributions graph fails to load on Cloudflare Pages because it's a static hosting service and doesn't run your backend server.

## Solution
Use Cloudflare Functions (serverless functions) to handle the GitHub API requests.

## Setup Instructions

### 1. Configure Environment Variables in Cloudflare Pages

1. Go to your Cloudflare Pages dashboard
2. Select your project (`msbello`)
3. Navigate to **Settings** → **Environment variables**
4. Add the following variable:
   - **Variable name**: `GITHUB_TOKEN`
   - **Value**: Your GitHub Personal Access Token
   - **Environment**: Production (and Preview if needed)

### 2. Get Your GitHub Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name like "Portfolio GitHub Contributions"
4. Select scopes:
   - ✅ `read:user`
   - ✅ `user:email`
5. Click **Generate token**
6. Copy the token (you won't see it again!)

### 3. Deploy the Changes

The following files have been created for Cloudflare Pages:

- `frontend/functions/api/github-contributions/[username].js` - Serverless function
- `frontend/_redirects` - Routing configuration

#### Build Configuration in Cloudflare Pages:

- **Build command**: `npm run build`
- **Build output directory**: `frontend/dist`
- **Root directory**: `/` (or leave empty)

### 4. Redeploy

After adding the environment variable:
1. Go to **Deployments** in Cloudflare Pages
2. Click **Retry deployment** on the latest deployment
   OR
3. Push a new commit to trigger a new deployment

### 5. Verify

Once deployed, check:
- Visit: `https://msbello.pages.dev/api/github-contributions/Lycan-Xx`
- You should see JSON data with your GitHub contributions
- The graph should now load on your portfolio

## How It Works

### Before (Railway):
```
Frontend → Backend Server (Express) → GitHub API
```

### After (Cloudflare Pages):
```
Frontend → Cloudflare Function (Serverless) → GitHub API
```

## Troubleshooting

### If the graph still doesn't load:

1. **Check Environment Variable**
   - Make sure `GITHUB_TOKEN` is set in Cloudflare Pages
   - Verify the token has the correct permissions

2. **Check Function Logs**
   - Go to Cloudflare Pages dashboard
   - Navigate to **Functions** → **Logs**
   - Look for errors

3. **Test the API Endpoint**
   - Visit: `https://msbello.pages.dev/api/github-contributions/Lycan-Xx`
   - Should return JSON, not HTML

4. **Clear Cache**
   - Clear your browser cache
   - Or open in incognito mode

5. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in the Console tab
   - Check Network tab for failed requests

## Alternative: Keep Using Railway for Backend

If you prefer to keep your backend on Railway:

1. Update the API URL in your frontend to point to Railway:
   ```javascript
   const apiBaseUrl = 'https://your-railway-app.railway.app';
   ```

2. Make sure CORS is configured on Railway to allow requests from Cloudflare Pages

## Notes

- Cloudflare Functions are free for up to 100,000 requests/day
- The function will be deployed automatically with your site
- No additional configuration needed after initial setup
- The function runs on Cloudflare's edge network (fast!)

## Support

If you encounter issues:
1. Check Cloudflare Pages documentation: https://developers.cloudflare.com/pages/
2. Check Cloudflare Functions docs: https://developers.cloudflare.com/pages/functions/
3. Verify your GitHub token is valid and has correct permissions
