import React from 'react';

const ResumeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width='24'
      height='24'
      className="fill-current text-secondary"
    >
      <path 
        fillRule='evenodd' 
        d="M4 4V20C4 21.1046 4.89543 22 6 22L18 22C19.1046 22 20 21.1046 20 20V8.34162C20 7.8034 19.7831 7.28789 19.3982 6.91161L14.9579 2.56999C14.5842 2.20459 14.0824 2 13.5597 2L6 2C4.89543 2 4 2.89543 4 4Z" 
        stroke="black" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        fillRule='evenodd' 
        d="M14 2V6C14 7.10457 14.8954 8 16 8H20" 
        stroke="black" 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export const Resume = () => {
  return (
    <a
      href="https://drive.google.com/uc?export=download&id=15j1G81uZtpHV9GRse5SMczuZM6NPPS_a"
      target="_blank"
      rel="noopener noreferrer"
      className="glass-button group flex items-center gap-3"
    >
      <ResumeIcon />
      <span className="font-mono">
        Resume
      </span>
    </a>
  );
};