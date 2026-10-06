import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onRevealStart, onComplete }) {
  const containerRef = useRef(null);
  const nameWrapperRef = useRef(null);
  const nameTextRef = useRef(null);
  const topPanelsRef = useRef([]);
  const bottomPanelsRef = useRef([]);

  // Stable callback refs prevent parent re-renders from restarting the timeline
  const onRevealStartRef = useRef(onRevealStart);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    topPanelsRef.current = topPanelsRef.current.slice(0, 7);
    bottomPanelsRef.current = bottomPanelsRef.current.slice(0, 7);

    // Initial state: hide name text during the initial blank pause
    if (nameTextRef.current) {
      gsap.set(nameTextRef.current, { yPercent: 120, opacity: 0 });
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          console.log('[Preloader] COMPLETE');
          console.log('[Preloader] Setting shouldPlayVideo = true');
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        },
      });

      if (prefersReducedMotion) {
        // Reduced motion fallback
        tl.to({}, { duration: 0.4 })
          .to(nameTextRef.current, {
            opacity: 1,
            yPercent: 0,
            duration: 0.5,
            ease: 'power2.out',
          })
          .to({}, { duration: 0.4 })
          .call(() => {
            if (onRevealStartRef.current) onRevealStartRef.current();
          })
          .to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          });
        return;
      }

      // STAGE 1: Blank warm off-white screen pause (~400ms)
      tl.to({}, { duration: 0.4 })

        // STAGE 2: SAHIL GUPTA enters from below in near-black (#0A0A0A) exactly ONCE
        .to(nameTextRef.current, {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          ease: 'power3.out',
        })

        // Controlled hold after name settles
        .to({}, { duration: 0.5 })

        // Name gently dissolves as curtain split initiates
        .to(nameWrapperRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.35,
          ease: 'power2.inOut',
        })
        .call(() => {
          // Trigger Hero typography line-by-line entrance as the panels begin opening
          if (onRevealStartRef.current) onRevealStartRef.current();
        });

      // STAGE 3: Restored 7-Panel Center Split Sequence (Strictly: 4 -> 3+5 -> 2+6 -> 1+7) in #F5F1EA
      // Top half moves UP (yPercent: -100), Bottom half moves DOWN (yPercent: 100)
      const splitDuration = 0.55;
      const groupGap = 0.11;
      const ease = 'power3.inOut';

      // STEP 1: Panel 4 (Center - Index 3)
      tl.to(topPanelsRef.current[3], { yPercent: -100, duration: splitDuration, ease }, 'split4')
        .to(bottomPanelsRef.current[3], { yPercent: 100, duration: splitDuration, ease }, 'split4')

        // STEP 2: Panels 3 & 5 (Indices 2 & 4) simultaneously
        .to([topPanelsRef.current[2], topPanelsRef.current[4]], { yPercent: -100, duration: splitDuration, ease }, `split4+=${groupGap}`)
        .to([bottomPanelsRef.current[2], bottomPanelsRef.current[4]], { yPercent: 100, duration: splitDuration, ease }, `split4+=${groupGap}`)

        // STEP 3: Panels 2 & 6 (Indices 1 & 5) simultaneously
        .to([topPanelsRef.current[1], topPanelsRef.current[5]], { yPercent: -100, duration: splitDuration, ease }, `split4+=${groupGap * 2}`)
        .to([bottomPanelsRef.current[1], bottomPanelsRef.current[5]], { yPercent: 100, duration: splitDuration, ease }, `split4+=${groupGap * 2}`)

        // STEP 4: Panels 1 & 7 (Indices 0 & 6) simultaneously
        .to([topPanelsRef.current[0], topPanelsRef.current[6]], { yPercent: -100, duration: splitDuration, ease }, `split4+=${groupGap * 3}`)
        .to([bottomPanelsRef.current[0], bottomPanelsRef.current[6]], { yPercent: 100, duration: splitDuration, ease }, `split4+=${groupGap * 3}`);
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden="true"
    >
      {/* 7 Vertical Full-Height Panels covering 100vw x 100vh in Warm Off-White (#F5F1EA) */}
      <div className="absolute inset-0 flex w-full h-full">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="panel relative h-full flex flex-col overflow-hidden"
            style={{ width: 'calc(100% / 7 + 0.5px)', marginRight: '-0.5px' }}
          >
            {/* Top Half (50vh) - Moves UP */}
            <div
              ref={(el) => (topPanelsRef.current[index] = el)}
              className="panel-top w-full h-1/2 bg-[#F5F1EA] will-change-transform"
            />
            {/* Bottom Half (50vh) - Moves DOWN */}
            <div
              ref={(el) => (bottomPanelsRef.current[index] = el)}
              className="panel-bottom w-full h-1/2 bg-[#F5F1EA] will-change-transform"
            />
          </div>
        ))}
      </div>

      {/* Name Introduction Layer */}
      <div
        ref={nameWrapperRef}
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-6"
      >
        <div className="overflow-hidden py-6 sm:py-8">
          <div
            ref={nameTextRef}
            className="flex items-center gap-4 sm:gap-6 md:gap-8 will-change-transform opacity-0"
          >
            <img 
              src="/transparentLogoDark.png" 
              alt="Logo" 
              className="w-[clamp(2.5rem,7vw,8rem)] h-auto object-contain"
            />
            <h1
              className="font-editorial font-bold tracking-tight text-[#0A0A0A] uppercase whitespace-nowrap leading-none m-0"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(3rem, 9.5vw, 11rem)',
              }}
            >
              SAHIL GUPTA
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
