import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaGithub, FaExternalLinkAlt, FaClock, FaCodeBranch, FaCircle } from "react-icons/fa";
import projectsData from "./projects.json";
import { getRandomDirection } from "../../utils/getRandomDirection";

// Process projects data and add lastUpdated field based on status
const processProjects = (projects) => {
  return projects.map(project => {
    // Generate realistic lastUpdated dates based on project status
    let lastUpdated;
    const now = new Date();

    switch (project.status) {
      case 'active':
        // Recently updated (1–30 days ago)
        lastUpdated = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        break;
      case 'dormant':
        // Left alone for 2–12 months
        lastUpdated = new Date(now.getTime() - (60 + Math.random() * 300) * 24 * 60 * 60 * 1000);
        break;
      case 'experimental':
        // Updated anytime, but mostly quick bursts (1–14 days ago)
        lastUpdated = new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000);
        break;
      case 'archived':
        // Really old stuff (1–3 years ago)
        lastUpdated = new Date(now.getTime() - (365 + Math.random() * 730) * 24 * 60 * 60 * 1000);
        break;
      default:
        lastUpdated = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    }
    

    return {
      ...project,
      lastUpdated: lastUpdated.toISOString().split('T')[0] // Format as YYYY-MM-DD
    };
  });
};

const projects = processProjects(projectsData);

