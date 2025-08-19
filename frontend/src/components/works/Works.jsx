import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import projects from "./projects.json";
import { FaGithub, FaExternalLinkAlt, FaClock, FaCodeBranch, FaCircle } from "react-icons/fa";

const ProjectCard = ({ project, index, inView, isLeft }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      'completed': {
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        borderColor: 'border-green-400/30',
        dotColor: 'bg-green-400',
        icon: '✓',
        label: 'Completed'
      },
      'active': {
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        borderColor: 'border-blue-400/30',
        dotColor: 'bg-blue-400',
        icon: '●',
        label: 'Active'
      },
      'in-progress': {
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        borderColor: 'border-yellow-400/30',
        dotColor: 'bg-yellow-400',
        icon: '⚡',
        label: 'In Progress'
      }
    };
    return configs[status] || configs['completed'];
  };

  const statusConfig = getStatusConfig(project.status);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: isLeft ? -80 : 80,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1 
    },
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Branch Connection - Properly positioned */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {/* Main branch dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="w-5 h-5 bg-cyan-400 rounded-full border-4 border-gray-900 shadow-lg shadow-cyan-400/50 relative"
        >
          <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
          <div className="absolute inset-0 bg-cyan-400/50 rounded-full animate-pulse"></div>
        </motion.div>
        
        {/* Branch line extending to card */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-${isLeft ? 'l' : 'r'} from-cyan-400/80 to-cyan-400/20 ${
            isLeft ? 'right-2.5 w-32 md:w-40 lg:w-48' : 'left-2.5 w-32 md:w-40 lg:w-48'
          }`}
        />
        
        {/* Branch endpoint dot */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 ${statusConfig.dotColor} rounded-full border-2 border-gray-900 ${
            isLeft ? 'right-32 md:right-40 lg:right-48' : 'left-32 md:left-40 lg:left-48'
          }`}
        >
          <div className="absolute inset-0 bg-current rounded-full animate-ping opacity-20"></div>
        </div>
      </div>

      {/* Project Card Container */}
      <div className={`w-full flex ${isLeft ? 'justify-start pl-8 md:pl-12 lg:pl-16' : 'justify-end pr-8 md:pr-12 lg:pr-16'}`}>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.2,
            type: "spring",
            stiffness: 100 
          }}
          className="w-full max-w-lg"
        >
          {/* Project Card */}
          <div className="glass-card group hover:shadow-xl hover:shadow-cyan-400/10 hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-pointer">
            {/* Card Header with Status */}
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <div className={`flex items-center gap-2 px-3 py-1.5 ${statusConfig.bgColor} ${statusConfig.borderColor} border backdrop-blur-sm rounded-full`}>
                  <span className={`text-xs ${statusConfig.color}`}>{statusConfig.icon}</span>
                  <span className={`text-xs font-mono ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Project Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={project.images?.[0] || project.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                
                {/* Tech count badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-cyan-400/20">
                    <FaCodeBranch className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs font-mono text-cyan-400">
                      {project.tags?.length || 0} techs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-3" style={{ fontFamily: 'ChocoCooky' }}>
                {project.title}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: 'ChocoCooky' }}>
                {project.description}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.tags || []).slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-mono font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-md hover:bg-cyan-400/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {(project.tags?.length || 0) > 4 && (
                  <span className="px-3 py-1 text-xs font-mono font-medium text-gray-400 bg-gray-800/50 border border-gray-600/30 rounded-md">
                    +{project.tags.length - 4}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 hover:border-cyan-400/50 rounded-lg text-cyan-400 font-medium transition-all duration-200 hover:scale-105 active:scale-95 no-underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaExternalLinkAlt className="w-3 h-3" />
                    <span className="text-sm">Live</span>
                  </a>
                )}

                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50 rounded-lg text-gray-300 hover:text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95 no-underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGithub className="w-3 h-3" />
                    <span className="text-sm">Code</span>
                  </a>
                )}
              </div>

              {/* Footer with timestamp */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FaClock className="w-3 h-3" />
                  <span>{formatDate(project.lastUpdated || new Date().toISOString())}</span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  commit #{String(index + 1).padStart(3, '0')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const Works = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <section 
      ref={ref} 
      id="works" 
      className="relative min-h-screen py-16 sm:py-20 px-4 z-20"
    >
      <div className="w-full max-w-[86rem] mx-auto relative">
        
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 glass-card opacity-40"></div>
        
        <div className="relative p-6 md:p-10 z-10">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaCodeBranch className="text-cyan-400 text-2xl animate-pulse-slow" />
              <h2 className="section-heading font-mono">
                git log --projects
              </h2>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed" style={{ fontFamily: 'ChocoCooky' }}>
              A timeline of my development journey. Each branch represents a unique solution, 
              crafted with passion and precision.
            </p>
          </motion.div>

          {/* Git Branch Timeline */}
          <div className="relative max-w-6xl mx-auto">
            
            {/* Main Branch Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400/90 via-cyan-400/70 to-cyan-400/50 transform -translate-x-1/2 rounded-full z-10">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 w-2 bg-cyan-400/30 blur-sm transform -translate-x-1/4 rounded-full"></div>
              <div className="absolute inset-0 w-3 bg-cyan-400/10 blur-md transform -translate-x-1/3 rounded-full"></div>
            </div>

            {/* Branch Commits */}
            <div className="space-y-20 md:space-y-24 relative">
              {projects.map((project, index) => {
                const isLeft = index % 2 === 0;
                
                return (
                  <ProjectCard 
                    key={project.id || index}
                    project={project} 
                    index={index} 
                    inView={inView}
                    isLeft={isLeft}
                  />
                );
              })}
            </div>

            {/* Branch end indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: projects.length * 0.1 }}
              className="flex justify-center mt-16 relative z-30"
            >
              <div className="flex items-center gap-3 px-6 py-3 glass-card">
                <FaCircle className="text-cyan-400 text-xs animate-pulse" />
                <span className="text-gray-300 font-mono text-sm">
                  HEAD → main ({projects.length} commits)
                </span>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="animated-gradient"></div>
          <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-cyan-400/10 blur-2xl animate-float"></div>
          <div className="absolute bottom-1/4 left-10 w-32 h-32 rounded-full bg-cyan-400/5 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-none md:rounded-3xl opacity-20">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 L0 0 0 40" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.3" />
              </pattern>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#bgGrad)" />
          </svg>
        </div>
      </div>
    </section>
  );
};