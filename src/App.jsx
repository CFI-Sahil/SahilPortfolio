import { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import HeroTransitionScene from './components/HeroTransitionScene';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import About from './components/About';
import Work from './components/Work';
import Connect from './components/Connect';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [heroRevealTriggered, setHeroRevealTriggered] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Ensure manual scroll restoration and reset window scroll to top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Reset Lenis scroll position to top immediately
    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
    };
  }, []);

  // Stabilize callbacks with useCallback so references remain constant
  const handleRevealStart = useCallback(() => {
    setHeroRevealTriggered(true);
    setNavbarVisible(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setNavbarVisible(true);
    // Video starts ONLY after the entire preloader animation has finished
    setShouldPlayVideo(true);
    // Recalculate ScrollTrigger measurements once preloader finishes
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F5F1EA] text-[#0A0A0A] selection:bg-brand-red selection:text-white">
      {/* 1. Full-screen Editorial Preloader (#F5F1EA canvas -> #0A0A0A typography -> 7-panel center split) */}
      <Preloader
        onRevealStart={handleRevealStart}
        onComplete={handlePreloaderComplete}
      />

      {/* 2. Fixed Single-Page Navbar (Transparent over Hero -> Warm off-white blur on scroll) */}
      <Navbar isVisible={navbarVisible} />

      {/* 3. Full-Screen Cinematic Hero & Pinned Editorial Statement Transition */}
      <main>
        <HeroTransitionScene
          shouldAnimateText={heroRevealTriggered}
          shouldPlayVideo={shouldPlayVideo}
        />

        {/* 4. Editorial About & Engineering Identity Section */}
        <About />

        {/* 5. Technology / Skills Logo Loop Section */}
        <TechStack />

        {/* 6. Professional AI Experience Section */}
        <Experience />

        {/* Remaining Milestone Sections on Warm Off-White Canvas */}
        <div className="relative bg-[#F5F1EA]">

          {/* 7. Work / Project Showcase Section */}
          <Work />
        </div>

        {/* 8. Final Scene: Thank You / Connect Section */}
        <Connect />
      </main>
    </div>
  );
}
