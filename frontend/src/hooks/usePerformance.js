// src/hooks/usePerformance.js
import { useState, useEffect } from 'react';

export const usePerformance = () => {
	const [isHighPerformance, setIsHighPerformance] = useState(false);

	useEffect(() => {
		// Only run in browser
		if (typeof window === 'undefined') return;

		const checkPerformance = () => {
			try {
				const highEnd =
					// Check if user hasn't requested reduced motion
					(!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) &&
					// Check if device has more than 4GB RAM (may be undefined)
					(window.deviceMemory === undefined || window.deviceMemory > 4) &&
					// Check if data-saver mode is off
					(!navigator.connection || !navigator.connection.saveData);

				setIsHighPerformance(highEnd);
			} catch (e) {
				// If any property access fails, default to false
				setIsHighPerformance(false);
			}
		};

		checkPerformance();
		window.addEventListener('resize', checkPerformance);

		return () => window.removeEventListener('resize', checkPerformance);
	}, []);

	return isHighPerformance;
};
