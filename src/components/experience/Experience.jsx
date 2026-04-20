import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import experienceData from './experience.json';

/* ─── Data (loaded from JSON, editable via Admin) ─────────── */
const experiences = experienceData.experiences || [];
const education = experienceData.education || [];

const allItems = [...experiences, ...education];
const TOTAL = allItems.length;

/* ─── Helper components ─────────────────────────────────── */

const StatusBadge = ({ status }) =>
  status === 'active' ? (
    <span
      className="flex items-center gap-1.5 text-[9px] text-green-400 bg-green-400/10
                 border border-green-400/20 px-2 py-0.5 rounded"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      active
    </span>
  ) : (
    <span
      className="text-[9px] text-slate-500 bg-slate-500/10 border border-slate-500/20
                 px-2 py-0.5 rounded"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      completed
    </span>
  );

const TypeBadge = ({ label }) => (
  <span
    className="text-[9px] text-slate-400 bg-slate-400/5
               border border-slate-400/15 px-2 py-0.5 rounded"
    style={{ fontFamily: 'JetBrains Mono, monospace' }}
  >
    {label}
  </span>
);

const CommitDot = ({ color, size = 'md' }) => {
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3' };
  const colors = {
    cyan:   'bg-[var(--color-accent)]   shadow-[0_0_8px_rgba(66,188,188,0.7)]',
    orange: 'bg-[var(--color-secondary)] shadow-[0_0_8px_rgba(236,112,76,0.7)]',
    slate:  'bg-slate-500',
  };
  return (
    <span
      className={`rounded-full border-2 border-theme-background flex-shrink-0 ${sizes[size]} ${colors[color]}`}
    />
  );
};

const TagPill = ({ label, color }) => {
  const styles = {
    cyan:   'text-[var(--color-accent)]   bg-[var(--color-accent)]/5   border-[var(--color-accent)]/20',
    orange: 'text-[var(--color-secondary)] bg-[var(--color-secondary)]/5 border-[var(--color-secondary)]/20',
    slate:  'text-slate-400 bg-slate-400/5 border-slate-400/20',
  };
  return (
    <span
      className={`text-[9px] px-2 py-0.5 rounded border ${styles[color]}`}
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      {label}
    </span>
  );
};

/* ─── Branch Map Item ────────────────────────────────────── */
const BranchItem = ({ item, index, isActive, onClick, isEdu = false }) => {
  const isOrange = item.color === 'orange';
  const activeBorder = isOrange
    ? 'border-l-[var(--color-secondary)] bg-[var(--color-secondary)]/5'
    : 'border-l-[var(--color-accent)] bg-[var(--color-accent)]/5';
  const inactiveBorder = 'border-l-transparent hover:bg-[var(--color-accent)]/[0.03]';

  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2
                  border-l-2 transition-all duration-200 relative z-10
                  ${isActive ? activeBorder : inactiveBorder}`}
      style={{ paddingLeft: isEdu ? '2.75rem' : '2.75rem', fontFamily: 'JetBrains Mono, monospace' }}
    >
      {/* dot sits on the spine */}
      <span className="absolute left-[22px]">
        {isEdu ? (
          <span
            className={`w-2.5 h-2.5 rounded-sm border flex-shrink-0 block transition-colors
              ${isActive
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/25'
                : 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5'
              }`}
          />
        ) : (
          <CommitDot color={item.color} size="sm" />
        )}
      </span>

      {/* text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[12px] truncate font-semibold leading-tight transition-colors
            ${isActive ? 'text-white' : 'text-slate-400'}`}
        >
          {isEdu ? item.degree : item.role}
        </p>
        <p
          className={`text-[9.5px] truncate mt-0.5 transition-colors
            ${isActive
              ? isOrange ? 'text-[var(--color-secondary)]' : 'text-[var(--color-accent)]'
              : 'text-slate-500'
            }`}
        >
          {isEdu ? item.institution.split(',')[0] : item.org}
        </p>
      </div>

      {/* right side */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {item.status === 'active' && (
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        )}
        <span className="text-[8px] text-slate-400 whitespace-nowrap">
          {isEdu ? item.periodShort : item.periodShort}
        </span>
      </div>
    </motion.button>
  );
};

