import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const GitHubCalendar = lazy(() => import('react-github-calendar'));

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const USERNAME = 'Lycan-Xx';

// ─── CACHE ────────────────────────────────────────────────────────────────────
const CACHE_KEY = `github-stats-v2-${USERNAME}`;
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 hours

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
  } catch {}
};

// ─── GRAPHQL QUERY ────────────────────────────────────────────────────────────
// Fetches: contributions calendar, PRs, total repos, top repos by commits
const buildQuery = (login) => `
  query {
    user(login: "${login}") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
        totalPullRequestContributions
        totalCommitContributions
        totalRepositoriesWithContributedCommits
      }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
        totalCount
        nodes {
          name
          url
          isPrivate
          defaultBranchRef {
            target {
              ... on Commit {
                history(since: "${new Date(new Date().getFullYear(), 0, 1).toISOString()}") {
                  totalCount
                }
              }
            }
          }
        }
      }
      pullRequests(states: MERGED) {
        totalCount
      }
    }
  }
`;

// ─── DATA PROCESSING ─────────────────────────────────────────────────────────
const calculateStreaks = (contributions) => {
  if (!contributions?.length) return {
    longest: { days: 0, start: '', end: '' },
    current: { days: 0, start: '', end: '' },
  };

  const fmt = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return `${dt.toLocaleString('default', { month: 'short' })} ${dt.getDate()}`;
  };

  const sorted = [...contributions].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Current streak
  let cur = { days: 0, start: '', end: '' };
  let active = false;
  for (const { date, count } of sorted) {
    if (count > 0) {
      if (!active) { active = true; cur.end = date; }
      cur.days++;
      cur.start = date;
    } else if (active) break;
  }

  // Longest streak — forward pass
  let long = { days: 0, start: '', end: '' };
  let tmp  = { days: 0, start: '', end: '' };
  active   = false;
  for (const { date, count } of [...contributions].sort((a, b) => new Date(a.date) - new Date(b.date))) {
    if (count > 0) {
      if (!active) { active = true; tmp = { days: 1, start: date, end: date }; }
      else { tmp.days++; tmp.end = date; }
      if (tmp.days > long.days) long = { ...tmp };
    } else { active = false; }
  }

  return {
    longest: { days: long.days, start: fmt(long.start), end: fmt(long.end) },
    current: { days: cur.days,  start: fmt(cur.start),  end: fmt(cur.end) },
  };
};

