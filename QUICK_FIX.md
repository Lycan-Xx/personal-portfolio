# Quick Fix for Cloudflare Pages GitHub Graph

## The Problem
Your GitHub contributions graph shows this error:
```
Error: Failed to parse API response: JSON.parse: unexpected character at line 1 column 1
```

This happens because Cloudflare Pages returns HTML instead of JSON when you try to access `/api/github-contributions/Lycan-Xx`.

## The Fix (3 Steps)

### Step 1: Add GitHub Token to Cloudflare Pages
1. Go to: https://dash.cloudflare.com/
2. Select your **msbello** project
3. Go to **Settings** → **Environment variables**
4. Click **Add variable**
5. Add:
   - Name: `GITHUB_TOKEN`
   - Value: `your_github_token_here` (get from https://github.com/settings/tokens)
6. Click **Save**

### Step 2: Commit and Push the New Files
```bash
git add frontend/functions/api/github-contributions/[username].js
git add frontend/_redirects
git commit -m "Add Cloudflare Functions for GitHub API"
git push
```

### Step 3: Wait for Deployment
- Cloudflare Pages will automatically redeploy
- Wait 2-3 minutes
- Visit your site and check if the graph loads

## Verify It Works
Visit this URL in your browser:
```
https://msbello.pages.dev/api/github-contributions/Lycan-Xx
```

You should see JSON data like:
```json
{
  "total": 365,
  "contributions": [
    {"date": "2024-01-01", "count": 5},
    ...
  ]
}
```

## If It Still Doesn't Work

### Check 1: Environment Variable
- Make sure `GITHUB_TOKEN` is set in Cloudflare Pages
- Try redeploying after adding it

### Check 2: GitHub Token Permissions
Your token needs these scopes:
- ✅ `read:user`
- ✅ `user:email`

### Check 3: Function Deployment
- Go to Cloudflare Pages dashboard
- Check **Functions** tab
- You should see: `api/github-contributions/[username]`

## Alternative: Use Railway Backend
If you want to keep using Railway for the backend:

1. Update `frontend/src/components/github/GitHubContributions.jsx`:
```javascript
const apiBaseUrl = typeof window !== 'undefined'
  ? window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://your-railway-app.railway.app' // Add your Railway URL here
  : '';
```

2. Make sure Railway backend has CORS enabled for `msbello.pages.dev`

## Need Help?
Check the full guide: `CLOUDFLARE_DEPLOYMENT.md`
