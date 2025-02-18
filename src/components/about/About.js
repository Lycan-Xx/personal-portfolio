/* eslint-disable no-unused-vars */
import React from "react";
import { Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles"; // Update this line
import { TextDecrypt } from "../content/TextDecrypt";
import { FirstName, LastName } from "../../utils/getName";

import './About.css';

import profile from '../../assets/profile.png';

const useStyles = makeStyles((theme) => ({
	section: {
		minHeight: '100vh',
		background: theme.palette.background.default,
		padding: '80px 0',
	},
	main: {
		maxWidth: '100vw',
		marginTop: '3em',
		marginBottom: "auto",
	},
}));

export const About = () => {
	const classes = useStyles();
	const greetings = "Hello there!";
	const aboutme = `I'm ${FirstName} ${LastName}, a multidisciplinary 
                  designer & developer. I'm always down for something new and challenging!
                  I'm here to help you create beautifully formatted websites. 
                  My projects mostly includes web development.`;

	return (
		<section className={classes.section} id="about">
			<Container component="main" className={classes.main} maxWidth="md">
				<div className="about">
					<div className="_img"
						style={{
							background: "url(" + profile + ")",
							backgroundSize: 'contain',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
					</div>
					<div className="_content_wrapper">
						<Typography component='h2' variant="h5">
							<TextDecrypt text={`${greetings}`} />
						</Typography>
						<p className="aboutme">
							{aboutme}
						</p>
						<a href="#contact" className="contact-btn">
							<i className="fas fa-terminal"></i>
							<Typography component='span'> Send me a message.</Typography>
						</a>
					</div>
				</div>
			</Container>
		</section>
	);
};