/* ─── Detail Panel ───────────────────────────────────────── */
const DetailPanel = ({ item, globalIndex, onNavigate, inView }) => {
  const isEdu = 'degree' in item;
  const isOrange = !isEdu && item.color === 'orange';
  const orgColor = isOrange ? 'text-[var(--color-secondary)]' : 'text-[var(--color-accent)]';
  const arrowColor = isOrange ? 'text-[var(--color-secondary)]/50' : 'text-[var(--color-accent)]/50';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col h-full"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {/* Commit hash row */}
        <div className="flex items-center gap-3 mb-3">
          <p className="text-[9px] text-slate-500 whitespace-nowrap">
            commit{' '}
            <span className="text-[var(--color-accent)]/40">{item.commitHash}</span>
            {' · '}
            <span className="text-[var(--color-accent)]/40">{item.branch}</span>
          </p>
          <div className="flex-1 h-px bg-[var(--color-accent)]/8" />
        </div>

        {/* Header */}
        <div className="mb-5">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <StatusBadge status={item.status} />
            {!isEdu && <TypeBadge label={item.type} />}
            {!isEdu && item.workType && <TypeBadge label={item.workType} />}
          </div>

          {/* Role / Degree */}
          <h2
            className="text-white leading-tight mb-2"
            style={{ fontFamily: 'ChocoCooky', fontSize: 'clamp(36px, 4vw, 44px)', textShadow: '0 0 15px rgba(66, 188, 188, 0.1)' }}
          >
            {isEdu ? item.degree : item.role}
          </h2>

          {/* Org / Institution */}
          <p className={`text-xs mb-2 ${orgColor}`}>
            {isEdu ? item.institution : item.org}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[9px] text-slate-400">{item.period}</span>
            {!isEdu && (
              <span className="text-[9px] text-slate-400">{item.duration}</span>
            )}
            {!isEdu && item.location && (
              <span className="text-[9px] text-slate-400">{item.location}</span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-accent)]/8 mb-4" />

        {/* Description */}
        <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Bullets */}
        {item.bullets && item.bullets.length > 0 && (
          <ul className="space-y-2 mb-4">
            {item.bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.06 }}
                className="flex items-start gap-2.5 text-[11px] text-slate-400"
              >
                <span className={`flex-shrink-0 mt-0.5 ${arrowColor}`}>▸</span>
                {b}
              </motion.li>
            ))}
          </ul>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-auto">
            {item.tags.map(tag => (
              <TagPill
                key={tag}
                label={tag}
                color={isEdu ? 'cyan' : item.color}
              />
            ))}
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-[var(--color-accent)]/8">
          <button
            onClick={() => onNavigate(globalIndex - 1)}
            disabled={globalIndex === 0}
            className="text-[9px] text-[var(--color-accent)]/40 border border-[var(--color-accent)]/12
                       rounded px-3 py-1.5 transition-all duration-150 disabled:opacity-20
                       hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30
                       hover:bg-[var(--color-accent)]/5 disabled:cursor-not-allowed"
          >
            ← prev
          </button>
          <span className="text-[9px] text-slate-500">
            {globalIndex + 1} / {TOTAL}
          </span>
          <button
            onClick={() => onNavigate(globalIndex + 1)}
            disabled={globalIndex === TOTAL - 1}
            className="text-[9px] text-[var(--color-accent)]/40 border border-[var(--color-accent)]/12
                       rounded px-3 py-1.5 transition-all duration-150 disabled:opacity-20
                       hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30
                       hover:bg-[var(--color-accent)]/5 disabled:cursor-not-allowed"
          >
            next →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Mobile Card ────────────────────────────────────────── */
