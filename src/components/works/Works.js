/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles"; // Update this line
import { Card } from "flowbite-react";
import { Typography, Link } from "@mui/material";

import "./Works.css";

// Import project images
import Portfolio from "../../assets/recentprojects/react-portfolio.png";
import Veritru from "../../assets/recentprojects/veritru.png";
import Lofo from "../../assets/recentprojects/lofo.png";
import Startup from "../../assets/recentprojects/startup.png";
import Lacalle from "../../assets/recentprojects/lacalle.png";

const useStyles = makeStyles((theme) => ({
	section: {
		minHeight: "100vh",
		background: theme.palette.background.default,
		padding: "60px 20px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	main: {
		maxWidth: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	previewBtn: {
		padding: "0.5rem 1rem",
		border: `1px solid ${theme.palette.primary.main}`,
		borderRadius: "8px",
		display: "inline-flex",
		alignItems: "center",
		gap: "0.5rem",
		transition: "all 0.3s ease",
		marginTop: "1rem",
		color: theme.palette.primary.main,
		textDecoration: "none",
		"&:hover": {
			background: theme.palette.primary.main,
			color: theme.palette.background.paper,
		},
	},
}));

export const Works = () => {
	const classes = useStyles();
	const [projects] = useState([
		{
			id: 1,
			title: "React Portfolio",
			description: `Designed and developed a ReactJS portfolio with fancy 3D animations using Three.js for the background element.`,
			alter: "React Portfolio",
			image: Portfolio,
		},
		{
			id: 2,
			title: "VeriTru Project",
			description: `An advocacy project website built using MEAN stack with a fact-checking tool to promote actions against fake news.`,
			alter: "VeriTru Project",
			image: Veritru,
		},
		{
			id: 3,
			title: "LoFo Project",
			description: `Logistics and Forwarding website built using ReactJS to design and develop its front-end.`,
			alter: "LoFo Project",
			image: Lofo,
		},
		{
			id: 4,
			title: "Startup Project",
			description: `A website portfolio project for the Startup Dev Team built using MEVN stack to demonstrate the CRUD capabilities of the tech stack.`,
			alter: "Startup Project",
			image: Startup,
		},
		{
			id: 5,
			title: "LaCalle Cafe",
			description: `A website project for the La Calle Cafe business built using Wordpress and PHP with integrated SEO tools to help the business ramp up its prospects and lead generation.`,
			alter: "LaCalle Cafe",
			image: Lacalle,
		},
	]);

	return (
		<section className={classes.section} id="works">
			<Container component="main" className={classes.main}>
				<Typography variant="h4" component="h1" gutterBottom>
					My Projects
				</Typography>
				<div className="projects-container">
					{projects.map((project) => (
						<div key={project.id} className="project-card">
							<Card className="custom-card">
								<img
									src={project.image}
									alt={project.alter}
									className="card-image"
								/>
								<div className="card-details">
									<Typography variant="h6" className="project-title">
										{project.title}
									</Typography>
									<Typography variant="body2" className="project-description">
										{project.description}
									</Typography>
									<Link
										href="#"
										className={classes.previewBtn}
										underline="none"
									>
										Preview
									</Link>
								</div>
							</Card>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
};