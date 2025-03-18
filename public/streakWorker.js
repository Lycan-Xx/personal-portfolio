function formatDate(dateStr) {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
}

function calculateStreaks(contributions) {
	if (!contributions || contributions.length === 0) {
		return {
			longestStreak: { days: 0, start: '', end: '' },
			currentStreak: { days: 0, start: '', end: '' },
		};
	}

	// Sort contributions from newest to oldest
	const sortedContributions = [...contributions].sort((a, b) =>
		new Date(b.date) - new Date(a.date)
	);

	// Calculate current streak (most recent consecutive days with contributions)
	let currentStreak = { days: 0, start: '', end: '' };
	let streakActive = false;

	for (let i = 0; i < sortedContributions.length; i++) {
		const { date, count } = sortedContributions[i];

		if (count > 0) {
			if (!streakActive) {
				streakActive = true;
				currentStreak.end = date; // First day (most recent) of the streak
				currentStreak.days = 1;
			} else {
				currentStreak.days++;
			}
			currentStreak.start = date; // Keep updating the start (oldest day of the streak)
		} else if (streakActive) {
			// End of streak when we hit a day with no contributions
			break;
		}
	}

	// Calculate longest streak
	let longestStreak = { days: 0, start: '', end: '' };
	let tempStreak = { days: 0, start: '', end: '' };
	streakActive = false;

	// Work from newest to oldest for consistency
	for (let i = 0; i < sortedContributions.length; i++) {
		const { date, count } = sortedContributions[i];

		if (count > 0) {
			if (!streakActive) {
				streakActive = true;
				tempStreak = { days: 1, start: date, end: date };
			} else {
				tempStreak.days++;
				tempStreak.start = date; // Keep updating start to the oldest day
			}

			if (tempStreak.days > longestStreak.days) {
				longestStreak = { ...tempStreak };
			}
		} else {
			// Reset streak when we hit a day with no contributions
			streakActive = false;
			tempStreak = { days: 0, start: '', end: '' };
		}
	}

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

self.onmessage = function (e) {
	const { contributions } = e.data;
	const streaks = calculateStreaks(contributions);
	self.postMessage(streaks);
};