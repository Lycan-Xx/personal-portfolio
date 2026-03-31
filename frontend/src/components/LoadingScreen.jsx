import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Always set loading to false after a short delay
        // This ensures the app doesn't get stuck
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

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
