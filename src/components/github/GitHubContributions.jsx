import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Lazy load the GitHubCalendar component
const GitHubCalendar = lazy(() => import('react-github-calendar'));

// Web Worker for streak calculations
// Create a separate file named 'streakWorker.js' with this content:
/*
self.onmessage = function(e) {
  const { contributions } = e.data;
  const streaks = calculateStreaks(contributions);
  self.postMessage(streaks);
};

function calculateStreaks(contributions) {
  if (!contributions || contributions.length === 0) {
	return {
	  longestStreak: { days: 0, start: '', end: '' },
	  currentStreak: { days: 0, start: '', end: '' },
	};
  }

  // Format date helper
  const formatDate = (dateStr) => {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
  };

  // Reverse array so the most recent days come first
  const sortedContributions = [...contributions].reverse();
  let currentStreak = { days: 0, start: '', end: '' };
  let longestStreak = { days: 0, start: '', end: '' };
  let tempStreak = { days: 0, start: '', end: '' };

  // Calculate current streak (from most recent day until first zero)
  let streakActive = false;
  for (let i = 0; i < sortedContributions.length; i++) {
	const { date, count } = sortedContributions[i];
	if (count > 0) {
	  if (!streakActive) {
		streakActive = true;
		currentStreak.start = date;
		currentStreak.days = 1;
	  } else {
		currentStreak.days++;
	  }
	  currentStreak.end = date;
	} else if (streakActive) {
	  break;
	}
  }

  // Calculate longest streak
  streakActive = false;
  sortedContributions.forEach(({ date, count }) => {
	if (count > 0) {
	  if (!streakActive) {
		streakActive = true;
		tempStreak = { days: 1, start: date, end: date };
	  } else {
		tempStreak.days++;
		tempStreak.end = date;
	  }
	  if (tempStreak.days > longestStreak.days) {
		longestStreak = { ...tempStreak };
	  }
	} else {
	  streakActive = false;
	  tempStreak = { days: 0, start: '', end: '' };
	}
  });

  return {
	longestStreak: {
	  days: longestStreak.days,
	  start: formatDate(longestStreak.start),
	  end: formatDate(longestStreak.end),
	},
	currentStreak: {
	  days: currentStreak.days,
	  start: formatDate(currentStreak.start),
	  end: formatDate(currentStreak.end),
	},
  };
}
*/

// Cache helper with expiration time
const useCache = (key, ttl = 3600000) => { // Default TTL: 1 hour
	const getCache = () => {
		try {
			const cached = localStorage.getItem(key);
			if (!cached) return null;

			const { data, expiry } = JSON.parse(cached);
			if (Date.now() > expiry) {
				localStorage.removeItem(key);
				return null;
			}
			return data;
		} catch (error) {
			console.error('Cache retrieval error:', error);
			return null;
		}
	};

	const setCache = (data) => {
		try {
			const item = {
				data,
				expiry: Date.now() + ttl
			};
			localStorage.setItem(key, JSON.stringify(item));
		} catch (error) {
			console.error('Cache setting error:', error);
		}
	};

	return { getCache, setCache };
};

// Placeholder component while loading
const CalendarPlaceholder = () => (
	<div className="animate-pulse h-32 bg-gray-800 rounded-lg w-full"></div>
);

const StatsBox = ({ title, value, subtitle, delay }) => (
	<motion.div
		className="border border-gray-700 bg-gray-800 bg-opacity-50 rounded-lg p-4"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6, delay }}
	>
		<h3 className="text-md">{title}</h3>
		<p className="text-4xl font-bold my-2">{value}</p>
		<p className="text-sm text-gray-400">{subtitle}</p>
	</motion.div>
);

