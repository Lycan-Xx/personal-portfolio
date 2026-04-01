import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaClock,
  FaCodeBranch,
  FaCircle,
} from "react-icons/fa";
import { useProjects } from "../../hooks/useProjects";
import { formatLastUpdated } from "../../utils/dateHelpers";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SLIDE_DIRECTIONS = ["left", "right", "up", "down"];
const CAROUSEL_INTERVAL = 4000;
const SLIDE_DURATION = 0.65; // was 1.2s — halved so the gap is imperceptible

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return null;
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop";

// ─── IMAGE PRELOADER ──────────────────────────────────────────────────────────
// Loads all image URLs for a project silently so the browser has them cached
// before the carousel tries to display them — eliminates the gap.
const preloadImages = (images = []) => {
  images.forEach((img) => {
    const url = getImageUrl(img);
    if (url) {
      const el = new Image();
      el.src = url;
    }
  });
};

// Build slide variants once — avoids recalculating on every render
const buildSlideVariants = (direction) => {
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "right" || direction === "down" ? 1 : -1;

  return {
    enter: { [axis]: `${sign * 100}%`, opacity: 0 },
    center: { [axis]: "0%", opacity: 1 },
    exit: { [axis]: `${sign * -100}%`, opacity: 0 },
  };
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active: {
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-secondary",
    label: "Active",
  },
  dormant: {
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-secondary",
    label: "Dormant",
  },
  experimental: {
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-secondary",
    label: "Experimental",
  },
  archived: {
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-secondary",
    label: "Archived",
  },
};

