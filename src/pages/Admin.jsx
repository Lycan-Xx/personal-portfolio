import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaTrash, FaSave, FaTimes, FaUpload, FaArrowUp, FaArrowDown,
  FaCheck, FaExclamationTriangle, FaImage, FaLink, FaCode, FaTag, FaBoxOpen
} from 'react-icons/fa';
import { uploadToCloudinary, isValidCloudinaryUrl } from '../utils/cloudinaryConfig';
import projectsData from '../components/works/projects.json';
import experienceData from '../components/experience/experience.json';

const API_URL = '/api';

export function Admin() {
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

  // ─── STATE ───────────────────────────────────────────────────────────────
  const [directoryTab, setDirectoryTab] = useState('works');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Works state
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    id: null, title: '', description: '', status: 'active', tags: [],
    link: '', repo: '', images: [], featured: false, displayOrder: 1
  });

  // Experience & Education state
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [editingExpId, setEditingExpId] = useState(null);
  const [isCreatingExp, setIsCreatingExp] = useState(false);
  const [expSubTab, setExpSubTab] = useState('experience');
  const [expForm, setExpForm] = useState({
    id: '', commitHash: '', branch: '', role: '', org: '', type: 'Full-time', 
    workType: 'Remote', period: '', periodShort: '', duration: '', location: '',
    status: 'active', color: 'cyan', description: '', tags: [], bullets: []
  });
  const [eduForm, setEduForm] = useState({
    id: '', commitHash: '', branch: '', degree: '', institution: '', 
    period: '', periodShort: '', status: 'active', note: '', 
    description: '', tags: [], bullets: []
  });

  const [tagInput, setTagInput] = useState('');
  const [bulletInput, setBulletInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // ─── LOAD DATA FROM JSON ───────────────────────────────────────────────────
  useEffect(() => {
    setProjects(projectsData || []);
    setExperiences(experienceData.experiences || []);
    setEducation(experienceData.education || []);
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ─── API CALLS ───────────────────────────────────────────────────────────────
  const saveProject = async () => {
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setSaving(true);
    try {
      const url = isCreatingProject ? `${API_URL}/projects/add` : `${API_URL}/projects/${projectForm.id}`;
      const method = isCreatingProject ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm)
      });

      if (!res.ok) throw new Error('Failed to save project');

      const data = await res.json();
      if (isCreatingProject) {
        setProjects([...projects, data.project]);
      } else {
        setProjects(projects.map(p => p.id === projectForm.id ? data.project : p));
      }

      setSuccess(`Project ${isCreatingProject ? 'created' : 'updated'} successfully!`);
      cancelProjectEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project?')) return;

    try {
      const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setProjects(projects.filter(p => p.id !== id));
      setSuccess('Project deleted!');
      if (editingProjectId === id) cancelProjectEdit();
    } catch (err) {
      setError(err.message);
    }
  };

  const saveExperience = async () => {
    const isExp = expSubTab === 'experience';
    const form = isExp ? expForm : eduForm;
    const requiredFields = isExp 
      ? ['role', 'org', 'period', 'description'] 
      : ['degree', 'institution', 'period', 'description'];

    for (const field of requiredFields) {
      if (!form[field]?.trim()) {
        setError(`${field} is required`);
        return;
      }
    }

    setSaving(true);
    try {
      // Create clean item without internal UI fields
      const { itemType, ...cleanForm } = form;
      const item = { 
        ...cleanForm, 
        id: cleanForm.id || Math.random().toString(36).substring(7),
        commitHash: cleanForm.commitHash || Math.random().toString(16).substring(2, 9),
        branch: cleanForm.branch || `${expSubTab}/${cleanForm.id || 'new'}`
      };

      const payload = {
        experiences: isExp 
          ? (isCreatingExp ? [...experiences, item] : experiences.map(e => e.id === editingExpId ? item : e))
          : experiences,
        education: !isExp
          ? (isCreatingExp ? [...education, item] : education.map(e => e.id === editingExpId ? item : e))
          : education
      };

      const res = await fetch(`${API_URL}/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save');

      setExperiences(payload.experiences);
      setEducation(payload.education);
      setSuccess(`${isExp ? 'Experience' : 'Education'} saved!`);
      cancelExpEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteExperience = async (id, itemType, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete this ${itemType}?`)) return;

    try {
      const payload = {
        experiences: itemType === 'experience' ? experiences.filter(e => e.id !== id) : experiences,
        education: itemType === 'education' ? education.filter(e => e.id !== id) : education
      };

      const res = await fetch(`${API_URL}/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to delete');

      setExperiences(payload.experiences);
      setEducation(payload.education);
      setSuccess(`${itemType} deleted!`);
      if (editingExpId === id) cancelExpEdit();
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── IMAGE UPLOAD HANDLERS ───────────────────────────────────────────────────
  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      setUploadProgress(0);
      const url = await uploadToCloudinary(file, (progress) => setUploadProgress(Math.round(progress)));
      setProjectForm(prev => ({ ...prev, images: [...prev.images, url] }));
      setSuccess('Image uploaded successfully!');
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
    setProjectForm(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
    setSuccess('Image URL added!');
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
    const newImages = [...projectForm.images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setProjectForm({ ...projectForm, images: newImages });
  };

  // ─── HANDLERS ───────────────────────────────────────────────────────────────
  const editProject = (project) => {
    setProjectForm(project);
    setEditingProjectId(project.id);
    setIsCreatingProject(false);
  };

  const createProject = () => {
    setProjectForm({
      id: null, title: '', description: '', status: 'active', tags: [],
      link: '', repo: '', images: [], featured: false, displayOrder: projects.length + 1
    });
    setIsCreatingProject(true);
    setEditingProjectId(null);
  };

  const cancelProjectEdit = () => {
    setEditingProjectId(null);
    setIsCreatingProject(false);
    setProjectForm({
      id: null, title: '', description: '', status: 'active', tags: [],
      link: '', repo: '', images: [], featured: false, displayOrder: 1
    });
    setTagInput('');
    setImageUrlInput('');
  };

  const editExperience = (item, itemType) => {
    if (itemType === 'experience') {
      setExpForm(item);
      setExpSubTab('experience');
    } else {
      setEduForm(item);
      setExpSubTab('education');
    }
    setEditingExpId(item.id);
    setIsCreatingExp(false);
  };

  const createExperience = (itemType) => {
    if (itemType === 'experience') {
      setExpForm({
        id: '', commitHash: '', branch: '', role: '', org: '', type: 'Full-time',
        workType: 'Remote', period: '', periodShort: '', duration: '', location: '',
        status: 'active', color: 'cyan', description: '', tags: [], bullets: []
      });
      setExpSubTab('experience');
    } else {
      setEduForm({
        id: '', commitHash: '', branch: '', degree: '', institution: '',
        period: '', periodShort: '', status: 'active', note: '',
        description: '', tags: [], bullets: []
      });
      setExpSubTab('education');
    }
    setIsCreatingExp(true);
    setEditingExpId(null);
  };

  const cancelExpEdit = () => {
    setEditingExpId(null);
    setIsCreatingExp(false);
    setExpForm({
      id: '', commitHash: '', branch: '', role: '', org: '', type: 'Full-time',
      workType: 'Remote', period: '', periodShort: '', duration: '', location: '',
      status: 'active', color: 'cyan', description: '', tags: [], bullets: []
    });
    setEduForm({
      id: '', commitHash: '', branch: '', degree: '', institution: '',
      period: '', periodShort: '', status: 'active', note: '',
      description: '', tags: [], bullets: []
    });
    setTagInput('');
    setBulletInput('');
  };

  const isEditing = editingProjectId !== null || isCreatingProject || editingExpId !== null || isCreatingExp;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fc] font-sans">
      {/* Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-gray-900 text-white rounded-full shadow-2xl flex items-center gap-3 font-medium">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs"><FaCheck /></div>
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-red-600 text-white rounded-full shadow-2xl flex items-center gap-3 font-medium">
            <FaExclamationTriangle /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT PANEL: Editor */}
      <div className="w-full md:w-3/5 lg:w-2/3 h-screen overflow-y-auto p-6 md:p-12">
        {!isEditing ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
              <FaBoxOpen size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Workspace Empty</h2>
            <p className="text-gray-500">Select an item from the directory or create a new one.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {directoryTab === 'works' 
                  ? (isCreatingProject ? 'Create Project' : 'Edit Project') 
                  : (isCreatingExp ? `Create ${expSubTab}` : `Edit ${expSubTab}`)}
              </h1>
              <button onClick={directoryTab === 'works' ? cancelProjectEdit : cancelExpEdit} className="text-gray-400 hover:text-gray-700 p-2 bg-gray-100 rounded-full">
                <FaTimes size={18} />
              </button>
            </div>

            {directoryTab === 'works' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="Project title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea rows="4" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none" placeholder="Project description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                      <option value="active">Active</option>
                      <option value="experimental">Experimental</option>
                      <option value="archived">Archived</option>
                      <option value="dormant">Dormant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                    <input type="number" value={projectForm.displayOrder} onChange={(e) => setProjectForm({ ...projectForm, displayOrder: parseInt(e.target.value) || 1 })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaLink className="text-gray-400"/> Live URL</label>
                    <input type="url" value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaCode className="text-gray-400"/> Repository</label>
                    <input type="url" value={projectForm.repo} onChange={(e) => setProjectForm({ ...projectForm, repo: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="https://github.com/..." />
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaTag className="text-gray-400"/> Tags</label>
                  <form onSubmit={(e) => { e.preventDefault(); if (tagInput.trim() && !projectForm.tags.includes(tagInput.trim())) { setProjectForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] })); setTagInput(''); } }} className="flex gap-2 mb-3">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Add tag (Press Enter)" />
                    <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm">Add</button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {projectForm.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-sm font-medium flex items-center gap-2">
                        {tag} <button type="button" onClick={() => setProjectForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))} className="hover:text-red-500"><FaTimes size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaImage className="text-gray-400"/> Images ({projectForm.images.length})</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {projectForm.images.map((img, idx) => (
                      <motion.div layout key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-between">
                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">{idx + 1}</span>
                            <button onClick={() => setProjectForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx)}))} className="text-white hover:text-red-400 bg-black/50 p-1.5 rounded backdrop-blur-sm"><FaTrash size={12} /></button>
                          </div>
                          <div className="flex justify-center gap-2">
                            {idx > 0 && <button onClick={() => moveImage(idx, 'up')} className="bg-white/20 hover:bg-white/40 text-white p-2 rounded backdrop-blur-sm"><FaArrowUp size={12}/></button>}
                            {idx < projectForm.images.length - 1 && <button onClick={() => moveImage(idx, 'down')} className="bg-white/20 hover:bg-white/40 text-white p-2 rounded backdrop-blur-sm"><FaArrowDown size={12}/></button>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <label onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                      {uploading ? (
                        <div className="w-full px-6 flex flex-col items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                          </div>
                          <span className="text-xs font-medium">{uploadProgress}%</span>
                        </div>
                      ) : (
                        <>
                          <FaUpload className="mb-2 text-xl" />
                          <span className="text-sm font-medium">Upload</span>
                          <input type="file" accept="image/*" multiple onChange={handleMultipleImageUpload} className="hidden" disabled={uploading} />
                        </>
                      )}
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Or paste Cloudinary URL..." className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    <button type="button" onClick={handleAddImageUrl} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm">Add URL</button>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button type="button" onClick={() => setProjectForm({ ...projectForm, featured: !projectForm.featured })} className={`w-12 h-6 rounded-full transition-colors relative ${projectForm.featured ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <motion.div layout className={`w-4 h-4 rounded-full bg-white absolute top-1 ${projectForm.featured ? 'right-1' : 'left-1'}`} />
                  </button>
                  <label className="text-sm font-semibold text-gray-700">Featured Project</label>
                </div>
              </div>

            ) : (
              <div className="space-y-6">
                <div className="flex border-b border-gray-200">
                  <button onClick={() => setExpSubTab('experience')} className={`px-6 py-3 font-medium text-sm ${expSubTab === 'experience' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Experience</button>
                  <button onClick={() => setExpSubTab('education')} className={`px-6 py-3 font-medium text-sm ${expSubTab === 'education' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Education</button>
                </div>

                {expSubTab === 'experience' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
                        <input type="text" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="e.g. Software Engineer" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Organization *</label>
                        <input type="text" value={expForm.org} onChange={(e) => setExpForm({ ...expForm, org: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="Company Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                        <select value={expForm.type} onChange={(e) => setExpForm({ ...expForm, type: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Apprenticeship">Apprenticeship</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Work Type</label>
                        <select value={expForm.workType} onChange={(e) => setExpForm({ ...expForm, workType: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                          <option value="Remote">Remote</option>
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select value={expForm.status} onChange={(e) => setExpForm({ ...expForm, status: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Period *</label>
                        <input type="text" value={expForm.period} onChange={(e) => setExpForm({ ...expForm, period: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="Jan 2023 – Present" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Period Short</label>
                        <input type="text" value={expForm.periodShort} onChange={(e) => setExpForm({ ...expForm, periodShort: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="Jan '23" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                        <input type="text" value={expForm.duration} onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="1 yr 6 mos" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                        <input type="text" value={expForm.location} onChange={(e) => setExpForm({ ...expForm, location: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="City, State" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                        <select value={expForm.color} onChange={(e) => setExpForm({ ...expForm, color: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                          <option value="cyan">Cyan</option>
                          <option value="orange">Orange</option>
                          <option value="slate">Slate</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                        <textarea rows="3" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none" placeholder="Describe the role..." />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaTag className="text-gray-400"/> Tags</label>
                      <form onSubmit={(e) => { e.preventDefault(); if (tagInput.trim() && !expForm.tags.includes(tagInput.trim())) { setExpForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] })); setTagInput(''); } }} className="flex gap-2 mb-3">
                        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Add tag" />
                        <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm">Add</button>
                      </form>
                      <div className="flex flex-wrap gap-2">
                        {expForm.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-sm font-medium flex items-center gap-2">
                            {tag} <button type="button" onClick={() => setExpForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))} className="hover:text-red-500"><FaTimes size={12} /></button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bullets</label>
                      <form onSubmit={(e) => { e.preventDefault(); if (bulletInput.trim() && !expForm.bullets.includes(bulletInput.trim())) { setExpForm(prev => ({ ...prev, bullets: [...prev.bullets, bulletInput.trim()] })); setBulletInput(''); } }} className="flex gap-2 mb-3">
                        <input type="text" value={bulletInput} onChange={(e) => setBulletInput(e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Add bullet point" />
                        <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm">Add</button>
                      </form>
                      <div className="space-y-2">
                        {expForm.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">•</span>
                            <span className="flex-1 text-sm">{bullet}</span>
                            <button type="button" onClick={() => setExpForm(prev => ({ ...prev, bullets: prev.bullets.filter((_, i) => i !== idx) }))} className="text-red-500 hover:text-red-700"><FaTimes size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Degree *</label>
                        <input type="text" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="Bachelor of Science in Computer Science" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Institution *</label>
                        <input type="text" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="University Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Period *</label>
                        <input type="text" value={eduForm.period} onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="Sep 2020 – Jun 2024" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Period Short</label>
                        <input type="text" value={eduForm.periodShort} onChange={(e) => setEduForm({ ...eduForm, periodShort: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="2020" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select value={eduForm.status} onChange={(e) => setEduForm({ ...eduForm, status: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
                        <input type="text" value={eduForm.note} onChange={(e) => setEduForm({ ...eduForm, note: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="Additional note..." />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                        <textarea rows="3" value={eduForm.description} onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm resize-none" placeholder="Describe the education..." />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaTag className="text-gray-400"/> Tags</label>
                      <form onSubmit={(e) => { e.preventDefault(); if (tagInput.trim() && !eduForm.tags.includes(tagInput.trim())) { setEduForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] })); setTagInput(''); } }} className="flex gap-2 mb-3">
                        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Add tag" />
                        <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm">Add</button>
                      </form>
                      <div className="flex flex-wrap gap-2">
                        {eduForm.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-sm font-medium flex items-center gap-2">
                            {tag} <button type="button" onClick={() => setEduForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))} className="hover:text-red-500"><FaTimes size={12} /></button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bullets</label>
                      <form onSubmit={(e) => { e.preventDefault(); if (bulletInput.trim() && !eduForm.bullets.includes(bulletInput.trim())) { setEduForm(prev => ({ ...prev, bullets: [...prev.bullets, bulletInput.trim()] })); setBulletInput(''); } }} className="flex gap-2 mb-3">
                        <input type="text" value={bulletInput} onChange={(e) => setBulletInput(e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Add bullet point" />
                        <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm">Add</button>
                      </form>
                      <div className="space-y-2">
                        {eduForm.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">•</span>
                            <span className="flex-1 text-sm">{bullet}</span>
                            <button type="button" onClick={() => setEduForm(prev => ({ ...prev, bullets: prev.bullets.filter((_, i) => i !== idx) }))} className="text-red-500 hover:text-red-700"><FaTimes size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-gray-200">
              <button onClick={directoryTab === 'works' ? saveProject : saveExperience} disabled={saving} className="w-full py-4 bg-[#0a00e5] hover:bg-blue-800 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <FaSave /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* RIGHT PANEL: Directory with Tabs */}
      <div className="w-full md:w-2/5 lg:w-1/3 h-[50vh] md:h-screen overflow-y-auto bg-[#0b0c10] text-gray-300 p-6 shadow-2xl z-10 custom-scrollbar">
        {/* Tab Navigation */}
        <div className="sticky top-0 bg-[#0b0c10] pb-4 z-20 border-b border-[#1f2833] mb-6">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setDirectoryTab('works')} className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${directoryTab === 'works' ? 'bg-blue-600 text-white' : 'bg-[#1f2833] text-gray-400 hover:text-white'}`}>
              Works
            </button>
            <button onClick={() => setDirectoryTab('experience')} className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${directoryTab === 'experience' ? 'bg-blue-600 text-white' : 'bg-[#1f2833] text-gray-400 hover:text-white'}`}>
              Experience
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {directoryTab === 'works' ? 'Projects' : 'Experience & Education'}
              </h2>
              <p className="text-sm text-gray-500">
                {directoryTab === 'works' ? `${projects.length} Projects` : `${experiences.length + education.length} Items`}
              </p>
            </div>
            {directoryTab === 'works' ? (
              <button onClick={createProject} className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105">
                <FaPlus />
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => createExperience('experience')} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition">
                  <FaPlus className="inline mr-1" /> Exp
                </button>
                <button onClick={() => createExperience('education')} className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg font-medium transition">
                  <FaPlus className="inline mr-1" /> Edu
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Directory Content */}
        <div className="space-y-4">
          {directoryTab === 'works' ? (
            projects.length === 0 ? (
              <div className="text-center py-10 text-gray-600 italic">No projects found.</div>
            ) : (
              projects.map((project) => {
                const isActive = editingProjectId === project.id;
                let statusColor = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
                if (project.status === 'active') statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                if (project.status === 'experimental') statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                if (project.status === 'archived') statusColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';

                return (
                  <motion.div key={project.id} onClick={() => editProject(project)} className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${isActive ? 'bg-[#1f2833] border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-[#12141a] border-[#1f2833] hover:border-gray-600'}`}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1f2833] flex-shrink-0 border border-[#2a3644]">
                      {project.images?.[0] ? (
                        <img src={project.images[0]} alt="thumb" className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600"><FaImage /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold truncate pr-2 ${isActive ? 'text-white' : 'text-gray-200'}`}>
                          {project.title}
                        </h3>
                        <button onClick={(e) => deleteProject(project.id, e)} className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors">
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
            )
          ) : (
            [...experiences, ...education].length === 0 ? (
              <div className="text-center py-10 text-gray-600 italic">No items found.</div>
            ) : (
              [...experiences.map(e => ({ ...e, itemType: 'experience' })), ...education.map(e => ({ ...e, itemType: 'education' }))].map((item) => {
                const isActive = editingExpId === item.id;
                let statusColor = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
                if (item.status === 'active') statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                if (item.status === 'completed') statusColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';

                return (
                  <motion.div key={`${item.itemType}-${item.id}`} onClick={() => editExperience(item, item.itemType)} className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${isActive ? 'bg-[#1f2833] border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-[#12141a] border-[#1f2833] hover:border-gray-600'}`}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1f2833] flex-shrink-0 border border-[#2a3644] flex items-center justify-center">
                      <FaBoxOpen size={24} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold truncate pr-2 ${isActive ? 'text-white' : 'text-gray-200'}`}>
                          {item.itemType === 'experience' ? item.role : item.degree}
                        </h3>
                        <button onClick={(e) => deleteExperience(item.id, item.itemType, e)} className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors">
                          <FaTrash size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${item.itemType === 'experience' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                          {item.itemType}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColor}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      {item.itemType === 'experience' && item.org && <p className="text-xs text-gray-400 truncate">at {item.org}</p>}
                      {item.itemType === 'education' && item.institution && <p className="text-xs text-gray-400 truncate">at {item.institution}</p>}
                    </div>
                  </motion.div>
                );
              })
            )
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0b0c10; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2833; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a3644; }
      `}} />
    </div>
  );
}

export default Admin;
