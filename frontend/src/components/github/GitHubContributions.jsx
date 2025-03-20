import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Lazy load the GitHubCalendar component
const GitHubCalendar = lazy(() => import('react-github-calendar'));

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

// Error boundary component
class GitHubErrorBoundary extends React.Component {
	state = { hasError: false };

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <div className="glass-card p-4">Failed to load GitHub contributions</div>;
		}
		return this.props.children;
	}
}

// Fallback streak calculation when worker is not available
const calculateStreaks = (contributions) => {
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
};

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
	const [error, setError] = useState(null);
	const { getCache, setCache } = useCache(`github-contributions-${username}`, 86400000); // 24 hour cache

	// Determine API URL based on environment
	const apiBaseUrl = typeof window !== 'undefined'
		? window.location.hostname === 'localhost'
			? 'http://localhost:5000'
			: '/api' // Use relative path in production
		: 'http://localhost:5000'; // Fallback for SSR

	// Function to fetch contribution data
	const fetchContributionData = async () => {
		try {
			// Check cache first
			const cached = getCache();
			if (cached) {
				console.log("Using cached GitHub data");
				setContributionData(cached);
				setIsLoading(false);
				return;
			}

			console.log("Fetching fresh GitHub data");
			setIsLoading(true);

			const apiUrl = `${apiBaseUrl}/api/github-contributions/${username}`;
			console.log(`Fetching from: ${apiUrl}`);

			const response = await fetch(apiUrl);
			if (!response.ok) {
				throw new Error(`Failed to fetch GitHub data: ${response.status}`);
			}

			const data = await response.json();

			// Process data directly if worker is not available
			const streaks = calculateStreaks(data.contributions);
			const processedData = {
				...streaks,
				totalContributions: data.total,
				contributions: data.contributions,
			};

			try {
				if (typeof window !== 'undefined' && window.Worker) {
					// Use Vite's URL import syntax to load the worker as a module
					const worker = new Worker(new URL('/streakWorker.js', import.meta.url), {
						type: 'module',
					});
					console.log(`Attempting to load worker from: ${worker}`);
					worker.postMessage({ contributions: data.contributions });

					worker.onmessage = (e) => {
						const workerStreaks = e.data;
						const workerData = {
							...workerStreaks,
							totalContributions: data.total,
							contributions: data.contributions,
						};
						setContributionData(workerData);
						setCache(workerData);
						worker.terminate();
					};

					// Set timeout to fall back to direct calculation if worker doesn't respond
					setTimeout(() => {
						worker.terminate();
					}, 3000);
				} else {
					setContributionData(processedData);
					setCache(processedData);
				}
			} catch (workerError) {
				console.warn('Worker failed, using direct calculation:', workerError);
				setContributionData(processedData);
				setCache(processedData);
			}


		} catch (error) {
			console.error('Error fetching GitHub contribution data:', error);
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch data on mount if there's no initialData
	useEffect(() => {
		if (!initialData) {
			fetchContributionData();
		} else {
			setIsLoading(false);
		}
		// We intentionally run this only once on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialData]);

	// Memoize stats based on contributionData
	const memoizedStats = useMemo(() => ({
		total: contributionData.totalContributions || 0,
		longest: contributionData.longestStreak || { days: 0, start: '', end: '' },
		current: contributionData.currentStreak || { days: 0, start: '', end: '' }
	}), [contributionData]);

	const LoadingState = () => (
		<div className="glass-card p-8 animate-pulse">
			<div className="h-4 bg-gray-700 rounded w-1/3 mb-6 mx-auto" />
			<div className="h-32 bg-gray-800 rounded-lg w-full mb-6" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="h-24 bg-gray-800 rounded-lg" />
				))}
			</div>
		</div>
	);

	const ErrorState = () => (
		<div className="glass-card p-8">
			<h2 className="text-2xl font-bold text-white mb-6 text-center">
				GitHub Contributions
			</h2>
			<div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 mb-6">
				<p className="text-red-300">Failed to load GitHub contribution data</p>
				<p className="text-sm text-red-400">{error || "Unknown error"}</p>
			</div>
			<button
				onClick={() => {
					setError(null);
					fetchContributionData();
				}}
				className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white mx-auto block"
			>
				Try Again
			</button>
		</div>
	);

	if (isLoading) {
		return <LoadingState />;
	}

	if (error) {
		return <ErrorState />;
	}

	return (
		<GitHubErrorBoundary>
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
							value={`${memoizedStats.total} total`}
							subtitle="Past Year"
							delay={0.1}
						/>

						<StatsBox
							title="Longest streak"
							value={`${memoizedStats.longest.days} days`}
							subtitle={`${memoizedStats.longest.start} — ${memoizedStats.longest.end}`}
							delay={0.2}
						/>

						<StatsBox
							title="Current streak"
							value={`${memoizedStats.current.days} day${memoizedStats.current.days !== 1 ? 's' : ''}`}
							subtitle={`${memoizedStats.current.end} - ${memoizedStats.current.start}`}
							delay={0.3}
						/>
					</div>
				</div>
			</motion.div>
		</GitHubErrorBoundary>
	);
};

export default GitHubContributions;
