import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LogoLoop from './LogoLoop';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiFastapi,
  SiSupabase,
  SiFirebase,
  SiVercel,
  SiNetlify,
  SiGit,
  SiGithub,
  SiGreensock,
  SiFramer
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const CORE_DEV = [
  { name: 'React', icon: <SiReact className="w-full h-full" color="#61DAFB" /> },
  { name: 'JavaScript', icon: <SiJavascript className="w-full h-full" color="#F7DF1E" /> },
  { name: 'TypeScript', icon: <SiTypescript className="w-full h-full" color="#3178C6" /> },
  { name: 'Vite', icon: <SiVite className="w-full h-full" color="#646CFF" /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss className="w-full h-full" color="#06B6D4" /> },
  { name: 'Node.js', icon: <SiNodedotjs className="w-full h-full" color="#5FA04E" /> },
  { name: 'Git', icon: <SiGit className="w-full h-full" color="#F05032" /> },
  { name: 'GitHub', icon: <SiGithub className="w-full h-full" color="#FFFFFF" /> },
];

const AI_SYSTEMS = [
  { name: 'Python', icon: <SiPython className="w-full h-full" color="#3776AB" /> },
  { name: 'FastAPI', icon: <SiFastapi className="w-full h-full" color="#009688" /> },
  { name: 'Supabase', icon: <SiSupabase className="w-full h-full" color="#3ECF8E" /> },
  { name: 'Firebase', icon: <SiFirebase className="w-full h-full" color="#FFCA28" /> },
  { name: 'Express.js', icon: <SiExpress className="w-full h-full" color="#FFFFFF" /> },
  { name: 'Vercel', icon: <SiVercel className="w-full h-full" color="#FFFFFF" /> },
  { name: 'Netlify', icon: <SiNetlify className="w-full h-full" color="#00C7B7" /> },
];

const CREATIVE = [
  { name: 'GSAP', icon: <SiGreensock className="w-full h-full" color="#88CE02" /> },
  { name: 'Framer Motion', icon: <SiFramer className="w-full h-full" color="#0055FF" /> },
  {
    name: 'Lenis',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4.5" fill="#FFFFFF" />
        <path d="M6 14.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
        <path d="M8.5 17c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5" stroke="#AF0E06" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="1.5" fill="#AF0E06" />
      </svg>
    ),
  },
];

export default function TechStack() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const heading1Ref = useRef(null);
  const heading2Ref = useRef(null);
  const copyRef = useRef(null);
  const row1Ref = useRef(null);
  const dividerRef = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);
  const cinematicLineRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set([row1Ref.current, dividerRef.current, row2Ref.current, row3Ref.current], { opacity: 1 });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Section label fades in and moves upward slightly
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
        // Cinematic Red Line extends
        .fromTo(
          cinematicLineRef.current,
          { height: 0 },
          { height: '100%', duration: 0.8, ease: 'power3.inOut' },
          '-=0.4'
        )
        // 2. "THE TOOLS" reveals upward through an overflow-hidden mask
        .fromTo(
          heading1Ref.current,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.6'
        )
        // 3. "BEHIND THE SYSTEM." reveals immediately after
        .fromTo(
          heading2Ref.current,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.55'
        )
        // 4. Supporting copy fades upward
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        // 5. First technology row reveals
        .fromTo(
          row1Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.2'
        )
        // 6. Divider draws/reveals
        .fromTo(
          dividerRef.current,
          { opacity: 0, scaleX: 0.8 },
          { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        )
        // 7. Second technology row reveals
        .fromTo(
          row2Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        )
        // 8. Third creative tools row reveals
        .fromTo(
          row3Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative w-full bg-[#0A0A0A] text-[#FFFFFF] pt-24 pb-32 sm:pt-32 sm:pb-40 border-t border-[#FFFFFF]/10 overflow-hidden"
    >
      {/* Very subtle background texture / grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(175,14,6,0.06)_0%,transparent_60%)]"></div>

      <div className="w-full page-container relative z-10">

        {/* Section Intro / Header */}
        <div className="flex flex-col items-start mb-20 sm:mb-28">
          {/* Label */}
          <div className="overflow-hidden mb-6 sm:mb-8">
            <span
              ref={labelRef}
              className="inline-block font-editorial text-xs sm:text-sm tracking-widest text-brand-red uppercase font-bold will-change-transform"
            >
              02 / STACK
            </span>
          </div>

          <div className="relative flex">
            {/* Cinematic Red Line */}
            <div ref={cinematicLineRef} className="absolute -left-4 sm:-left-6 top-2 sm:top-3 w-[1px] h-0 bg-brand-red will-change-transform hidden sm:block" />

            <div className="flex flex-col">
              <div className="overflow-hidden">
                <h2
                  ref={heading1Ref}
                  className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFFFF] uppercase leading-[1.05] will-change-transform"
                >
                  THE TOOLS
                </h2>
              </div>
              <div className="overflow-hidden">
                <h2
                  ref={heading2Ref}
                  className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-red uppercase leading-[1.05] will-change-transform"
                >
                  BEHIND THE SYSTEM.
                </h2>
              </div>
            </div>
          </div>

          {/* Supporting Copy */}
          <div className="overflow-hidden mt-6 sm:mt-8">
            <p
              ref={copyRef}
              className="font-body text-sm sm:text-base text-[#A0A0A0] tracking-wide will-change-transform max-w-sm sm:max-w-md font-medium leading-relaxed"
            >
              Technologies I use to design, build, connect and ship intelligent digital systems.
            </p>
          </div>
        </div>

        {/* Technology Rows */}
        <div className="flex flex-col space-y-12 sm:space-y-16">

          {/* Row 1 */}
          <div ref={row1Ref} className="will-change-transform opacity-0">
            <div className="mb-4 sm:mb-6 px-4">
              <span className="font-editorial text-[10px] sm:text-xs tracking-widest text-[#888888] uppercase font-medium">
                01 / CORE DEVELOPMENT
              </span>
            </div>
            <LogoLoop items={CORE_DEV} speed={48} direction="left" />
          </div>

          {/* Divider */}
          <div ref={dividerRef} className="flex items-center justify-center opacity-0 will-change-transform w-full max-w-lg mx-auto">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FFFFFF]/20 to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-brand-red"></div>
            </div>
          </div>

          {/* Row 2 */}
          <div ref={row2Ref} className="will-change-transform opacity-0">
            <div className="mb-4 sm:mb-6 px-4 text-right">
              <span className="font-editorial text-[10px] sm:text-xs tracking-widest text-[#888888] uppercase font-medium">
                02 / AI + SYSTEMS
              </span>
            </div>
            <LogoLoop items={AI_SYSTEMS} speed={54} direction="right" />
          </div>

          {/* Creative / Experience */}
          <div ref={row3Ref} className="pt-8 sm:pt-16 flex flex-col items-center justify-center opacity-0 will-change-transform">
            <span className="font-editorial text-[10px] sm:text-xs tracking-widest text-[#666666] uppercase mb-4 sm:mb-6 text-center font-medium">
              CREATIVE & EXPERIENCE
            </span>
            <div className="flex items-center gap-6 sm:gap-10 flex-wrap justify-center">
              {CREATIVE.map(tech => (
                <div key={tech.name} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 shrink-0">
                    {tech.icon}
                  </div>
                  <span className="font-body text-[11px] sm:text-xs text-[#FFFFFF] font-medium tracking-wide uppercase">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
