import React, { useState, useEffect } from 'react';
import GitHubCalendar from 'react-github-calendar';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const GitHubContributions = () => {
	const [calendarRef, calendarInView] = useInView({
		triggerOnce: true,
		threshold: 0.2
	});

	const [contributionData, setContributionData] = useState({
		totalContributions: 0,
		longestStreak: { days: 0, start: '', end: '' },
		currentStreak: { days: 0, start: '', end: '' }
	});

	// Function to calculate statistics from contribution data
	const calculateStatistics = (data) => {
		if (!data || !data.years || !data.years[0].total) return;

		// Get total contributions from the most recent year
		const totalContributions = data.years[0].total;

		// Calculate streaks from contributions
		const { longestStreak, currentStreak } = calculateStreaks(data);

		setContributionData({
			totalContributions,
			longestStreak,
			currentStreak
		});
	};

	// Function to calculate longest and current streaks
	const calculateStreaks = (data) => {
		if (!data || !data.contributions) {
			return {
				longestStreak: { days: 0, start: '', end: '' },
				currentStreak: { days: 0, start: '', end: '' }
			};
		}

		const contributions = [...data.contributions].reverse(); // Most recent first
		let currentStreak = { days: 0, start: '', end: '' };
		let longestStreak = { days: 0, start: '', end: '' };
		let tempStreak = { days: 0, start: '', end: '' };

		// Helper to format date
		const formatDate = (dateStr) => {
			const date = new Date(dateStr);
			return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
		};

		// Calculate current streak (starting from most recent day)
		let isStreakActive = false;
		for (let i = 0; i < contributions.length; i++) {
			const { date, count } = contributions[i];

			if (count > 0) {
				if (!isStreakActive) {
					isStreakActive = true;
					currentStreak.start = date;
					currentStreak.days = 1;
				} else {
					currentStreak.days++;
				}
				currentStreak.end = date;
			} else if (isStreakActive) {
				break; // End of streak
			}
		}

		// Calculate longest streak
		isStreakActive = false;
		for (let i = 0; i < contributions.length; i++) {
			const { date, count } = contributions[i];

			if (count > 0) {
				if (!isStreakActive) {
					isStreakActive = true;
					tempStreak = { days: 1, start: date, end: date };
				} else {
					tempStreak.days++;
					tempStreak.end = date;
				}

				if (tempStreak.days > longestStreak.days) {
					longestStreak = { ...tempStreak };
				}
			} else {
				isStreakActive = false;
			}
		}

		return {
			longestStreak: {
				days: longestStreak.days,
				start: formatDate(longestStreak.start),
				end: formatDate(longestStreak.end)
			},
			currentStreak: {
				days: currentStreak.days,
				start: formatDate(currentStreak.start),
				end: formatDate(currentStreak.end)
			}
		};
	};

	// Fetch contribution data when component mounts
	const fetchContributionData = async (username) => {
		try {
			const response = await fetch(`https://github-contributions-api.vercel.app/api/v1/${username}`);
			const data = await response.json();
			calculateStatistics(data);
		} catch (error) {
			console.error('Error fetching GitHub contribution data:', error);
		}
	};

	// Effect to fetch data when component mounts
	useEffect(() => {
		fetchContributionData('Lycan-Xx');
	}, []);

	return (
		<motion.div
			ref={calendarRef}
			initial={{ opacity: 0, y: 30 }}
			animate={calendarInView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.6 }}
			className="max-w-4xl mx-auto mt-16"
		>
			<div className="glass-card p-8">
				<h2 className="text-2xl font-bold text-white mb-6 text-center">
					GitHub Contributions
				</h2>
				<div className="github-calendar-container">
					<GitHubCalendar
						username="Lycan-Xx"
						colorScheme='dark'
						blockSize={12}
						blockMargin={5}
						fontSize={16}
						showWeekdayLabels={true}
						style={{
							margin: '0 auto',
							maxWidth: '100%'
						}}
						onDataFetched={calculateStatistics}
					/>
				</div>

				{/* Stats boxes */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-white text-center">
					{/* Total Contributions */}
					<motion.div
						className="border border-gray-700 bg-gray-800 bg-opacity-50 rounded-lg p-4"
						initial={{ opacity: 0, y: 20 }}
						animate={calendarInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<h3 className="text-md">Contributions in the last year</h3>
						<p className="text-4xl font-bold my-2">{contributionData.totalContributions} total</p>
						<p className="text-sm text-gray-400">Apr 11, 2024 — Apr 10, 2025</p>
					</motion.div>

					{/* Longest Streak */}
					<motion.div
						className="border border-gray-700 bg-gray-800 bg-opacity-50 rounded-lg p-4"
						initial={{ opacity: 0, y: 20 }}
						animate={calendarInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<h3 className="text-md">Longest streak</h3>
						<p className="text-4xl font-bold my-2">{contributionData.longestStreak.days} days</p>
						<p className="text-sm text-gray-400">{contributionData.longestStreak.start} — {contributionData.longestStreak.end}</p>
					</motion.div>

					{/* Current Streak */}
					<motion.div
						className="border border-gray-700 bg-gray-800 bg-opacity-50 rounded-lg p-4"
						initial={{ opacity: 0, y: 20 }}
						animate={calendarInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<h3 className="text-md">Current streak</h3>
						<p className="text-4xl font-bold my-2">{contributionData.currentStreak.days} day{contributionData.currentStreak.days !== 1 ? 's' : ''}</p>
						<p className="text-sm text-gray-400">{contributionData.currentStreak.start} — {contributionData.currentStreak.end}</p>
					</motion.div>
				</div>
			</div>

		</motion.div>
	);
};

export default GitHubContributions;