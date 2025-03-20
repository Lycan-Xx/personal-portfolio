import React from 'react';
import { motion } from 'framer-motion';

const ResumeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width='24'
      height='24'
      className="fill-current text-secondary transition-transform duration-150 ease-in-out transform hover:scale-110"
    >
      <path fillRule='evenodd' d="M4 4V20C4 21.1046 4.89543 22 6 22L18 22C19.1046 22 20 21.1046 20 20V8.34162C20 7.8034 19.7831 7.28789 19.3982 6.91161L14.9579 2.56999C14.5842 2.20459 14.0824 2 13.5597 2L6 2C4.89543 2 4 2.89543 4 4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule='evenodd' d="M14 2V6C14 7.10457 14.8954 8 16 8H20" stroke="black" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
};

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
        Resume
      </span>
    </motion.a>
  );
};