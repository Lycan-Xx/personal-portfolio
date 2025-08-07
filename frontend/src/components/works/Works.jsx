import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import projects from "./projects.json";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const ProjectCard = ({ project, index, inView, style }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="absolute w-full transition-all duration-300 ease-out"
      style={style}
    >
      <div className="group bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-cyan-400/10 hover:shadow-lg flex flex-col">
        
        {/* Image container */}
        <div className="relative w-full flex items-center justify-center overflow-hidden bg-black aspect-video">
          <img
            src={project.images && project.images.length > 0 ? project.images[0] : project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/800x600/1f2937/cccccc?text=Image+Not+Found';
            }}
          />
        </div>
        
        {/* Content container */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-white group-hover:text-cyan-400 transition-colors mb-3 sm:mb-4">
              {project.title}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {project.tags.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 sm:px-3 py-1 text-xs font-medium font-mono text-cyan-400 bg-cyan-400/10 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 4 && (
                <span className="px-2 sm:px-3 py-1 text-xs font-medium font-mono text-cyan-400 bg-cyan-400/10 rounded-full">
                  +{project.tags.length - 4}
                </span>
              )}
            </div>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-3" style={{ fontFamily: "ChocoCooky" }}>
              {project.description}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="mt-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 font-medium rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
            >
              <FaExternalLinkAlt className="mr-2 w-4 h-4" />
              View Live
            </a>
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gray-900 hover:bg-gray-800 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
              >
                <FaGithub className="mr-2 w-4 h-4" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Improved masonry layout hook with better height calculation
const useMasonryLayout = (projects, containerWidth, inView) => {
  const [layout, setLayout] = React.useState([]);
  const [containerHeight, setContainerHeight] = React.useState(0);
  
  React.useEffect(() => {
    if (!inView || !containerWidth || projects.length === 0) return;
    
    const calculateLayout = () => {
      // More aggressive responsive columns - force multiple columns earlier
      let columns;
      if (containerWidth >= 1200) {
        columns = 3;
      } else if (containerWidth >= 800) {
        columns = 2;
      } else if (containerWidth >= 600) {
        columns = 2; // Force 2 columns even on smaller screens
      } else {
        columns = 1;
      }
      
      const gap = 32; // Gap between cards
      const columnWidth = Math.floor((containerWidth - (columns - 1) * gap) / columns);
      
      console.log('Masonry Debug:', {
        containerWidth,
        columns,
        columnWidth,
        gap
      });
      
      // Initialize column heights
      const columnHeights = new Array(columns).fill(0);
      const newLayout = [];
      
      projects.forEach((project, index) => {
        // More accurate height estimation based on content
        let estimatedHeight = 280; // Base height for image (aspect-video)
        
        // Add height for content
        estimatedHeight += 96; // Padding (p-4 sm:p-6)
        estimatedHeight += 60; // Title height
        estimatedHeight += Math.min(project.tags?.length || 0, 4) * 28 + 16; // Tags height
        
        // Description height (more accurate calculation)
        const descriptionLength = project.description?.length || 0;
        const estimatedLines = Math.ceil(descriptionLength / 50); // ~50 chars per line
        estimatedHeight += Math.min(estimatedLines, 3) * 24 + 24; // line-clamp-3
        
        // Buttons height
        estimatedHeight += 60; // Button container
        
        // Add some random variation for more natural masonry effect (but consistent per item)
        const seed = project.title?.length || index; // Use title length as seed for consistency
        const variation = (seed % 40) - 20; // -20 to +20px but consistent
        estimatedHeight += variation;
        
        // Find the shortest column
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Calculate position
        const x = shortestColumnIndex * (columnWidth + gap);
        const y = columnHeights[shortestColumnIndex];
        
        console.log(`Item ${index} (${project.title}):`, {
          shortestColumnIndex,
          x,
          y,
          columnWidth,
          estimatedHeight,
          columnHeights: [...columnHeights]
        });
        
        newLayout.push({
          x,
          y,
          width: columnWidth,
          height: estimatedHeight,
        });
        
        // Update column height
        columnHeights[shortestColumnIndex] += estimatedHeight + gap;
      });
      
      console.log('Final column heights:', columnHeights);
      
      setLayout(newLayout);
      setContainerHeight(Math.max(...columnHeights) + gap);
    };
    
    // Add a small delay to ensure proper calculation
    const timeoutId = setTimeout(calculateLayout, 100);
    return () => clearTimeout(timeoutId);
    
  }, [projects, containerWidth, inView]);
  
  return { layout, containerHeight };
};

export const Works = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const [containerRef, setContainerRef] = React.useState(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  
  React.useEffect(() => {
    if (!containerRef) return;
    
    const updateWidth = () => {
      const rect = containerRef.getBoundingClientRect();
      setContainerWidth(rect.width);
    };
    
    // Initial width calculation
    updateWidth();
    
    // Debounced resize handler
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWidth, 150);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [containerRef]);
  
  const { layout, containerHeight } = useMasonryLayout(projects, containerWidth, inView);

  // Debug logging
  React.useEffect(() => {
    console.log('Container width:', containerWidth);
    console.log('Layout:', layout);
    console.log('Container height:', containerHeight);
    console.log('Projects length:', projects.length);
  }, [containerWidth, layout, containerHeight]);

  return (
    <section ref={ref} id="works" className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20">
      <div className="w-full max-w-[86rem] mx-auto relative">
        {/* Glassmorphism container */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-none md:rounded-3xl shadow-lg shadow-cyan-400/5"></div>
        
        <div className="relative p-6 md:p-10 z-10">
          {/* Animated header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-start"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-cyan-400" style={{ fontFamily: 'ChocoCooky' }}>
              Featured Projects
            </h2>
            <p className="text-slate-100 max-w-2xl mt-8 text-lg md:text-xl" style={{ fontFamily: 'ChocoCooky' }}>
              Here are some of the projects I've worked on and I'm proud of. Each project is unique and purpose-driven to solve a problem.
            </p>
            <p className="text-slate-100 max-w-2xl mt-4 text-lg md:text-xl" style={{ fontFamily: 'ChocoCooky' }}>
              They also demonstrate different aspects of my skills and expertise.
            </p>
          </motion.div>
          
          {/* Debug info (remove in production) */}
          <div className="mb-4 p-2 bg-gray-800 rounded text-xs text-gray-300">
            <div>Container Width: {containerWidth}px</div>
            <div>Container Height: {containerHeight}px</div>
            <div>Projects: {projects.length}</div>
            <div>Layout Items: {layout.length}</div>
          </div>
          
          {/* Masonry Layout Container */}
          <div 
            ref={setContainerRef}
            className="relative w-full"
            style={{ 
              height: containerHeight > 0 ? `${containerHeight}px` : 'auto',
              minHeight: '400px' // Ensure minimum height
            }}
          >
            {projects.map((project, index) => {
              const itemLayout = layout[index];
              
              // Debug each item's position
              if (itemLayout) {
                console.log(`Project ${index}:`, {
                  title: project.title,
                  x: itemLayout.x,
                  y: itemLayout.y,
                  width: itemLayout.width
                });
              }
              
              return (
                <ProjectCard 
                  key={project.id || index} 
                  project={project} 
                  index={index} 
                  inView={inView}
                  style={itemLayout ? {
                    transform: `translate3d(${itemLayout.x}px, ${itemLayout.y}px, 0)`,
                    width: `${itemLayout.width}px`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  } : {
                    position: 'absolute',
                    top: `${index * 50}px`, // Fallback stacking
                    left: 0,
                    width: '100%',
                  }}
                />
              );
            })}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-cyan-400/10 blur-2xl"></div>
          <div className="absolute bottom-1/4 left-10 w-32 h-32 rounded-full bg-cyan-400/5 blur-3xl"></div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 L0 0 0 40" stroke="rgba(66,188,188,0.2)" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(66,188,188,0.1)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#grad)" />
          </svg>
        </div>
      </div>
    </section>
  );
};