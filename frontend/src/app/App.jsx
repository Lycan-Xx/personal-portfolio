import React, { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CustomThemeProvider } from "../components/theme/ThemeProvider";
import { ErrorBoundary } from "../components/ErrorBoundary";

import { Home } from "../pages/Home";
import Navbar from '../components/nav/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import About from '../components/about/About';
import { Works } from '../components/works/Works';
import ContentHub from '../components/content/ContentHub';
import Contact from '../components/contact/Contact';
import VideoBackground from '../components/background/VideoBackground';
import { Admin } from '../pages/Admin';

// Simple loading fallback
const SuspenseFallback = () => (
  <div className="min-h-[50vh]" />
);

export const App = () => {
	const [currentPath, setCurrentPath] = useState(window.location.pathname);

	// Listen for route changes
	useEffect(() => {
		const handlePopState = () => setCurrentPath(window.location.pathname);
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);

	// Admin panel route
	if (currentPath === '/admin') {
		return (
			<ErrorBoundary>
				<Admin />
			</ErrorBoundary>
		);
	}

	return (
		<LoadingScreen>
			<ErrorBoundary>
				<CustomThemeProvider>
					<Navbar />
					<main>
						<Home />
						<div className="relative">
							<Suspense fallback={<SuspenseFallback />}>
								<VideoBackground />
								<About />
								<Works />
								<ContentHub />
								<Contact />
							</Suspense>
						</div>
					</main>
					
					{/* Footer text */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="fixed bottom-4 right-4 text-sm text-gray-400/60 hover:text-cyan-400 transition-colors duration-300 font-mono z-50"
					>
						Lycan-Xx says hi... 👾
					</motion.div>
				</CustomThemeProvider>
			</ErrorBoundary>
		</LoadingScreen>
	);
};
