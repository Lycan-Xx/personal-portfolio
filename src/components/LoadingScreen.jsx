import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ children, blockForVideo = true, videoTimeout = 3500 }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let settled = false;
        const finalize = () => {
            if (settled) return;
            settled = true;
            setLoading(false);
        };

        // Always fallback after a short delay to avoid stuck loading screen
        const fallback = setTimeout(() => {
            finalize();
        }, Math.max(1500, videoTimeout));

        if (!blockForVideo || typeof window === 'undefined') {
            // not blocking or SSR
            finalize();
            clearTimeout(fallback);
            return () => clearTimeout(fallback);
        }

        // Listen for video readiness events emitted by VideoBackground
        const onReady = (e) => {
            if (e?.detail?.loaded) {
                clearTimeout(fallback);
                finalize();
            } else if (e?.detail?.error) {
                // video failed; don't block indefinitely
                clearTimeout(fallback);
                finalize();
            }
        };

        window.addEventListener('video:ready', onReady);

        return () => {
            window.removeEventListener('video:ready', onReady);
            clearTimeout(fallback);
        };
    }, [blockForVideo, videoTimeout]);

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
                
                {/* Simple loading indicator */}
                <div className="text-xs text-gray-400 font-mono">
                    Loading...
                </div>
            </div>
        );
    }

    return children;
};

export default LoadingScreen;