// Main component with static props support
const GitHubContributions = ({ initialData, username = 'Lycan-Xx' }) => {
	const [calendarRef, calendarInView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const [contributionData, setContributionData] = useState(initialData || {
		totalContributions: 0,
		longestStreak: { days: 0, start: '', end: '' },
		currentStreak: { days: 0, start: '', end: '' },
		contributions: [],
	});

	const [isLoading, setIsLoading] = useState(!initialData);
	const { getCache, setCache } = useCache(`github-contributions-${username}`, 86400000); // 24 hour cache

	// Create worker instance only when needed
	const getWorker = () => {
		if (typeof window !== 'undefined' && window.Worker) {
			// Update worker path to use the correct public path
			return new Worker('/personal-portfolio/streakWorker.js');
		}
		return null;
	};

	// Fetch contribution data
	const fetchContributionData = async () => {
		try {
			const cached = getCache();
			if (cached) {
				setContributionData(cached);
				return;
			}

			setIsLoading(true);
			// Update the API URL to match your server
			const response = await fetch(`http://localhost:5000/api/github-contributions/${username}`);
			if (!response.ok) {
				throw new Error('Failed to fetch GitHub data');
			}

			const data = await response.json();
			// Process the contributions data
			const contributions = data.contributions;

			const worker = getWorker();
			if (worker) {
				worker.postMessage({ contributions });
				worker.onmessage = (e) => {
					const streaks = e.data;
					const processedData = {
						...streaks,
						totalContributions: data.total,
						contributions,
					};
					setContributionData(processedData);
					setCache(processedData);
				};
			}
		} catch (error) {
			console.error('Error fetching GitHub contribution data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!initialData && calendarInView) {
			fetchContributionData();
		}
	}, [calendarInView]);

	return (
		<motion.div
			ref={calendarRef}
			initial={{ opacity: 0, y: 30 }}
			animate={calendarInView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.6 }}
			className="max-w-4xl mx-auto mt-16 font-semibold font-mono text-secondary"
		>
			<div className="glass-card p-8">
				<h2 className="text-2xl font-bold text-white mb-6 text-center">
					GitHub Contributions
				</h2>

				{calendarInView && (
					<div className="github-calendar-container">
						<Suspense fallback={<CalendarPlaceholder />}>
							<GitHubCalendar
								username={username}
								colorScheme="dark"
								blockSize={12}
								blockMargin={5}
								fontSize={16}
								showWeekdayLabels={true}
								style={{
									margin: '0 auto',
									maxWidth: '100%',
								}}
							/>
						</Suspense>
					</div>
				)}

				{/* Stats boxes */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-cyan-400 text-center">
					<StatsBox
						title="Total contributions in the last year"
						value={`${contributionData.totalContributions} total`}
						subtitle="Past Year"
						delay={0.1}
					/>

					<StatsBox
						title="Longest streak"
						value={`${contributionData.longestStreak.days} days`}
						subtitle={`${contributionData.longestStreak.start} — ${contributionData.longestStreak.end}`}
						delay={0.2}
					/>

					<StatsBox
						title="Current streak"
						value={`${contributionData.currentStreak.days} day${contributionData.currentStreak.days !== 1 ? 's' : ''}`}
						subtitle={`${contributionData.currentStreak.end} - ${contributionData.currentStreak.start}`}
						delay={0.3}
					/>
				</div>
			</div>
		</motion.div>
	);
};

// Static generation support for Next.js
export async function getStaticProps() {
	try {
		// This would run at build time in Next.js
		const response = await fetch(`http://localhost:5000/api/github-contributions/Lycan-Xx`);
		const data = await response.json();

		// Calculate streaks server-side
		// Import your calculation function or duplicate it here
		const { calculateStreaks } = require('./streakWorker');
		const streaks = calculateStreaks(data.contributions);

		return {
			props: {
				initialData: {
					totalContributions: data.total,
					...streaks,
					contributions: data.contributions,
				}
			},
			// Revalidate every 24 hours
			revalidate: 86400
		};
	} catch (error) {
		console.error('Error pre-fetching GitHub data:', error);
		return {
			props: {
				initialData: null
			},
			revalidate: 3600 // Try again in an hour if failed
		};
	}
}

export default GitHubContributions;