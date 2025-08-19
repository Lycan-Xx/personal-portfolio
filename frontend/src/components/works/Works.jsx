import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaGithub, FaExternalLinkAlt, FaClock, FaCodeBranch } from "react-icons/fa";

// Mock projects data - replace with your actual import
const projects = [
  {
    id: 1,
    title: "Cybernetagod",
    description: "A futuristic cyberpunk-themed web application with advanced animations and interactive elements.",
    tags: ["React", "Three.js", "WebGL", "TypeScript"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    link: "#",
    repo: "#",
    lastUpdated: "2024-08-15T14:30:00Z"
  },
  {
    id: 2,
    title: "Somasog",
    description: "Advanced data visualization platform for complex datasets with real-time analytics.",
    tags: ["Vue.js", "D3.js", "Python", "FastAPI"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    link: "#",
    repo: "#",
    lastUpdated: "2024-08-10T09:15:00Z"
  },
  {
    id: 3,
    title: "Socixium",
    description: "Social networking platform with AI-powered content recommendations and real-time messaging.",
    tags: ["React Native", "Node.js", "MongoDB", "Socket.io"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    link: "#",
    repo: "#",
    lastUpdated: "2024-08-05T16:45:00Z"
  },
  {
    id: 4,
    title: "Cinxto",
    description: "Machine learning platform for predictive analytics with intuitive dashboard interface.",
    tags: ["Python", "TensorFlow", "React", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
    link: "#",
    repo: "#",
    lastUpdated: "2024-07-28T11:20:00Z"
  },
  {
    id: 5,
    title: "NeuralFlow",
    description: "Deep learning framework for computer vision applications with pre-trained models.",
    tags: ["PyTorch", "OpenCV", "FastAPI", "Docker"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    link: "#",
    repo: "#",
    lastUpdated: "2024-07-20T13:10:00Z"
  },
  {
    id: 6,
    title: "CloudSync",
    description: "Multi-cloud storage synchronization tool with encryption and version control.",
    tags: ["Go", "AWS", "Azure", "Kubernetes"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    link: "#",
    repo: "#",
    lastUpdated: "2024-07-15T08:30:00Z"
  }
];

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
      x: branchSide === 'left' ? -50 : 50,
      scale: 0.9 
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
        delay: index * 0.15,
        type: "spring",
        stiffness: 100 
      }}
      className="absolute"
      style={style}
    >
      <div className={`group relative w-80 ${branchSide === 'left' ? 'ml-auto' : ''}`}>
        {/* Date/Time Badge */}
        <div className={`absolute -top-3 ${branchSide === 'left' ? 'left-4' : 'right-4'} z-20`}>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-400/20 backdrop-blur-sm rounded-full border border-cyan-400/30">
            <FaClock className="w-3 h-3 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-300">
              {formatDate(project.lastUpdated)}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-cyan-400/10 group-hover:bg-gray-900/90">
          
          {/* Project Image */}
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
            
            {/* Floating Tag Count */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
                <FaCodeBranch className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-300">
                  {project.tags.length} tech
                </span>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-3 font-mono">
              {project.title}
            </h3>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {project.description}
            </p>
            
            {/* Technology Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-mono font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-md hover:bg-cyan-400/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-3 py-1 text-xs font-mono font-medium text-gray-400 bg-gray-800/50 border border-gray-600/30 rounded-md">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
              >
                <FaExternalLinkAlt className="mr-2 w-3 h-3" />
                <span className="text-sm">Live Demo</span>
              </a>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200"
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

// Git branch path generator
const generateBranchPath = (projects, containerHeight) => {
  const branchSpacing = containerHeight / (projects.length + 1);
  const centerX = 400; // Center line position
  const branchLength = 200; // Length of horizontal branches
  
  let path = `M ${centerX} 0`; // Start from top center
  
  projects.forEach((_, index) => {
    const y = (index + 1) * branchSpacing;
    const isLeft = index % 2 === 0;
    const branchX = isLeft ? centerX - branchLength : centerX + branchLength;
    
    // Draw to branch point
    path += ` L ${centerX} ${y}`;
    // Draw branch
    path += ` L ${branchX} ${y}`;
    // Return to center for next branch
    if (index < projects.length - 1) {
      path += ` M ${centerX} ${y}`;
    }
  });
  
  return path;
};

// Calculate project positions along branches
const calculateProjectPositions = (projects, containerHeight, containerWidth) => {
  const branchSpacing = containerHeight / (projects.length + 1);
  const centerX = containerWidth / 2;
  const branchLength = 280;
  
  return projects.map((project, index) => {
    const y = (index + 1) * branchSpacing - 120; // Offset for card height
    const isLeft = index % 2 === 0;
    const x = isLeft 
      ? centerX - branchLength - 320 // Card width + gap
      : centerX + branchLength;
    
    return {
      x,
      y,
      branchSide: isLeft ? 'left' : 'right'
    };
  });
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
      const calculatedHeight = Math.max(projects.length * 300 + 200, 800);
      setContainerDimensions({
        width: rect.width,
        height: calculatedHeight
      });
    };
    
    updateDimensions();
    
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
    generateBranchPath(projects, containerDimensions.height),
    [containerDimensions.height]
  );

  return (
    <section ref={ref} id="works" className="relative min-h-screen py-16 sm:py-20 px-4 z-20 bg-slate-950">
      <div className="w-full max-w-7xl mx-auto relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaCodeBranch className="text-cyan-400 text-2xl" />
            <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
              git log --projects
            </h2>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            A timeline of my development journey. Each branch represents a unique solution, 
            crafted with passion and precision.
          </p>
        </motion.div>

        {/* Git Branch Visualization Container */}
        <div 
          ref={setContainerRef}
          className="relative w-full overflow-hidden"
          style={{ 
            height: containerDimensions.height > 0 ? `${containerDimensions.height}px` : '800px'
          }}
        >
          
          {/* Animated Git Branch Lines */}
          <svg 
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="branchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" />
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main branch line */}
            <motion.path
              d={branchPath}
              stroke="url(#branchGradient)"
              strokeWidth="3"
              fill="none"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Branch commit dots */}
            {projectPositions.map((pos, index) => {
              const centerX = containerDimensions.width / 2;
              const branchLength = 280;
              const dotX = pos.branchSide === 'left' 
                ? centerX - branchLength 
                : centerX + branchLength;
              const dotY = pos.y + 120; // Center of card
              
              return (
                <motion.circle
                  key={index}
                  cx={dotX}
                  cy={dotY}
                  r="8"
                  fill="#22d3ee"
                  stroke="#0f172a"
                  strokeWidth="3"
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
                    delay: index * 0.15 + 1,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="drop-shadow-lg"
                />
              );
            })}
            
            {/* Main branch dots */}
            {projectPositions.map((pos, index) => {
              const centerX = containerDimensions.width / 2;
              const dotY = pos.y + 120;
              
              return (
                <motion.circle
                  key={`main-${index}`}
                  cx={centerX}
                  cy={dotY}
                  r="6"
                  fill="#1e293b"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.15 + 0.5 
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
                key={project.id} 
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
          
          {/* Background gradient effects */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400/20 via-cyan-400/10 to-transparent blur-sm"></div>
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 12}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Terminal-style footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700/50">
            <span className="text-green-400 font-mono text-sm">$</span>
            <span className="text-gray-300 font-mono text-sm">
              git status: {projects.length} commits ahead
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};