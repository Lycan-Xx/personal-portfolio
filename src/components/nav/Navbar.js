import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import './Navbar.css';

const navItems = [
	{ id: "#home", label: "Home" },
	{ id: "#works", label: "Projects" },
	{ id: "#about", label: "About" },
	{ id: "#contact", label: "Contact" }
];

const Navbar = () => {
	const [activeNav, setActiveNav] = useState("#home");
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [currentSection, setCurrentSection] = useState("Home");

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const sections = navItems.map((item) => document.querySelector(item.id));
			sections.forEach((section, index) => {
				if (section && section.offsetTop <= scrollPosition + 100) {
					setActiveNav(navItems[index].id);
					setCurrentSection(navItems[index].label);
				}
			});
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav className="navbar-container">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="navbar-desktop"
			>
				{navItems.map((item) => (
					<a
						key={item.id}
						href={item.id}
						onClick={() => setActiveNav(item.id)}
						className={`nav-link ${activeNav === item.id ? "nav-link-active" : ""}`}
					>
						{item.label}
					</a>
				))}
			</motion.div>

			{/* Mobile View */}
			<div className="navbar-mobile">
				<span className="current-section">{currentSection}</span>
				<button onClick={() => setShowMobileMenu(!showMobileMenu)}>
					<Menu size={24} />
				</button>
			</div>

			{showMobileMenu && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mobile-menu"
				>
					{navItems.map((item) => (
						<a
							key={item.id}
							href={item.id}
							onClick={() => {
								setActiveNav(item.id);
								setShowMobileMenu(false);
							}}
							className="mobile-menu-link"
						>
							{item.label}
						</a>
					))}
				</motion.div>
			)}
		</nav>
	);
};

export default Navbar;
