import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";

export const Today = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const timeOfDayMessage = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 4) return "Midnight Code Crunch";
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
          setTypedText(text => fullGreeting.substring(0, index + 1));
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

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    if (!isTyping) {
      const resetInterval = setTimeout(() => {
        runTypewriter();
      }, 10000);

      return () => clearTimeout(resetInterval);
    }
  }, [isTyping, runTypewriter]);

  useEffect(() => {
    const typewriterCleanup = runTypewriter();
    return typewriterCleanup;
  }, [runTypewriter]);

  const formattedTime = format(currentTime, "HH:mm:ss");
  const formattedDate = format(currentTime, "EEEE, MMMM do, yyyy");
  const dateParts = formattedDate.split(" ");

  return (
    <div className="today-card glass-card p-4 sm:p-6 w-[95vw] sm:w-[400px] mx-auto opacity-0 translate-y-5 animate-fade-in-up mt-24 md:mt-0">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-cyan-400">Current Time</h3>
        <div className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-wider">
          {formattedTime}
        </div>
        <p className="text-base sm:text-lg text-gray-400 font-bold">
          {dateParts.map((part, index) => (
            <span
              key={index}
              style={{
                color: index === 0 ? "#ec704c" : index === 1 ? "#22d3ee" : index === 2 ? "white" : "red",
              }}
            >
              {part}{" "}
            </span>
          ))}
        </p>
        <div className="mt-3 sm:mt-4 text-base sm:text-lg font-medium font-mono text-gray-300 h-[60px] sm:h-[80px] overflow-hidden">
          {typedText}
          <span className={`ml-1 inline-block w-2 h-4 bg-cyan-400 ${isTyping ? 'animate-blink' : 'opacity-0'}`}></span>
        </div>
      </div>
    </div>
  );
};