import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaUpload, FaArrowUp, FaArrowDown, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { uploadToCloudinary, isValidCloudinaryUrl } from '../utils/cloudinaryConfig';

// Use relative path - Vite proxy handles the routing to admin server
const API_URL = '/api';

export function Admin() {
  // Localhost check
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (!isLocalhost) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">🔒 Access Denied</h1>
          <p className="text-lg text-gray-400">This panel is only accessible from localhost</p>
        </div>
      </div>
    );
  }

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active',
    tags: [],
    link: '',
    repo: '',
    images: [],
    featured: false,
    displayOrder: 1,
    completedDate: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData(project);
    setEditingId(project.id);
    setIsCreating(false);
    setTagInput('');
    setImageUrlInput('');
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      status: 'active',
      tags: [],
      link: '',
      repo: '',
      images: [],
      featured: false,
      displayOrder: projects.length + 1,
      completedDate: ''
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setTagInput('');
    setImageUrlInput('');
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        return;
      }

      // Validate all images are Cloudinary URLs
      for (const img of formData.images) {
        if (!isValidCloudinaryUrl(img)) {
          setError(`Invalid image URL (not a Cloudinary URL): ${img.substring(0, 50)}...`);
          return;
        }
      }

      setSaving(true);
      const payload = { ...formData };

      if (isCreating) {
        const response = await fetch(`${API_URL}/projects/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to add project');
        setSuccess('Project created successfully!');
      } else {
        const response = await fetch(`${API_URL}/projects/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to update project');
        setSuccess('Project updated successfully!');
      }

      await fetchProjects();
      handleCancel();
      setError(null);
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete project');
      await fetchProjects();
      setSuccess('Project deleted successfully!');
      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const url = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      setFormData({
        ...formData,
        images: [...formData.images, url]
      });
      
      setSuccess(`Image uploaded successfully!`);
      setUploadProgress(0);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) {
      setError('Please enter an image URL');
      return;
    }

    if (!isValidCloudinaryUrl(imageUrlInput)) {
      setError('Please enter a valid Cloudinary URL');
      return;
    }

    setFormData({
      ...formData,
      images: [...formData.images, imageUrlInput.trim()]
    });
    setImageUrlInput('');
    setSuccess('Image URL added!');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
    setSuccess('Image removed');
  };

  const moveImage = (index, direction) => {
    const newImages = [...formData.images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newImages.length) return;

    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setFormData({ ...formData, images: newImages });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">🛠️ Project Admin Panel</h1>
            <p className="text-gray-400">Manage your portfolio projects</p>
          </div>
          <motion.button
            onClick={handleCreate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            <FaPlus /> New Project
          </motion.button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-200 flex items-center gap-2"
            >
              <FaCheck /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200 flex items-center gap-2"
            >
              <FaExclamationTriangle /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="md:col-span-2">
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700">
                <h2 className="text-xl font-bold">Projects ({projects.length})</h2>
              </div>
              <div className="divide-y divide-slate-700 max-h-[600px] overflow-y-auto">
                {projects.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">No projects yet</div>
                ) : (
                  projects.map((project) => (
                    <motion.div
                      key={project.id}
                      className={`p-4 hover:bg-slate-700/50 transition cursor-pointer ${
                        editingId === project.id ? 'bg-slate-700' : ''
                      }`}
                      onClick={() => handleEdit(project)}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{project.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-1">{project.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(project);
                            }}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 hover:bg-blue-600/50 rounded transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project.id);
                            }}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 hover:bg-red-600/50 rounded transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center text-xs flex-wrap">
                        <span className={`px-2 py-1 rounded ${
                          project.status === 'active' ? 'bg-green-600/30 text-green-300' :
                          project.status === 'dormant' ? 'bg-gray-600/30 text-gray-300' :
                          project.status === 'experimental' ? 'bg-yellow-600/30 text-yellow-300' :
                          'bg-red-600/30 text-red-300'
                        }`}>
                          {project.status}
                        </span>
                        {project.featured && <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded">Featured</span>}
                        <span className="text-gray-500">{project.images.length} images</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-1">
            {(isCreating || editingId !== null) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-lg p-6 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{isCreating ? 'New Project' : 'Edit Project'}</h2>
                  <motion.button
                    onClick={handleCancel}
                    whileHover={{ scale: 1.1 }}
                    className="p-2 hover:bg-red-600/30 rounded transition"
                  >
                    <FaTimes />
                  </motion.button>
                </div>

                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                      placeholder="Project title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="2"
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                      placeholder="Project description"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="dormant">Dormant</option>
                      <option value="experimental">Experimental</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-3 h-3"
                    />
                    <label className="text-xs font-semibold">Featured</label>
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Tags</label>
                    <div className="flex gap-1 mb-1">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
                        placeholder="Add tag..."
                      />
                      <motion.button
                        onClick={handleAddTag}
                        whileHover={{ scale: 1.05 }}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                      >
                        <FaPlus />
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="px-2 py-0.5 bg-blue-600/30 border border-blue-600 rounded text-xs flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-400"
                          >
                            <FaTimes size={10} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Live Link</label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Repo Link</label>
                    <input
                      type="url"
                      value={formData.repo}
                      onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  {/* Images */}
                  <div className="mt-3">
                    <label className="block text-xs font-semibold mb-1">Images ({formData.images.length})</label>
                    
                    {/* Upload Button */}
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className="w-full px-2 py-2 bg-slate-700 border border-slate-600 border-dashed rounded text-white hover:bg-slate-600/50 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaUpload size={12} /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                        disabled={uploading}
                      />
                    </motion.label>

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="mt-2">
                        <div className="w-full bg-slate-700 rounded h-1.5">
                          <motion.div
                            className="bg-blue-500 h-1.5 rounded"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ ease: 'easeOut', duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p>
                      </div>
                    )}

                    {/* Add Image URL */}
                    <div className="mt-2 flex gap-1">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Or paste Cloudinary URL"
                        className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
                      />
                      <motion.button
                        onClick={handleAddImageUrl}
                        whileHover={{ scale: 1.05 }}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                      >
                        <FaPlus />
                      </motion.button>
                    </div>

                    {/* Image List */}
                    <div className="mt-2 space-y-1 max-h-[200px] overflow-y-auto">
                      {formData.images.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-1 bg-slate-700 rounded text-xs"
                        >
                          <img
                            src={img}
                            alt="Project"
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="flex-1 truncate px-2 text-gray-400 text-xs">{idx + 1}</span>
                          <div className="flex gap-0.5">
                            {idx > 0 && (
                              <motion.button
                                onClick={() => moveImage(idx, 'up')}
                                whileHover={{ scale: 1.1 }}
                                className="p-1 hover:bg-blue-600/50 rounded"
                                title="Move up"
                              >
                                <FaArrowUp size={10} />
                              </motion.button>
                            )}
                            {idx < formData.images.length - 1 && (
                              <motion.button
                                onClick={() => moveImage(idx, 'down')}
                                whileHover={{ scale: 1.1 }}
                                className="p-1 hover:bg-blue-600/50 rounded"
                                title="Move down"
                              >
                                <FaArrowDown size={10} />
                              </motion.button>
                            )}
                            <motion.button
                              onClick={() => handleRemoveImage(idx)}
                              whileHover={{ scale: 1.1 }}
                              className="p-1 hover:bg-red-600/50 rounded"
                              title="Remove"
                            >
                              <FaTrash size={10} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={!saving ? { scale: 1.02 } : {}}
                    className="w-full mt-4 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-semibold flex items-center justify-center gap-2 transition text-sm"
                  >
                    <FaSave /> {saving ? 'Saving...' : 'Save'}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-6 text-center text-gray-400">
                <p>Select a project to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
