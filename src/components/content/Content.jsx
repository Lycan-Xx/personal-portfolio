import React from "react";
import { motion } from "framer-motion";
import { TextDecrypt } from "./TextDecrypt";
import Resume from "../../settings/resume.json";
import { FirstName, LastName } from "../../utils/getName";

export const Content = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-xl md:text-2xl text-cyan-400 mb-4 font-mono">
            <TextDecrypt text={`${Resume.basics.x_title}`} />
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <TextDecrypt text={`${FirstName} ${LastName}`} />
          </h1>
          <div className="text-3xl md:text-5xl lg:text-6xl text-gray-300 font-light">
            <TextDecrypt text={`${Resume.basics.job1} `} />
            <TextDecrypt text={`${Resume.basics.job2}`} />
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

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="animated-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_70%)]" />
      </div>
    </div>
  );
};