// ─── IMAGE CAROUSEL ───────────────────────────────────────────────────────────
// Isolated into its own component so only the carousel re-renders on tick,
// not the entire ProjectCard.
const ImageCarousel = React.memo(({ images, isInView, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection]       = useState("right");
  // Store direction in a ref too so we can read it inside the interval
  // without adding it to the dependency array.
  const directionRef = useRef(direction);
  directionRef.current = direction;

  // Preload all images as soon as the card becomes visible
  useEffect(() => {
    if (isInView) preloadImages(images);
  }, [isInView, images]);

  // Single interval per carousel instance
  useEffect(() => {
    if (!isInView || images.length <= 1) return;

    const timer = setInterval(() => {
      const nextDir =
        SLIDE_DIRECTIONS[Math.floor(Math.random() * SLIDE_DIRECTIONS.length)];
      setDirection(nextDir);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(timer);
  }, [isInView, images.length]);

  const variants = useMemo(() => buildSlideVariants(direction), [direction]);
  const currentUrl = getImageUrl(images[currentIndex]) || FALLBACK_IMG;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/*
        mode="sync" so enter and exit animations overlap — no gap.
        The exiting image slides out while the entering one slides in simultaneously,
        exactly like the Windows 8 tile motion you're going for.
      */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: SLIDE_DURATION,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="absolute inset-0"
        >
          <img
            src={currentUrl}
            alt={images[currentIndex]?.alt || title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 h-2.5 bg-cyan-400"
                  : "w-2.5 h-2.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ImageCarousel.displayName = "ImageCarousel";

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
const ProjectCard = React.memo(
  ({ project, index, isFlipped, onFlip, isInView, onClickOutside }) => {
    const cardRef = useRef(null);

    // Click-outside to close
    useEffect(() => {
      if (!isFlipped) return;
      const handler = (e) => {
        if (cardRef.current && !cardRef.current.contains(e.target)) {
          onClickOutside(index);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isFlipped, index, onClickOutside]);

    const formattedDate = useMemo(
      () => formatLastUpdated(project.lastUpdated || project._updatedAt),
      [project.lastUpdated, project._updatedAt]
    );

    const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.dormant;
    const isLeft = index % 2 === 0;
    const images = project.images || [];

    return (
      <div
        ref={cardRef}
        className={`w-full max-w-2xl mx-auto mb-16 md:mb-32 snap-start ${
          isLeft ? "md:ml-8" : "md:mr-8 md:ml-auto"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.12, duration: 0.45 }}
          className="relative cursor-pointer group h-80 md:h-96"
          onClick={onFlip}
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/*
            The flip container must be a plain div — NOT a motion.div.
            Framer Motion's transform reconciliation overwrites transformStyle,
            which collapses the 3D context and makes both faces visible at once.
          */}
          <div
            className="w-full h-full relative"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* ── FRONT ── */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              {/*
                backdrop-blur creates a new stacking context which breaks
                backface-visibility. Replaced with a solid bg + manual blur
                on a pseudo-layer so the 3D isolation is preserved.
              */}
              <div className="w-full h-full bg-gray-800/90 relative overflow-hidden shadow-2xl hover:shadow-cyan-400/10 transition-shadow duration-300 border border-white/[0.08] hover:border-cyan-400/35 rounded-xl">

                {/* Carousel — only rendered when there are images */}
                {images.length > 0 ? (
                  <ImageCarousel
                    images={images}
                    isInView={isInView}
                    title={project.title}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-900" />
                )}

                {/* Status badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${statusConfig.bgColor} ${statusConfig.borderColor} border backdrop-blur-sm`}
                  >
                    <div
                      className={`w-2 h-2 ${statusConfig.color.replace(
                        "text-",
                        "bg-"
                      )} rounded-full animate-pulse`}
                    />
                    <span className={`text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-3 py-1.5 rounded-xl bg-yellow-500/20 border border-secondary backdrop-blur-sm">
                      <span className="text-xs font-medium text-yellow-400">
                        Featured
                      </span>
                    </div>
                  </div>
                )}

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-light font-mono text-white drop-shadow-lg">
                      {project.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base line-clamp-2 font-mono drop-shadow">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-400/[0.08] text-cyan-400/65"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags?.length > 3 && (
                        <span className="px-2 py-1 rounded-xl text-xs font-mono bg-white/10 backdrop-blur-sm text-white/70 border border-secondary">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/70 font-mono">
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        <span>{formattedDate}</span>
                      </div>
                      <span>Click to view details</span>
                    </div>
                  </div>
                </div>

                {/* Hover shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer-anim" />
                </div>
              </div>
            </div>

            {/* ── BACK ── */}
            <div
              className="absolute inset-0 bg-gray-900 border border-secondary rounded-xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="w-full h-full p-4 md:p-6 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <h3 className="text-lg md:text-2xl font-light text-white font-mono truncate pr-2">
                    {project.title}
                  </h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); onFlip(); }}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto mb-3 min-h-0">
                  <p className="text-gray-300 text-xs md:text-sm font-mono leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mb-3 flex-shrink-0">
                  <h4 className="text-cyan-400 text-xs md:text-sm font-medium font-mono mb-2">
                    Stack Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 md:px-3 py-1 rounded-xl text-xs font-mono bg-cyan-400/10 text-cyan-400 border border-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3 flex-shrink-0">
                  {(project.link || project.liveLink) && (
                    <a
                      href={project.link || project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 rounded-xl flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 bg-cyan-400/10 hover:bg-cyan-400/20 border border-secondary hover:border-secondary text-cyan-400 font-medium transition-colors no-underline text-xs md:text-sm"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      <span className="hidden sm:inline">Live Demo</span>
                      <span className="sm:hidden">Demo</span>
                    </a>
                  )}
                  {(project.repo || project.repoLink) && (
                    <a
                      href={project.repo || project.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 rounded-xl flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-secondary hover:border-secondary text-gray-300 hover:text-white font-medium transition-colors no-underline text-xs md:text-sm"
                    >
                      <FaGithub className="w-4 h-4" />
                      <span className="hidden sm:inline">Source Code</span>
                      <span className="sm:hidden">Code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

// ─── WORKS SECTION ────────────────────────────────────────────────────────────
export const Works = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { projects, loading, error } = useProjects();
  const [flippedCards, setFlippedCards]   = useState(new Set());
  const [visibleCards, setVisibleCards]   = useState(new Set());
  const cardRefs = useRef([]);

  // Track per-card visibility for carousel pause-when-offscreen
  useEffect(() => {
    if (!projects?.length) return;

    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          setVisibleCards((prev) => {
            const next = new Set(prev);
            entry.isIntersecting ? next.add(i) : next.delete(i);
            return next;
          });
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, [projects]);

  const handleFlip = useCallback((index) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

  const handleClickOutside = useCallback((index) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);

  // ── States ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="relative min-h-screen py-20 z-20 flex items-center justify-center">
          <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-secondary mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-sm">Loading projects…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen py-20 z-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading projects</p>
          <p className="text-gray-500 text-sm mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-400/10 border border-secondary hover:border-secondary text-cyan-400 rounded-xl hover:bg-cyan-400/20 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!projects?.length) {
    return (
      <section className="relative min-h-screen py-20 z-20 flex items-center justify-center">
        <div className="text-center">
          <FaCodeBranch className="text-cyan-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-400">No projects found</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="works"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
    >
      <div className="w-full max-w-[86rem] mx-auto relative">

        {/* Glassmorphism backdrop */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-none md:rounded-3xl shadow-lg shadow-cyan-400/5" />

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
              <h2 className="text-4xl md:text-5xl font-light text-white font-mono">
                Featured Works
              </h2>
            </div>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6" />
            <p className="text-gray-300 max-w-2xl mx-auto text-lg font-mono">
              These are collections of my top projects. They showcase my best
              work, and the lengths I went while learning solo.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="space-y-8 md:space-y-16">
            {projects.map((project, index) => (
              <div
                key={project._id || project.id}
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  isFlipped={flippedCards.has(index)}
                  onFlip={() => handleFlip(index)}
                  onClickOutside={handleClickOutside}
                  isInView={visibleCards.has(index)}
                />
              </div>
            ))}
          </div>

          {/* Footer note */}
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
            <p className="text-sm font-mono">
              Windows 8 tile motion inspired · Click any card to flip
            </p>
          </motion.div>
        </div>

      </div>

      <style>{`
        @keyframes shimmer-slide {
          0%   { transform: skewX(-12deg) translateX(-150%); }
          100% { transform: skewX(-12deg) translateX(250%); }
        }
        .shimmer-anim {
          animation: shimmer-slide 2.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};