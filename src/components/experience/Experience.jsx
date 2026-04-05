import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaChevronDown } from 'react-icons/fa';

/* ─── Data ─────────────────────────────────────────────── */

const experiences = [
  {
    id: 'kugal',
    role: 'Technical Co-Founder',
    org: 'Kugal Jobs',
    type: 'Full-time',
    period: 'Nov 2025 – Present',
    duration: '6 mos',
    location: 'Adamawa State, Nigeria · Hybrid',
    status: 'active',
    branch: 'main',
    color: 'cyan',
    dotColor: 'bg-cyan-400',
    borderColor: 'border-cyan-400',
    tagColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    description:
      'Lead the end-to-end design, development, and deployment of the platform\'s technical infrastructure. Architecting a job marketplace serving northeastern Nigeria with a dark-minimal design system built on Supabase + shadcn/ui.',
    tags: ['PostgreSQL', 'Supabase', 'React', 'TypeScript', 'shadcn/ui'],
    bullets: [
      'Designed and implemented the full platform architecture from scratch',
      'Built employer and job-seeker onboarding flows with account-type routing',
      'Leading frontend design system with consistent dark-minimal aesthetic',
    ],
  },
  {
    id: 'hacksat-cto',
    role: 'Chief Technology Officer',
    org: 'Hacksat Tech Ltd.',
    type: 'Contract',
    period: 'Oct 2025 – Present',
    duration: '7 mos',
    location: 'Jimeta, Adamawa State · On-site',
    status: 'active',
    branch: 'feature/leadership',
    color: 'orange',
    dotColor: 'bg-orange-400',
    borderColor: 'border-orange-400',
    tagColor: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    description:
      'Promoted from System Security Officer after demonstrating technical leadership. Responsible for all technical decisions, infrastructure, and team direction across the company\'s digital products.',
    tags: ['System Architecture', 'Technical Leadership', 'Security'],
    bullets: [
      'Oversee all technical infrastructure and product development decisions',
      'Mentor junior developers and manage technical hiring standards',
      'Define and enforce security policies across all digital assets',
    ],
  },
  {
    id: 'hacksat-sso',
    role: 'System Security Officer',
    org: 'Hacksat Tech Ltd.',
    type: 'Contract',
    period: 'May 2025 – Oct 2025',
    duration: '6 mos',
    location: 'Jimeta, Adamawa State · On-site',
    status: 'completed',
    branch: 'feature/security',
    color: 'slate',
    dotColor: 'bg-slate-400',
    borderColor: 'border-slate-600',
    tagColor: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    description:
      'Conducted regular security assessments across the company\'s web resources, identifying and remediating vulnerabilities. Ran cybersecurity awareness programs and tutored enrolled students in infosec fundamentals.',
    tags: ['Network Security', 'Vulnerability Assessment', 'Cybersecurity'],
    bullets: [
      'Conducted regular assessments of web resources and identified critical vulnerabilities',
      'Delivered hands-on cybersecurity tutoring to enrolled course students',
      'Organized online security awareness meetups and community learning sessions',
      'Provided guidance on personal digital safety and best practices',
    ],
  },
  {
    id: 'evault',
    role: 'Full Stack Engineer & Tech Lead',
    org: 'eVault',
    type: 'Full-time',
    period: 'Sep 2024 – Present',
    duration: '1 yr 8 mos',
    location: 'Adamawa State · Remote',
    status: 'active',
    branch: 'feature/fullstack',
    color: 'cyan',
    dotColor: 'bg-cyan-400',
    borderColor: 'border-cyan-400/50',
    tagColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    description:
      'Leading frontend development and technical direction for a fintech platform. Work spans responsive web pages, subscription services, and mobile-adjacent applications with a focus on performance and accessibility.',
    tags: ['React.js', 'Git', 'TypeScript', 'Firebase', 'REST APIs'],
    bullets: [
      'Develop functional, responsive, and visually appealing web pages using modern technologies',
      'Documented the entire eVault backend API into a professional reference document',
      'Optimize user experience, performance, and accessibility across all products',
    ],
  },
  {
    id: 'adama',
    role: 'Student Intern — Quality & Control Lab',
    org: 'Adama Beverages Ltd.',
    type: 'Internship',
    period: 'May 2025 – Nov 2025',
    duration: '7 mos',
    location: 'Jimeta, Adamawa State · On-site',
    status: 'completed',
    branch: 'feature/chemistry',
    color: 'slate',
    dotColor: 'bg-slate-400',
    borderColor: 'border-slate-600',
    tagColor: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    description:
      'Stationed in the Quality & Control laboratory, bridging my Chemistry degree with practical industrial application. Responsible for ensuring production standards across the water treatment and manufacturing pipeline.',
    tags: ['Analytical Chemistry', 'Polymer Chemistry', 'Quality Control'],
    bullets: [
      'Performed regular checks in the water treatment plant ensuring purification processes functioned correctly',
      'Inspected preforms for defects from the injection facility maintaining production standards',
      'Tested and analyzed production products, recording findings per company protocols',
    ],
  },
  {
    id: 'repair',
    role: 'Mobile Phone Repair Apprentice',
    org: 'Emergency Phone Repair',
    type: 'Apprenticeship',
    period: 'Jun 2022 – Jun 2024',
    duration: '2 yrs',
    location: 'Jimeta Shopping Complex, Yola · On-site',
    status: 'completed',
    branch: 'feature/hardware',
    color: 'slate',
    dotColor: 'bg-slate-400',
    borderColor: 'border-slate-600',
    tagColor: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    description:
      'Where the hardware obsession started. Diagnosed and repaired both minor and major mobile phone issues under expert supervision. Built the problem-solving intuition that now underlies how I approach software debugging.',
    tags: ['Hardware Repair', 'Troubleshooting', 'Customer Service'],
    bullets: [
      'Diagnosed and repaired minor and major mobile phone hardware and software issues',
      'Developed systematic problem-solving skills under expert technician supervision',
      'Managed customer relations and ensured quality repair standards across multiple phone models',
    ],
  },
];

