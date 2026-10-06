import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroTransitionScene
 * Pinned cinematic transition from Hero -> Off-white Editorial Statement surface (#F5F1EA).
 *
 * Sequence:
 * 1. User begins scrolling: Hero remains completely pinned and visually stable.
 * 2. Off-white physical panel rises smoothly from yPercent: 100 -> 0,
 *    gradually covering the Hero.
 * 3. As the panel covers the Hero, the 2-line centered editorial statement reveals:
 *    - Marker: "01 / ENGINEERING"
 *    - Line 1: "BEYOND THE BUILD." (Near-black #0A0A0A, same large font size)
 *    - Line 2: "I ENGINEER THE SYSTEM" (Brand red #AF0E06, same large font size, single line on desktop)
 * 4. Statement settles in place for comfortable reading buffer.
 * 5. Pin releases and normal page scroll resumes into TechStack & remaining sections.
 */
export default function HeroTransitionScene({
  shouldAnimateText = false,
  shouldPlayVideo = false,
}) {
  const sceneRef = useRef(null);
  const pinWrapperRef = useRef(null);
  const panelRef = useRef(null);
  const markerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHeroCovered, setIsHeroCovered] = useState(false);
  const isCoveredRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const scene = sceneRef.current;
    const pinWrapper = pinWrapperRef.current;
    const panel = panelRef.current;
    const marker = markerRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;

    if (!scene || !pinWrapper || !panel) return;

    const ctx = gsap.context(() => {
      // 1. Initial visual states managed strictly through GSAP
      gsap.set(panel, { yPercent: 100, y: 0, force3D: true });

      // Determine proportional scroll distance based on viewport
      const isMobile = window.innerWidth < 768;
      const scrollDistance = isMobile
        ? window.innerHeight * 1.5
        : window.innerHeight * 2.2;

      // Master ScrollTrigger timeline with smooth heavy scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: pinWrapper,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // When off-white overlay covers the hero (>45% progress), pause video
            const covered = self.progress >= 0.45;
            if (covered !== isCoveredRef.current) {
              isCoveredRef.current = covered;
              setIsHeroCovered(covered);
              const video = document.querySelector('#hero video');
              if (video) {
                if (covered) {
                  if (!video.paused && !video.ended) {
                    video.pause();
                  }
                } else {
                  if (video.paused && !video.ended && shouldPlayVideo && !window.__heroUserManuallyPaused) {
                    video.play().catch(() => { });
                  }
                }
              }
            }
          },
        },
      });

      // Step 1: Physical off-white panel rises from bottom to cover the pinned Hero completely
      tl.fromTo(
        panel,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: 'power2.inOut',
          duration: 0.45,
        },
        0
      );

      // Step 2: Marker appears the moment the panel covers the hero
      tl.fromTo(
        marker,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.40,
          ease: 'power2.out',
        },
        0.45
      );

      // Step 3: Wait for scroll (delay), then Line 1 ("BEYOND THE BUILD.") reveals
      tl.fromTo(
        line1,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.60,
          ease: 'power3.out',
        },
        0.55
      );

      // Step 4: Wait for scroll (delay), then Line 2 ("I ENGINEER THE SYSTEM") reveals
      tl.fromTo(
        line2,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.60,
          ease: 'power3.out',
        },
        0.75
      );

      // Step 5: Generous reading hold buffer before unpinning into next section
      tl.to({}, { duration: 0.65 }, 1.35);
    }, scene);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Shared typography class string to guarantee identical font-size, weight, line-height & font-family
  const statementTypographyClass =
    "font-display text-[clamp(2.15rem,5.75vw,6.5rem)] font-bold tracking-tight uppercase leading-[0.96] will-change-transform";

  // Reduced motion accessible fallback: Static centered sequential layout with zero pinning
  if (reducedMotion) {
    return (
      <div className="relative w-full">
        <Hero
          shouldAnimateText={shouldAnimateText}
          shouldPlayVideo={shouldPlayVideo}
        />
        <section
          id="statement"
          className="relative w-full min-h-screen bg-[#F5F1EA] flex flex-col items-center justify-center py-20 select-none text-center"
        >
          <div className="w-full page-container flex flex-col items-center justify-center text-center">
            <div className="w-full max-w-6xl flex flex-col items-center justify-center text-center">
              <div className="mb-6 sm:mb-8">
                <span className="font-editorial text-xs sm:text-sm tracking-widest text-[#0A0A0A]/60 uppercase">
                  ENGINEERING
                </span>
              </div>
              <div className="space-y-2 sm:space-y-3 flex flex-col items-center text-center">
                <h2 className={`${statementTypographyClass} text-[#0A0A0A]`}>
                  BEYOND THE BUILD.
                </h2>
                <h2 className={`${statementTypographyClass} text-brand-red whitespace-normal sm:whitespace-nowrap`}>
                  I ENGINEER THE SYSTEM
                </h2>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <section ref={sceneRef} className="relative w-full">
      <div
        ref={pinWrapperRef}
        className="relative w-screen h-screen overflow-hidden bg-[#0A0A0A]"
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* Pinned Hero Section (Unmodified, physically covered by rising panel) */}
        <Hero
          shouldAnimateText={shouldAnimateText}
          shouldPlayVideo={shouldPlayVideo}
          isCovered={isHeroCovered}
        />

        {/* Rising Off-White Editorial Statement Surface */}
        <div
          ref={panelRef}
          id="statement"
          className="absolute inset-0 w-full h-full bg-[#F5F1EA] z-20 flex flex-col items-center justify-center select-none text-center"
        >
          <div className="w-full page-container flex flex-col items-center justify-center text-center">
            <div className="w-full max-w-6xl flex flex-col items-center justify-center text-center">
              {/* Centered Restrained Section Marker */}
              <div ref={markerRef} className="overflow-hidden mb-6 sm:mb-8">
                <span className="font-editorial text-xs sm:text-sm tracking-widest text-[#0A0A0A]/60 uppercase">
                  ENGINEERING
                </span>
              </div>

              {/* Exact 2-Line Centered Typographic Statement */}
              <div className="space-y-2 sm:space-y-3 flex flex-col items-center text-center">
                {/* Line 1: Near-black #0A0A0A */}
                <div className="overflow-hidden py-1">
                  <h2
                    ref={line1Ref}
                    className={`${statementTypographyClass} text-[#0A0A0A]`}
                  >
                    BEYOND THE BUILD.
                  </h2>
                </div>

                {/* Line 2: Brand Red #FF1C01 (Single line on desktop) */}
                <div className="overflow-hidden py-1">
                  <h2
                    ref={line2Ref}
                    className={`${statementTypographyClass} text-brand-red whitespace-normal sm:whitespace-nowrap`}
                  >
                    I ENGINEER THE SYSTEM
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
