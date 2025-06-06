import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';

const navItems = [
	{ id: "home", label: "Lycan_Xx" },
	{ id: "works", label: "Projects" },
	{ id: "about", label: "About" },
	{ id: "contact", label: "Contact" }
];

const Navbar = () => {
	const [activeNav, setActiveNav] = useState("home");
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [isHighPerformance, setIsHighPerformance] = useState(false);
	const navRef = useRef(null);

	useEffect(() => {
		setIsHighPerformance(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
	}, []);

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

	const NavWrapper = isHighPerformance ? motion.nav : 'nav';
	const NavProps = isHighPerformance ? {
		initial: { y: -100 },
		animate: { y: 0 },
		transition: { duration: 0.3 },
		className: `fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2 sm:py-4 transition-all duration-300 ${scrolled ? 'bg-dark-DEFAULT/80 backdrop-blur-[1px]' : 'bg-transparent'
			}`
	} : {
		className: `fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2 sm:py-4 transition-all duration-300 ${scrolled ? 'bg-dark-DEFAULT/80 backdrop-blur-[1px]' : 'bg-transparent'
			}`
	};

	return (
		<NavWrapper {...NavProps} ref={navRef}>
			<div className="max-w-4xl mx-auto">
				<div className={`glass-card py-2 sm:py-3 px-3 sm:px-4 md:px-6 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''
					}`}>
					<div className="flex items-center justify-between md:justify-center h-10 sm:h-12">
						<div className="md:hidden font-bold font-mono text-cyan-400 text-base sm:text-lg">
							{navItems.find(item => item.id === activeNav)?.label || 'Home'}
						</div>

						<div className="hidden md:flex items-center space-x-6 lg:space-x-10">
							{navItems.map((item) => (
								<Link
									key={item.id}
									to={item.id}
									spy={true}
									smooth={true}
									offset={-80}
									duration={500}
									onSetActive={handleSetActive}
									className={`px-3 sm:px-4 py-2 rounded-xl text-base lg:text-lg font-semibold font-mono transition-all duration-300 cursor-pointer
                    ${activeNav === item.id
											? "text-white border-2 border-cyan-400 bg-cyan-400/10"
											: "text-cyan-400 hover:text-white hover:bg-cyan-400/10"
										}`}
								>
									{item.label}
								</Link>
							))}
						</div>

						<button
							onClick={() => setShowMobileMenu(!showMobileMenu)}
							className="md:hidden p-2 rounded-full hover:bg-cyan-400/10 transition-colors duration-300"
							aria-label="Toggle menu"
						>
							<span className="block w-6 h-6">
								{!showMobileMenu ? (
									<svg className="w-full h-full stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								) : (
									<svg className="w-full h-full stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								)}
							</span>
						</button>
					</div>
				</div>

				{showMobileMenu && (
					<div className="mt-2 glass-card p-3 sm:p-4 md:hidden mx-auto max-w-[90%] border border-cyan-400/20">
						<div className="flex flex-col space-y-2 sm:space-y-3">
							{navItems.map((item) => (
								<Link
									key={item.id}
									to={item.id}
									spy={true}
									smooth={true}
									offset={-80}
									duration={500}
									onSetActive={handleSetActive}
									onClick={() => setShowMobileMenu(false)}
									className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-mono font-semibold text-left w-full transition-all duration-300 block
                    ${activeNav === item.id
											? "text-white bg-cyan-400/10 border-2 border-cyan-400"
											: "text-cyan-400 hover:text-white hover:bg-cyan-400/10"
										}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</NavWrapper>
	);
};

export default Navbar;