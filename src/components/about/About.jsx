import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Resume from '../../settings/resume.json';
import {
  FaCode, FaLinux, FaShieldAlt, FaWrench
} from 'react-icons/fa';
import { SlChemistry } from 'react-icons/sl';
import { FaCss3 } from 'react-icons/fa';
import {
  SiReact, SiJavascript, SiHtml5, SiTailwindcss,
  SiMongodb, SiSupabase, SiRender, SiCloudinary, SiGithub
} from 'react-icons/si';
import { VscTerminalBash } from 'react-icons/vsc';

const skills = [
  {
    icon: <FaCode className="text-4xl text-cyan-400" />,
    title: "Web Development",
    description: "Crafting blazing fast web-apps, debugging is optional, functionality is guaranteed!"
  },
  {
    icon: <FaLinux className="text-4xl text-cyan-400" />,
    title: "Linux Administration",
    description: "Taming unruly distros with terminal magic and a pinch of StackOverflow humor!"
  },
  {
    icon: <FaShieldAlt className="text-4xl text-cyan-400" />,
    title: "Security Auditing",
    description: "Hunting down and testing vulnerabilities like a cyber detective 'always on watch'."
  },
  {
    icon: <SlChemistry className="text-4xl text-cyan-400" />,
    title: "Chemist",
    description: "Mixing up chemical concoctions that might heat, change color, and occasionally surprise—safety first!"
  },
  {
    icon: <FaWrench className="text-4xl text-cyan-400" />,
    title: "Computer Repair Tech",
    description: "Reviving hardware and nurturing it back to life—upgrade and repair before you buy new."
  },
];

const techStack = [
  { icon: <SiReact />, name: "React" },
  { icon: <SiJavascript />, name: "JavaScript" },
  { icon: <SiHtml5 />, name: "HTML5" },
  { icon: <FaCss3 />, name: "CSS3" },
  { icon: <SiTailwindcss />, name: "Tailwind CSS" },
  { icon: <SiMongodb />, name: "MongoDB" },
  { icon: <SiSupabase />, name: "Supabase" },
  { icon: <SiRender />, name: "Render" },
  { icon: <SiCloudinary />, name: "Cloudinary" },
  { icon: <SiGithub />, name: "GitHub" },
  { icon: <VscTerminalBash />, name: "Bash" },
];

const truncate = (text, words = 30) => {
  const arr = text.split(' ');
  return arr.length <= words ? text : arr.slice(0, words).join(' ') + '…';
};

const SkillCard = ({ skill, index, inView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-black/20 backdrop-blur-md p-6 flex flex-col items-center text-center group hover:shadow-cyan-400/20 hover:shadow-lg transition-shadow duration-300 rounded-2xl border border-cyan-400/20"
    >
      {skill.icon}
      <h3 className="mt-4 text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
        {skill.title}
      </h3>
      <p className="mt-2 text-gray-300 text-sm font-mono">
        {truncate(skill.description, 20)}
      </p>
    </motion.div>
  );
};

const About = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [bioRef, bioInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [techRef, techInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const names = Resume.basics.name.split(' ');
  const first = names[0];
  const last = names[names.length - 1];

  return (
    <section ref={ref} id="about" className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20">
      <div className="w-full max-w-[86rem] mx-auto relative">
        {/* Glassmorphism container — reduced opacity */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-none md:rounded-3xl shadow-lg shadow-cyan-400/5" />
        {/* Dark overlay for video bleed */}
        <div className="absolute inset-0 bg-black/50 rounded-none md:rounded-3xl" />

        <div className="relative p-6 md:p-10 z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 text-start"
          >
            <h2
              className="text-4xl font-bold text-white relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-2/3 after:h-1 after:bg-cyan-400"
              style={{ fontFamily: 'ChocoCooky', fontSize: '36px' }}
            >
              {'< About Me />'}
            </h2>
            <p className="text-slate-100 max-w-2xl mt-8 text-lg md:text-xl" style={{ fontFamily: 'ChocoCooky' }}>
              I am <span className="text-cyan-400">{first} (Sani) {last}</span>, a multidisciplinary technician & developer.
            </p>
          </motion.div>

          {/* Bio + Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <motion.div
              ref={bioRef}
              initial={{ opacity: 0, x: -30 }}
              animate={bioInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                A Little Bit About Myself
              </h3>
              <div className="space-y-4 text-gray-300 leading-relaxed font-mono text-sm">
                <p>I'm passionate about continuous learning and self-improvement, solving real-world problems with tech.</p>
                <p>My journey spans web development, system administration, and now chemistry & full-stack dev.</p>
                <p>Currently pursuing a degree in Chemistry while honing my skills as a full-stack developer.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={bioInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {skills.map((skill, i) => (
                <SkillCard key={i} skill={skill} index={i} inView={inView} />
              ))}
            </motion.div>
          </div>

          {/* Tech Stack */}
          <motion.div
            ref={techRef}
            initial={{ opacity: 0, y: 30 }}
            animate={techInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-black/20 backdrop-blur-md p-8 w-full mb-16 rounded-2xl border border-cyan-400/20"
          >
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              My Tech Arsenal
            </h3>
            <div className="flex flex-wrap justify-center gap-12">
              {techStack.map((tech, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="text-5xl mb-3 text-gray-300 group-hover:text-cyan-400 transition-colors duration-300">
                    {tech.icon}
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
