// src/hooks/usePerformance.js
import { useState, useEffect } from 'react';

export const usePerformance = () => {
	const [isHighPerformance, setIsHighPerformance] = useState(false);

	useEffect(() => {
		const checkPerformance = () => {
			const highEnd =
				// Check if user hasn't requested reduced motion
				!window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
				// Check if device has more than 4GB RAM
				window.deviceMemory > 4 &&
				// Check if data-saver mode is off
				!navigator.connection?.saveData;

			setIsHighPerformance(highEnd);
		};

		checkPerformance();
		window.addEventListener('resize', checkPerformance);

		return () => window.removeEventListener('resize', checkPerformance);
	}, []);

	return isHighPerformance;
};