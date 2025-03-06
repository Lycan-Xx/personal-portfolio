import React, { useState, useEffect } from 'react';
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
	const [scrolled, setScrolled] = useState(false);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 20;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [scrolled]);

	const handleSetActive = (to) => {
		setActiveNav(to);
		setShowMobileMenu(false);
	};

	const mobileMenuVariants = {
		hidden: { 
			opacity: 0,
			y: -20,
			transition: {
				duration: 0.2
			}
		},
		visible: { 
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.2
			}
		}
	};

	const navbarVariants = {
		initial: { y: -100 },
		animate: { y: 0 },
		transition: { duration: 0.3 }
	};

	return (
		<motion.nav 
			initial="initial"
			animate="animate"
			variants={navbarVariants}
			className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${
				scrolled ? 'bg-dark-DEFAULT/80 backdrop-blur-[1px]' : 'bg-transparent'
			}`}
		>
			<div className="max-w-4xl mx-auto">
				<div className={`glass-card py-3 px-4 md:px-6 transition-all duration-300 ${
					scrolled ? 'shadow-lg' : ''
				}`}>
					<div className="flex items-center justify-between md:justify-center h-12">
						{/* Current Section Name - Mobile Only */}
						<div className="md:hidden font-bold font-mono text-cyan-400 text-lg">
							{navItems.find(item => item.id === activeNav)?.label || 'Home'}
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-2">
							{navItems.map((item) => (
								<motion.div 
									key={item.id}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
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
							className="md:hidden p-2 rounded-full hover:bg-cyan-400/10 transition-colors duration-300"
							aria-label="Toggle menu"
						>
							<motion.span
								animate={{ rotate: showMobileMenu ? 180 : 0 }}
								transition={{ duration: 0.3 }}
							>
								{!showMobileMenu ? (
									<svg className="w-6 h-6 stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								) : (
									<svg className="w-6 h-6 stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								)}
							</motion.span>
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
							className="mt-2 glass-card p-4 md:hidden mx-auto max-w-[90%] border border-cyan-400/20"
						>
							<div className="flex flex-col space-y-3">
								{navItems.map((item) => (
									<motion.div
										key={item.id}
										whileTap={{ scale: 0.95 }}
									>
										<Link
											to={item.id}
											spy={true}
											smooth={true}
											offset={-100}
											duration={500}
											onSetActive={handleSetActive}
											onClick={() => setShowMobileMenu(false)}
											className={`px-4 py-3 rounded-xl text-base font-mono font-semibold text-left w-full transition-all duration-300 block
												${activeNav === item.id
													? "text-white bg-cyan-400/10 border-2 border-cyan-400"
													: "text-cyan-400 hover:text-white hover:bg-cyan-400/10"
												}`}
										>
											{item.label}
										</Link>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.nav>
	);
};

export default Navbar;