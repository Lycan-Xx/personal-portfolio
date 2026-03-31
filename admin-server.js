import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite dev server
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Path to projects.json
const PROJECTS_FILE = path.join(__dirname, 'frontend/src/components/works/projects.json');

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Admin API server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Admin Server running on http://localhost:${PORT}`);
  console.log(`📁 Projects file: ${PROJECTS_FILE}\n`);
});
