import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite dev server
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Path to projects.json
const PROJECTS_FILE = path.join(__dirname, 'src/components/works/projects.json');
const EXPERIENCE_FILE = path.join(__dirname, 'src/components/experience/experience.json');

// Middleware to check if request is from localhost
const localhostOnly = (req, res, next) => {
  const hostname = req.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '::1') {
    return res.status(403).json({ 
      success: false, 
      message: 'This endpoint is only accessible from localhost' 
    });
  }
  next();
};

// GET /api/projects - Retrieve all projects
app.get('/api/projects', localhostOnly, (req, res) => {
  try {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    const projects = JSON.parse(data);
    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error reading projects:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to read projects file',
      error: error.message 
    });
  }
});

// POST /api/projects/save - Save projects to file
app.post('/api/projects/save', localhostOnly, (req, res) => {
  try {
    const { projects } = req.body;

    // Validate request
    if (!Array.isArray(projects)) {
      return res.status(400).json({
        success: false,
        message: 'Projects must be an array'
      });
    }

    // Validate each project has required fields
    const requiredFields = ['id', 'title', 'description', 'status'];
    for (const project of projects) {
      for (const field of requiredFields) {
        if (!(field in project)) {
          return res.status(400).json({
            success: false,
            message: `Project missing required field: ${field}`
          });
        }
      }
    }

    // Write to file with formatting
    const projectsJson = JSON.stringify(projects, null, 2);
    fs.writeFileSync(PROJECTS_FILE, projectsJson, 'utf-8');

    console.log(`✓ Projects saved successfully (${projects.length} projects)`);
    res.json({
      success: true,
      message: `Projects saved successfully (${projects.length} projects)`,
      projects
    });
  } catch (error) {
    console.error('Error saving projects:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to save projects',
      error: error.message
    });
  }
});

// POST /api/projects/add - Add a single project
app.post('/api/projects/add', localhostOnly, (req, res) => {
  try {
    const newProject = req.body;

    // Validate required fields
    const requiredFields = ['title', 'description', 'status'];
    for (const field of requiredFields) {
      if (!(field in newProject)) {
        return res.status(400).json({
          success: false,
          message: `New project missing required field: ${field}`
        });
      }
    }

    // Read current projects
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    const projects = JSON.parse(data);

    // Generate new ID based on highest existing ID
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;

    // Create project object with defaults
    const project = {
      id: newId,
      ...newProject,
      featured: newProject.featured || false,
      displayOrder: newProject.displayOrder || projects.length + 1,
      images: newProject.images || [],
      tags: newProject.tags || [],
      completedDate: newProject.completedDate || null
    };

    projects.push(project);

    // Write back to file
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');

    console.log(`✓ Project added: ${project.title} (ID: ${project.id})`);
    res.json({
      success: true,
      message: `Project added successfully`,
      project
    });
  } catch (error) {
    console.error('Error adding project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add project',
      error: error.message
    });
  }
});

// DELETE /api/projects/:id - Delete a project by ID
app.delete('/api/projects/:id', localhostOnly, (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    // Read current projects
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    let projects = JSON.parse(data);

    // Find and remove project
    const originalLength = projects.length;
    projects = projects.filter(p => p.id !== projectId);

    if (projects.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${projectId} not found`
      });
    }

    // Write back to file
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');

    console.log(`✓ Project deleted (ID: ${projectId})`);
    res.json({
      success: true,
      message: `Project deleted successfully`,
      projects
    });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// PUT /api/projects/:id - Update a project
app.put('/api/projects/:id', localhostOnly, (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const updates = req.body;

    // Read current projects
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    const projects = JSON.parse(data);

    // Find project index
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${projectId} not found`
      });
    }

    // Update project (preserve ID and other fields not in updates)
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      id: projectId // Ensure ID doesn't change
    };

    // Write back to file
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');

    console.log(`✓ Project updated (ID: ${projectId})`);
    res.json({
      success: true,
      message: `Project updated successfully`,
      project: projects[projectIndex]
    });
  } catch (error) {
    console.error('Error updating project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// ================================================
// Experience JSON (read/write)
// ================================================
app.get('/api/experience', localhostOnly, (req, res) => {
  try {
    const data = fs.readFileSync(EXPERIENCE_FILE, 'utf-8');
    res.json({ success: true, data: JSON.parse(data) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/experience', localhostOnly, (req, res) => {
  try {
    const { experiences, education } = req.body || {};
    if (!Array.isArray(experiences) || !Array.isArray(education)) {
      return res.status(400).json({
        success: false,
        message: 'Body must contain { experiences: [], education: [] }',
      });
    }
    fs.writeFileSync(
      EXPERIENCE_FILE,
      JSON.stringify({ experiences, education }, null, 2),
      'utf-8'
    );
    console.log(`✓ Experience saved (${experiences.length} roles, ${education.length} edu)`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================================================
// GitHub GraphQL API Proxy
// ================================================
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

app.post('/api/github/graphql', async (req, res) => {
  try {
    // Get the GitHub token from environment variables or Authorization header
    const githubToken = req.headers.authorization?.replace('Bearer ', '')
      || process.env.GITHUB_TOKEN
      || process.env.VITE_GITHUB_TOKEN;

    if (!githubToken) {
      return res.status(401).json({ error: 'GitHub token not configured' });
    }

    // Parse the request body
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
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

    // Return the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('GitHub GraphQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ================================================
// YouTube Data API Proxy
// ================================================
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

app.get('/api/youtube/videos', async (req, res) => {
  try {
    // Get the YouTube API key from environment variables
    const apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(401).json({ error: 'YouTube API key not configured' });
    }

    // Parse query parameters
    const channelId = req.query.channelId || 'UCcGgfqebSy8yIGlnhW0qT_g';
    const maxResults = req.query.maxResults || '3';
    const part = req.query.part || 'snippet,id';

    // Build the YouTube API URL
    const youtubeUrl = `${YOUTUBE_API_BASE}/search?key=${apiKey}&channelId=${channelId}&part=${part}&order=date&maxResults=${maxResults}&type=video`;

    // Forward the request to YouTube API
    const response = await fetch(youtubeUrl);

    // Get the response
    const data = await response.json();

    // Return the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('YouTube API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Admin API server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Admin Server running on http://localhost:${PORT}`);
  console.log(`📁 Projects file: ${PROJECTS_FILE}\n`);
});
