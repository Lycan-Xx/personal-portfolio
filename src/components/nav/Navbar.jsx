import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';

const navItems = [
	{ id: "home", label: "Home" },
	{ id: "works", label: "Projects" }, // Updated to match Works component id
	{ id: "about", label: "About" },
	{ id: "contact", label: "Contact" }
];

const Navbar = () => {
	const [activeNav, setActiveNav] = useState("home");
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const handleSetActive = (to) => {
		setActiveNav(to);
		setShowMobileMenu(false);
	};

	const mobileMenuVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0 }
	};

	return (
		<nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-50">
			<div className="glass-card py-3 px-6">
				<div className="flex items-center justify-between md:justify-center">
					{/* Desktop Navigation */}
					<div className="hidden md:flex space-x-2">
						{navItems.map((item) => (
							<motion.div key={item.id}>
								<Link
									to={item.id}
									spy={true}
									smooth={true}
									offset={-100}
									duration={500}
									onSetActive={handleSetActive}
									className={`px-4 py-2 rounded-xl text-lg font-semibold font-mono transition-all duration-300 cursor-pointer
                    ${activeNav === item.id
											? "text-white border-2 border-cyan-400 bg-cyan-400/10"
											: "text-cyan-400 hover:text-white hover:bg-cyan-400/10"
										}`}
								>
									{item.label}
								</Link>
							</motion.div>
						))}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setShowMobileMenu(!showMobileMenu)}
						className="md:hidden p-2 rounded-full text-white hover:bg-cyan-400/10 transition-colors duration-300"
						aria-label="Toggle mobile menu"
					>
						<span className="sr-only">Toggle menu</span>
						{!showMobileMenu ? (
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						) : (
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu Dropdown */}
			<AnimatePresence>
				{showMobileMenu && (
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={mobileMenuVariants}
						transition={{ duration: 0.2 }}
						className="mt-4 glass-card p-4 md:hidden"
					>
						<div className="flex flex-col space-y-2">
							{navItems.map((item) => (
								<Link
									key={item.id}
									to={item.id}
									spy={true}
									smooth={true}
									offset={-100}
									duration={500}
									onSetActive={handleSetActive}
									onClick={() => setShowMobileMenu(false)}
									className={`px-4 py-2 rounded-xl text-[1rem] font-mono font-semibold text-left w-full transition-all duration-300
                    ${activeNav === item.id
											? "text-white bg-cyan-400/10 border-2 border-cyan-400"
											: "text-cyan-400 hover:text-white hover:bg-cyan-400/10"
										}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navbar;