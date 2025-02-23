import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";

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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl bg-white/20 backdrop-blur-lg rounded-full py-3 px-6 shadow-lg flex items-center justify-center z-50">
      {/* Desktop Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex gap-6 justify-center w-full"
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
            className={`relative px-4 py-2 rounded-full text-white font-semibold cursor-pointer transition-all duration-300 hover:bg-white/10
              ${activeNav === item.id ? "border border-white" : ""}`}
            onClick={() => setActiveNav(item.id)}
          >
            {item.label}
          </ScrollLink>
        ))}
      </motion.div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center justify-between w-full text-white">
        <span className="text-lg font-semibold">{currentSection}</span>
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, y: -10 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute top-full left-0 w-full bg-white/20 backdrop-blur-lg py-3 px-6 rounded-b-3xl overflow-hidden"
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
                className="block py-3 px-4 rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300"
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