import React, { useMemo } from 'react';

/**
 * React Bits LogoLoop Component
 * Infinite horizontal marquee loop with smooth linear motion,
 * gradient edge fade masks, pause on hover, and accessible labels.
 */
export default function LogoLoop({
  items = [],
  speed = 40, // duration in seconds for one full 50% cycle
  direction = 'left',
  pauseOnHover = true,
  className = '',
}) {
  if (!items || items.length === 0) return null;

  // Duplicate items array to ensure seamless, glitch-free continuous looping
  const duplicatedItems = [...items, ...items];

  const isMobileOrTablet = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia('(pointer: coarse)').matches;
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden logo-loop-mask py-3 select-none ${className}`}
      aria-label="Technology stack logo loop"
    >
      <div
        className="flex w-max items-center will-change-transform"
        style={{
          animation: `logoloop-scroll ${speed}s linear infinite ${direction === 'right' ? 'reverse' : 'normal'}`,
          animationPlayState: 'running',
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover && !isMobileOrTablet) e.currentTarget.style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover && !isMobileOrTablet) e.currentTarget.style.animationPlayState = 'running';
        }}
      >
        {duplicatedItems.map((tech, index) => {
          const isDuplicate = index >= items.length;
          return (
            <div
              key={`${tech.name}-${index}`}
              aria-hidden={isDuplicate}
              className={`${!isMobileOrTablet ? 'group cursor-pointer' : ''} flex items-center pr-10 sm:pr-14 md:pr-16 transition-all duration-300`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-2">
              {/* Technology Icon */}
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 shrink-0 opacity-70 grayscale-[60%] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300">
                {tech.icon}
              </div>

              {/* Technology Label */}
              <span className="font-body text-xs sm:text-sm font-medium tracking-wide text-[#888888] group-hover:text-[#FFFFFF] whitespace-nowrap transition-colors duration-200">
                {tech.name}
              </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
