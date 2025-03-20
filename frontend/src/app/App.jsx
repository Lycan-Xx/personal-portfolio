import React, { lazy, Suspense } from "react";
import { CustomThemeProvider } from "../components/theme/ThemeProvider";
import { CssBaseline } from "@mui/material";
import { Home } from "../pages/Home";
import { Works } from "../components/works/Works";
import Navbar from '../components/nav/Navbar';
import LoadingScreen from '../components/LoadingScreen'; // Add this import

// Add lazy loading for About and Contact
const About = lazy(() => import("../components/about/About"));
const Contact = lazy(() => import("../components/contact/Contact"));
const VideoBackground = lazy(() => import("../components/background/VideoBackground"));

export const App = () => {
	return (
		<LoadingScreen>
			<CustomThemeProvider>
				<CssBaseline />
				<Navbar />
				<main>
					<Home />
					<Works />
					<div className="relative">
						<Suspense fallback={
							<div className="min-h-screen flex items-center justify-center">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
							</div>
						}>
							<VideoBackground />
							<About />
							<Contact />
						</Suspense>
					</div>
				</main>
			</CustomThemeProvider>
		</LoadingScreen>
	);
};