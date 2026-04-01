import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const getChannelId = () => import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'UCcGgfqebSy8yIGlnhW0qT_g';
const getChannelHandle = () => import.meta.env.VITE_YOUTUBE_HANDLE || 'Lycan_Xx';
const MAX_VIDEOS = 3;

// ─── YOUTUBE DATA API ────────────────────────────────────────────────────────────
const getYouTubeApiKey = () => import.meta.env.VITE_YOUTUBE_API_KEY;

// Safe localStorage check
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// ─── CACHE ────────────────────────────────────────────────────────────────────
const CACHE_KEY = 'yt-feed-cache-v1';
const CACHE_TTL = 1000 * 60 * 60 * 3; // 3 hours

const readCache = () => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) { localStorage.removeItem(CACHE_KEY); return null; }
    return data;
  } catch { return null; }
};

const writeCache = (data) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, expiry: Date.now() + CACHE_TTL }));
  } catch {}
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

const normaliseVideo = (item) => ({
  id: item.id?.videoId || item.id,
  videoId: item.id?.videoId || item.id,
  title: item.snippet?.title,
  url: `https://www.youtube.com/watch?v=${item.id?.videoId || item.id}`,
  pubDate: item.snippet?.publishedAt,
  thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.high?.url,
  description: item.snippet?.description?.slice(0, 120) + '…' || '',
});

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white drop-shadow-lg">
    <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.6)" />
    <polygon points="9.5,7.5 9.5,16.5 17,12" fill="white" />
  </svg>
);

const YouTubeBadge = () => (
  <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full text-slate-400">
    ▶ Video
  </span>
);

const SkeletonVideo = ({ delay, featured }) => (
  <motion.div
    className={`glass-card animate-pulse ${featured ? 'col-span-full' : ''}`}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
  >
    <div className={`bg-gray-800 rounded-t-lg ${featured ? 'h-52' : 'h-36'}`} />
    <div className="p-4">
      <div className="h-3 bg-gray-700 rounded w-1/4 mb-3" />
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-800 rounded w-1/2" />
    </div>
  </motion.div>
);

// Featured (latest) video card — larger
const FeaturedVideoCard = ({ video }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block glass-card group overflow-hidden border border-secondary hover:border-secondary transition-colors duration-300 no-underline col-span-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* accent line */}
      <motion.div
        className="h-[2px] bg-cyan-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="flex flex-col sm:flex-row">
        {/* thumbnail */}
        <div className="relative sm:w-64 md:w-80 flex-shrink-0 overflow-hidden bg-gray-900">
          {video.thumbnail ? (
            <motion.img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 sm:h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <div className="w-full h-48 sm:h-full bg-gray-800 flex items-center justify-center">
              <PlayIcon />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <PlayIcon />
          </div>
          {/* "LATEST" tag */}
          <span className="absolute top-2 left-2 text-[10px] font-mono bg-cyan-400/80 text-black px-1.5 py-0.5 rounded uppercase tracking-wider">
            Latest
          </span>
        </div>

        {/* content */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <YouTubeBadge />
              <span className="text-xs text-gray-500 font-mono">{formatDate(video.pubDate)}</span>
            </div>
            <h3 className="text-base font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors duration-200 leading-snug mb-2">
              {video.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
              {video.description}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-cyan-400 transition-colors duration-200">
            <span>Watch on YouTube</span>
            <span>↗</span>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

// Secondary video card — smaller
const VideoCard = ({ video, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block glass-card group overflow-hidden border border-secondary hover:border-secondary transition-colors duration-300 no-underline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="h-[2px] bg-cyan-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* thumbnail */}
      <div className="relative overflow-hidden bg-gray-900 h-36">
        {video.thumbnail ? (
          <motion.img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <PlayIcon />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <PlayIcon />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <YouTubeBadge />
          <span className="text-xs text-gray-500 font-mono">{formatDate(video.pubDate)}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors duration-200 leading-snug line-clamp-2">
          {video.title}
        </h3>
      </div>
    </motion.a>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const YouTubeFeed = () => {
  const [videos,  setVideos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const load = async () => {
    setLoading(true);
    setError(null);

    const cached = readCache();
    if (cached) { setVideos(cached); setLoading(false); return; }

    if (!getYouTubeApiKey()) {
      setError('YouTube API key not configured');
      setLoading(false);
      return;
    }

    try {
      const url = `/api/youtube/videos?channelId=${getChannelId()}&maxResults=${MAX_VIDEOS}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error.message || 'API error');

      const filtered = json.items.filter(item => item.id?.videoId);
      const normalised = filtered.slice(0, MAX_VIDEOS).map(normaliseVideo);
      setVideos(normalised);
      writeCache(normalised);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const [featured, ...rest] = videos;

  return (
    <section ref={ref} className="max-w-4xl mx-auto mt-20 px-4" id="youtube">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* heading */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white font-mono">
            <span className="text-cyan-400">{'<'}</span>
            {' '}Videos{' '}
            <span className="text-cyan-400">{'/>'}</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-mono">
            latest from the channel
          </p>
        </div>

        {/* loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonVideo delay={0} featured />
            <SkeletonVideo delay={0.08} />
            <SkeletonVideo delay={0.16} />
          </div>
        )}

        {/* error */}
        {!loading && error && (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400 font-mono text-sm mb-4">{error}</p>
            <button
              onClick={load}
              disabled={loading}
              className="text-xs font-mono px-4 py-2 border border-secondary text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors disabled:opacity-50"
            >
              {loading ? 'loading...' : 'retry'}
            </button>
          </div>
        )}

        {/* videos */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured && <FeaturedVideoCard video={featured} />}
            {rest.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
          </div>
        )}

        {/* channel link */}
        {!loading && !error && (
          <div className="flex justify-center mt-8">
            <a
              href={`https://www.youtube.com/${getChannelHandle()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-gray-500 hover:text-cyan-400 border border-cyan-400/15 hover:border-cyan-400/30 px-4 py-2 rounded transition-colors duration-200"
            >
              All videos ↗
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default YouTubeFeed;