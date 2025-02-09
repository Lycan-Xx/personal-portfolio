import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import './Navbar.css';

const navItems = [
	{ id: "home", label: "Home" },
	{ id: "works", label: "Projects" },
	{ id: "about", label: "About" },
	{ id: "contact", label: "Contact" }
];

const Navbar = () => {
	const [activeNav, setActiveNav] = useState("home");
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [currentSection, setCurrentSection] = useState("Home");

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const sections = navItems.map((item) => document.getElementById(item.id));
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
					<ScrollLink
						key={item.id}
						to={item.id}
						spy={true}
						smooth={true}
						offset={-70}
						duration={800}
						delay={100}
						isDynamic={true}
						spyThrottle={500}
						className={`nav-link ${activeNav === item.id ? "nav-link-active" : ""}`}
						onClick={() => setActiveNav(item.id)}
					>
						{item.label}
					</ScrollLink>
				))}
			</motion.div>

			{/* Mobile View */}
			<div className="navbar-mobile">
				<span className="current-section">{currentSection}</span>
				<button onClick={() => setShowMobileMenu(!showMobileMenu)}>
					<Menu size={24} />
				</button>
			</div>

			<AnimatePresence>
				{showMobileMenu && (
					<motion.div
						initial={{ opacity: 0, scaleY: 0, y: -10 }}
						animate={{ opacity: 1, scaleY: 1, y: 0 }}
						exit={{ opacity: 0, scaleY: 0, y: -10 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						style={{ transformOrigin: "top" }}
						className="mobile-menu"
					>
						{navItems.map((item) => (
							<ScrollLink
								key={item.id}
								to={item.id}
								spy={true}
								smooth={true}
								offset={-70}
								duration={800}
								delay={100}
								isDynamic={true}
								spyThrottle={500}
								className="mobile-menu-link"
								onClick={() => {
									setActiveNav(item.id);
									setShowMobileMenu(false);
								}}
							>
								{item.label}
							</ScrollLink>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navbar;
