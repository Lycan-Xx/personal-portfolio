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
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useProjects } from "../../hooks/useProjects";
import { formatLastUpdated } from "../../utils/dateHelpers";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CAROUSEL_INTERVAL = 4000;
const SLIDE_DURATION = 0.55;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return null;
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop";

const preloadImages = (images = []) => {
  images.forEach((img) => {
    const url = getImageUrl(img);
    if (url) {
      const el = new Image();
      el.src = url;
    }
  });
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active: {
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    text: "text-emerald-400",
    badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    label: "active",
  },
  dormant: {
    dot: "bg-slate-500",
    text: "text-slate-400",
    badge: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    label: "dormant",
  },
  experimental: {
    dot: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]",
    text: "text-violet-400",
    badge: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    label: "experimental",
  },
  archived: {
    dot: "bg-rose-500",
    text: "text-rose-400",
    badge: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    label: "archived",
  },
};

// ─── IMAGE CAROUSEL (drawer version — large) ─────────────────────────────────
const DrawerCarousel = React.memo(({ images, title }) => {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    preloadImages(images);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setDir(1);
      setCurrent((p) => (p + 1) % images.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(t);
  }, [images.length]);

  const goTo = useCallback((idx) => {
    setDir(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const prev = () => {
    setDir(-1);
    setCurrent((p) => (p - 1 + images.length) % images.length);
  };
  const next = () => {
    setDir(1);
    setCurrent((p) => (p + 1) % images.length);
  };

  const currentUrl = getImageUrl(images[current]) || FALLBACK_IMG;

  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden group">
      <AnimatePresence mode="sync" initial={false} custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          variants={{
            enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
            center: { x: "0%", opacity: 1 },
            exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: SLIDE_DURATION, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img
            src={currentUrl}
            alt={images[current]?.alt || title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7
                       rounded-full bg-black/50 flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-black/70 text-white"
          >
            <FaChevronLeft size={10} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7
                       rounded-full bg-black/50 flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-black/70 text-white"
          >
            <FaChevronRight size={10} />
          </button>

          {/* Dot strip */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-4 h-1.5 bg-[var(--color-accent)]"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});
DrawerCarousel.displayName = "DrawerCarousel";

// ─── SMALL CARD THUMBNAIL ─────────────────────────────────────────────────────
const CardThumbnail = React.memo(({ images, isVisible, title }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isVisible || images.length <= 1) return;
    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, CAROUSEL_INTERVAL + 800);
    return () => clearInterval(t);
  }, [isVisible, images.length]);

  const url = getImageUrl(images[current]) || FALLBACK_IMG;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-t-xl">
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={current}
          src={url}
          alt={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    </div>
  );
});
CardThumbnail.displayName = "CardThumbnail";

// ─── PROJECT WALL CARD ────────────────────────────────────────────────────────
const ProjectCard = React.memo(({ project, index, isSelected, onClick, isVisible, inView }) => {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.dormant;
  const images = project.images || [];
  const formattedDate = useMemo(
    () => formatLastUpdated(project.lastUpdated || project._updatedAt),
    [project.lastUpdated, project._updatedAt]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={onClick}
      className={`relative rounded-xl cursor-pointer overflow-hidden
                  border transition-all duration-300 group
                  ${isSelected
                    ? "border-[var(--color-accent)]/60 shadow-[0_0_20px_rgba(66,188,188,0.15)]"
                    : "border-[var(--color-accent)]/15 hover:border-[var(--color-accent)]/35"
                  }`}
      style={{ background: "rgba(15,23,42,0.85)" }}
    >
      {/* Thumbnail area */}
      <div className="relative h-36 overflow-hidden rounded-t-xl bg-slate-900">
        {images.length > 0 ? (
          <CardThumbnail images={images} isVisible={isVisible} title={project.title} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}

        {/* Featured badge */}
        {project.featured && (
          <div
            className="absolute top-2 left-2 z-10 text-[8px] px-2 py-0.5 rounded
                       text-[var(--color-secondary)] bg-[var(--color-secondary)]/10
                       border border-[var(--color-secondary)]/25"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            featured
          </div>
        )}

        {/* Status dot */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
        </div>

        {/* Selected indicator — cyan left border glow */}
        {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent)] z-20" />
        )}
      </div>

      {/* Card body */}
      <div className="p-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            className="text-white leading-tight line-clamp-1 flex-1"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", fontWeight: 600 }}
          >
            {project.title}
          </h3>
          <span className={`text-[8px] flex-shrink-0 px-1.5 py-0.5 rounded border ${status.badge}`}>
            {status.label}
          </span>
        </div>

        <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
          {project.description}
        </p>

        {/* Tags — first 2 only */}
        <div className="flex gap-1.5 flex-wrap">
          {(project.tags || []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[8px] px-1.5 py-0.5 rounded
                         text-[var(--color-accent)]/70 bg-[var(--color-accent)]/5
                         border border-[var(--color-accent)]/15"
            >
              {tag}
            </span>
          ))}
          {(project.tags || []).length > 2 && (
            <span className="text-[8px] px-1.5 py-0.5 rounded text-slate-600 bg-slate-800/50 border border-slate-700/30">
              +{project.tags.length - 2}
            </span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-[var(--color-accent)]/8">
          <FaClock size={8} className="text-slate-500" />
          <span className="text-[8px] text-slate-500">{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
});
ProjectCard.displayName = "ProjectCard";

// ─── DETAIL DRAWER ────────────────────────────────────────────────────────────
const DetailDrawer = ({ project, onClose, projects, onNavigate }) => {
  const status = STATUS_CONFIG[project?.status] || STATUS_CONFIG.dormant;
  const images = project?.images || [];
  const currentIdx = projects.findIndex((p) => (p._id || p.id) === (project?._id || project?.id));
  const formattedDate = useMemo(
    () => formatLastUpdated(project?.lastUpdated || project?._updatedAt),
    [project?.lastUpdated, project?._updatedAt]
  );

  return (
    <motion.div
      key={project?._id || project?.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex flex-col h-full"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      {/* Drawer top bar */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
          <span className="text-[9px] text-slate-400">
            {currentIdx + 1} / {projects.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => currentIdx > 0 && onNavigate(projects[currentIdx - 1])}
            disabled={currentIdx === 0}
            className="w-6 h-6 rounded flex items-center justify-center
                       text-[var(--color-accent)]/40 border border-[var(--color-accent)]/10
                       hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30
                       hover:bg-[var(--color-accent)]/5 disabled:opacity-20 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            <FaChevronLeft size={9} />
          </button>
          <button
            onClick={() => currentIdx < projects.length - 1 && onNavigate(projects[currentIdx + 1])}
            disabled={currentIdx === projects.length - 1}
            className="w-6 h-6 rounded flex items-center justify-center
                       text-[var(--color-accent)]/40 border border-[var(--color-accent)]/10
                       hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30
                       hover:bg-[var(--color-accent)]/5 disabled:opacity-20 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            <FaChevronRight size={9} />
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center ml-1
                       text-slate-600 border border-slate-700/40
                       hover:text-slate-300 hover:border-slate-500
                       transition-all duration-150"
          >
            <FaTimes size={9} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      {images.length > 0 && (
        <div className="flex-shrink-0 mb-4">
          <DrawerCarousel images={images} title={project.title} />
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-4
                      scrollbar-thin scrollbar-thumb-[var(--color-accent)]/20
                      scrollbar-track-transparent">

        {/* Title block */}
        <div>
          {/* Commit-style hash line */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] text-slate-500">
              commit{" "}
              <span className="text-[var(--color-accent)]/40">
                {(project._id || project.id || "").toString().slice(0, 7) || "a1b2c3d"}
              </span>
            </span>
            <div className="flex-1 h-px bg-[var(--color-accent)]/8" />
          </div>

          {/* Status + type badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-[9px] px-2 py-0.5 rounded border ${status.badge}`}>
              {status.label}
            </span>
            {project.featured && (
              <span
                className="text-[9px] px-2 py-0.5 rounded border
                           text-[var(--color-secondary)] bg-[var(--color-secondary)]/8
                           border-[var(--color-secondary)]/25"
              >
                featured
              </span>
            )}
          </div>

          <h2
            className="text-white leading-tight mb-1"
            style={{ fontFamily: "ChocoCooky", fontSize: "clamp(28px, 3vw, 32px)" }}
          >
            {project.title}
          </h2>

          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 text-[9px] text-slate-400">
              <FaClock size={8} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-accent)]/8" />

        {/* Description */}
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {project.description}
        </p>

        {/* Full stack */}
        {(project.tags || []).length > 0 && (
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">
              stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] px-2 py-0.5 rounded border
                             text-[var(--color-accent)] bg-[var(--color-accent)]/5
                             border-[var(--color-accent)]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-2 pt-1">
          {(project.link || project.liveLink) && (
            <a
              href={project.link || project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                         text-[10px] font-medium no-underline transition-all duration-200
                         text-[var(--color-accent)] bg-[var(--color-accent)]/8
                         border border-[var(--color-accent)]/20
                         hover:bg-[var(--color-accent)]/15 hover:border-[var(--color-accent)]/40"
            >
              <FaExternalLinkAlt size={10} />
              Live Demo
            </a>
          )}
          {(project.repo || project.repoLink) && (
            <a
              href={project.repo || project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                         text-[10px] font-medium no-underline transition-all duration-200
                         text-slate-400 bg-slate-800/50
                         border border-slate-700/40
                         hover:bg-slate-700/50 hover:text-white hover:border-slate-600"
            >
              <FaGithub size={10} />
              Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── MOBILE CARD (full-width stacked) ────────────────────────────────────────
const MobileProjectCard = ({ project, index, inView }) => {
  const [open, setOpen] = useState(false);
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.dormant;
  const images = project.images || [];
  const formattedDate = useMemo(
    () => formatLastUpdated(project.lastUpdated || project._updatedAt),
    [project.lastUpdated, project._updatedAt]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="rounded-xl border border-[var(--color-accent)]/15 overflow-hidden mb-4"
      style={{ background: "rgba(15,23,42,0.85)", fontFamily: "JetBrains Mono, monospace" }}
    >
      {/* Image */}
      {images.length > 0 && (
        <div className="relative h-40 bg-slate-900">
          <DrawerCarousel images={images} title={project.title} />
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "14px", fontWeight: 600 }}>
            {project.title}
          </h3>
          <span className={`text-[8px] px-2 py-0.5 rounded border flex-shrink-0 ${status.badge}`}>
            {status.label}
          </span>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(project.tags || []).slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[8px] px-1.5 py-0.5 rounded
                         text-[var(--color-accent)]/70 bg-[var(--color-accent)]/5
                         border border-[var(--color-accent)]/15"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-2">
          {(project.link || project.liveLink) && (
            <a
              href={project.link || project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                         text-[9px] no-underline
                         text-[var(--color-accent)] bg-[var(--color-accent)]/8
                         border border-[var(--color-accent)]/20"
            >
              <FaExternalLinkAlt size={9} /> Live Demo
            </a>
          )}
          {(project.repo || project.repoLink) && (
            <a
              href={project.repo || project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                         text-[9px] no-underline
                         text-slate-400 bg-slate-800/50 border border-slate-700/40"
            >
              <FaGithub size={9} /> Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN WORKS COMPONENT ────────────────────────────────────────────────────
export const Works = () => {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [gridRef, gridInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [mobileRef, mobileInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const { projects, loading, error } = useProjects();
  const [selected, setSelected] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  // Track per-card visibility for carousel throttling
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
        { threshold: 0.2 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [projects]);

  // Auto-select first project on desktop
  useEffect(() => {
    if (projects?.length && !selected) {
      setSelected(projects[0]);
    }
  }, [projects]);

  // Close drawer on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Loading / error / empty ──────────────────────────────────────────────
  if (loading) {
    return (
      <section className="relative min-h-screen py-20 z-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b border-[var(--color-accent)] mx-auto mb-4" />
          <p
            className="text-slate-500 text-[11px]"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            loading projects…
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen py-20 z-20 flex items-center justify-center">
        <div
          className="text-center"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          <p className="text-rose-400 text-[11px] mb-2">error loading projects</p>
          <p className="text-slate-600 text-[10px] mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[10px] px-4 py-2 rounded-lg
                       text-[var(--color-accent)] bg-[var(--color-accent)]/8
                       border border-[var(--color-accent)]/20
                       hover:bg-[var(--color-accent)]/15 transition-colors"
          >
            retry
          </button>
        </div>
      </section>
    );
  }

  if (!projects?.length) {
    return (
      <section className="relative min-h-screen py-20 z-20 flex items-center justify-center">
        <div
          className="text-center"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          <FaCodeBranch className="text-[var(--color-accent)] text-3xl mx-auto mb-3 opacity-40" />
          <p className="text-slate-600 text-[11px]">no projects found</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
    >
      <div className="w-full max-w-[86rem] mx-auto relative">

        {/* Glass backdrop */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-none md:rounded-3xl" />
        <div className="absolute inset-0 bg-black/50 rounded-none md:rounded-3xl" />

        <div className="relative p-6 md:p-10 z-10">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2
              className="text-white relative inline-block pb-2
                         after:content-[''] after:absolute after:bottom-0 after:left-0
                         after:w-2/3 after:h-[2px] after:bg-[var(--color-accent)]"
              style={{ fontFamily: "ChocoCooky", fontSize: "clamp(28px, 4vw, 40px)" }}
            >
              {"< Works />"}
            </h2>
            <p
              className="mt-3 text-slate-500 text-[10px]"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {`// ${projects.filter((p) => p.status === "active").length} active · ${projects.length} total`}
            </p>
          </motion.div>

          {/* ── DESKTOP: Card Wall + Drawer ── */}
          <div className="hidden md:flex gap-0 rounded-2xl overflow-hidden
                          border border-[var(--color-accent)]/15 min-h-[640px]">

            {/* LEFT: Scrollable card wall */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={sectionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              ref={gridRef}
              className={`transition-all duration-300 ease-in-out overflow-y-auto
                          bg-black/40 border-r border-[var(--color-accent)]/12
                          ${selected ? "w-[52%]" : "w-full"}`}
            >
              {/* Wall header */}
              <div
                className="sticky top-0 z-10 px-5 py-3 border-b border-[var(--color-accent)]/10
                           bg-black/60 backdrop-blur-sm flex items-center justify-between"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                <p className="text-[10px] text-slate-500 tracking-widest uppercase">
                  repository
                </p>
                <div className="flex items-center gap-3">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const count = projects.filter((p) => p.status === key).length;
                    if (!count) return null;
                    return (
                      <div key={key} className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span className={`text-[8px] ${cfg.text}`}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid */}
              <div
                className={`p-4 grid gap-3 transition-all duration-300
                            ${selected
                              ? "grid-cols-1 lg:grid-cols-2"
                              : "grid-cols-2 lg:grid-cols-3"
                            }`}
              >
                {projects.map((project, i) => (
                  <div
                    key={project._id || project.id}
                    ref={(el) => (cardRefs.current[i] = el)}
                  >
                    <ProjectCard
                      project={project}
                      index={i}
                      isSelected={
                        selected &&
                        (selected._id || selected.id) === (project._id || project.id)
                      }
                      onClick={() =>
                        setSelected(
                          selected &&
                          (selected._id || selected.id) === (project._id || project.id)
                            ? null
                            : project
                        )
                      }
                      isVisible={visibleCards.has(i)}
                      inView={gridInView}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Detail Drawer */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "48%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="flex-shrink-0 overflow-hidden bg-black/25"
                >
                  <div className="w-full h-full p-5 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <DetailDrawer
                        key={selected._id || selected.id}
                        project={selected}
                        onClose={() => setSelected(null)}
                        projects={projects}
                        onNavigate={(p) => setSelected(p)}
                      />
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── MOBILE: Stacked cards ── */}
          <div ref={mobileRef} className="md:hidden">
            {projects.map((project, i) => (
              <MobileProjectCard
                key={project._id || project.id}
                project={project}
                index={i}
                inView={mobileInView}
              />
            ))}
          </div>

          {/* Footer count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={sectionInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            className="mt-8 flex items-center gap-2"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"
            />
            <span className="text-[9px] text-slate-500">
              {projects.length} projects · click any card to inspect
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Works;