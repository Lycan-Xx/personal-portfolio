import React from "react";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { CssBaseline } from "@mui/material";
import { Home } from "../pages/Home";
import { Works } from "../components/works/Works";
import { About } from "../components/about/About";
import { Contact } from "../components/contact/Contact";
import Navbar from '../components/nav/Navbar';

export const App = () => {
	return (
		<ThemeProvider>
			<CssBaseline />
			<Navbar />
			<main>
				<Home />
				<Works />
				<About />
				<Contact />
			</main>
		</ThemeProvider>
	);
};
