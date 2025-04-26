import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import GitHubContributions from '../github/GitHubContributions';
import Resume from '../../settings/resume.json';
import { FaCode, FaLinux, FaShieldAlt, FaWrench } from "react-icons/fa";
import { SlChemistry } from "react-icons/sl";
import {
	SiReact, SiJavascript, SiHtml5, SiCss3, SiTailwindcss,
	SiMongodb, SiSupabase, SiRender, SiCloudinary, SiGithub
} from "react-icons/si";
import { VscTerminalBash } from "react-icons/vsc";

const skills = [
	{
		icon: <FaCode className="text-4xl text-cyan-400" />,
		title: "Web Development",
		description: "Crafting blazing fast web-apps, debugging is optional, functionality is guaranteed!"
	},
	{
		icon: <FaLinux className="text-4xl text-cyan-400" />,
		title: "Linux Administration",
		description: "Taming unruly distros with terminal magic and a pinch of stackoverflow humor!"
	},
	{
		icon: <FaShieldAlt className="text-4xl text-cyan-400" />,
		title: "Security Auditing",
		description: "Hunting down and testing vulnerabilities whenever i get the chance like a cyber detective 'always on watch'"
	},
	{
		icon: <SlChemistry className="text-4xl text-cyan-400" />,
		title: "Chemist",
		description: "Mixing up chemical concoctions that might heat up, change color, and occasionally even making mistakes 'safety first'"
	},
	{
		icon: <FaWrench className="text-4xl text-cyan-400" />,
		title: "Computer Repair Technician",
		description: "Reviving your piece of hardware and norturing it to life, (Always upgrade and repair, buy new only when absolutely necessary)"
	},
];

const techStack = [
	{ icon: <SiReact />, name: "React" },
	{ icon: <SiJavascript />, name: "JavaScript" },
	{ icon: <SiHtml5 />, name: "HTML5" },
	{ icon: <SiCss3 />, name: "CSS3" },
	{ icon: <SiTailwindcss />, name: "Tailwind CSS" },
	{ icon: <SiMongodb />, name: "MongoDB" },
	{ icon: <SiSupabase />, name: "Supabase" },
	{ icon: <SiRender />, name: "Render" },
	{ icon: <SiCloudinary />, name: "Cloudinary" },
	{ icon: <SiGithub />, name: "GitHub" },
	{ icon: <VscTerminalBash />, name: "Bash" },
];

const SkillCard = ({ skill, index, isVisible, isHighPerformance }) => {
	return (
		<div
			className={`glass-card p-6 flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-2xl 
        ${isHighPerformance ? 'transition-custom opacity-0 translate-y-4' : ''}
        ${isVisible && isHighPerformance ? 'opacity-100 translate-y-0' : ''}`}
			style={{ transitionDelay: `${index * 0.1}s` }}
		>
			{skill.icon}
			<h3 className="mt-4 text-xl font-bold text-white">{skill.title}</h3>
			<p className="mt-2 text-gray-300 text-sm">{skill.description}</p>
		</div>
	);
};

const About = () => {
	const [isHighPerformance, setIsHighPerformance] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0.1 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		setIsHighPerformance(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);

		return () => observer.disconnect();
	}, []);

	const [bioRef, bioInView] = useInView({ threshold: 0.2, triggerOnce: true });
	const [techRef, techInView] = useInView({ threshold: 0.2, triggerOnce: true });

	// Resume data
	const names = Resume.basics.name.split(" ");
	const FirstName = names[0];
	const LastName = names[names.length - 1];

	return (
		<section ref={sectionRef} id="about" className="relative min-h-screen py-20 px-4 md:px-8">
			<div className="max-w-7xl mx-auto" style={{ fontFamily: "ChocoCooky" }}>
				<header className="mb-8">
					<motion.h1
						initial="hidden"
						animate="visible"
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0 },
						}}
						transition={{ duration: 0.6 }}
						className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-4"
					>
						Who Am I & What I Do
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-xl md:text-2xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
					>
						I am <span className="text-cyan-400">{FirstName} (Sani) {LastName}</span>, a multidisciplinary technician and developer.
					</motion.p>
				</header>

				{/* Main Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
					{/* Bio Section */}
					<motion.div
						ref={bioRef}
						initial={{ opacity: 0, x: -30 }}
						animate={bioInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6 }}
						className="glass-card p-8"
					>
						<h2 className="text-2xl font-bold text-cyan-400 mb-4">
							A Little Bit About Myself
						</h2>
						<div className="space-y-4 text-gray-300 leading-relaxed">
							<p>
								I am very fond of continuous learning and self-improvement. While I prefer working privately, I don't dislike collaborative environments, and I enjoy leveraging cutting-edge technologies to solve everyday challenges.
							</p>
							<p>
								My journey in technology has given me a solid foundation in both web development and system administration. I am set on building robust and user-friendly solutions.
							</p>
							<p>
								I am currently pursuing a degree in Chemistry while further honing my skills as a full-stack developer.
							</p>
						</div>
					</motion.div>

					{/* Skills Grid */}
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 gap-8"
						initial={{ opacity: 0, x: 30 }}
						animate={bioInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						{skills.map((skill, index) => (
							<SkillCard
								key={index}
								skill={skill}
								index={index}
								isVisible={isVisible}
								isHighPerformance={isHighPerformance}
							/>
						))}
					</motion.div>
				</div>

				{/* Tech Stack Section - Now full width at the bottom */}
				<motion.div
					ref={techRef}
					initial={{ opacity: 0, y: 30 }}
					animate={techInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="glass-card p-8 w-full mb-16"
				>
					<h2 className="text-3xl font-bold text-white mb-8 text-center">My Tech Arsenal</h2>
					<div className="flex flex-wrap justify-center gap-12">
						{techStack.map((tech, index) => (
							<motion.div
								key={index}
								whileHover={{ scale: 1.2, y: -10 }}
								whileTap={{ scale: 0.95 }}
								className="flex flex-col items-center group"
							>
								<div className="text-5xl mb-3 text-gray-300 group-hover:text-cyan-400 transition-all duration-300 cursor-pointer">
									{tech.icon}
								</div>
								<span className="text-sm text-gray-400 group-hover:text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
									{tech.name}
								</span>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* GitHub Calendar Section */}
				<GitHubContributions />
			</div>
		</section>
	);
};

export default About;