const education = [
  {
    degree: "Bachelor's — Chemistry",
    institution: 'Modibbo Adama University, Yola',
    period: 'Apr 2023 – Dec 2027',
    status: 'active',
    note: 'Concurrent with full-time software development work',
  },
  {
    degree: 'SSCE — High School Certificate',
    institution: 'Federal Government College, Kiyawa, Jigawa',
    period: 'Aug 2015 – Aug 2018',
    status: 'completed',
    note: 'Federal Government unity college — strict, conducive learning environment',
  },
];

/* ─── Sub-components ────────────────────────────────────── */

const statusBadge = (status) => {
  if (status === 'active') {
    return (
      <span
        className="flex items-center gap-1.5 text-[10px] text-green-400 bg-green-400/10
                   border border-green-400/20 px-2 py-0.5 rounded"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        active
      </span>
    );
  }
  return (
    <span
      className="text-[10px] text-slate-500 bg-slate-500/10 border border-slate-500/20
                 px-2 py-0.5 rounded"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      completed
    </span>
  );
};

const ExperienceCard = ({ exp, index, inView }) => {
  const [expanded, setExpanded] = useState(index < 2);
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
    >
      {/* Connector dot on the timeline */}
      <div
        className={`absolute top-6 z-20 w-3 h-3 rounded-full border-2 border-black
                    ${exp.dotColor}
                    ${isLeft
                      ? 'right-0 translate-x-1/2 md:left-auto md:right-0 md:translate-x-1/2'
                      : 'left-0 -translate-x-1/2 md:left-0 md:-translate-x-1/2'
                    }
                    hidden md:block`}
      />
      {/* Mobile dot */}
      <div className={`absolute top-6 left-0 -translate-x-1/2 z-20 w-3 h-3 rounded-full
                       border-2 border-black ${exp.dotColor} md:hidden`} />

      <button
        onClick={() => setExpanded(e => !e)}
        className={`w-full text-left bg-black/20 backdrop-blur-md rounded-2xl
                    border ${exp.borderColor} p-5
                    hover:bg-black/30 transition-all duration-300 group
                    hover:shadow-lg`}
        aria-expanded={expanded}
      >
        {/* Card top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {statusBadge(exp.status)}
              <span
                className="text-[10px] text-slate-500"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {exp.type}
              </span>
            </div>
            <h3
              className="text-white text-lg leading-tight mt-1"
              style={{ fontFamily: 'ChocoCooky', fontSize: '20px' }}
            >
              {exp.role}
            </h3>
            <p
              className="text-cyan-400 text-xs mt-0.5"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {exp.org}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span
              className="text-[10px] text-slate-400 text-right"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {exp.period}
            </span>
            <span
              className="text-[10px] text-slate-600"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {exp.duration}
            </span>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-slate-500 group-hover:text-cyan-400 transition-colors mt-1"
            >
              <FaChevronDown size={11} />
            </motion.span>
          </div>
        </div>

        {/* Location */}
        <p
          className="text-[10px] text-slate-600 mb-3"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {exp.location}
        </p>

        {/* Tags always visible */}
        <div className="flex flex-wrap gap-1.5">
          {exp.tags.map(tag => (
            <span
              key={tag}
              className={`text-[10px] px-2 py-0.5 rounded border ${exp.tagColor}`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className={`mt-1 bg-black/15 backdrop-blur-md rounded-2xl
                          border-x border-b ${exp.borderColor} p-5 pt-4`}
            >
              <p
                className="text-sm text-slate-300 leading-relaxed mb-4"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {exp.description}
              </p>
              <ul className="space-y-2">
                {exp.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-400"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    <span className="text-cyan-400/60 flex-shrink-0 mt-0.5">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Main Component ────────────────────────────────────── */

const Experience = () => {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.05, triggerOnce: true });
  const [expRef, expInView] = useInView({ threshold: 0.05, triggerOnce: true });
  const [eduRef, eduInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
    >
      <div className="w-full max-w-[86rem] mx-auto relative">
        {/* Glass container */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-none md:rounded-3xl" />
        <div className="absolute inset-0 bg-black/50 rounded-none md:rounded-3xl" />

        <div className="relative p-6 md:p-10 z-10">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2
              className="text-white relative inline-block pb-2
                         after:content-[''] after:absolute after:bottom-0 after:left-0
                         after:w-2/3 after:h-[2px] after:bg-cyan-400"
              style={{ fontFamily: 'ChocoCooky', fontSize: 'clamp(28px, 4vw, 40px)' }}
            >
              {'< Experience />'}
            </h2>
            <p
              className="mt-3 text-slate-400 text-xs"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {`// ${experiences.filter(e => e.status === 'active').length} active roles · ${experiences.length} total entries`}
            </p>
          </motion.div>

          {/* ── Timeline ── */}
          <div ref={expRef} className="relative">

            {/* Central branch line — desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px
                            bg-gradient-to-b from-cyan-400/60 via-cyan-400/30 to-transparent
                            -translate-x-1/2 z-10" />

            {/* Left branch line — mobile */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-px
                            bg-gradient-to-b from-cyan-400/60 via-cyan-400/30 to-transparent
                            z-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pl-8 md:pl-0">
              {experiences.map((exp, i) => (
                <div
                  key={exp.id}
                  className={`
                    ${i % 2 === 0
                      ? 'md:pr-6 md:col-start-1'
                      : 'md:pl-6 md:col-start-2 md:row-start-auto'
                    }
                  `}
                  style={{ gridRow: Math.floor(i / 2) + 1 }}
                >
                  <ExperienceCard exp={exp} index={i} inView={expInView} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Education ── */}
          <div ref={eduRef} className="mt-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={eduInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="mb-6 flex items-center gap-3"
            >
              <h3
                className="text-white"
                style={{ fontFamily: 'ChocoCooky', fontSize: '28px' }}
              >
                {'< Education />'}
              </h3>
              <div className="flex-1 h-px bg-cyan-400/15" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={eduInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-black/20 backdrop-blur-md rounded-2xl border border-cyan-400/15 p-5
                             hover:border-cyan-400/30 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4
                      className="text-white leading-tight"
                      style={{ fontFamily: 'ChocoCooky', fontSize: '18px' }}
                    >
                      {edu.degree}
                    </h4>
                    {edu.status === 'active'
                      ? <span
                          className="flex items-center gap-1 text-[10px] text-green-400
                                     bg-green-400/10 border border-green-400/20 px-2 py-0.5
                                     rounded flex-shrink-0"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          ongoing
                        </span>
                      : <span
                          className="text-[10px] text-slate-500 bg-slate-500/10 border
                                     border-slate-500/20 px-2 py-0.5 rounded"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          completed
                        </span>
                    }
                  </div>
                  <p
                    className="text-xs text-cyan-400 mb-1"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {edu.institution}
                  </p>
                  <p
                    className="text-[10px] text-slate-500 mb-3"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {edu.period}
                  </p>
                  <p
                    className="text-[10px] text-slate-600 italic"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {edu.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;