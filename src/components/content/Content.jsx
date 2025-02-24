import React from "react";
import { motion } from "framer-motion";
import Resume from "../../settings/resume.json";
import { FirstName, LastName } from "../../utils/getName";
import { Today } from "./Today";

export const Content = () => {
  return (
    <section className="min-h-screen relative px-4 md:px-8 flex flex-col md:flex-row items-center justify-center">
      {/* Today component: on mobile, order 1 (top); on desktop, order 2 (right) */}
      <div className="order-1 md:order-2 md:ml-8 mb-8 md:mb-0">
        <Today />
      </div>
      {/* Main Content: on mobile, order 2 (below Today); on desktop, order 1 (left) */}
      <div className="order-2 md:order-1 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-xl md:text-2xl text-cyan-400 mb-4 font-mono">
            {Resume.basics.x_title}
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            {FirstName} {LastName}
          </h1>
          <div className="text-3xl md:text-5xl lg:text-6xl text-gray-300 font-light">
            {Resume.basics.job1} <br />
            {Resume.basics.job2}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
        >
          {Resume.basics.description}
        </motion.p>
      </div>
    </section>
  );
};
