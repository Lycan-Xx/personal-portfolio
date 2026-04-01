import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import SocialLinks from '../socials/SocialLinks';

export const Contact = () => {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [refSection, inViewSection] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [refCards, inViewCards] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await emailjs.sendForm(
        "service_8bezxog",
        "template_jmsk313",
        formRef.current,
        "knwNTK4YU4K30HYMd"
      );
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "I'll get back to you soon.",
        showConfirmButton: false,
        timer: 2000,
        background: "#1e293b",
        color: "#fff",
      });
      formRef.current.reset();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Try again later.",
        background: "#1e293b",
        color: "#fff",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('msbello514@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={refSection}
      id="contact"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
      style={{ fontFamily: "ChocoCooky" }}
    >
      <div className="w-full max-w-[86rem] mx-auto relative">
        {/* Glassmorphism container — reduced */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-none md:rounded-3xl shadow-lg shadow-cyan-400/5" />

        <div className="relative p-6 md:p-10 z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inViewSection ? "visible" : "hidden"}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12 text-start"
            style={{ fontFamily: "ChocoCooky" }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-white inline-block pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/4 after:h-1 after:bg-cyan-400"
              style={{ fontFamily: 'ChocoCooky', fontSize: '36px' }}
            >
              {'< Contact Me />'}
            </h2>
            <p className="text-slate-100 max-w-2xl mt-8 text-lg md:text-xl" style={{ fontFamily: 'ChocoCooky' }}>
              Have a project, question, or just want to say hi? Let's connect!
            </p>
          </motion.div>

          <div
            ref={refCards}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Info Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={inViewCards ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-black/20 backdrop-blur-md p-8 rounded-xl overflow-hidden shadow-lg border border-white/10 hover:border-cyan-400/45 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                Let's Connect
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed font-mono text-sm">
                Reach out if you have an idea, collaboration, or just want to chat. I'm excited to explore how we can build something great together.
              </p>
              <div className="space-y-4 text-gray-300">
                <p className="flex items-center gap-2">
                  <span className="text-cyan-400">Email:</span>
                  <button
                    onClick={handleCopyEmail}
                    className="hover:text-cyan-400 transition-colors font-mono text-sm cursor-pointer bg-transparent"
                  >
                    msbello514@gmail.com
                  </button>
                  <span
                    className={`text-xs font-mono text-cyan-400 transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}
                  >
                    ✓ Copied
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-cyan-400">Location:</span>
                  <span className="font-mono text-sm">Adamawa, Nigeria</span>
                </p>
              </div>
            </motion.div>

            {/* Social Links Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={inViewCards ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-black/20 backdrop-blur-md p-8 rounded-xl overflow-hidden shadow-lg border border-white/10 hover:border-cyan-400/45 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                Find Me Online
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed font-mono text-sm">
                Connect with me on various platforms. Feel free to follow, message, or just say hello!
              </p>
              <SocialLinks />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
