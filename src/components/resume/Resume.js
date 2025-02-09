import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@material-ui/core';
import { TextDecrypt } from '../content/TextDecrypt';
import ResumePDF from './../../assets/Tan_Mark_Resume.pdf';
import {
	ResumeIcon
} from '../content/ResumeButton';

const useStyles = makeStyles(() => ({
	resumeBtn: {
		position: 'fixed',
		top: '80px', // Positioned below navbar
		right: '2rem',
		padding: '0.5rem 1rem',
		zIndex: 999,
	},
}));

export const Resume = () => {
	const classes = useStyles();

	return (
		<Link
			color='inherit'
			underline='none'
			href={`${ResumePDF}`}
			target='_blank'
			rel='noopener noreferrer'
			className={classes.resumeBtn}
		>
			<ResumeIcon />
			<Typography component='span'>
				<TextDecrypt text={' Resume'} />
			</Typography>
		</Link>
	);
};
