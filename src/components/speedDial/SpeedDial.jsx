import React, { useContext, useState } from "react";
import { ThemeContext } from "../theme/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "../../utils/iconMap";

const SpeedDial = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showTooltip, setShowTooltip] = useState(false);

  const ToggleIcon = theme === 'light' ? Icons.moon : Icons.sun;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.div
        className="relative"
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
      >
        <motion.button
          onClick={toggleTheme}
          className="glass-button group flex items-center gap-3 backdrop-blur-xl px-3 py-2 rounded-xl shadow-lg md:w-auto w-12 h-12 md:h-auto overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ToggleIcon
            size={22}
            className="text-secondary transition-transform duration-150 ease-in-out transform group-hover:scale-110"
          />
          <span className="font-mono hidden md:inline text-cyan-400">
            {theme === 'light' ? 'Dark' : 'Light'}
          </span>
        </motion.button>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-0 mb-2 md:hidden"
            >
              <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SpeedDial;
