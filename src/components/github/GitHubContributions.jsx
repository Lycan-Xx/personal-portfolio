import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const GitHubContributions = () => {
	const [calendarRef, calendarInView] = useInView({
		triggerOnce: true,
		threshold: 0.2
	});

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
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default GitHubContributions;