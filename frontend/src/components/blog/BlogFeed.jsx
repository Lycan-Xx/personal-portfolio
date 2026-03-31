import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const getMediumHandle = () => import.meta.env.VITE_MEDIUM_HANDLE || '@Lycan_Xx';
const getDevtoHandle = () => import.meta.env.VITE_DEVTO_HANDLE || 'lycan_xx';
const getRss2JsonKey = () => import.meta.env.VITE_RSS2JSON_KEY || '';
const MAX_POSTS = 6;

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';

// ─── FETCH HELPERS ────────────────────────────────────────────────────────────
const fetchFeed = async (rssUrl) => {
  console.log('[BlogFeed] Fetching:', rssUrl);
  const params = new URLSearchParams({ rss_url: rssUrl });
  if (getRss2JsonKey()) params.set('api_key', getRss2JsonKey());
  const res = await fetch(`${RSS2JSON_BASE}?${params}`);
  console.log('[BlogFeed] Response status:', res.status);
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
  const json = await res.json();
  console.log('[BlogFeed] JSON status:', json.status, '- Items:', json.items?.length);
  if (json.status !== 'ok') throw new Error(json.message || 'Feed error');
  return json.items;
};

// Helper to extract first image from HTML content
const extractThumbnailFromHtml = (htmlContent) => {
  if (!htmlContent) return null;
  const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
};

const normaliseMedium = (item) => {
  // Try: thumbnail field, then enclosure, then extract from HTML
  const thumbnail = item.thumbnail || item.enclosure?.link || extractThumbnailFromHtml(item.content || item.description);
  console.log('[BlogFeed] Medium thumbnail extracted:', thumbnail);
  return {
    id:          item.guid,
    title:       item.title,
    url:         item.link,
    pubDate:     item.pubDate,
    thumbnail:   thumbnail,
    readingTime: estimateReadTime(item.content || item.description || ''),
    source:      'Medium',
    sourceColor: '#00b382',
    sourceIcon:  'M',
    tags:        item.categories?.slice(0, 3) || [],
  };
};

const normaliseDevto = (item) => ({
  id:          item.guid,
  title:       item.title,
  url:         item.link,
  pubDate:     item.pubDate,
  thumbnail:   item.thumbnail || null,
  readingTime: estimateReadTime(item.content || item.description || ''),
  source:      'Dev.to',
  sourceColor: '#7c3aed',
  sourceIcon:  'D',
  tags:        item.categories?.slice(0, 3) || [],
});

const estimateReadTime = (html) => {
  const text  = html.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ─── CACHE ────────────────────────────────────────────────────────────────────
const CACHE_KEY = 'blog-feed-cache';
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) { localStorage.removeItem(CACHE_KEY); return null; }
    return data;
  } catch { return null; }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, expiry: Date.now() + CACHE_TTL }));
  } catch { /* quota exceeded – silent */ }
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
const SourceBadge = ({ source, color, icon }) => (
  <span
    className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border border-secondary"
    style={{ color }}
  >
    <span className="font-bold">{icon}</span>
    {source}
  </span>
);

const SkeletonCard = ({ delay }) => (
  <motion.div
    className="glass-card p-5 animate-pulse"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
  >
    <div className="h-3 bg-gray-700 rounded w-1/3 mb-4" />
    <div className="h-5 bg-gray-700 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-800 rounded w-1/2 mb-4" />
    <div className="flex gap-2">
      <div className="h-5 bg-gray-700 rounded-full w-16" />
      <div className="h-5 bg-gray-700 rounded-full w-12" />
    </div>
  </motion.div>
);

const PostCard = ({ post, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block glass-card p-5 group relative overflow-hidden border border-secondary hover:border-secondary transition-colors duration-300 no-underline"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* accent line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: post.sourceColor }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* thumbnail */}
      {post.thumbnail && (
        <div className="mb-4 overflow-hidden rounded-md h-36 bg-gray-800">
          <motion.img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.4 }}
            onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
          />
        </div>
      )}

      {/* header row */}
      <div className="flex items-center justify-between mb-3">
        <SourceBadge source={post.source} color={post.sourceColor} icon={post.sourceIcon} />
        <span className="text-xs text-gray-500 font-mono">{formatDate(post.pubDate)}</span>
      </div>

      {/* title */}
      <h3 className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors duration-200 leading-snug mb-3 line-clamp-2">
        {post.title}
      </h3>

      {/* footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-2">
          {post.readingTime} min read
        </span>
      </div>

      {/* arrow */}
      <motion.span
        className="absolute bottom-4 right-4 text-cyan-400 text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        animate={{ x: hovered ? 0 : -4 }}
        transition={{ duration: 0.2 }}
      >
        ↗
      </motion.span>
    </motion.a>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const BlogFeed = () => {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState('All'); // 'All' | 'Medium' | 'Dev.to'

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const load = async () => {
    setLoading(true);
    setError(null);

    const cached = readCache();
    if (cached) { setPosts(cached); setLoading(false); return; }

    try {
      const results = await Promise.allSettled([
        fetchFeed(`https://medium.com/feed/${getMediumHandle()}`).then(items => items.map(normaliseMedium)),
        fetchFeed(`https://dev.to/feed/${getDevtoHandle()}`).then(items => items.map(normaliseDevto)),
      ]);

      const merged = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        .slice(0, MAX_POSTS);

      if (merged.length === 0) throw new Error('No posts found from either platform.');

      setPosts(merged);
      writeCache(merged);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const sources  = ['All', ...new Set(posts.map(p => p.source))];
  const filtered = filter === 'All' ? posts : posts.filter(p => p.source === filter);

  return (
    <section ref={ref} className="max-w-4xl mx-auto mt-20 px-4" id="blog">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* heading */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white font-mono">
            <span className="text-cyan-400">{'<'}</span>
            {' '}Writing{' '}
            <span className="text-cyan-400">{'/>'}</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-mono">
            thoughts from Medium &amp; Dev.to
          </p>
        </div>

        {/* source filter tabs */}
        {!loading && !error && sources.length > 1 && (
          <div className="flex gap-2 justify-center mb-6">
            {sources.map(src => (
              <button
                key={src}
                onClick={() => setFilter(src)}
                className={`text-xs font-mono px-3 py-1 rounded border transition-colors duration-200 ${
                  filter === src
                    ? 'border-secondary text-cyan-400 bg-cyan-500/10'
                    : 'border-secondary text-gray-500 hover:border-secondary'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        )}

        {/* loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} delay={i * 0.08} />)}
          </div>
        )}

        {/* error */}
        {!loading && error && (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400 font-mono text-sm mb-4">{error}</p>
            <button
              onClick={load}
              className="text-xs font-mono px-4 py-2 border border-secondary text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors"
            >
              retry
            </button>
          </div>
        )}

        {/* posts grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
          </div>
        )}

        {/* view all */}
        {!loading && !error && (
          <div className="flex gap-4 justify-center mt-8">
            {getMediumHandle() !== '@your-medium-handle' && (
              <a
                href={`https://medium.com/${getMediumHandle()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-gray-500 hover:text-cyan-400 border border-secondary hover:border-secondary px-4 py-2 rounded transition-colors duration-200"
              >
                All Medium posts ↗
              </a>
            )}
            {getDevtoHandle() !== 'your-devto-handle' && (
              <a
                href={`https://dev.to/${getDevtoHandle()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-gray-500 hover:text-cyan-400 border border-secondary hover:border-secondary px-4 py-2 rounded transition-colors duration-200"
              >
                All Dev.to posts ↗
              </a>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default BlogFeed;