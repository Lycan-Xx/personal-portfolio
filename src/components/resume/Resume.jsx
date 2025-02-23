import React from 'react';
import { motion } from 'framer-motion';
import { TextDecrypt } from '../content/TextDecrypt';
import { ResumeIcon } from '../content/ResumeButton';

export const Resume = () => {
  return (
    <motion.a
      href="https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="glass-button group flex items-center gap-3"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ResumeIcon />
      <span className="font-mono">
        <TextDecrypt text="Resume" />
      </span>
    </motion.a>
  );
};