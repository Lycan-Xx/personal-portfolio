import React, { useState, useEffect } from 'react';
import { Content } from '../components/content/Content';
import { makeStyles } from '@mui/styles';
import AnimatedBackground from '../components/background/AnimatedBackground';
// import { ThemeToggle } from '../components/theme/ThemeToggle';
import { Resume } from '../components/resume/Resume';
import SpeedDial from '../components/speedDial/SpeedDial';
import { usePerformance } from '../hooks/usePerformance';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    paddingTop: '80px',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      paddingTop: '60px',
    }
  },
  resumeContainer: {
    position: 'absolute',
    top: '80px',
    right: '2rem',
    zIndex: 999,
    '@media (max-width: 768px)': {
      top: '120px',
      right: '1rem',
      transform: 'scale(0.9)',
    }
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    '@media (max-width: 768px)': {
      padding: '0 0.5rem',
    }
  }
}));

export const Home = () => {
  const classes = useStyles();
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
    <div className={classes.root} id="home">
      <AnimatedBackground />
      
      <div className={classes.contentWrapper}>
        <Content />
      </div>

      {/* <ThemeToggle /> */}
      <SpeedDial />
      {isVisible && (
        <div className={`${classes.resumeContainer} ${isHighPerformance ? 'slide-in-right' : ''}`}>
          <Resume />
        </div>
      )}
    </div>
  );
};