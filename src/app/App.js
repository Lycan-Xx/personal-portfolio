import React from "react";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { CssBaseline } from "@material-ui/core";
import { Home } from "../pages/Home";
import { Works } from "../components/works/Works";
import { About } from "../components/about/About";
import { Contact } from "../components/contact/Contact";
import { SideNavbar } from '../components/nav/SideNavbar';

export const App = () => {
	return (
		<ThemeProvider>
			<CssBaseline />
			<SideNavbar />
			<main>
				<Home />
				<Works />
				<About />
				<Contact />
			</main>
		</ThemeProvider>
	);
};
