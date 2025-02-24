import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { throttle } from 'lodash';

const navItems = [
  { id: "home", label: "Home" },
  { id: "works", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const [activeNav, setActiveNav] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentSection, setCurrentSection] = useState("Home");

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section && section.offsetTop <= scrollPosition + 100) {
          setActiveNav(item.id);
          setCurrentSection(item.label);
        }
      });
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-50">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl py-3 px-6 shadow-lg">
        <div className="flex items-center justify-between md:justify-center">
          {/* Mobile Section Name */}
          <div className="md:hidden font-semibold font-mono text-white">
            {currentSection}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                aria-label={`Navigate to ${item.label}`}
                className={`px-4 py-2 rounded-2xl text-lg font-semibold font-mono transition-colors duration-200 ${
                  activeNav === item.id
                    ? "text-white border-[0.2rem] border-[#22d3ee] rounded-xl"
                    : "text-[#22d3ee]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-full text-white hover:bg-black/5"
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
            className="mt-4 bg-white/20 backdrop-blur-sm rounded-3xl p-4 shadow-xl md:hidden"
          >
            <div className="flex flex-col space-y-2 items-start">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-label={`Navigate to ${item.label}`}
                  onClick={() => setShowMobileMenu(false)}
                  className={`px-4 py-2 rounded-xl text-[1rem] font-mono font-semibold text-left w-full transition-colors duration-200 ${
                    activeNav === item.id
                      ? "text-white"
                      : "text-[#22d3ee]"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;