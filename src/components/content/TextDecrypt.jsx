import React, { useEffect, useState, useRef } from "react";

export const TextDecrypt = ({ text, interval = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let index = 0;

    const decrypt = () => {
      if (!mountedRef.current) return;

      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
        timeoutRef.current = setTimeout(decrypt, interval);
      } else {
        setIsComplete(true);
      }
    };

    timeoutRef.current = setTimeout(decrypt, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, interval]);

  return (
    <span className={`inline-block font-mono ${
      isComplete ? 'after:content-[""] after:inline-block after:w-[2px] after:h-[1em] after:bg-cyan-400 after:align-middle after:ml-1 after:animate-blink' : ''
    }`}>
      {displayedText}
    </span>
  );
};