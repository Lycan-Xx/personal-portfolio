# Project Admin Panel - Implementation Complete ✅

## Overview
Your portfolio has been successfully migrated from Sanity CMS to a JSON-based system with a localhost-only admin control panel. This document explains the new architecture and how to use it.

---

## What Changed

### Phase 1: Data Migration ✅
- **projects.json**: Now standardized with all Sanity schema fields:
  - `id`, `title`, `description`, `status`, `tags`
  - `link` (live demo), `repo` (repository)
  - `images` (array of Cloudinary URLs)
  - `featured` (boolean), `displayOrder` (number)
  - `completedDate` (ISO date string or null)

### Phase 2: Frontend Updates ✅
- **useProjects hook** (`frontend/src/hooks/useProjects.js`): Simplified to load only from local JSON
  - No more Sanity API calls
  - Faster page loads (instant, no network delay)
  - Projects sorted by `displayOrder`
- **Works.jsx**: Updated to work with Cloudinary URLs only
  - Removed Sanity `@sanity/image-url` dependency
  - Simplified image handling

### Phase 3: Backend API ✅
- **admin-server.js** (new): Express.js server for admin operations
  - Runs on port 3001 (doesn't interfere with Vite dev server on 5173)
  - Endpoints:
    - `GET /api/projects` — Fetch all projects
    - `POST /api/projects/add` — Create new project
    - `PUT /api/projects/:id` — Update project
    - `DELETE /api/projects/:id` — Delete project
    - `GET /health` — Server health check
  - Localhost-only protection for all endpoints
  - CORS enabled for front-end communication

### Phase 4: Control Panel ✅
- **Admin.jsx** (`frontend/src/pages/Admin.jsx`): React admin interface
  - Full CRUD operations for projects
  - Form with all project fields
  - Tag management (add/remove)
  - Image management:
    - Upload to Cloudinary
    - Add image URLs manually
    - Reorder images (drag-style with up/down buttons)
    - Remove images
    - Preview images in the list
  - Success/error notifications
  - Localhost-only access check
- **App.jsx**: Updated routing to support `/admin` route

### Phase 5: Cloudinary Integration ✅
- **cloudinaryConfig.js** (`frontend/src/utils/cloudinaryConfig.js`): Upload utility
  - Handles file uploads to Cloudinary
  - Progress tracking
  - URL validation
  - Error handling
- Environment variables for credentials (see setup below)

---

## Setup Instructions

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
```

### 2. Configure Cloudinary

1. **Sign up at Cloudinary** (if not already): https://cloudinary.com/
2. **Get your credentials**:
   - Cloud Name: Found in your Cloudinary dashboard
   - Upload Preset: Create in Settings > Upload > Upload presets
     - Create preset: "unsigned" type (safe for client-side uploads)

3. **Add environment variables** in `frontend/.env`:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

   Example:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=demo-portfolio
   VITE_CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
   ```

### 3. Run Development Environment

**Option A: Frontend only** (without admin panel)
```bash
npm run frontend
```
Then visit: http://localhost:5173

**Option B: Frontend + Admin Server**
```bash
npm run dev:admin
```
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5173/admin
- Admin API: http://localhost:3001

---

## Using the Admin Panel

### Accessing Admin
1. Ensure you're on **localhost** (not remote)
2. Navigate to: `http://localhost:5173/admin`
3. You'll see the admin interface (or "Access Denied" if not on localhost)

### Creating a Project
1. Click **"New Project"** button
2. Fill in the form:
   - **Title** (required)
   - **Description** (required)
   - **Status**: active, dormant, experimental, or archived
   - **Display Order**: Lower numbers appear first
   - **Featured**: Check to highlight project
   - **Tags**: Add technology tags (e.g., React, Node.js)
   - **Live Link**: URL to live demo (optional)
   - **Repo Link**: GitHub/GitLab URL (optional)
3. **Add Images**:
   - Click "Upload" to upload to Cloudinary (or)
   - Paste existing Cloudinary URL and click "+"
   - Images appear in the list below
   - Use up/down arrows to reorder
   - First image is shown as primary in carousel
4. Click **"Save"** — project is immediately added to projects.json

### Editing a Project
1. Click on project in the list
2. Update any fields in the form
3. Manage images (add/remove/reorder)
4. Click **"Save"** — changes written to projects.json

### Deleting a Project
1. Click the **trash icon** next to project
2. Confirm deletion
3. Project removed from projects.json

### Image Management
- **Upload new**: Automatically uploads to Cloudinary and adds URL
- **Reorder**: Use arrow buttons to change image order (affects carousel)
- **Remove**: Delete image URL from project
- **Paste URL**: Add existing Cloudinary URLs manually

---

## Project File Structure

### New/Modified Files

```
Project Root
├── admin-server.js                          # NEW - Express API server
├── package.json                             # MODIFIED - Added express, cors, npm scripts
│
└── frontend
    ├── .env.example                         # MODIFIED - Added Cloudinary config
    ├── package.json                         # MODIFIED - Removed Sanity deps, added Cloudinary
    │
    ├── src
    │   ├── app/App.jsx                      # MODIFIED - Added /admin route
    │   ├── pages/Admin.jsx                  # NEW - Admin control panel
    │   │
    │   ├── hooks/useProjects.js             # MODIFIED - JSON-only logic
    │   │
    │   ├── components/works/Works.jsx       # MODIFIED - Removed Sanity imports
    │   ├── components/works/projects.json   # MODIFIED - Added new fields
    │   │
    │   ├── lib/sanity.js                    # DEPRECATED - No longer used
    │   │
    │   └── utils/cloudinaryConfig.js        # NEW - Cloudinary upload utility
    │
    └── sanitycms/                           # DEPRECATED - Can be deleted if not needed
```

### Removed Dependencies
- `@sanity/client` ✅ Removed
- `@sanity/image-url` ✅ Removed

### Added Dependencies
- `express` — Backend API server
- `cors` — Cross-Origin Resource Sharing for admin API
- `cloudinary` — Cloudinary SDK (optional, used by upload utility)
- `cloudinary-react` — Cloudinary React components (optional)

---

## How It Works

### Data Flow: Admin → Frontend

```
1. Admin Panel (React @ localhost:5173/admin)
   ↓ (User creates/edits project)
   ↓
2. Admin API (Express @ localhost:3001)
   ↓ (Validates & writes to disk)
   ↓
3. projects.json (source of truth for frontend)
   ↓ (Frontend reads on page load)
   ↓
4. useProjects Hook (sorts by displayOrder)
   ↓ (provides to components)
   ↓
5. Works.jsx Component (renders project cards)
   ↓
6. User sees updated portfolio
```

### Image Upload Flow

```
1. Select image in Admin
   ↓
2. Upload to Cloudinary (cloudinaryConfig.js)
   ↓
3. Get Cloudinary URL
   ↓
4. Add URL to project.images array
   ↓
5. Save project to projects.json (via admin API)
   ↓
6. Frontend reads from projects.json
   ↓
7. Cloudinary CDN serves images automatically
```

---

## Development Tips

### Viewing Projects
- **Public**: http://localhost:5173 (works section)
- **Admin**: http://localhost:5173/admin (manage projects)

### Server Logs
When running `npm run dev:admin`, you'll see logs like:
```
Vite dev server running...
Admin Server running on http://localhost:3001
✓ Projects saved successfully (7 projects)
```

### Testing Locally
1. Create a test project in admin panel
2. Refresh the homepage (http://localhost:5173)
3. Verify the project appears in Works section
4. Check browser console for any errors

### Cloudinary Debug
If images don't upload:
1. Check `.env` variables are set correctly:
   ```bash
   echo $VITE_CLOUDINARY_CLOUD_NAME
   echo $VITE_CLOUDINARY_UPLOAD_PRESET
   ```
2. Browser console will show upload errors
3. Verify Cloudinary preset is "unsigned" type

---

## API Endpoints Reference

### GET /api/projects
Fetch all projects
```bash
curl http://localhost:3001/api/projects
```

### POST /api/projects/add
Create a new project
```bash
curl -X POST http://localhost:3001/api/projects/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "description": "Project description",
    "status": "active",
    "tags": ["React", "Node.js"],
    "images": ["https://res.cloudinary.com/..."],
    "featured": false,
    "displayOrder": 1
  }'
```

### PUT /api/projects/:id
Update project
```bash
curl -X PUT http://localhost:3001/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{...updated data...}'
```

### DELETE /api/projects/:id
Delete project
```bash
curl -X DELETE http://localhost:3001/api/projects/1
```

---

## Troubleshooting

### Admin panel shows "Access Denied"
- **Solution**: Admin is localhost-only. Ensure you're on `http://localhost:5173/admin`
- Remote URLs won't work intentionally for security

### Images not uploading
- **Check 1**: VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are set in `.env`
- **Check 2**: Upload preset exists in Cloudinary and is "unsigned" type
- **Check 3**: Browser console (F12) shows specific error message

### Projects not appearing
- **Check 1**: Run `npm run dev:admin` (not just `npm run frontend`)
- **Check 2**: Refresh page (Ctrl+Shift+R to hard refresh)
- **Check 3**: Check browser console for errors
- **Check 4**: Verify `projects.json` has valid JSON (no trailing commas)

### Admin server won't start
- **Check 1**: Port 3001 is not in use: `lsof -i :3001`
- **Check 2**: Dependencies installed: `npm install` (in root)
- **Check 3**: Node.js version is 14+ : `node --version`

### "projects.json" file permissions error
- **Solution**: Ensure `projects.json` is writable
  ```bash
  chmod 644 frontend/src/components/works/projects.json
  ```

---

## Next Steps

1. ✅ **Setup**: Follow "Setup Instructions" above
2. ✅ **Configure Cloudinary**: Add environment variables
3. ✅ **Test Admin Panel**: Create a test project
4. ✅ **Verify Frontend**: See project appear on portfolio
5. **Optional**: 
   - Add more features (tags filtering, featured projects only, etc.)
   - Set up auto-backups of projects.json
   - Add git integration for version control of projects
   - Deploy admin panel with authentication if needed later

---

## Optional: Removing Sanity

If you don't need Sanity anymore, you can safely delete:
- `frontend/src/lib/sanity.js` — No longer imported
- `sanitycms/` directory — Entire CMS folder
- Update `.gitignore` if Sanity configs are listed

---

## Optional: Production Deployment

**Important**: The admin panel is localhost-only by design. For production:

1. **Frontend** deploys as usual (via Netlify, Vercel, etc.)
   - Uses `projects.json` as static data source
   - No backend needed for production

2. **Admin Panel** stays on your local machine
   - Sync changes: `npm run dev:admin` locally, then commit `projects.json` to git
   - Or: Set up admin server deployment with authentication if needed

3. **projects.json** is your source of truth
   - Commit to git for version control
   - Serves as both CMS data and deployment data

---

## Sanity Migration Complete! 🎉

Your portfolio is now using JSON + Cloudinary for images. Enjoy faster development, simpler deployment, and full control over your projects!

For questions or issues, check the troubleshooting section above.
