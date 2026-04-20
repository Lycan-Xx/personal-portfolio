import React, { useState, useEffect } from 'react';
import { Content } from '../components/content/Content';
// import { ThemeToggle } from '../components/theme/ThemeToggle';
import { Resume } from '../components/resume/Resume';
import SpeedDial from '../components/speedDial/SpeedDial';
import { usePerformance } from '../hooks/usePerformance';

export const Home = () => {
  const [isVisible, setIsVisible] = useState(true);
  const isHighPerformance = usePerformance();

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect();
        setIsVisible(rect.top <= 0 && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-20 md:pt-[60px] relative overflow-hidden max-w-[100vw]" id="home">
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-2 md:px-1 overflow-hidden max-w-[100vw]">
        <Content />
      </div>

      <SpeedDial />
      {isVisible && (
        <div className={`absolute top-20 right-8 z-[999] md:top-[120px] md:right-4 md:scale-90 ${isHighPerformance ? 'slide-in-right' : ''}`}>
          <Resume />
        </div>
      )}
    </div>
  );
};