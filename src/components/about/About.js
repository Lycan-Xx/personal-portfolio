/* eslint-disable no-unused-vars */
import React from "react";
import { Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextDecrypt } from "../content/TextDecrypt";
import { FirstName, LastName } from "../../utils/getName";

import "./About.css";

import profile from "../../assets/profile.png";
import { FaCode, FaLinux, FaShieldAlt } from "react-icons/fa";
import { SiReact, SiJavascript, SiHtml5, SiCss3, SiGo, SiMongodb, SiSupabase, SiRender, SiCloudinary, SiGithub } from "react-icons/si";
import { VscTerminalBash } from "react-icons/vsc";

const useStyles = makeStyles((theme) => ({
	section: {
		minHeight: "100vh",
		background: theme.palette.background.default,
		padding: "60px 0",
	},
	main: {
		maxWidth: "90vw",
		marginTop: "3em",
		marginBottom: "auto",
	},
}));

export const About = () => {
	const classes = useStyles();
	const greetings = "Hello there!";
	const aboutme = `I'm ${FirstName} ${LastName}, a multidisciplinary 
    designer & developer. I'm always down for something new and challenging!
    I'm here to help you create beautifully formatted websites. 
    My projects mostly include web development.`;

	return (
		<section className={classes.section} id="about">
			<Container component="main" className={classes.main} maxWidth="lg">
				<div className="about">
					{/* Profile Image */}
					<div className="_img" style={{ backgroundImage: `url(${profile})` }}></div>

					{/* Bio & Skills */}
					<div className="_content_wrapper">
						<Typography component="h2" variant="h5">
							<TextDecrypt text={`${greetings}`} />
						</Typography>
						<p className="aboutme">{aboutme}</p>

						{/* Skill Cards */}
						<div className="skills">
							<div className="skill-card">
								<FaCode className="skill-icon" />
								<h4>Web Development</h4>
								<p>Creating fast, scalable, and efficient web applications.</p>
							</div>
							<div className="skill-card">
								<FaLinux className="skill-icon" />
								<h4>Linux Administration</h4>
								<p>Managing systems, automation, and security configurations.</p>
							</div>
							<div className="skill-card">
								<FaShieldAlt className="skill-icon" />
								<h4>Security Auditing</h4>
								<p>Analyzing and strengthening system security.</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bio Text */}
				<div className="bio">
					<h2>📌 About Me</h2>
					<p>
						I'm always hungry for knowledge, a glutton for learning if you will. I enjoy working independently,
						but I thrive when collaborating with a purpose-driven team focused on solving real everyday problems
						using the latest technologies. I love building practical applications that solve real problems
						and enjoy tackling complex tasks that challenge my knowledge.
					</p>
					<p>
						As an introvert, I prefer calm and focused environments. My curiosity drives me to understand how things work,
						and I embrace challenges that push my foundational knowledge. I believe in continuous learning and
						strive for personal growth.
					</p>
					<p>
						Currently, I'm a Chemistry student at university. While I may not be the top of my class, I grasp concepts
						well and am always improving. My true aspiration is to become a full-stack developer specializing in backend
						systems, as I care more about solving problems than just making things look pretty.
					</p>
					<p>
						I have a strong affinity for open-source and Linux communities, as I believe in sharing knowledge with
						like-minded individuals. I prefer focusing on technical aspects over aesthetics. In short, I don't like
						being the center of attention—I just love learning, growing, and sharing what I know.
					</p>
				</div>

				{/* Tech Stack Logos */}
				<div className="tech-stack">
					<SiReact className="tech-icon" />
					<SiJavascript className="tech-icon" />
					<SiHtml5 className="tech-icon" />
					<SiCss3 className="tech-icon" />
					<SiGo className="tech-icon" />
					<SiMongodb className="tech-icon" />
					<SiSupabase className="tech-icon" />
					<SiRender className="tech-icon" />
					<SiCloudinary className="tech-icon" />
					<SiGithub className="tech-icon" />
					<VscTerminalBash className="tech-icon" />
				</div>
			</Container>
		</section>
	);
};
