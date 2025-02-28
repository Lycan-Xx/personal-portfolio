import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaCode, FaLinux, FaShieldAlt, FaWrench } from "react-icons/fa";
import { SlChemistry } from "react-icons/sl";
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
    description:
      "Crafting blazing fast web apps—debugging is optional, laughter is guaranteed!",
  },
  {
    icon: <FaLinux className="text-4xl text-cyan-400" />,
    title: "Linux Administration",
    description:
      "Taming unruly servers with terminal magic and a pinch of geek humor!",
  },
  {
    icon: <FaShieldAlt className="text-4xl text-cyan-400" />,
    title: "Security Auditing",
    description:
      "Hunting down vulnerabilities like a cyber detective with a side of puns!",
  },
  {
    icon: <SlChemistry className="text-4xl text-cyan-400" />,
    title: "Chemist",
    description:
      "Mixing up chemical concoctions that might fizz, pop, and occasionally even sparkle—safety goggles on!",
  },
  {
    icon: <FaWrench className="text-4xl text-cyan-400" />,
    title: "Computer Repair",
    description:
      "Reviving your tech with a toolbox of duct tape, witty banter, and a dash of magic!",
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
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="glass-card p-6 flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-2xl"
    >
      {skill.icon}
      <h3 className="mt-4 text-xl font-bold text-white">{skill.title}</h3>
      <p className="mt-2 text-gray-300 text-sm">{skill.description}</p>
    </motion.div>
  );
};

const About = () => {
  const [bioRef, bioInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [techRef, techInView] = useInView({ threshold: 0.2, triggerOnce: true });

  // Simulated resume data
  const Resume = { basics: { name: "Mark Tan" } };
  const names = Resume.basics.name.split(" ");
  const FirstName = names[0];
  const LastName = names[names.length - 1];

  return (
    <section id="about" className="relative min-h-screen py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
            Who am I
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            I am {FirstName} {LastName}, a multidisciplinary designer and developer.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Bio Section */}
          <motion.div
            ref={bioRef}
            initial={{ opacity: 0, x: -30 }}
            animate={bioInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">About Me</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                I am very fond of continuous learning and self-improvement.
                While i prefer working privately, i don't dislike collaborative environments, and I enjoy leveraging cutting-edge technologies to solve everyday challenges.
              </p>
              <p>
                My journey in technology has given me a solid foundation in both web development and system administration. I am set on building robust and user-friendly solutions.
              </p>
              <p>
                I am currently pursuing a degree in Chemistry while further honing my skills as a full-stack developer.
              </p>
            </div>
          </motion.div>

          {/* Skills and Tech Stack Section */}
          <div className="flex flex-col gap-12">
            {/* Skills Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
              initial={{ opacity: 0, x: 30 }}
              animate={bioInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {skills.map((skill, index) => (
                <SkillCard key={index} skill={skill} index={index} />
              ))}
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              ref={techRef}
              initial={{ opacity: 0, y: 30 }}
              animate={techInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="glass-card p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 2, color: "#42bcbc" }}
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
      </div>
    </section>
  );
};

export default About;
