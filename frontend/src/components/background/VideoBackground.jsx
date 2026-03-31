import React, { useState, useEffect, useRef } from 'react';

const VideoBackground = () => {
	const videoRef = useRef(null);
	const containerRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [videoSrc, setVideoSrc] = useState(null);
	const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

	// Set up intersection observer to detect when component is in viewport
	useEffect(() => {
		// Check if user prefers reduced data usage
		const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
		const isSaveData = connection && connection.saveData;
		
		// Don't load video on slow connections or save-data mode
		if (isSlowConnection || isSaveData) {
			console.log('Skipping video load due to connection constraints');
			return;
		}
		
		const options = {
			root: null, // viewport
			rootMargin: '0px',
			threshold: 0.1 // Trigger when at least 10% of the element is visible
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				// When component enters viewport
				if (entry.isIntersecting) {
					setShouldLoadVideo(true);
					// Once we've detected visibility, we can disconnect the observer
					observer.disconnect();
				}
			});
		}, options);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, []);

	// Only set the video source when we should load it
	useEffect(() => {
		if (shouldLoadVideo) {
			setIsVisible(true);
			setVideoSrc("https://res.cloudinary.com/cloudinary-lycan-xx/video/upload/v1742216068/video_compressed-for-testing_fkyn7j.mp4");
		}
	}, [shouldLoadVideo]);

	// Handle video loading and events
	useEffect(() => {
		const videoElement = videoRef.current;
		
		if (videoElement && videoSrc) {
			const handleLoaded = () => {
				setIsLoaded(true);
				console.log("Video loaded successfully");
			};
			
			const handleError = (error) => {
				console.error("Error loading video:", error);
				setHasError(true);
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
					preload="metadata"
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
