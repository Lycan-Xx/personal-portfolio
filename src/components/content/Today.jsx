import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export const Today = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const timeOfDayMessage = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 4)  return "Midnight Code Crunch";
    if (hour < 12) return "AM Coffee & Code";
    if (hour < 18) return "Afternoon Debug";
    if (hour < 22) return "Evening Code";
    return "Late Night Code";
  }, [currentTime]);

  const fullGreeting = useMemo(() => {
    return `Welcome! You're in ${timeOfDayMessage} mode.`;
  }, [timeOfDayMessage]);

  const runTypewriter = useCallback(() => {
    setIsTyping(true);
    setTypedText("");
    const startDelay = setTimeout(() => {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < fullGreeting.length) {
          setTypedText(() => fullGreeting.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 50);
      return () => clearInterval(typeInterval);
    }, 50);
    return () => clearTimeout(startDelay);
  }, [fullGreeting]);

  // Clock tick — every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Reset typewriter 10s after it finishes
  useEffect(() => {
    if (!isTyping) {
      const resetTimeout = setTimeout(() => {
        runTypewriter();
      }, 10000);
      return () => clearTimeout(resetTimeout);
    }
  }, [isTyping, runTypewriter]);

  // Initial typewriter run
  useEffect(() => {
    const cleanup = runTypewriter();
    return cleanup;
  }, [runTypewriter]);

  const formattedTime = format(currentTime, "HH:mm:ss");

  // Date parts with corrected palette colors
  const dayName  = format(currentTime, "EEEE");   // Monday
  const monthDay = format(currentTime, "MMMM do"); // April 5th
  const year     = format(currentTime, "yyyy");    // 2026

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
      className="today-card today-card-float p-4 sm:p-6 w-[95vw] sm:w-[400px] mx-auto rounded-2xl"
      style={{
        background:     'rgba(18, 26, 42, 0.55)',
        border:         '1px solid rgba(66, 188, 188, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="space-y-3 sm:space-y-4">

        {/* Label */}
        <p
          className="text-[10px] uppercase tracking-widest text-cyan-400/60"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          // current time
        </p>

        {/* Clock */}
        <div
          className="text-3xl sm:text-4xl font-bold text-cyan-400 tracking-wider"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {formattedTime}
        </div>

        {/* Date — corrected palette */}
        <p
          className="text-base sm:text-lg font-bold"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <span style={{ color: '#ec704c' }}>{dayName}</span>
          {', '}
          <span style={{ color: '#42bcbc' }}>{monthDay}</span>
          {', '}
          <span style={{ color: '#94a3b8' }}>{year}</span>
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-cyan-400/15" />

        {/* Typewriter */}
        <div
          className="text-sm font-medium text-gray-300 h-[48px] sm:h-[56px] overflow-hidden"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <span>{typedText}</span>
          <span
            className={`ml-0.5 inline-block w-[7px] h-[14px] bg-cyan-400 ${isTyping ? 'animate-blink' : 'opacity-0'}`}
            style={{ verticalAlign: 'middle', transition: 'opacity 0.2s' }}
          />
        </div>

      </div>
    </motion.div>
  );
};