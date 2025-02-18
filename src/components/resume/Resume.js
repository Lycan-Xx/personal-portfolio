import React from 'react';
import { makeStyles } from '@mui/styles';
import { Typography, Link } from '@mui/material';
import { TextDecrypt } from '../content/TextDecrypt';
import ResumePDF from './../../assets/Tan_Mark_Resume.pdf';
import { ResumeIcon } from '../content/ResumeButton';

const useStyles = makeStyles((theme) => ({
	resumeBtn: {
		padding: '0.5rem 1rem',
		border: `1px solid ${theme.palette.foreground.default}`,
		borderRadius: '8px',
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		transition: 'all 0.3s ease',
		'&:hover': {
			background: theme.palette.primary.main,
			borderColor: theme.palette.primary.main,
		}
	}
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
