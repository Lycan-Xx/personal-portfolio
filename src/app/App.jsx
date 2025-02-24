import React from "react";
import { CustomThemeProvider } from "../components/theme/ThemeProvider";
import { CssBaseline } from "@mui/material";
import { Home } from "../pages/Home";
import { Works } from "../components/works/Works";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";
import Navbar from '../components/nav/Navbar';
import VideoBackground from "../components/background/VideoBackground";

export const App = () => {
	return (
		<CustomThemeProvider>
			<CssBaseline />
			<VideoBackground />
			<Navbar />
			<main>
				<Home />
				<Works />
				<About />
				<Contact />
			</main>
		</CustomThemeProvider>
	);
};
