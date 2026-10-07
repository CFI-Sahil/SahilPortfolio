import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Pause } from 'lucide-react';
import HeroInkReveal from './HeroInkReveal';

export default function Hero({
  shouldAnimateText = false,
  shouldPlayVideo = false,
  isCovered = false,
}) {
  const heroRef = useRef(null);
  const headlineLine1Ref = useRef(null);
  const headlineLine2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaGroupRef = useRef(null);
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Single playback guard: becomes true ONLY after play() resolves successfully
  const hasStartedVideoRef = useRef(false);
  // Manual pause guard: if user explicitly clicked Pause, never auto-resume on scroll
  const userManuallyPausedRef = useRef(false);

  // Controlled video start: triggered solely when preloader signals shouldPlayVideo = true
  useEffect(() => {
    console.log('[Hero] shouldPlayVideo:', shouldPlayVideo);

    if (!shouldPlayVideo) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      console.error('[Hero Video] videoRef is null');
      return;
    }

    if (hasStartedVideoRef.current) {
      return;
    }

    const startVideo = async () => {
      if (hasStartedVideoRef.current) {
        return;
      }

      console.log('[Hero Video] Attempting playback');
      try {
        video.currentTime = 0;
        video.muted = false;
        video.volume = 1;

        await video.play();

        hasStartedVideoRef.current = true;
        setIsPlaying(true);
      } catch (error) {
        console.warn('[Hero Video] Audible autoplay blocked by browser policy. Retrying with muted autoplay...');
        try {
          video.muted = true;
          await video.play();
          hasStartedVideoRef.current = true;
          setIsPlaying(true);

          // Arm immediate unmute on the very first user interaction anywhere on the window or document
          const handleFirstInteraction = (e) => {
            const v = videoRef.current;
            if (!v || userManuallyPausedRef.current) return;

            // If user clicked the play controller directly, let handleTogglePlay handle it
            if (e && e.target && e.target.closest && e.target.closest('#hero-play-controller')) {
              return;
            }

            if (v.muted) {
              v.muted = false;
              v.volume = 1;
              console.log('[Hero Video] Audio unmuted via user interaction');
            }
            cleanupListeners();
          };

          const cleanupListeners = () => {
            const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'wheel'];
            events.forEach((evt) => {
              window.removeEventListener(evt, handleFirstInteraction, true);
              document.removeEventListener(evt, handleFirstInteraction, true);
            });
          };

          const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'wheel'];
          events.forEach((evt) => {
            window.addEventListener(evt, handleFirstInteraction, { once: true, passive: true, capture: true });
            document.addEventListener(evt, handleFirstInteraction, { once: true, passive: true, capture: true });
          });
        } catch (mutedError) {
          console.warn('[Hero Video] Autoplay completely blocked. Activating interactive Hero ink layer directly.');
          setVideoEnded(true);
        }
      }
    };

    if (video.readyState >= 3) {
      startVideo();
      return;
    }

    const handleCanPlay = () => {
      startVideo();
    };

    video.addEventListener('canplay', handleCanPlay, {
      once: true,
    });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [shouldPlayVideo]);

  // Handle native video ended event
  const handleVideoEnded = () => {
    console.log('[Hero Ink] Video ended');
    setIsPlaying(false);
    setVideoEnded(true);
  };

  // Toggle Video Play / Pause with replay support when finished
  const handleTogglePlay = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused && !video.ended) {
      // If video is currently playing muted (e.g. browser started it muted), clicking unmutes with full audio immediately!
      if (video.muted) {
        video.muted = false;
        video.volume = 1;
        setIsPlaying(true);
        console.log('[Hero Video] Unmuted on controller click');
        return;
      }
      video.pause();
      userManuallyPausedRef.current = true;
      window.__heroUserManuallyPaused = true;
      setIsPlaying(false);
    } else {
      userManuallyPausedRef.current = false;
      window.__heroUserManuallyPaused = false;
      try {
        if (videoEnded || video.ended || (video.duration > 0 && video.currentTime >= video.duration - 0.05)) {
          video.currentTime = 0;
          setVideoEnded(false);
        }
        video.muted = false;
        video.volume = 1;
        await video.play();
        hasStartedVideoRef.current = true;
        setIsPlaying(true);
      } catch (err) {
        console.warn('[Hero Video] Audible play failed, trying muted:', err);
        try {
          video.muted = true;
          await video.play();
          hasStartedVideoRef.current = true;
          setIsPlaying(true);
        } catch (mutedErr) {
          console.error('[Hero Video] Play failed completely:', mutedErr);
        }
      }
    }
  };

  // Pause video when covered by the off-white overlay, resume ONLY if NOT manually paused by user
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasStartedVideoRef.current || videoEnded) return;

    if (isCovered) {
      if (!video.paused && !video.ended) {
        video.pause();
      }
    } else {
      // Only auto-resume if the user DID NOT manually pause the video
      if (video.paused && !video.ended && shouldPlayVideo && !userManuallyPausedRef.current) {
        video.play().catch(() => { });
      }
    }
  }, [isCovered, shouldPlayVideo, videoEnded]);

  // Resume video playback automatically when tab/window regains focus or visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video || !hasStartedVideoRef.current || videoEnded || userManuallyPausedRef.current) return;

      if (document.visibilityState === 'visible') {
        if (video.paused && !video.ended && !isCovered && shouldPlayVideo) {
          video.play().catch(() => {});
        }
      }
    };

    const handleWindowFocus = () => {
      const video = videoRef.current;
      if (!video || !hasStartedVideoRef.current || videoEnded || userManuallyPausedRef.current) return;

      if (video.paused && !video.ended && !isCovered && shouldPlayVideo) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [shouldPlayVideo, videoEnded, isCovered]);

  // 3. Line-by-line typography reveal triggered as preloader panels split
  useEffect(() => {
    if (!shouldAnimateText) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.to(
          [
            headlineLine1Ref.current,
            headlineLine2Ref.current,
            subtitleRef.current,
            ctaGroupRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
          }
        );
        return;
      }

      const tl = gsap.timeline({ delay: 0.1 });

      // Line-by-line reveal from masked containers
      tl.fromTo(
        headlineLine1Ref.current,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
        }
      )
        .fromTo(
          headlineLine2Ref.current,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.7'
        )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          },
          '-=0.55'
        )
        .fromTo(
          ctaGroupRef.current,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
          },
          '-=0.5'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [shouldAnimateText]);

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-screen h-screen overflow-hidden bg-[#0A0A0A] flex items-center"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Layer 1: Full-screen Cinematic Video Background */}
      <video
        ref={videoRef}
        src="/Hero.mp4"
        poster="/herolast.webp"
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleVideoEnded}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration > 0 && v.currentTime >= v.duration - 0.05 && !videoEnded) {
            handleVideoEnded();
          }
        }}
        onLoadedData={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-90'
          }`}
      />

      {/* Layer 2: Interactive Hero Ink Reveal Layer (Enabled strictly when video ends) */}
      <HeroInkReveal isEnabled={videoEnded} parentRef={heroRef} />

      {/* Layer 3: Hero Content (Layered above video & ink reveal) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-[var(--page-padding)] pt-16 sm:pt-12 pointer-events-none">
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-[48%] text-left space-y-6 sm:space-y-7 pointer-events-auto">
          {/* Main Headline (Masked Line-by-Line Reveal) */}
          <h1 className="space-y-1 sm:space-y-2 m-0 p-0 font-normal">
            <span className="block overflow-hidden">
              <span
                ref={headlineLine1Ref}
                className="block font-display text-[clamp(2.5rem,5.5vw,5.25rem)] font-bold tracking-tight text-white leading-[1.05] will-change-transform opacity-0"
              >
                FULL-STACK
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                ref={headlineLine2Ref}
                className="block font-display text-[clamp(2.5rem,5.5vw,5.25rem)] font-bold tracking-tight text-white leading-[1.05] will-change-transform opacity-0"
              >
                AI DEVELOPER
              </span>
            </span>
          </h1>

          {/* Supporting Copy */}
          <div className="max-w-md sm:max-w-lg">
            <p
              ref={subtitleRef}
              className="font-body text-base sm:text-lg lg:text-xl font-normal text-off-white/80 leading-relaxed will-change-transform opacity-0"
            >
              I build intelligent digital experiences by combining AI, engineering, and creative development.
            </p>
          </div>

          {/* Hero CTAs */}
          <div
            ref={ctaGroupRef}
            className="pt-2 flex flex-wrap items-center gap-6 sm:gap-8 will-change-transform opacity-0"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-contact-overlay'));
              }}
              className="inline-flex items-center justify-center px-6 py-3.5 bg-brand-red hover:bg-[#8F0C05] text-white font-body text-xs sm:text-sm font-semibold tracking-wider rounded transition-colors duration-200 shadow-lg shadow-brand-red/20 pointer-events-auto cursor-pointer"
            >
              LET&apos;S CONNECT
            </button>

            <a
              href="/Sahil_Gupta_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-xs sm:text-sm font-medium tracking-wider text-off-white/75 hover:text-white transition-colors duration-200 group pointer-events-auto"
            >
              <span>VIEW RESUME</span>
              <span className="transform transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Layer 4: Dynamic Bottom-Right Video Play / Pause Controller (Only for Hero section) */}
      <div
        className={`absolute bottom-6 sm:bottom-10 right-[var(--page-padding)] z-10 transition-opacity duration-300 ${isCovered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          }`}
      >
        <button
          id="hero-play-controller"
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-brand-red hover:bg-[#8F0C05] text-white font-body text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-full transition-all duration-300 shadow-lg shadow-brand-red/30 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
              <span>PLAY</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}

