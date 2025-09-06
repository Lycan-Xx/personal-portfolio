import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import SocialLinks from '../socials/SocialLinks'; // adjust path to where you put the file


export const Contact = () => {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highPerf, setHighPerf] = useState(false);

  // detect reduced-motion preference
  useEffect(() => {
    setHighPerf(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // inView for scroll animations
  const [refSection, inViewSection] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const [refCards, inViewCards] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // email send handler
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

  // animation variants
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
        {/* Glassmorphism container */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-none md:rounded-3xl shadow-lg shadow-cyan-400/5 border border-white/10"></div>

        {/* content wrapper */}
        <div className="relative p-6 md:p-10 z-10">
          {/* Header  Text*/}


          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inViewSection ? "visible" : "hidden"}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12 text-start"
            style={{ fontFamily: "ChocoCooky" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white inline-block pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/4 after:h-1 after:bg-cyan-400">
              Contact Me
            </h2>
            <p className="text-slate-100 max-w-2xl mt-8 text-lg md:text-xl" style={{ fontFamily: 'ChocoCooky' }}>
              Have a project, question, or just want to say hi? Let’s connect!
            </p>
          </motion.div>

          {/* Cards */}
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
              className="glass-card p-8 bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/10 hover:border-cyan-400/40 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                Let's Connect
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Reach out if you have an idea, collaboration, or just want to chat. I’m excited to explore how we can build something great together.
              </p>
              <div className="space-y-4 text-gray-300">
                <p className="flex items-center gap-2">
                  <span className="text-cyan-400">Email:</span>
                  <a href="mailto:msbello514@gmail.com" className="hover:underline">
                    msbello514@gmail.com
                  </a>
                </p>

                <p className="flex items-center gap-2">
                  <span className="text-cyan-400">Location:</span>
                  Adamawa, Nigeria
                </p>


              </div>
            </motion.div>

            {/* Social Links Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={inViewCards ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card p-8 bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/10 hover:border-cyan-400/40 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                Find Me Online
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Connect with me on various platforms. Feel free to follow, message, or just say hello!
              </p>
              <SocialLinks />
            </motion.div>

            {/* Form Card
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inViewCards ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: highPerf ? 0.2 : 0 }}
              className="glass-card p-8 bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300"
            >
              <form
                ref={formRef}
                onSubmit={sendEmail}
                className="space-y-6"
              >
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <textarea
                  name="message"
                  required
                  rows="5"
                  placeholder="Your Message..."
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? {} : { x: 5 }}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 font-medium text-white rounded-lg 
                  bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300
                  ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-cyan-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            </motion.div> */}
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-cyan-400/10 blur-2xl"></div>
        <div className="absolute bottom-1/4 left-10 w-32 h-32 rounded-full bg-cyan-400/5 blur-3xl"></div>

        {/* Background grid */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <svg className="absolute w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 L0 0 0 40" stroke="rgba(66,188,188,0.2)" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(66,188,188,0.1)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#grad)" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Contact;
