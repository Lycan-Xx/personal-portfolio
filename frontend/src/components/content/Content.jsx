import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Resume from "../../settings/resume.json";
import { FirstName, LastName } from "../../utils/getName";
import { Today } from "./Today";

export const Content = () => {
	const [currentJobIndex, setCurrentJobIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const jobs = [Resume.basics.job1, Resume.basics.job2, Resume.basics.job3].filter(Boolean);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true);

			setTimeout(() => {
				setCurrentJobIndex((prevIndex) => (prevIndex + 1) % jobs.length);
				setIsAnimating(false);
			}, 500);
		}, 3000);

		return () => clearInterval(interval);
	}, [jobs.length]);

	return (
		<section className="min-h-screen relative px-4 md:px-8 flex flex-col md:flex-row items-center justify-center">
			<div className="order-1 md:order-2 md:ml-8 mb-8 md:mb-0">
				<Today />
			</div>

			<div className="order-2 md:order-1 relative z-10 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="mb-8"
				>
					<h2 className="text-xl text-start md:text-4xl text-cyan-400 mb-4 font-mono">
						{Resume.basics.x_title}
					</h2>
					<h1 style={{ fontFamily: "ChocoCooky" }} className="text-4xl text-gray-200 md:text-6xl lg:text-7xl font-bold mb-6">
						{FirstName} (Sani) {LastName}
					</h1>
					<div className="text-3xl md:text-5xl lg:text-6xl text-gray-300 font-light">
						<div className="relative h-24 overflow-hidden">
							<div
								className={`transition-all duration-500 ease-in-out ${isAnimating
									? "opacity-0 -translate-y-6"
									: "opacity-100 translate-y-0"
									}`}
							>
								<span className="text-cyan-400">{jobs[currentJobIndex]}</span>
							</div>
						</div>
					</div>
				</motion.div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.5 }}
					className="text-lg md:text-2xl font-semibold text-start text-cyan-400 max-w-2xl mx-auto"
					style={{ fontFamily: "ChocoCooky" }}
				>
					{Resume.basics.description}
				</motion.p>
			</div>
		</section>
	);
};
