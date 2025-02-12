import React from 'react';
import { Link, Tooltip, IconButton, Zoom } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Resume from '../../settings/resume.json';

const useStyles = makeStyles((theme) => ({
	social: {
		position: 'fixed',
		left: '2rem',
		top: '50%',
		transform: 'translateY(-50%)',
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
		zIndex: 999,
	},
	icon: {
		fontSize: '1.5rem',
		transition: 'all 0.3s ease',
		'&:hover': {
			color: theme.palette.primary.main,
			transform: 'scale(1.2)',
		},
	},
}));

export const SocialIcons = () => {
	const classes = useStyles();

	const socialItems = Resume.basics.profiles.map((socialItem) => (
		<Link
			href={socialItem.url}
			key={socialItem.network.toLowerCase()}
			target='_blank'
			rel='noopener noreferrer'
			underline='none'
			color='inherit'
		>
			<Tooltip
				title={socialItem.username}
				placement='left'
				TransitionComponent={Zoom}
			>
				<IconButton
					color='inherit'
					aria-label={socialItem.network}
					className={classes.iconButton}
				>
					<i className={`${classes.icon} ${socialItem.x_icon}`}></i>
				</IconButton>
			</Tooltip>
		</Link>
	));

	return <div className={classes.social}>{socialItems}</div>;
};
