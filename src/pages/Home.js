import React, { useState, useEffect } from 'react';
import { Content } from '../components/content/Content';
import { Hidden } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DisplacementSphere from '../components/background/DisplacementSphere';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { Resume } from '../components/resume/Resume';
import { SocialIcons } from '../components/content/SocialIcons';
import { SpeedDials } from '../components/speedDial/SpeedDial';
import { SideNavbar } from '../components/nav/Navbar';
import { About } from '../components/about/About';
import { Contact } from '../components/contact/Contact';
import { Today } from '../components/content/Today';

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
			<DisplacementSphere />
			<Content />
			<ThemeToggle />
			<Hidden smDown>
				<SocialIcons />
			</Hidden>
			<Hidden mdUp>
				<SpeedDials />
			</Hidden>
			{isVisible && (
				<>
					<div className={classes.resumeContainer}>
						<Resume />
					</div>
					<Today />
				</>
			)}
		</div>
	);
};
