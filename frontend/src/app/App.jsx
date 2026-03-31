import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { CustomThemeProvider } from "../components/theme/ThemeProvider";
import { ErrorBoundary } from "../components/ErrorBoundary";

import { Home } from "../pages/Home";
import Navbar from '../components/nav/Navbar';
import LoadingScreen from '../components/LoadingScreen';

// Lazy load — everything below the fold
const About = lazy(() => import("../components/about/About"));
const Works = lazy(() => import("../components/works/Works"));
const ContentHub = lazy(() => import("../components/content/ContentHub"));
const Contact = lazy(() => import("../components/contact/Contact"));
const VideoBackground = lazy(() => import("../components/background/VideoBackground"));

// Simple loading fallback for Suspense
const SuspenseFallback = () => (
  <div style={{ 
    minHeight: '50vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#22d3ee',
    fontFamily: 'monospace'
  }}>
    Loading...
  </div>
);

export const App = () => {
	return (
		<ErrorBoundary>
			<LoadingScreen>
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
						initial={{ opacity: 1 }}
						animate={{ opacity: 2 }}
						transition={{ duration: 0.5 }}
						className="fixed bottom-4 right-4 text-sm text-gray-400/60 hover:text-cyan-400 transition-colors duration-300 font-mono z-50"
					>
						Lycan-Xx says hi... 👾
					</motion.div>
				</CustomThemeProvider>
			</LoadingScreen>
		</ErrorBoundary>
	);
};
