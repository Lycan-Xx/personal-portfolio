import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const projects = [
  {
    id: 1,
    title: "React Portfolio",
    description: "Designed and developed a ReactJS portfolio with fancy 3D animations using Three.js for the background element.",
    image: "https://picsum.photos/seed/portfolio/800/600",
    tags: ["React", "Three.js", "Framer Motion", "Tailwind CSS"],
    link: "#"
  },
  {
    id: 2,
    title: "VeriTru Project",
    description: "An advocacy project website built using MEAN stack with a fact-checking tool to promote actions against fake news.",
    image: "https://picsum.photos/seed/veritru/800/600",
    tags: ["MongoDB", "Express", "Angular", "Node.js"],
    link: "#"
  },
  {
    id: 3,
    title: "LoFo Project",
    description: "Logistics and Forwarding website built using ReactJS to design and develop its front-end.",
    image: "https://picsum.photos/seed/lofo/800/600",
    tags: ["React", "Redux", "Material-UI", "Firebase"],
    link: "#"
  },
  {
    id: 4,
    title: "Startup Project",
    description: "A website portfolio project for the Startup Dev Team built using MEVN stack to demonstrate the CRUD capabilities of the tech stack.",
    image: "https://picsum.photos/seed/startup/800/600",
    tags: ["Vue.js", "MongoDB", "Express", "Node.js"],
    link: "#"
  },
  {
    id: 5,
    title: "LaCalle Cafe",
    description: "A website project for the La Calle Cafe business built using Wordpress and PHP with integrated SEO tools.",
    image: "https://picsum.photos/seed/lacalle/800/600",
    tags: ["WordPress", "PHP", "SEO", "MySQL"],
    link: "#"
  }
];

const ProjectCard = ({ project, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
    >
      <div className="glass-card overflow-hidden group card-hover">
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-DEFAULT via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-400 text-sm line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-400/10 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <motion.a
            href={project.link}
            whileHover={{ x: 5 }}
            className="inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View Project
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export const Works = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="works" className="min-h-screen py-20 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">
            Featured Projects
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Here are some of my favorite projects I've worked on. Each project is unique and demonstrates different aspects of my skills and expertise.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_70%)]" />
      </div>
    </section>
  );
};