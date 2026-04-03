import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaUpload, 
  FaArrowUp, FaArrowDown, FaCheck, FaExclamationTriangle, 
  FaImage, FaLink, FaCode, FaTag, FaBoxOpen
} from 'react-icons/fa';
import { uploadToCloudinary, isValidCloudinaryUrl } from '../utils/cloudinaryConfig';

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

  // --- State Management ---
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [activeTab, setActiveTab] = useState(1); // 1: Info, 2: Media & Links

  const defaultFormState = {
    title: '', description: '', status: 'active', tags: [],
    link: '', repo: '', images: [], featured: false,
    displayOrder: 1, completedDate: ''
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [tagInput, setTagInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // --- Effects ---
  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // --- API Calls ---
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      // Sort by display order or ID
      setProjects(data.projects?.sort((a, b) => a.displayOrder - b.displayOrder) || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        setActiveTab(1); // Switch to info tab
        return;
      }

      for (const img of formData.images) {
        if (!isValidCloudinaryUrl(img)) {
          setError(`Invalid image URL (not a Cloudinary URL)`);
          setActiveTab(2); // Switch to media tab
          return;
        }
      }

      setSaving(true);
      const payload = { ...formData };

      const url = isCreating ? `${API_URL}/projects/add` : `${API_URL}/projects/${formData.id}`;
      const method = isCreating ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`Failed to ${isCreating ? 'add' : 'update'} project`);
      
      setSuccess(`Project ${isCreating ? 'created' : 'updated'} successfully!`);
      await fetchProjects();
      if (isCreating) {
        handleCancel(); // Close if creating
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete project');
      
      if (editingId === id) handleCancel();
      await fetchProjects();
      setSuccess('Project deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Handlers ---
  const handleEdit = (project) => {
    setFormData(project);
    setEditingId(project.id);
    setIsCreating(false);
    setTagInput('');
    setImageUrlInput('');
    setActiveTab(1);
  };

  const handleCreate = () => {
    setFormData({ ...defaultFormState, displayOrder: projects.length + 1 });
    setIsCreating(true);
    setEditingId(null);
    setActiveTab(1);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(defaultFormState);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      setUploadProgress(0);
      const url = await uploadToCloudinary(file, (progress) => setUploadProgress(Math.round(progress)));
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
      setSuccess(`Image uploaded successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddImageUrl = () => {
    if (!isValidCloudinaryUrl(imageUrlInput)) {
      setError('Please enter a valid Cloudinary URL');
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
    setSuccess('Image URL added!');
  };

  const handleAddTag = (e) => {
    e?.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    for (const file of files) {
      await handleImageUpload(file);
    }
  };

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await handleImageUpload(file);
    }
    e.target.value = '';
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
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-blue-500 text-4xl">
          <FaCode />
        </motion.div>
      </div>
    );
  }

  const isEditing = isCreating || editingId !== null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fc] font-sans">
      
      {/* Absolute Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-gray-900 text-white rounded-full shadow-2xl flex items-center gap-3 font-medium">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs"><FaCheck /></div>
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-red-600 text-white rounded-full shadow-2xl flex items-center gap-3 font-medium">
            <FaExclamationTriangle /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT PANEL: Editor Workspace (Light Theme) */}
      <div className="w-full md:w-3/5 lg:w-2/3 h-screen overflow-y-auto p-6 md:p-12">
        {!isEditing ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
              <FaBoxOpen size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Workspace Empty</h2>
            <p className="text-gray-500">Select a project from the directory or create a new one.</p>
            <button onClick={handleCreate} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
              <FaPlus /> Start New Project
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            
            {/* Header & Tabs */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{isCreating ? 'Create Project' : 'Edit Project'}</h1>
                  <p className="text-gray-500 mt-1">{formData.title || 'Untitled Project'}</p>
                </div>
                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-700 transition p-2 bg-gray-100 rounded-full">
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="flex border-b border-gray-200">
                <button onClick={() => setActiveTab(1)} className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 1 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  1 Information
                  {activeTab === 1 && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
                <button onClick={() => setActiveTab(2)} className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 2 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  2 Media & Links
                  {activeTab === 2 && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
              </div>
            </div>

            {/* Tab 1: Information */}
            <div className={activeTab === 1 ? 'block' : 'hidden'}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm" placeholder="e.g. E-Commerce Platform" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm resize-none" placeholder="Describe the project..." />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none">
                      <option value="active">Active</option>
                      <option value="dormant">Dormant</option>
                      <option value="experimental">Experimental</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                    <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaTag className="text-gray-400"/> Tech Stack / Tags</label>
                  <form onSubmit={handleAddTag} className="flex gap-2 mb-3">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. React, Node.js (Press Enter)" />
                    <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm">Add Tag</button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-sm font-medium flex items-center gap-2">
                        {tag} <button type="button" onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))} className="hover:text-red-500"><FaTimes size={12} /></button>
                      </span>
                    ))}
                    {formData.tags.length === 0 && <span className="text-sm text-gray-400 italic">No tags added yet.</span>}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.featured ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <motion.div layout className={`w-4 h-4 rounded-full bg-white absolute top-1 ${formData.featured ? 'right-1' : 'left-1'}`} />
                  </button>
                  <label className="text-sm font-semibold text-gray-700">Mark as Featured Project</label>
                </div>
              </div>
            </div>

            {/* Tab 2: Media & Links */}
            <div className={activeTab === 2 ? 'block' : 'hidden'}>
              <div className="space-y-8">
                
                {/* URLs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaLink className="text-gray-400"/> Live URL</label>
                    <input type="url" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm" placeholder="https://your-project.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaCode className="text-gray-400"/> Repository URL</label>
                    <input type="url" value={formData.repo} onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm" placeholder="https://github.com/..." />
                  </div>
                </div>

                {/* Images */}
                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaImage className="text-gray-400"/> Project Gallery ({formData.images.length})</label>
                  
                  {/* Grid of Images */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {formData.images.map((img, idx) => (
                      <motion.div layout key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-between">
                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">{idx + 1}</span>
                            <button onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx)}))} className="text-white hover:text-red-400 bg-black/50 p-1.5 rounded backdrop-blur-sm"><FaTrash size={12} /></button>
                          </div>
                          <div className="flex justify-center gap-2">
                            {idx > 0 && <button onClick={() => moveImage(idx, 'up')} className="bg-white/20 hover:bg-white/40 text-white p-2 rounded backdrop-blur-sm"><FaArrowUp size={12}/></button>}
                            {idx < formData.images.length - 1 && <button onClick={() => moveImage(idx, 'down')} className="bg-white/20 hover:bg-white/40 text-white p-2 rounded backdrop-blur-sm"><FaArrowDown size={12}/></button>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Upload Placeholder inside grid */}
                    <label 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer relative ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                      {uploading ? (
                        <div className="w-full px-6 flex flex-col items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                          </div>
                          <span className="text-xs font-medium">{uploadProgress}%</span>
                        </div>
                      ) : isDragging ? (
                        <div className="text-blue-500 text-center">
                          <FaUpload className="mb-2 text-xl mx-auto" />
                          <span className="text-sm font-medium">Drop images here</span>
                        </div>
                      ) : (
                        <>
                          <FaUpload className="mb-2 text-xl" />
                          <span className="text-sm font-medium">Upload Images</span>
                          <input type="file" accept="image/*" multiple onChange={handleMultipleImageUpload} className="hidden" disabled={uploading} />
                        </>
                      )}
                    </label>
                  </div>

                  {/* Manual URL Input */}
                  <div className="flex gap-2">
                    <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste Cloudinary URL here..." className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    <button type="button" onClick={handleAddImageUrl} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm">Add URL</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <button onClick={handleSave} disabled={saving} className="w-full py-4 bg-[#0a00e5] hover:bg-blue-800 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <FaSave /> {saving ? 'Saving Project...' : 'Proceed & Save'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* RIGHT PANEL: Directory (Dark Theme) */}
      <div className="w-full md:w-2/5 lg:w-1/3 h-[50vh] md:h-screen overflow-y-auto bg-[#0b0c10] text-gray-300 p-6 shadow-2xl z-10 custom-scrollbar">
        <div className="sticky top-0 bg-[#0b0c10] pb-4 z-20 flex justify-between items-center border-b border-[#1f2833] mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Directory</h2>
            <p className="text-sm text-gray-500">{projects.length} Projects Total</p>
          </div>
          <button onClick={handleCreate} className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105">
            <FaPlus />
          </button>
        </div>

        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-10 text-gray-600 italic">No projects found.</div>
          ) : (
            projects.map((project) => {
              const isActive = editingId === project.id;
              
              // Badge color logic
              let statusColor = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
              if (project.status === 'active') statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
              if (project.status === 'experimental') statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
              if (project.status === 'archived') statusColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';

              return (
                <motion.div key={project.id} onClick={() => handleEdit(project)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                    isActive 
                      ? 'bg-[#1f2833] border-blue-500 shadow-lg shadow-blue-900/20' 
                      : 'bg-[#12141a] border-[#1f2833] hover:border-gray-600'
                  }`}>
                  
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1f2833] flex-shrink-0 border border-[#2a3644]">
                    {project.images?.[0] ? (
                      <img src={project.images[0]} alt="thumb" className="w-full h-full object-cover opacity-80" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600"><FaImage /></div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold truncate pr-2 ${isActive ? 'text-white' : 'text-gray-200'}`}>
                        {project.title}
                      </h3>
                      <button onClick={(e) => handleDelete(project.id, e)} className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors">
                        <FaTrash size={12} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColor}`}>
                        {project.status}
                      </span>
                      {project.featured && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-purple-500/20 text-purple-400 border-purple-500/30">★</span>}
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate">{project.description}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Adding a tiny custom style for the dark scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0b0c10; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2833; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a3644; }
      `}} />
    </div>
  );
}