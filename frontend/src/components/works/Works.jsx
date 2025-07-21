import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import projects from "./projects.json";
import { FaGithub } from "react-icons/fa";

// Helper to truncate description to 15 words
const truncateDescription = (desc) => {
  const words = desc.split(" ");
  if (words.length <= 15) return desc;
  return (
    <>
      {words.slice(0, 15).join(" ")}
      <span className="text-cyan-400">   ........ continue reading</span>
    </>
  );
};

const ProjectCard = ({ project, index, inView, onClick }) => {
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
      onClick={() => onClick(project)}
      className="w-full mb-8"
    >
      <div className="group h-full bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer hover:translate-x-2 hover:shadow-cyan-400/10 hover:shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Image container - left side on md+ screens */}
          <div className="relative h-[25rem] md:h-[25rem] md:w-2/5 flex items-center justify-center overflow-hidden bg-black">
            <img
              src={project.images && project.images.length > 0 ? project.images[0] : project.image}
              alt={project.title}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = 'https://placehold.co/800x600/1f2937/cccccc?text=Image+Not+Found';
              }}
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          </div>
          
          {/* Content container - right side on md+ screens */}
          <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-sans font-bold text-white group-hover:text-cyan-400 transition-colors mb-4">
                {project.title}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium font-mono text-cyan-400 bg-cyan-400/10 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="px-3 py-1 text-xs font-medium font-mono text-cyan-400 bg-cyan-400/10 rounded-full">
                    +{project.tags.length - 4}
                  </span>
                )}
              </div>
              
              <p className="text-gray-300 text-sm line-clamp-3 mb-6" style={{ fontFamily: "ChocoCooky" }}>
                {truncateDescription(project.description)}
              </p>
            </div>
            
            <motion.div
              whileHover={{ x: 5 }}
              className="inline-flex items-center font-sans text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Explore Project
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Modal image slider with underscore indicators
const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentImg, setCurrentImg] = useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentImg(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, project]);

  if (!project) return null;

  const images = project.images && project.images.length > 0 ? project.images : [project.image];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'pointer-events-none'}`}
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      variants={overlayVariants}
      transition={{ duration: 0.2 }}
    >
      {/* Click-to-close backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md z-10"
        onClick={onClose}
      ></div>
      <motion.div
        className="relative z-20 bg-gray-800/80 backdrop-blur-md border border-cyan-400/20 rounded-xl w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        transition={{ duration: 0.3, delay: 0.1 }}
        onClick={e => e.stopPropagation()}
      >
        {/* X Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-30 p-2 hover:bg-white/10 rounded-full transition-colors text-2xl font-bold"
          aria-label="Close modal"
        >
          ×
        </button>
        {/* Image slider */}
        <div className="relative flex items-center justify-center w-full bg-black" style={{ minHeight: '300px', maxHeight: '70vh' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
          <img
            src={images[currentImg]}
            alt={project.title}
            className="max-h-[65vh] w-auto max-w-full object-contain mx-auto z-20"
            style={{ display: 'block', background: '#111', margin: '0 auto' }}
          />
          {images.length > 1 && (
            <>
              {/* Prev/Next buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-cyan-400/30 text-white rounded-full p-2 z-20"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-cyan-400/30 text-white rounded-full p-2 z-20"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {/* Underscore indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`block h-1 rounded transition-all duration-300 ${idx === currentImg ? "w-8 bg-cyan-400" : "w-4 bg-gray-400/40"}`}
                  ></span>
                ))}
              </div>
            </>
          )}
          <div className="absolute bottom-0 left-0 p-6 z-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{project.title}</h2>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-300" style={{ fontFamily: "ChocoCooky" }}>{project.description}</p>
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium font-mono text-cyan-400 bg-cyan-400/10 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 font-medium rounded-lg transition-colors"
            >
              View Live Project
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-3 bg-gray-900 hover:bg-gray-800 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400 rounded-lg transition-colors"
                title="View GitHub Repository"
              >
                <FaGithub className="w-5 h-5 mr-2" />
                <span className="font-medium">GitHub Repo</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Works = () => {
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed to false to animate cards as user scrolls
    threshold: 0.1,
  });
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleCardClick = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null); // <-- Add this line
  };

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

                    {/* Header  Text*/}


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
          
          {/* Project Cards - now in a vertical list */}
          <div className="space-y-4">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                inView={inView}
                onClick={handleCardClick}
              />
            ))}
          </div>
          
          {/* Project detail modal */}
          <ProjectModal 
            project={selectedProject}
            isOpen={modalOpen}
            onClose={closeModal}
          />
          
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