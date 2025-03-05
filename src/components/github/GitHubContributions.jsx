import React, { useState, useEffect } from 'react';
import GitHubCalendar from 'react-github-calendar';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const GitHubContributions = () => {
	const [calendarRef, calendarInView] = useInView({
		triggerOnce: true,
		threshold: 0.2,
	});

	const [contributionData, setContributionData] = useState({
		totalContributions: 0,
		longestStreak: { days: 0, start: '', end: '' },
		currentStreak: { days: 0, start: '', end: '' },
		contributions: [],
	});

	// Helper: format date (month day)
	const formatDate = (dateStr) => {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
	};

	// Calculate streaks from contribution data
	const calculateStreaks = (data) => {
		if (!data || !data.contributions || data.contributions.length === 0) {
			return {
				longestStreak: { days: 0, start: '', end: '' },
				currentStreak: { days: 0, start: '', end: '' },
			};
		}

		// Reverse array so the most recent days come first
		const contributions = [...data.contributions].reverse();
		let currentStreak = { days: 0, start: '', end: '' };
		let longestStreak = { days: 0, start: '', end: '' };
		let tempStreak = { days: 0, start: '', end: '' };

		// Calculate current streak (from most recent day until first zero)
		let streakActive = false;
		for (let i = 0; i < contributions.length; i++) {
			const { date, count } = contributions[i];
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
		contributions.forEach(({ date, count }) => {
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

	// Fetch contribution data from your own API endpoint
	const fetchContributionData = async (username) => {
		try {
			const response = await fetch(`http://localhost:5000/api/github-contributions/${username}`);
			const data = await response.json();

			// Data from our API: { total, contributions: [{date, count}, ...] }
			const totalContributions = data.total;
			const streaks = calculateStreaks({ contributions: data.contributions });

			setContributionData({
				totalContributions,
				longestStreak: streaks.longestStreak,
				currentStreak: streaks.currentStreak,
				contributions: data.contributions,
			});
		} catch (error) {
			console.error('Error fetching GitHub contribution data:', error);
		}
	};

	useEffect(() => {
		fetchContributionData('Lycan-Xx');
	}, []);

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
				<div className="github-calendar-container">
					<GitHubCalendar
						username="Lycan-Xx"
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
				</div>

				{/* Stats boxes */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-cyan-400 text-center">
					{/* Total Contributions */}
					<motion.div
						className="border border-gray-700 bg-gray-800 bg-opacity-50 rounded-lg p-4"
						initial={{ opacity: 0, y: 20 }}
						animate={calendarInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<h3 className="text-md">Total contributions in the last year</h3>
						<p className="text-4xl font-bold my-2">{contributionData.totalContributions} total</p>
						{/* Adjust the date range as needed */}
						<p className="text-sm text-gray-400">Past Year</p>
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
						<p className="text-sm text-gray-400">
							{contributionData.longestStreak.start} — {contributionData.longestStreak.end}
						</p>
					</motion.div>

					{/* Current Streak */}
					<motion.div
						className="border border-gray-700 bg-gray-800 bg-opacity-50 rounded-lg p-4"
						initial={{ opacity: 0, y: 20 }}
						animate={calendarInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<h3 className="text-md">Current streak</h3>
						<p className="text-4xl font-bold my-2">
							{contributionData.currentStreak.days} day{contributionData.currentStreak.days !== 1 ? 's' : ''}
						</p>
						<p className="text-sm text-gray-400">
							{contributionData.currentStreak.end} - {contributionData.currentStreak.start}
						</p>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default GitHubContributions;
