import React, { useState, useEffect } from "react";
import Resume from "../../settings/resume.json";
import { FirstName, LastName } from "../../utils/getName";
import { Today } from "./Today";
import { usePerformance } from '../../hooks/usePerformance';

export const Content = () => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isHighPerformance = usePerformance();
  const jobs = [Resume.basics.job1, Resume.basics.job2, Resume.basics.job3].filter(Boolean);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentJobIndex((prevIndex) => (prevIndex + 1) % jobs.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [jobs.length]);

  return (
    <section className="min-h-[calc(100vh-4rem)] relative px-2 sm:px-4 md:px-8 flex items-center justify-center max-w-[100vw] overflow-x-hidden">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-8 py-8 md:py-0">
        
        <div className="order-2 md:order-1 w-full md:w-2/3 relative z-10 text-center md:text-left">
          <div className={`mb-6 md:mb-8 ${isHighPerformance ? 'slide-up' : ''}`}>
            <h2 className="text-lg sm:text-xl md:text-4xl text-cyan-400 mb-3 md:mb-4 font-mono">
              {Resume.basics.x_title}
            </h2>
            <div className="flex flex-col">
              <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-200">
                <span style={{ fontFamily: "ChocoCooky" }}>{FirstName}</span>
                <span style={{ fontFamily: "ChocoCooky" }} className="ml-2">(Sani)</span>
              </div>
              <div style={{ fontFamily: "ChocoCooky" }} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-gray-200">
                {LastName}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-gray-300 font-light">
              <div className="relative h-16 md:h-24 overflow-hidden">
                <div
                  className={`transition-all duration-500 ease-in-out ${isAnimating
                    ? "opacity-0 -translate-y-6"
                    : "opacity-100 translate-y-0"
                    }`}
                >
                  <span className="text-cyan-400">{jobs[currentJobIndex]}</span>
                </div>
              </div>
            </div>
          </div>

          <p
            className={`sm:text-lg md:text-2xl font-semibold text-cyan-400 max-w-3xl mx-auto md:mx-0 ${isHighPerformance ? 'slide-in-left delay-300' : ''
              }`}
            style={{ fontFamily: "ChocoCooky" }}
          >
            {Resume.basics.description}
          </p>
        </div>

        <div className="order-1 md:order-2 w-full sm:w-[80%] md:w-1/3">
          <Today />
        </div>
      </div>
    </section>
  );
};