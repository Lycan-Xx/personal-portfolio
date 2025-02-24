import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export const Today = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayedGreeting, setDisplayedGreeting] = useState("");
  const [displayedTimeOfDay, setDisplayedTimeOfDay] = useState("");

  // Update time every second.
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Animate the greeting and time-of-day message.
  useEffect(() => {
    const animateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      let timeOfDay = "";
      if (hour < 4) timeOfDay = "Nocturnal Protocols";
      else if (hour < 12) timeOfDay = "AM Bitstream";
      else if (hour < 18) timeOfDay = "Midday Matrix";
      else if (hour < 22) timeOfDay = "Evening Algorithm";
      else timeOfDay = "Nocturnal Protocols";

      const fullGreeting = "Greetings, digital traveler!";
      let index = 0;
      setDisplayedGreeting("");
      setDisplayedTimeOfDay("");

      const intervalId = setInterval(() => {
        if (index < fullGreeting.length) {
          setDisplayedGreeting((prev) => prev + fullGreeting.charAt(index));
        } else if (index < fullGreeting.length + timeOfDay.length) {
          setDisplayedTimeOfDay((prev) =>
            prev + timeOfDay.charAt(index - fullGreeting.length)
          );
        }
        index++;
        if (index >= fullGreeting.length + timeOfDay.length) {
          clearInterval(intervalId);
        }
      }, 50);
    };

    animateGreeting();
    const greetingInterval = setInterval(animateGreeting, 10000);
    return () => clearInterval(greetingInterval);
  }, []);

  const formattedTime = format(currentTime, "HH:mm:ss");
  const formattedDate = format(currentTime, "EEEE, MMMM do, yyyy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card w-full max-w-sm p-6 mx-auto"
    >
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-cyan-400">Current Time</h3>
        <div className="text-4xl font-bold text-white font-mono tracking-wider">
          {formattedTime}
        </div>
        <p className="text-lg text-gray-400">{formattedDate}</p>
        <div className="mt-4 text-lg font-medium text-gray-300">
          {displayedGreeting} {displayedTimeOfDay}
        </div>
      </div>
    </motion.div>
  );
};
