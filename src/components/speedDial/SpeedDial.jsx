import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, Github, Flag, MessageCircle, MessageSquare } from 'lucide-react';

const profiles = [
  { 
    network: "Google",
    username: "markcmtan@gmail.com",
    url: "mailto:markcmtan@gmail.com",
    icon: Mail
  },
  {
    network: "LinkedIn",
    username: "mcmtan",
    url: "https://www.linkedin.com/in/mcmtan/",
    icon: Linkedin
  },
  {
    network: "GitHub",
    username: "taniyow",
    url: "https://github.com/taniyow",
    icon: Github
  },
  {
    network: "GitLab",
    username: "taniyow",
    url: "https://gitlab.com/taniyow",
    icon: Flag
  },
  {
    network: "Telegram",
    username: "marktaniyow",
    url: "https://t.me/marktaniyow",
    icon: MessageCircle
  },
  {
    network: "Discord",
    username: "taniyow#9142",
    url: "https://discord.com",
    icon: MessageSquare
  }
];

const SpeedDial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if the screen is mobile on resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle popup on mobile, hover on desktop
  const handleToggle = () => {
    if (isMobile) {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.div
        className="relative"
        {...(!isMobile && {
          onHoverStart: () => setIsOpen(true),
          onHoverEnd: () => setIsOpen(false),
        })}
      >
        {/* Main Toggle Button */}
        <motion.button
          onClick={handleToggle}
          className="glass-button group flex items-center gap-3  backdrop-blur-lg px-3 py-2 rounded-xl shadow-lg md:w-auto w-12 h-12 md:h-auto overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-current text-secondary transition-transform duration-150 ease-in-out transform group-hover:scale-110"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 3.59 8 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-mono hidden md:inline">Socials</span>
        </motion.button>

        {/* Social Links Popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute ${
                isMobile
                  ? "bottom-full right-[-0.75rem] transform -translate-x-1/2 mb-2 flex flex-col items-center"
                  : "bottom-full left-0 mb-4"
              } shadow-lg overflow-hidden`}
            >
              <div className="p-2 flex flex-col gap-2">
                {profiles.map((profile) => (
                  <motion.a
                    key={profile.network}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative backdrop-blur-[2rem] glass-button group flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-black/5 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Use text-secondary for all icons */}
                    <profile.icon 
                      size={20}
                      className="text-secondary"
                    />
                    {/* Desktop label */}
                    <span className="font-mono text-sm hidden md:inline">
                      {profile.network}
                    </span>
                    {/* Mobile Tooltip (Now properly positioned & visible) */}
                    {isMobile && (
                      <span className="absolute -top-8 left-1/4 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {profile.network}
                      </span>
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SpeedDial;
