import React, { lazy, Suspense } from "react";
import { CustomThemeProvider } from "../components/theme/ThemeProvider";
import { CssBaseline } from "@mui/material";
import { Home } from "../pages/Home";
import { Works } from "../components/works/Works";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";
import Navbar from '../components/nav/Navbar';
// Lazy load the VideoBackground component
const VideoBackground = lazy(() => import("../components/background/VideoBackground"));
import LoadingScreen from "../components/LoadingScreen";

export const App = () => {
    return (
        <LoadingScreen>
            <CustomThemeProvider>
                <CssBaseline />
                <Navbar />
                <main>
                    <Home />
                    <Works />
                    <div className="relative">
                        {/* Use Suspense to handle the lazy-loaded component */}
                        <Suspense fallback={
                            <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10">
                                <div className="absolute inset-0 bg-black/60 z-10"></div>
                                <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-dark-DEFAULT via-blue-900/30 to-purple-900/30 -z-20"></div>
                            </div>
                        }>
                            <VideoBackground />
                        </Suspense>
                        <About />
                        <Contact />
                    </div>
                </main>
            </CustomThemeProvider>
        </LoadingScreen>
    );
};