const getMonthlyCommits = (contributions) => {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  return contributions
    .filter(({ date }) => {
      const d = new Date(date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, { count }) => sum + count, 0);
};

const getTopRepo = (repos) => {
  return repos
    .filter(r => r.defaultBranchRef?.target?.history?.totalCount > 0)
    .sort((a, b) =>
      (b.defaultBranchRef?.target?.history?.totalCount || 0) -
      (a.defaultBranchRef?.target?.history?.totalCount || 0)
    )
    .slice(0, 5)
    .map(r => ({
      name: r.name,
      commits: r.defaultBranchRef?.target?.history?.totalCount || 0,
      isPrivate: r.isPrivate,
      url: r.url,
    }));
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
const CalendarPlaceholder = () => (
  <div className="animate-pulse h-32 bg-gray-800 rounded-lg w-full" />
);

const StatCard = ({ label, value, sub, accent = '#22d3ee', icon, delay, href }) => {
  const inner = (
    <motion.div
      className="relative border border-secondary hover:border-secondary bg-gray-800/50 rounded-lg p-4 transition-colors duration-300 group overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500 font-mono uppercase tracking-widest leading-tight">
          {label}
        </span>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      <p
        className="text-3xl font-bold font-mono my-1 tabular-nums"
        style={{ color: accent }}
      >
        {value ?? '—'}
      </p>
      {sub && (
        <p className="text-xs text-gray-500 font-mono leading-snug mt-1 truncate" title={sub}>
          {sub}
        </p>
      )}
    </motion.div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
      {inner}
    </a>
  ) : inner;
};

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-gray-700" />
    <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">{label}</span>
    <div className="flex-1 h-px bg-gray-700" />
  </div>
);

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="text-sm text-red-400 font-mono p-4">Calendar failed to load.</div>
    );
    return this.props.children;
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const GitHubStats = ({ token }) => {
  const githubToken = token || import.meta.env.VITE_GITHUB_TOKEN;

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [calRef, calInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const cached = readCache();
    if (cached) { setData(cached); setLoading(false); return; }

    if (!githubToken) {
      setError('VITE_GITHUB_TOKEN not set in .env');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://api.github.com/graphql', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${githubToken.trim()}`,
        },
        body: JSON.stringify({ query: buildQuery(USERNAME) }),
      });

      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);
      if (!json.data?.user) throw new Error(`User "${USERNAME}" not found`);

      const u    = json.data.user;
      const col  = u.contributionsCollection;
      const cal  = col.contributionCalendar;

      const contributions = cal.weeks.flatMap(w =>
        w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount }))
      );

      const processed = {
        totalContributions: cal.totalContributions,
        totalRepos:         u.repositories.totalCount,
        mergedPRs:          u.pullRequests.totalCount,
        monthlyCommits:     getMonthlyCommits(contributions),
        topRepos:           getTopRepo(u.repositories.nodes),
        ...calculateStreaks(contributions),
        contributions,
      };

      setData(processed);
      writeCache(processed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── loading ──
  if (loading) return (
    <div className="max-w-4xl mx-auto mt-16 px-4">
      <div className="glass-card p-8 animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-48 mx-auto mb-8" />
        <div className="h-32 bg-gray-800 rounded-lg mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );

  // ── error ──
  if (error) return (
    <div className="max-w-4xl mx-auto mt-16 px-4">
      <div className="glass-card p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-4 font-mono">GitHub Stats</h2>
        <div className="bg-red-900/20 border border-secondary rounded-lg p-4 mb-4">
          <p className="text-red-300 text-sm font-mono">Failed to load GitHub data</p>
          <p className="text-red-400 text-xs mt-1">{error}</p>
        </div>
        <button
          onClick={fetchData}
          className="text-xs font-mono px-4 py-2 border border-secondary text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors"
        >
          retry
        </button>
      </div>
    </div>
  );

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });

  return (
    <ErrorBoundary>
      <section
        ref={ref}
        className="max-w-4xl mx-auto mt-16 px-4 font-mono"
        id="github"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-card p-6 md:p-8">
            {/* heading */}
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              <span className="text-cyan-400">{'<'}</span>
              {' '}GitHub Stats{' '}
              <span className="text-cyan-400">{'/>'}</span>
            </h2>

            {/* contribution calendar */}
            <div ref={calRef} className="mb-2">
              {calInView && (
                <Suspense fallback={<CalendarPlaceholder />}>
                  <GitHubCalendar
                    username={USERNAME}
                    colorScheme="dark"
                    blockSize={11}
                    blockMargin={4}
                    fontSize={14}
                    showWeekdayLabels
                    style={{ margin: '0 auto', maxWidth: '100%' }}
                  />
                </Suspense>
              )}
            </div>

            {/* ── Activity ── */}
            <SectionDivider label="Activity" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Total contributions"
                value={data.totalContributions.toLocaleString()}
                sub="past 12 months"
                accent="#22d3ee"
                delay={0.05}
              />
              <StatCard
                label={`${monthName} commits`}
                value={data.monthlyCommits}
                sub="this month"
                accent="#22d3ee"
                delay={0.10}
              />
              <StatCard
                label="Current streak"
                value={`${data.current.days}d`}
                sub={data.current.days > 0 ? `${data.current.start} – ${data.current.end}` : 'No active streak'}
                accent="#22d3ee"
                delay={0.15}
              />
              <StatCard
                label="Longest streak"
                value={`${data.longest.days}d`}
                sub={data.longest.days > 0 ? `${data.longest.start} – ${data.longest.end}` : '—'}
                accent="#22d3ee"
                delay={0.20}
              />
            </div>

            {/* ── Overview ── */}
            <SectionDivider label="Overview" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                label="Total repos"
                value={data.totalRepos}
                sub="owned repositories"
                accent="#22d3ee"
                delay={0.25}
                href={`https://github.com/${USERNAME}?tab=repositories`}
              />
              <StatCard
                label="Merged PRs"
                value={data.mergedPRs.toLocaleString()}
                sub="pull requests merged"
                accent="#22d3ee"
                delay={0.30}
                href={`https://github.com/pulls?q=is:pr+author:${USERNAME}+is:merged`}
              />
            </div>

            {/* ── Top Repos ── */}
            {data.topRepos && data.topRepos.length > 0 && (
              <>
                <SectionDivider label="Top Repos" />
                <div className="space-y-2">
                  {data.topRepos.map((repo, idx) => (
                    <motion.div
                      key={repo.name}
                      className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-cyan-400/15 hover:border-cyan-400/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + idx * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-600 w-4">{idx + 1}.</span>
                        {repo.isPrivate ? (
                          <span className="text-sm text-gray-400 font-mono">
                            <span className="text-xs text-slate-500">[private]</span> {repo.name}
                          </span>
                        ) : (
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cyan-400 font-mono hover:text-cyan-300 no-underline"
                          >
                            {repo.name}
                          </a>
                        )}
                      </div>
                      <span className="text-xs font-mono text-gray-500">
                        {repo.commits} commits
                      </span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* profile link */}
            <div className="flex justify-center mt-6">
              <a
                href={`https://github.com/${USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-gray-500 hover:text-cyan-400 border border-secondary hover:border-secondary px-4 py-2 rounded transition-colors duration-200"
              >
                github.com/{USERNAME} ↗
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </ErrorBoundary>
  );
};

export default GitHubStats;