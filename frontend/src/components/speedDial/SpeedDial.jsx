import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaTwitter, FaTelegram, FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const profiles = [
  {
    network: "LinkedIn",
    username: "mohammad-bello",
    url: "https://www.linkedin.com/in/mohammad-bello/",
    icon: FaLinkedin
  },
  {
    network: "GitHub",
    username: "Lycan-Xx",
    url: "https://github.com/Lycan-Xx",
    icon: FaGithub
  },
  {
    network: "Twitter",
    username: "LycanXx2",
    url: "https://x.com/LycanXx2",
    icon: FaTwitter
  },
  {
    network: "Telegram",
    username: "lycan_xx1",
    url: "https://t.me/lycan_xx1",
    icon: FaTelegram
  },
  {
    network: "Discord",
    username: "lycan_xx0",
    url: "https://discord.com/users/lycan_xx0",
    icon: FaDiscord
  }
];

const SpeedDial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Check if the screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.speed-dial-container')) {
        setIsOpen(false);
        setActiveTooltip(null);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setActiveTooltip(null);
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank');
    if (isMobile) {
      setIsOpen(false);
      setActiveTooltip(null);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 speed-dial-container">
      <motion.div
        className="relative"
        {...(!isMobile && {
          onHoverStart: () => setIsOpen(true),
          onHoverEnd: () => {
            setIsOpen(false);
            setActiveTooltip(null);
          },
        })}
      >
        {/* Main Toggle Button */}
        <motion.button
          onClick={handleToggle}
          className="glass-button group flex items-center gap-3 backdrop-blur-lg px-3 py-2 rounded-xl shadow-lg md:w-auto w-12 h-12 md:h-auto overflow-hidden"
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute bottom-full mb-2 right-0 bg-black/20 backdrop-blur-sm rounded-lg p-2 w-fit"
            >
              <div className="flex flex-col gap-2">
                {profiles.map((profile) => (
                  <motion.button
                    key={profile.network}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10"
                    onClick={() => window.open(profile.url, '_blank')}
                    onMouseEnter={() => setActiveTooltip(profile.network)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <profile.icon 
                      size={20}
                      className="text-secondary"
                    />
                    <span className="font-mono text-sm hidden md:inline">
                      {profile.network}
                    </span>
                    
                    {/* Mobile Tooltip */}
                    <AnimatePresence>
                      {isMobile && activeTooltip === profile.network && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50"
                        >
                          {profile.network}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
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