const MobileCard = ({ item, index, inView }) => {
  const isEdu = 'degree' in item;
  const isOrange = !isEdu && item.color === 'orange';
  const borderColor = isOrange
    ? 'border-[var(--color-secondary)]/30'
    : item.color === 'cyan'
    ? 'border-[var(--color-accent)]/30'
    : 'border-slate-700/50';
  const orgColor = isOrange
    ? 'text-[var(--color-secondary)]'
    : 'text-[var(--color-accent)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.06 }}
      className="flex items-start gap-0"
    >
      {/* Spine + dot */}
      <div className="flex flex-col items-center w-4 flex-shrink-0 pt-2.5">
        <CommitDot color={isEdu ? 'cyan' : item.color} size="sm" />
        {index < allItems.length - 1 && (
          <div
            className="w-px flex-1 mt-1"
            style={{
              minHeight: '12px',
              background: 'linear-gradient(to bottom, rgba(66,188,188,0.4), rgba(66,188,188,0.05))',
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 ml-3 mb-4 rounded-xl border p-4
                    bg-slate-900/85 md:backdrop-blur-md transition-all duration-300 ${borderColor}`}
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <StatusBadge status={item.status} />
          {!isEdu && <TypeBadge label={item.type} />}
        </div>

        <h3
          className="text-white leading-tight mb-1 text-[15px] font-semibold"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {isEdu ? item.degree : item.role}
        </h3>
        <p className={`text-[10px] mb-1.5 ${orgColor}`}>
          {isEdu ? item.institution : item.org}
        </p>

        <p className="text-[9px] text-slate-400 mb-3 leading-relaxed">
          {item.period}{!isEdu && ` · ${item.duration}`}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {(item.tags || []).slice(0, 3).map(tag => (
            <TagPill
              key={tag}
              label={tag}
              color={isEdu ? 'cyan' : item.color}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
const Experience = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sectionRef, sectionInView] = useInView({ threshold: 0.05, triggerOnce: true });
  const [mobileRef, mobileInView] = useInView({ threshold: 0.05, triggerOnce: true });

  const selectedItem = allItems[selectedIndex];
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  const handleNavigate = (idx) => {
    if (idx >= 0 && idx < TOTAL) setSelectedIndex(idx);
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
    >
      <div className="w-full max-w-[86rem] mx-auto relative">
        {/* Glass container */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-none md:rounded-3xl" />

        <div className="relative p-6 md:p-10 z-10">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12"
          >
            <h2
              className="text-white relative inline-block pb-3
                         after:content-[''] after:absolute after:bottom-0 after:left-0
                         after:w-2/3 after:h-[3px] after:bg-[var(--color-accent)]"
              style={{ fontFamily: 'ChocoCooky', fontSize: 'clamp(32px, 4.5vw, 44px)', textShadow: '0 0 20px rgba(66, 188, 188, 0.15)' }}
            >
              {'< Experience />'}
            </h2>
            <p
              className="mt-4 text-cyan-400/80 text-[11px]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {`// ${experiences.filter(e => e.status === 'active').length} active roles · ${experiences.length} total entries`}
            </p>
          </motion.div>

          {/* ── DESKTOP LAYOUT ── */}
          <div className="hidden md:flex gap-0 rounded-3xl overflow-hidden border border-[var(--color-accent)]/15 min-h-[700px]">

            {/* LEFT: Branch Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={sectionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-[240px] xl:w-[280px] flex-shrink-0 flex flex-col
                         bg-black/40 border-r border-[var(--color-accent)]/12"
            >
              {/* Panel header */}
              <div
                className="px-4 py-3.5 border-b border-[var(--color-accent)]/10"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <p className="text-[10px] text-slate-500 tracking-widest uppercase">
                  git log --graph
                </p>
                <p className="text-[8.5px] text-slate-500 mt-0.5">
                  {`// ${experiences.filter(e => e.status === 'active').length} active · ${TOTAL} entries`}
                </p>
              </div>

              {/* Spine + items */}
              <div className="flex-1 py-2 overflow-y-auto relative">
                {/* Vertical spine line */}
                <div
                  className="absolute left-[28px] top-0 bottom-0 w-px pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(66,188,188,0.55) 0%, rgba(66,188,188,0.25) 65%, rgba(66,188,188,0.04) 100%)',
                  }}
                />

                {/* Experience items */}
                {experiences.map((exp, i) => (
                  <BranchItem
                    key={exp.id}
                    item={exp}
                    index={i}
                    isActive={selectedIndex === i}
                    onClick={() => setSelectedIndex(i)}
                  />
                ))}
              </div>

              {/* Education sub-section */}
              <div className="border-t border-[var(--color-accent)]/10 py-2 relative">
                <div
                  className="absolute left-[28px] top-0 bottom-0 w-px pointer-events-none opacity-20"
                  style={{ background: 'var(--color-accent)' }}
                />
                <p
                  className="px-3.5 pb-1.5 text-[8.5px] text-slate-500 tracking-widest uppercase"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  education
                </p>
                {education.map((edu, i) => (
                  <BranchItem
                    key={edu.id}
                    item={edu}
                    index={experiences.length + i}
                    isActive={selectedIndex === experiences.length + i}
                    onClick={() => setSelectedIndex(experiences.length + i)}
                    isEdu
                  />
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Detail Panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={sectionInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex-1 p-7 xl:p-9 overflow-y-auto bg-black/20"
            >
              <DetailPanel
                item={selectedItem}
                globalIndex={selectedIndex}
                onNavigate={handleNavigate}
                inView={sectionInView}
              />
            </motion.div>
          </div>

          {/* ── MOBILE LAYOUT ── */}
          <div ref={mobileRef} className="md:hidden pl-3 pr-3">
            {allItems.map((item, i) => (
              <MobileCard
                key={item.id}
                item={item}
                index={i}
                inView={mobileInView}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;