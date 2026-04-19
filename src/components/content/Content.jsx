import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Resume from "../../settings/resume.json";
import { FirstName, LastName } from "../../utils/getName";
import { Today } from "./Today";
import { usePerformance } from '../../hooks/usePerformance';

/* ─── Quick-link pills ──────────────────────────────────── */
const quickLinks = [
  { label: 'GitHub', href: 'https://github.com/Lycan-Xx', icon: '⌥' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mohammad-bello', icon: '⌘' },
  { label: 'Resume', href: '#', icon: '↓', download: true },
];

/* ─── Job title rotator ─────────────────────────────────── */
const JobRotator = ({ jobs }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (jobs.length <= 1) return;
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % jobs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [jobs.length]);

  return (
    <div className="relative h-14 md:h-20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 flex items-center justify-center md:justify-start"
          style={{ color: '#42bcbc', fontFamily: 'ChocoCooky', fontSize: 'clamp(24px, 5vw, 52px)' }}
        >
          {jobs[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

/* ─── Main component ────────────────────────────────────── */
export const Content = () => {
  const isHighPerformance = usePerformance();
  const jobs = [
    Resume.basics.job1,
    Resume.basics.job2,
    Resume.basics.job3,
  ].filter(Boolean);

  return (
    <section
      id="home"
      className="min-h-[calc(100vh-4rem)] relative px-2 sm:px-4 md:px-8
                 flex items-center justify-center max-w-[100vw] overflow-x-hidden"
    >
      <div
        className="w-full max-w-5xl mx-auto flex flex-col md:flex-row
                   items-center justify-between gap-8 py-8 md:py-0"
      >

        {/* ── Left: text column ── */}
        <div
          className="order-2 md:order-1 w-full md:w-2/3 relative z-10
                     text-center md:text-left hero-text-col"
        >
          {/* Greeting line with blinking cursor */}
          <motion.div
            initial={isHighPerformance ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center md:justify-start gap-1 mb-3 md:mb-4"
          >
            <span
              className="text-base md:text-lg text-slate-400"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {Resume.basics.x_title}
            </span>
            <span className="inline-block w-[8px] h-[18px] bg-cyan-400 animate-blink ml-0.5"
              style={{ verticalAlign: 'middle' }} />
          </motion.div>

          {/* Name */}
          <motion.div
            initial={isHighPerformance ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mb-1"
            style={{
              textShadow: '0 0 40px rgba(66, 188, 188, 0.12)',
            }}
          >
            <div
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-200 leading-tight"
              style={{ fontFamily: 'ChocoCooky' }}
            >
              {FirstName}{' '}
              <span className="text-cyan-400/80">(Sani)</span>
            </div>
            <div
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-200 leading-tight mb-4 md:mb-6"
              style={{ fontFamily: 'ChocoCooky' }}
            >
              {LastName}
            </div>
          </motion.div>

          {/* Rotating job title */}
          <motion.div
            initial={isHighPerformance ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-5 md:mb-6"
          >
            <JobRotator jobs={jobs} />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={isHighPerformance ? { opacity: 0, x: -16 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-sm leading-relaxed text-slate-300 max-w-lg
                       mx-auto md:mx-0 mb-6 md:mb-8"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            I build things end to end — fintech wallets, campus marketplaces,
            Linux tools. Based in Adamawa, Nigeria. Always shipping.
          </motion.p>

          {/* Quick-link pills */}
          <motion.div
            initial={isHighPerformance ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2"
          >
            {quickLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target={link.download ? undefined : '_blank'}
                rel={link.download ? undefined : 'noopener noreferrer'}
                download={link.download || undefined}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                           border border-cyan-400/25 text-slate-400
                           hover:border-cyan-400/60 hover:text-cyan-400
                           transition-all duration-200 group"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}
              >
                <span className="text-cyan-400/50 group-hover:text-cyan-400 transition-colors">
                  {link.icon}
                </span>
                {link.label}
                <span className="text-cyan-400/30 group-hover:text-cyan-400/70 transition-colors">
                  ↗
                </span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Today card ── */}
        <div className="order-1 md:order-2 w-full md:w-1/3 mt-20 md:mt-0 flex justify-center">
          <Today />
        </div>

      </div>
    </section>
  );
};