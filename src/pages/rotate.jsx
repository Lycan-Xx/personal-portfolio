import React, { useState, useEffect } from 'react';

const NameRotationAnimation = () => {
	const [currentNameIndex, setCurrentNameIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const names = ["mark", "lilian", "julia", "boss", "adrian", "mike"];

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true);

			setTimeout(() => {
				setCurrentNameIndex((prevIndex) => (prevIndex + 1) % names.length);
				setIsAnimating(false);
			}, 500); // Matches the transition duration
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center w-full h-64 bg-white">
			<div className="text-4xl font-bold text-gray-800 flex">
				<span>My name is </span>
				<div className="relative h-12 ml-2 w-36 overflow-hidden">
					{/* Current Name */}
					<div
						className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
							}`}
					>
						<span className="text-purple-600 inline-block">{names[currentNameIndex]}</span>
					</div>
					{/* Next Name */}
					<div
						className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
							}`}
					>

					</div>
				</div>
			</div>

		</div>
	);
};

export default NameRotationAnimation;