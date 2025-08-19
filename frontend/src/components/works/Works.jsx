import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import projects from "./projects.json";
import { FaGithub, FaExternalLinkAlt, FaClock, FaCodeBranch } from "react-icons/fa";

const ProjectCard = ({ project, index, inView, style, branchSide }) => {
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: branchSide === 'left' ? -30 : 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1 
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100 
      }}
      className="absolute z-20"
      style={style}
    >
      <div className={`group relative w-80 ${branchSide === 'left' ? 'ml-auto' : ''}`}>
        {/* Date/Time Badge */}
        <div className={`absolute -top-3 ${branchSide === 'left' ? 'left-4' : 'right-4'} z-30`}>
          <div className="flex items-center gap-2 px-3 py-1.5 glass-card">
            <FaClock className="w-3 h-3 text-[var(--color-primary)]" />
            <span className="text-xs font-mono text-[var(--color-primary)]">
              {formatDate(project.lastUpdated || new Date().toISOString())}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-card card-hover group-hover:border-[var(--color-primary)]/40 group-hover:shadow-[var(--color-primary)]/10">
          
          {/* Project Image */}
          <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
            <img
              src={project.images?.[0] || project.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/80 via-transparent to-transparent" />
            
            {/* Floating Tech Count */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg border border-[var(--color-primary)]/20">
                <FaCodeBranch className="w-3 h-3 text-[var(--color-primary)]" />
                <span className="text-xs font-mono text-[var(--color-primary)]">
                  {project.tags?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white group-hover:text-[var(--color-primary)] transition-colors mb-3" style={{ fontFamily: 'ChocoCooky' }}>
              {project.title}
            </h3>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: 'ChocoCooky' }}>
              {project.description}
            </p>
            
            {/* Technology Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(project.tags || []).slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-mono font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-md hover:bg-[var(--color-primary)]/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {(project.tags?.length || 0) > 3 && (
                <span className="px-3 py-1 text-xs font-mono font-medium text-gray-400 bg-gray-800/50 border border-gray-600/30 rounded-md">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href={project.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 glass-button flex items-center justify-center"
              >
                <FaExternalLinkAlt className="mr-2 w-3 h-3" />
                <span className="text-sm">Live Demo</span>
              </a>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white border border-gray-600/50 hover:border-[var(--color-primary)]/50 rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Calculate project positions with proper centering
const calculateProjectPositions = (projects, containerHeight, containerWidth) => {
  if (!containerWidth || !containerHeight) return [];
  
  const cardWidth = 320; // 80 * 4 = 320px
  const verticalSpacing = 350; // Increased spacing between cards
  const horizontalOffset = 250; // Distance from center line
  const startY = 100; // Start offset from top
  
  return projects.map((project, index) => {
    const y = startY + (index * verticalSpacing);
    const isLeft = index % 2 === 0;
    const centerX = containerWidth / 2;
    
    const x = isLeft 
      ? centerX - horizontalOffset - cardWidth // Left side
      : centerX + horizontalOffset; // Right side
    
    return {
      x,
      y,
      branchSide: isLeft ? 'left' : 'right'
    };
  });
};

// Generate SVG path for git-style branches
const generateBranchPath = (projects, containerHeight, containerWidth) => {
  if (!containerWidth || projects.length === 0) return "";
  
  const centerX = containerWidth / 2;
  const verticalSpacing = 350;
  const horizontalOffset = 200;
  const startY = 100;
  
  let path = `M ${centerX} 0`; // Start from top center
  
  projects.forEach((_, index) => {
    const y = startY + (index * verticalSpacing) + 120; // Center of card
    const isLeft = index % 2 === 0;
    const branchEndX = isLeft ? centerX - horizontalOffset : centerX + horizontalOffset;
    
    // Draw vertical line to branch point
    path += ` L ${centerX} ${y}`;
    // Draw horizontal branch
    path += ` L ${branchEndX} ${y}`;
    // Return to center for next branch
    if (index < projects.length - 1) {
      path += ` M ${centerX} ${y}`;
    }
  });
  
  return path;
};

export const Works = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const [containerRef, setContainerRef] = React.useState(null);
  const [containerDimensions, setContainerDimensions] = React.useState({ width: 0, height: 0 });
  
  React.useEffect(() => {
    if (!containerRef) return;
    
    const updateDimensions = () => {
      const rect = containerRef.getBoundingClientRect();
      const calculatedHeight = Math.max(projects.length * 350 + 300, 1000);
      setContainerDimensions({
        width: rect.width,
        height: calculatedHeight
      });
    };
    
    // Initial calculation with delay to ensure proper rendering
    setTimeout(updateDimensions, 100);
    
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 150);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [containerRef]);
  
  const projectPositions = React.useMemo(() => 
    calculateProjectPositions(projects, containerDimensions.height, containerDimensions.width),
    [containerDimensions]
  );
  
  const branchPath = React.useMemo(() => 
    generateBranchPath(projects, containerDimensions.height, containerDimensions.width),
    [containerDimensions, projects.length]
  );

  return (
    <section 
      ref={ref} 
      id="works" 
      className="relative min-h-screen py-16 sm:py-20 px-4 z-20"
      style={{ backgroundColor: 'var(--color-background)' }}
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
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaCodeBranch className="text-[var(--color-primary)] text-2xl animate-pulse-slow" />
              <h2 className="section-heading font-mono">
                git log --projects
              </h2>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed" style={{ fontFamily: 'ChocoCooky' }}>
              A timeline of my development journey. Each branch represents a unique solution, 
              crafted with passion and precision.
            </p>
          </motion.div>

          {/* Git Branch Visualization Container */}
          <div 
            ref={setContainerRef}
            className="relative w-full mx-auto"
            style={{ 
              height: containerDimensions.height > 0 ? `${containerDimensions.height}px` : '1000px',
              maxWidth: '1400px'
            }}
          >
            
            {/* Animated Git Branch Lines */}
            <svg 
              className="absolute inset-0 w-full h-full z-15 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="branchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                </linearGradient>
                
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main branch line with branches */}
              <motion.path
                d={branchPath}
                stroke="url(#branchGradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
              />
              
              {/* Branch endpoint dots */}
              {projectPositions.map((pos, index) => {
                if (!containerDimensions.width) return null;
                
                const centerX = containerDimensions.width / 2;
                const horizontalOffset = 200;
                const dotX = pos.branchSide === 'left' 
                  ? centerX - horizontalOffset 
                  : centerX + horizontalOffset;
                const dotY = pos.y + 120;
                
                return (
                  <motion.circle
                    key={`branch-${index}`}
                    cx={dotX}
                    cy={dotY}
                    r="6"
                    fill="var(--color-primary)"
                    stroke="var(--color-background)"
                    strokeWidth="2"
                    filter="url(#glow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { 
                      scale: 1, 
                      opacity: 1,
                    } : { 
                      scale: 0, 
                      opacity: 0 
                    }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.2 + 1.5,
                      type: "spring",
                      stiffness: 200
                    }}
                  />
                );
              })}
              
              {/* Main branch intersection dots */}
              {projectPositions.map((pos, index) => {
                if (!containerDimensions.width) return null;
                
                const centerX = containerDimensions.width / 2;
                const dotY = pos.y + 120;
                
                return (
                  <motion.circle
                    key={`main-${index}`}
                    cx={centerX}
                    cy={dotY}
                    r="4"
                    fill="var(--color-background)"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.2 + 1.2 
                    }}
                  />
                );
              })}
            </svg>

            {/* Project Cards */}
            {projects.map((project, index) => {
              const position = projectPositions[index];
              if (!position) return null;
              
              return (
                <ProjectCard 
                  key={project.id || index} 
                  project={project} 
                  index={index} 
                  inView={inView}
                  branchSide={position.branchSide}
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                  }}
                />
              );
            })}
            
            {/* Central line background glow */}
            {containerDimensions.width > 0 && (
              <div 
                className="absolute top-0 w-1 bg-gradient-to-b from-[var(--color-primary)]/20 via-[var(--color-primary)]/10 to-transparent blur-sm"
                style={{
                  left: `${containerDimensions.width / 2}px`,
                  height: `${containerDimensions.height}px`,
                  transform: 'translateX(-50%)'
                }}
              />
            )}
          </div>

          {/* Terminal-style Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 glass-card">
              <span className="text-green-400 font-mono text-sm">$</span>
              <span className="text-gray-300 font-mono text-sm">
                git status: {projects.length} commits ahead of main
              </span>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="animated-gradient"></div>
          <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-[var(--color-primary)]/10 blur-2xl animate-float"></div>
          <div className="absolute bottom-1/4 left-10 w-32 h-32 rounded-full bg-[var(--color-secondary)]/10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
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