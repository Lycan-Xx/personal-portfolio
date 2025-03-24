import React, { useState, useEffect } from 'react';
import { Content } from '../components/content/Content';
import { makeStyles } from '@mui/styles';
import AnimatedBackground from '../components/background/AnimatedBackground';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { Resume } from '../components/resume/Resume';
import SpeedDial from '../components/speedDial/SpeedDial';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    paddingTop: '80px',
  },
  resumeContainer: {
    position: 'absolute',
    top: '80px',
    right: '2rem',
    zIndex: 999,
    [theme.breakpoints.down('sm')]: {
      top: '120px',
      right: '1.5rem',
    }
  }
}));

export const Home = () => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(true);

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
      <Content />

      <ThemeToggle />
      <SpeedDial />
      {isVisible && (
        <div className={classes.resumeContainer}>
          <Resume />
        </div>
      )}
    </div>
  );
};
