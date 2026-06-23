import React, { useState, useEffect, useRef } from 'react';

const VideoBackground = () => {
	const videoRef = useRef(null);
	const containerRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [videoSrc, setVideoSrc] = useState(null);

	// Start loading video immediately on mount (during loading screen)
	// Check connection quality to avoid loading on slow connections or save-data mode
	useEffect(() => {
		const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
		const isSaveData = connection && connection.saveData;
		
		// Don't load video on slow connections or save-data mode
		if (isSlowConnection || isSaveData) {
			return;
		}
		
		// Load video immediately on component mount so it's ready when loading screen finishes
		setVideoSrc("https://res.cloudinary.com/cloudinary-lycan-xx/video/upload/v1742216068/video_compressed-for-testing_fkyn7j.mp4");
	}, []);

	// Handle video loading and events
	useEffect(() => {
		const videoElement = videoRef.current;
		
		if (videoElement && videoSrc) {
			const handleLoaded = () => {
				setIsLoaded(true);
				// Notify interested parties that background video is ready
				try {
					window.dispatchEvent(new CustomEvent('video:ready', { detail: { loaded: true } }));
				} catch (e) {}
				// Video loaded successfully
			};
			
			const handleError = (error) => {
				// Error loading video
				setHasError(true);
				try {
					window.dispatchEvent(new CustomEvent('video:ready', { detail: { loaded: false, error: true } }));
				} catch (e) {}
			};
			
			// Add event listeners
			videoElement.addEventListener('loadeddata', handleLoaded);
			videoElement.addEventListener('error', handleError);
			
			// Cleanup
			return () => {
				videoElement.removeEventListener('loadeddata', handleLoaded);
				videoElement.removeEventListener('error', handleError);
				
				// Unload video when component unmounts to free resources
				if (videoElement) {
					videoElement.pause();
					videoElement.removeAttribute('src');
					videoElement.load();
				}
			};
		}
	}, [videoSrc]);

	return (
		<div ref={containerRef} className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10">
			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/50 z-10"></div>

			{/* Fallback gradient background if video fails or is not yet loaded */}
			<div className={`absolute inset-0 animate-gradient bg-gradient-to-br from-dark-DEFAULT via-blue-900/30 to-purple-900/30 -z-20`}></div>

			{/* Video element with proper attributes - only add src when visible */}
			{videoSrc && (
				<video
					ref={videoRef}
					className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
				>
					<source 
						src={videoSrc}
						type="video/mp4" 
					/>
					Your browser does not support the video tag.
				</video>
			)}
		</div>
	);
};

export default VideoBackground;
