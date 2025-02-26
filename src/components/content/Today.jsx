import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";

export const Today = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const timeOfDayMessage = useMemo(() => {
	const hour = currentTime.getHours();
  
	if (hour < 4) return "Midnight Code Crunch (No Sleep Mode)";
	if (hour < 12) return "AM Coffee & Code";
	if (hour < 18) return "Afternoon Debugging Spree";
	if (hour < 22) return "Evening Optimization Party";
	return "Late Night Algorithm Jam";
  }, [currentTime]);
  
  // Combined greeting text
  const fullGreeting = useMemo(() => {
	return `Welcome, fellow coder! You've booted into the realm of ${timeOfDayMessage}. Time to push some code, squash some bugs, and make the magic happen!`;
  }, [timeOfDayMessage]);
  
  // Typewriter effect implementation using useCallback for better performance
  const runTypewriter = useCallback(() => {
	setIsTyping(true);
	setTypedText(""); // Clear text first
	
	// Slight delay before starting to type
	const startDelay = setTimeout(() => {
	  let index = 0;
	  const typeInterval = setInterval(() => {
		if (index < fullGreeting.length) {
		  setTypedText(text => fullGreeting.substring(0, index + 1)); // Use substring instead
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
  
  // Clock update effect - runs every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(clockInterval);
  }, []);
  
  // Typewriter reset effect - resets every 10 seconds if not currently typing
  useEffect(() => {
    if (!isTyping) {
      const resetInterval = setTimeout(() => {
        runTypewriter();
      }, 10000);
      
      return () => clearTimeout(resetInterval);
    }
  }, [isTyping, runTypewriter]);
  
  // Initial typewriter run
  useEffect(() => {
    const typewriterCleanup = runTypewriter();
    return typewriterCleanup;
  }, [runTypewriter]);
  
  // Formatted time and date strings
  const formattedTime = format(currentTime, "HH:mm:ss");
  const formattedDate = format(currentTime, "EEEE, MMMM do, yyyy");
  // Split the formatted date into parts for styling
  const dateParts = formattedDate.split(" ");
  
  return (
    <div 
      className="glass-card w-full max-w-sm p-6 mx-auto opacity-0 translate-y-5 animate-fade-in-up"
    >
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-cyan-400">Current Time</h3>
        <div className="text-4xl font-bold text-white font-mono tracking-wider">
          {formattedTime}
        </div>
        <p className="text-lg text-gray-400 font-bold">
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
        <div className="mt-4 text-lg font-medium font-mono text-gray-300 min-h-[28px]">
          {typedText}
          <span className={`ml-1 inline-block w-2 h-4 bg-cyan-400 ${isTyping ? 'animate-blink' : 'opacity-0'}`}></span>
        </div>
      </div>
    </div>
  );
};