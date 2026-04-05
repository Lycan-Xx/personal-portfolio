import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaCode, FaLinux, FaShieldAlt, FaWrench, FaFlask,
} from 'react-icons/fa';
import {
  SiReact, SiTypescript, SiJavascript, SiNextdotjs,
  SiTailwindcss, SiFirebase, SiSupabase, SiPostgresql,
  SiGithub, SiCloudflare, SiAppwrite, SiSolana,
} from 'react-icons/si';
import { VscTerminalBash } from 'react-icons/vsc';
import { TbBrandVite } from 'react-icons/tb';

/* ─── Data ─────────────────────────────────────────────── */

const bioBlocks = [
  {
    label: '> curiosity.exe',
    text: "I'm always hungry for knowledge — a glutton for learning if you will. My curiosity drives me to understand how things work at a fundamental level, and I embrace challenges that shake my foundational understanding. Open to any fact or idea, provided the evidence is sufficient.",
  },
  {
    label: '> mindset.log',
    text: "I enjoy working independently but thrive when collaborating with purpose-driven teams solving real everyday problems. As an introvert, I prefer calm, focused environments. I recognize when others need space and strive not to be a nuisance — boundaries matter.",
  },
  {
    label: '> current.status',
    text: "Chemistry student at Modibbo Adama University, Yola — pursuing a degree while building production software simultaneously. My true aspiration is full-stack with a backend specialization, because I care more about solving problems than making things look pretty. Though I do both.",
  },
  {
    label: '> values.conf',
    text: "Strong affinity for open-source and the Linux community. I believe in sharing knowledge with those who are worthy. I don't like being the centre of attention. I just love learning, growing, and sharing what I know.",
  },
];

const techCategories = [
  {
    label: '< Frontend />',
    icon: <FaCode />,
    items: [
      { icon: <SiReact />, name: 'React' },
      { icon: <SiNextdotjs />, name: 'Next.js' },
      { icon: <SiTypescript />, name: 'TypeScript' },
      { icon: <SiJavascript />, name: 'JavaScript' },
      { icon: <SiTailwindcss />, name: 'Tailwind' },
      { icon: <TbBrandVite />, name: 'Vite' },
    ],
  },
  {
    label: '< Backend />',
    icon: <VscTerminalBash />,
    items: [
      { icon: <SiFirebase />, name: 'Firebase' },
      { icon: <SiSupabase />, name: 'Supabase' },
      { icon: <SiAppwrite />, name: 'Appwrite' },
      { icon: <SiPostgresql />, name: 'PostgreSQL' },
      { icon: <SiSolana />, name: 'Solana' },
      { icon: <SiCloudflare />, name: 'Cloudflare' },
    ],
  },
  {
    label: '< Systems />',
    icon: <FaLinux />,
    items: [
      { icon: <FaLinux />, name: 'Linux' },
      { icon: <VscTerminalBash />, name: 'Bash' },
      { icon: <FaShieldAlt />, name: 'Security' },
      { icon: <SiGithub />, name: 'GitHub' },
      { icon: <FaWrench />, name: 'Hardware' },
      { icon: <FaFlask />, name: 'Chemistry' },
    ],
  },
];

const traits = [
  { value: '6+', label: 'years building' },
  { value: '10+', label: 'shipped projects' },
  { value: '2.2k+', label: 'contributions' },
  { value: '3', label: 'active roles' },
];

/* ─── Sub-components ───────────────────────────────────── */

const BioBlock = ({ block, index, inView }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-l-2 border-cyan-400/30 hover:border-cyan-400 transition-colors duration-300"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 group"
        aria-expanded={open}
      >
        <span
          className="text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {block.label}
        </span>
        <span
          className="text-cyan-400/60 text-xs ml-2 flex-shrink-0"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {open ? '[-]' : '[+]'}
        </span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p
          className="px-4 pb-4 text-sm text-slate-300 leading-relaxed"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {block.text}
        </p>
      </motion.div>
    </motion.div>
  );
};

