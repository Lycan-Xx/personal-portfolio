function formatDate(dateStr) {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
}

function calculateStreaks(contributions) {
	const sortedContributions = contributions.sort((a, b) =>
		new Date(b.date) - new Date(a.date)
	);

	let currentStreak = { days: 0, start: '', end: '' };
	let longestStreak = { days: 0, start: '', end: '' };
	let tempStreak = { days: 0, start: '', end: '' };
	let streakActive = false;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	for (let i = 0; i < sortedContributions.length; i++) {
		const { date, count } = sortedContributions[i];
		const contributionDate = new Date(date);
		contributionDate.setHours(0, 0, 0, 0);

		if (count > 0) {
			if (!streakActive) {
				streakActive = true;
				tempStreak = { days: 1, start: date, end: date };
			} else {
				tempStreak.days++;
				tempStreak.start = date;
			}

			if (tempStreak.days > longestStreak.days) {
				longestStreak = { ...tempStreak };
			}
		} else {
			streakActive = false;
		}
	}

	return { currentStreak, longestStreak };
}

self.onmessage = function (e) {
	const { contributions } = e.data;
	const streaks = calculateStreaks(contributions);
	self.postMessage(streaks);
};