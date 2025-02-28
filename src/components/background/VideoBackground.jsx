import React from 'react';
import video from "../../assets/video.mp4";

const VideoBackground = () => {
	return (
		<div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10">
			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/55 z-10"></div>

			<video
				className="absolute w-full h-full object-cover"
				autoPlay
				loop
				muted
				playsInline
			>
				<source src={video} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
};

export default VideoBackground;
