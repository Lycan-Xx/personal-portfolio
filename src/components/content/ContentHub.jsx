import React, { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const GithubTab = lazy(() => import('../github/GithubStats'));
const WritingTab = lazy(() => import('../blog/BlogFeed'));
const VideosTab = lazy(() => import('../youtube/YoutubeFeed'));

const tabs = [
  { key: 'github', label: '< GitHub />' },
  { key: 'writing', label: '< Writing />' },
  { key: 'videos', label: '< Videos />' },
];

const TabSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-4" />
        <div className="h-3 bg-gray-700 rounded w-1/2 mb-3" />
        <div className="h-3 bg-gray-700 rounded w-3/4" />
      </div>
    ))}
  </div>
);

const ContentHub = () => {
  const [activeTab, setActiveTab] = useState('github');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section
      ref={ref}
      id="content-hub"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
    >
      <div className="w-full max-w-[86rem] mx-auto relative">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-none md:rounded-3xl shadow-lg shadow-cyan-400/5" />

        <div className="relative p-6 md:p-10 z-10">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-10 text-start"
          >
            <h2
              className="font-bold text-white relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-2/3 after:h-1 after:bg-cyan-400"
              style={{ fontFamily: 'ChocoCooky', fontSize: 'clamp(32px, 4.5vw, 44px)' }}
            >
              Content Hub
            </h2>
          </motion.div>

          {/* Tab bar */}
          <div className="flex gap-6 mb-8 border-b border-gray-700/50 pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 text-lg md:text-xl transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={{ fontFamily: 'ChocoCooky', minHeight: '44px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <Suspense fallback={<TabSkeleton />}>
            {activeTab === 'github' && <GithubTab />}
            {activeTab === 'writing' && <WritingTab />}
            {activeTab === 'videos' && <VideosTab />}
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ContentHub;
