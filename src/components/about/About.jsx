import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FirstName, LastName } from "../../utils/getName";
import { FaCode, FaLinux, FaShieldAlt } from "react-icons/fa";
import {
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiGo,
  SiMongodb,
  SiSupabase,
  SiRender,
  SiCloudinary,
  SiGithub,
} from "react-icons/si";
import { VscTerminalBash } from "react-icons/vsc";

const skills = [
  {
    icon: <FaCode className="text-4xl text-cyan-400" />,
    title: "Web Development",
    description: "Creating fast, scalable, and efficient web applications.",
  },
  {
    icon: <FaLinux className="text-4xl text-cyan-400" />,
    title: "Linux Administration",
    description: "Managing systems, automation, and security configurations.",
  },
  {
    icon: <FaShieldAlt className="text-4xl text-cyan-400" />,
    title: "Security Auditing",
    description: "Analyzing and strengthening system security.",
  },
];

const techStack = [
  { icon: <SiReact />, name: "React" },
  { icon: <SiJavascript />, name: "JavaScript" },
  { icon: <SiHtml5 />, name: "HTML5" },
  { icon: <SiCss3 />, name: "CSS3" },
  { icon: <SiGo />, name: "Go" },
  { icon: <SiMongodb />, name: "MongoDB" },
  { icon: <SiSupabase />, name: "Supabase" },
  { icon: <SiRender />, name: "Render" },
  { icon: <SiCloudinary />, name: "Cloudinary" },
  { icon: <SiGithub />, name: "GitHub" },
  { icon: <VscTerminalBash />, name: "Bash" },
];

const SkillCard = ({ skill, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="glass-card p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105"
    >
      {skill.icon}
      <h3 className="text-xl font-bold text-white mt-4 mb-2">{skill.title}</h3>
      <p className="text-gray-400">{skill.description}</p>
    </motion.div>
  );
};

export const About = () => {
  const [bioRef, bioInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [techRef, techInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="about" className="min-h-screen py-20 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-heading">
              Hello there!
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              I'm {FirstName} {LastName}, a multidisciplinary designer & developer.
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {skills.map((skill, index) => (
              <SkillCard key={index} skill={skill} index={index} />
            ))}
          </div>

          {/* Bio Section */}
          <motion.div
            ref={bioRef}
            initial={{ opacity: 0, y: 20 }}
            animate={bioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 mb-16 text-left"
          >
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">📌 About Me</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                I'm always hungry for knowledge, a glutton for learning if you will. I enjoy working independently,
                but I thrive when collaborating with a purpose-driven team focused on solving real everyday problems
                using the latest technologies.
              </p>
              <p>
                As an introvert, I prefer calm and focused environments. My curiosity drives me to understand how things work,
                and I embrace challenges that push my foundational knowledge.
              </p>
              <p>
                Currently, I'm a Chemistry student at university. While I may not be the top of my class, I grasp concepts
                well and am always improving. My true aspiration is to become a full-stack developer specializing in backend
                systems.
              </p>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            ref={techRef}
            initial={{ opacity: 0, y: 20 }}
            animate={techInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, color: "#42bcbc" }}
                  whileTap={{ scale: 0.9 }}
                  className="text-3xl text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
                  title={tech.name}
                >
                  {tech.icon}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="animated-gradient opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_70%)]" />
      </div>
    </section>
  );
};