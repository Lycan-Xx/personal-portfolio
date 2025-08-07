import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        // Check if user has visited before (skip loading for returning users)
        const hasVisited = localStorage.getItem('portfolio-visited');
        if (hasVisited) {
            setLoading(false);
            return;
        }
        
        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                const newProgress = prev + Math.random() * 15;
                return newProgress > 90 ? 90 : newProgress; // Cap at 90% until actual content loads
            });
        }, 400);

        // Start preloading critical assets (not the video - that's lazy loaded)
        const preloadAssets = async () => {
            try {
                // Preload critical fonts or small images if needed
                // For this example, we'll just simulate asset loading
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                setContentLoaded(true);
                setLoadingProgress(100); // Set to 100% when done
                localStorage.setItem('portfolio-visited', 'true');
            } catch (error) {
                console.error("Error preloading assets:", error);
                setContentLoaded(true); // Continue anyway
                setLoadingProgress(100);
                localStorage.setItem('portfolio-visited', 'true');
            }
        };

        preloadAssets();

        // Minimum display time for loading screen
        const minDisplayTimer = setTimeout(() => {
            if (contentLoaded) {
                setLoading(false);
            }
        }, 2000);

        // Maximum display time (fallback)
        const maxDisplayTimer = setTimeout(() => {
            setLoading(false);
        }, 4000);

        return () => {
            clearTimeout(minDisplayTimer);
            clearTimeout(maxDisplayTimer);
            clearInterval(progressInterval);
        };
    }, [contentLoaded]);

    // When content is loaded, start the transition
    useEffect(() => {
        if (contentLoaded) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 800); // Give a little extra time after content loads
            
            return () => clearTimeout(timer);
        }
    }, [contentLoaded]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-loaderBg z-50 flex flex-col justify-center items-center">
                <div className="flex space-x-6 mb-8">
                    <div 
                        className="w-8 h-8 bg-loader rounded shadow-[0_15px_35px_rgba(32,201,226,0.2)] 
                                  animate-box-bounce-1 transform perspective-[100px] rotate-x-[10deg] rotate-y-[10deg]
                                  transition-all duration-300"
                    />
                    <div 
                        className="w-8 h-8 bg-loader rounded shadow-[0_15px_35px_rgba(32,201,226,0.2)] 
                                  animate-box-bounce-2 transform perspective-[100px] rotate-x-[10deg] rotate-y-[10deg]
                                  transition-all duration-300"
                    />
                    <div 
                        className="w-8 h-8 bg-loader rounded shadow-[0_15px_35px_rgba(32,201,226,0.2)] 
                                  animate-box-bounce-3 transform perspective-[100px] rotate-x-[10deg] rotate-y-[10deg]
                                  transition-all duration-300"
                    />
                </div>
                
                {/* Loading progress bar */}
                <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-loader transition-all duration-300 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
                <div className="mt-2 text-xs text-gray-400 font-mono">
                    {Math.round(loadingProgress)}% loaded
                </div>
            </div>
        );
    }

    return children;
};

export default LoadingScreen;