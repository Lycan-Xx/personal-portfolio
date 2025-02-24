import React from 'react';
import video from "../../assets/video.mp4";
const VideoBackground = () => {
  return (
    <video
      className="fixed inset-0 w-full h-full object-cover -z-10"
      autoPlay
      loop
      muted
    >
      <source src={video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoBackground; 