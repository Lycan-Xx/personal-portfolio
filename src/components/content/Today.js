import React from "react";
import { Typography, Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
	card: {
		position: 'fixed',
		top: '160px',  // Position below Resume button
		right: '2rem',
		width: '280px',
		background: `${theme.palette.background.default}dd`, // Semi-transparent
		backdropFilter: 'blur(10px)',
		border: `1px solid ${theme.palette.foreground.default}`,
		borderRadius: '8px',
		zIndex: 999,
		[theme.breakpoints.down('sm')]: {
			top: '200px',
			right: '1.5rem',
			width: '240px',
		}
	},
	time: {
		color: theme.palette.primary.main,
		marginTop: theme.spacing(1)
	},
	date: {
		opacity: 0.8,
		fontSize: '0.9rem',
		marginTop: theme.spacing(1)
	}
}));

export const Today = () => {
	const classes = useStyles();
	const date = new Date();
	const hour = date.getHours();
	const timeOfDay =
		(hour < 4 && "night") ||
		(hour < 12 && "morning") ||
		(hour < 18 && "afternoon") ||
		(hour < 22 && "evening") ||
		"night";

	const formattedDate = format(date, 'EEEE, MMMM do yyyy');
	const formattedTime = format(date, 'h:mm a');

	return (
		<Card className={classes.card} elevation={3}>
			<CardContent>
				<Typography variant="h6">
					Good {timeOfDay}!
				</Typography>
				<Typography variant="body1" className={classes.time}>
					{formattedTime}
				</Typography>
				<Typography variant="body2" className={classes.date}>
					{formattedDate}
				</Typography>
			</CardContent>
		</Card>
	);
};