const TechCategory = ({ cat, index, inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    className="bg-black/20 backdrop-blur-md rounded-2xl border border-cyan-400/15 p-5
               hover:border-cyan-400/35 transition-colors duration-300"
  >
    <h4
      className="text-base text-white mb-4"
      style={{ fontFamily: 'ChocoCooky', fontSize: '18px' }}
    >
      {cat.label}
    </h4>

    <div className="grid grid-cols-3 gap-3">
      {cat.items.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl
                     bg-black/20 hover:bg-cyan-400/8 border border-transparent
                     hover:border-cyan-400/20 transition-all duration-200 cursor-default group"
        >
          <span className="text-xl text-slate-400 group-hover:text-cyan-400 transition-colors duration-200">
            {item.icon}
          </span>
          <span
            className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {item.name}
          </span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ─── Main Component ────────────────────────────────────── */

const About = () => {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.05, triggerOnce: true });
  const [bioRef, bioInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [stackRef, stackInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
    >
      {/* Section glass container */}
      <div className="w-full max-w-[86rem] mx-auto relative">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-none md:rounded-3xl" />
        <div className="absolute inset-0 bg-black/50 rounded-none md:rounded-3xl" />

        <div className="relative p-6 md:p-10 z-10">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <div>
              <h2
                className="text-white relative inline-block pb-2
                           after:content-[''] after:absolute after:bottom-0 after:left-0
                           after:w-2/3 after:h-[2px] after:bg-cyan-400"
                style={{ fontFamily: 'ChocoCooky', fontSize: 'clamp(28px, 4vw, 40px)' }}
              >
                {'< About Me />'}
              </h2>
              <p
                className="mt-3 text-slate-400 text-xs"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                multidisciplinary technician & developer · Adamawa, Nigeria
              </p>
            </div>

            {/* Stat strip */}
            <div className="flex gap-6 flex-wrap">
              {traits.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex flex-col items-center"
                >
                  <span
                    className="text-2xl text-cyan-400 leading-none"
                    style={{ fontFamily: 'ChocoCooky', fontSize: '26px' }}
                  >
                    {t.value}
                  </span>
                  <span
                    className="text-[10px] text-slate-500 mt-0.5 text-center"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {t.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Main grid: Bio + Identity card ── */}
          <div ref={bioRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

            {/* Bio accordion — 3 cols */}
            <div className="lg:col-span-3 bg-black/20 backdrop-blur-md rounded-2xl
                            border border-cyan-400/15 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-cyan-400/10 bg-black/20">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span
                  className="ml-3 text-[10px] text-slate-500"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  sani@lycan-xx ~ about.md
                </span>
              </div>

              {/* Bio blocks */}
              <div className="p-4 space-y-1">
                {bioBlocks.map((block, i) => (
                  <BioBlock key={i} block={block} index={i} inView={bioInView} />
                ))}
              </div>
            </div>

            {/* Identity card — 2 cols */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={bioInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              {/* Currently card */}
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-cyan-400/15 p-5 flex-1">
                <p
                  className="text-[10px] text-cyan-400/60 mb-3 uppercase tracking-widest"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  // currently
                </p>
                <ul className="space-y-3">
                  {[
                    { role: 'Technical Co-Founder', org: 'Kugal Jobs', dot: 'bg-green-400' },
                    { role: 'Chief Technology Officer', org: 'Hacksat Tech', dot: 'bg-cyan-400' },
                    { role: 'Full Stack Lead', org: 'eVault', dot: 'bg-cyan-400' },
                    { role: 'Chemistry Student', org: 'Modibbo Adama University', dot: 'bg-slate-400' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                      <div>
                        <p
                          className="text-xs text-white leading-tight"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {item.role}
                        </p>
                        <p
                          className="text-[10px] text-slate-500 mt-0.5"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {item.org}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Philosophy card */}
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-cyan-400/15 p-5">
                <p
                  className="text-[10px] text-cyan-400/60 mb-3 uppercase tracking-widest"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  // open source · linux · knowledge sharing
                </p>
                <p
                  className="text-xs text-slate-400 leading-relaxed"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Backend-focused. Problem-first. I care more about solving the right problem than shipping the prettiest interface. But I do both.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['#linux', '#oss', '#backend', '#infosec', '#chemistry'].map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] text-cyan-400/70 bg-cyan-400/8 border border-cyan-400/15
                                 px-2 py-0.5 rounded"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Tech Stack ── */}
          <div ref={stackRef}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={stackInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="mb-5 flex items-center gap-3"
            >
              <h3
                className="text-white"
                style={{ fontFamily: 'ChocoCooky', fontSize: '28px' }}
              >
                {'< Tech Arsenal />'}
              </h3>
              <div className="flex-1 h-px bg-cyan-400/15" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {techCategories.map((cat, i) => (
                <TechCategory key={i} cat={cat} index={i} inView={stackInView} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;