const ProjectCard = ({ project, index, isFlipped, onFlip, isInView, onClickOutside }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const cardRef = useRef(null);

  // Image carousel for in-view cards only - optimized with longer intervals
  useEffect(() => {
    if (!isInView || !project.images || project.images.length <= 1) return;

    const interval = setInterval(() => {
      setSlideDirection(getRandomDirection());
      setCurrentImageIndex(prev => (prev + 1) % project.images.length);
    }, 4000 + Math.random() * 2000); // Longer intervals for smoother experience

    return () => clearInterval(interval);
  }, [isInView, project.images]);

  // Handle click outside to close flipped card
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFlipped && cardRef.current && !cardRef.current.contains(event.target)) {
        onClickOutside(index);
      }
    };

    if (isFlipped) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isFlipped, index, onClickOutside]);

  // Memoize date formatting and status config for performance
  const formattedDate = useMemo(() => {
    const date = new Date(project.lastUpdated);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }, [project.lastUpdated]);

  const statusConfig = useMemo(() => {
    const configs = {
      active: {
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        borderColor: "border-emerald-400/30",
        label: "Active",
      },
      dormant: {
        color: "text-gray-400",
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/30",
        label: "Dormant",
      },
      experimental: {
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/30",
        label: "Experimental",
      },
      archived: {
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/30",
        label: "Archived",
      },
    };
    return configs[project.status] || configs["dormant"];
  }, [project.status]);
  


  const isLeft = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`w-full max-w-2xl mx-auto mb-16 md:mb-32 ${isLeft ? 'md:ml-8' : 'md:mr-8 md:ml-auto'} snap-start`}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.15, duration: 0.5 }}
        className="relative cursor-pointer group h-80 md:h-96 works-card-container"
        onClick={onFlip}
      >
        {/* Card Container */}
        <div
          className="w-full h-full relative transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
          }}
        >
          {/* Front Side - Windows 8 Style */}
          <div
            className="absolute inset-0 works-card-face"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            <div className="w-full h-full bg-gray-800/90 backdrop-blur-sm relative overflow-hidden shadow-2xl hover:shadow-cyan-400/10 transition-shadow duration-300 border border-gray-700/50 rounded-xl">

              {/* Background Image Carousel */}
              {project.images && project.images.length > 0 && (
                <div className="absolute inset-0">
                  <AnimatePresence mode="sync">


                    <motion.div
                      key={currentImageIndex}
                      initial={{
                        x: slideDirection === 'right' ? '100%' : slideDirection === 'left' ? '-100%' : '0%',
                        y: slideDirection === 'down' ? '100%' : slideDirection === 'up' ? '-100%' : '0%',
                        opacity: 0.7
                      }}
                      animate={{ x: '0%', y: '0%', opacity: 1 }}
                      exit={{
                        x: slideDirection === 'right' ? '-100%' : slideDirection === 'left' ? '100%' : '0%',
                        y: slideDirection === 'down' ? '-100%' : slideDirection === 'up' ? '100%' : '0%',
                        opacity: 0.7
                      }}
                      transition={{
                        duration: 1.2,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="absolute inset-0"
                    >
                      <img
                        src={project.images[currentImageIndex]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60" />
                    </motion.div>

                  </AnimatePresence>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${statusConfig.bgColor} ${statusConfig.borderColor} border backdrop-blur-sm`}>
                  <div className={`w-2 h-2 ${statusConfig.color.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                  <span className={`text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Image Indicators */}
              {project.images && project.images.length > 1 && (
                <div className="absolute top-4 left-4 flex space-x-1">
                  {project.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-cyan-400' : 'bg-white/30'
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <motion.div
                  key={project.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-3"
                >
                  <h3 className="text-2xl md:text-3xl font-light text-white drop-shadow-lg">
                    {project.title}
                  </h3>

                  <p className="text-white/90 text-sm md:text-base line-clamp-2 drop-shadow">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-xl text-xs bg-cyan-400/20 backdrop-blur-sm text-cyan-400 border border-cyan-400/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags?.length > 3 && (
                      <span className="px-2 py-1 rounded-xl text-xs bg-white/10 backdrop-blur-sm text-white/70 border border-white/20">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                    <span>Click to view details</span>
                  </div>
                </motion.div>
              </div>

              {/* Hover Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  style={{
                    animation: "shimmer 2s ease-in-out infinite",
                    transform: "skewX(-12deg) translateX(-100%)"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Back Side - Detailed Information */}
          <div
            className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm border border-gray-700 works-card-face rounded-xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="w-full h-full p-4 md:p-6 flex flex-col overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0">
                <h3 className="text-lg md:text-xl lg:text-2xl font-light text-theme-text-primary truncate pr-2">
                  {project.title}
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); onFlip(); }}
                  className="text-theme-text-secondary hover:text-theme-text-primary transition-colors flex-shrink-0 p-1"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <div className="flex-1 overflow-y-auto mb-3 md:mb-4 min-h-0">
                <p className="text-theme-text-secondary text-xs md:text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Full Tech Stack */}
              <div className="mb-3 md:mb-4 flex-shrink-0">
                <h4 className="text-theme-accent text-xs md:text-sm font-medium mb-2">Stack Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 md:px-3 py-1 rounded-xl text-xs bg-theme-accent/10 text-theme-accent border border-theme-accent/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 flex-shrink-0">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 bg-theme-accent/10 hover:bg-theme-accent/20 border border-theme-accent/30 text-theme-accent font-medium transition-colors no-underline text-xs md:text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaExternalLinkAlt className="w-4 h-4" />
                    <span className="hidden sm:inline">Live Demo</span>
                    <span className="sm:hidden">Demo</span>
                  </a>
                )}

                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 bg-theme-surface hover:bg-theme-hover border border-theme-border text-theme-text-secondary hover:text-theme-text-primary font-medium transition-colors no-underline text-xs md:text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGithub className="w-4 h-4" />
                    <span className="hidden sm:inline">Source Code</span>
                    <span className="sm:hidden">Code</span>
                  </a>
                )}
              </div>

              {/* Footer
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className={`w-2 h-2 ${statusConfig.color.replace('text-', 'bg-')} rounded-full`}></div>
                  <span>{statusConfig.label}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {formattedDate}
                </div>
              </div> */}


            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Works = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [flippedCards, setFlippedCards] = useState(new Set());
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Track which cards are in view for carousel functionality
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set(prev).add(index));
          } else {
            setVisibleCards(prev => {
              const newSet = new Set(prev);
              newSet.delete(index);
              return newSet;
            });
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const handleCardFlip = useCallback((index) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleClickOutside = useCallback((index) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }, []);

  return (
    <section
      ref={ref}
      id="works"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
    >
      <div className="w-full max-w-[86rem] mx-auto relative">
        {/* Glassmorphism container */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-none md:rounded-3xl shadow-lg shadow-cyan-400/5"></div>
        <div className="relative p-6 md:p-10 z-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaCodeBranch className="text-cyan-400 text-2xl animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-light text-white">
                Featured Works
              </h2>
            </div>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              These are collections of my Top projects. They showcase my best work, and the lengths i went while learning solo
            </p>
          </motion.div>

          {/* Projects Container with Scroll Snap */}
          <div className="overflow-y-auto snap-y snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
            <div className="space-y-8 md:space-y-16">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  ref={el => cardRefs.current[index] = el}
                  className="snap-start"
                >
                  <ProjectCard
                    project={project}
                    index={index}
                    isFlipped={flippedCards.has(index)}
                    onFlip={() => handleCardFlip(index)}
                    onClickOutside={handleClickOutside}
                    isInView={visibleCards.has(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16 text-gray-400"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaCircle className="text-cyan-400 text-xs animate-pulse" />
              <span className="font-mono text-sm">
                {projects.length} projects loaded
              </span>
            </div>
            <p className="text-sm">Microsoft Windows 8 inspired • Startmenu Tiles</p>
              <p className="text-sm">Check out the <span>repo</span> and play with it to your liking</p>
          </motion.div>

        </div>

        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-cyan-400/10 blur-2xl"></div>
        <div className="absolute bottom-1/4 left-10 w-32 h-32 rounded-full bg-cyan-400/5 blur-3xl"></div>

        {/* Background grid/pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-none md:rounded-3xl">
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="works-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 L0 0 0 40" stroke="rgba(66,188,188,0.2)" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="works-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(66,188,188,0.1)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#works-grid)" />
            <rect width="100%" height="100%" fill="url(#works-grad)" />
          </svg>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: skewX(-12deg) translateX(-100%); }
          100% { transform: skewX(-12deg) translateX(200%); }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Mobile Responsive Adjustments */
        @media (max-width: 768px) {
          .max-w-2xl {
            max-width: calc(100vw - 2rem);
          }
        }

        @media (max-width: 480px) {
          .max-w-2xl {
            max-width: calc(100vw - 1rem);
          }
        }
      `}</style>
    </section>
  );
};