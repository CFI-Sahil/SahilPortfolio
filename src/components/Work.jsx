import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpotlightCard from './SpotlightCard';

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // Intro Text Reveal
      gsap.fromTo('.work-intro-text',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.work-intro',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Project Reveals
      const projects = gsap.utils.toArray('.project-wrapper');
      projects.forEach((project) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        // 1. Frame / Wrapper Reveal
        tl.fromTo(project,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );

        // 2. Viewport Subtle Scale
        const viewport = project.querySelector('.project-viewport');
        if (viewport) {
          tl.fromTo(viewport,
            { scale: 0.98, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' },
            '-=0.7'
          );
        }

        // 3. Staggered text reveal
        const textElements = project.querySelectorAll('.reveal-text');
        if (textElements.length > 0) {
          tl.fromTo(textElements,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
            '-=1.0'
          );
        }

        // 4. Parallax Image internal scroll (only for long viewports)
        const parallaxImg = project.querySelector('.parallax-img');
        if (parallaxImg) {
          gsap.fromTo(parallaxImg,
            { y: '0%' },
            {
              y: '-12%',
              ease: 'none',
              scrollTrigger: {
                trigger: project,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        }
      });

      // BRIDGE REVEAL (WORK OUTRO)
      const bridgeTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.work-outro',
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      // Phase 1: Label
      bridgeTl.fromTo('.bridge-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
        // Phase 2: Headline
        .fromTo('.bridge-title',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.4'
        )
        // Phase 3: Line & Node
        .fromTo('.bridge-base-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.inOut' },
          '-=0.2'
        )
        .fromTo('.bridge-node',
          { opacity: 0, left: '0%', x: '0%' },
          { opacity: 1, left: '100%', x: '-100%', duration: 1.5, ease: 'power2.inOut' },
          '<0.2'
        )
        // Phase 4: Principles Stagger
        .fromTo('.bridge-principle',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
          '-=0.8'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="work-section" className="relative w-full bg-[#F5F1EA] text-[#0A0A0A] pt-32 pb-40 overflow-hidden">
      <div className="page-container w-full max-w-7xl mx-auto flex flex-col">

        {/* SECTION INTRO */}
        <div className="mb-24 sm:mb-32 work-intro">
          <div className="mb-24 flex work-intro-text">
            <span className="font-editorial text-xs tracking-widest text-[#0A0A0A]/50 uppercase font-medium">
              FROM EXPERIENCE TO EXECUTION.
            </span>
          </div>
          <span className="font-editorial text-xs sm:text-sm tracking-widest text-brand-red uppercase font-bold work-intro-text block">
            04 / WORK
          </span>
          <h2 className="mt-6 sm:mt-8 font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[#0A0A0A] uppercase leading-[1.05] work-intro-text">
            THINGS I'VE BUILT.<br />
            SYSTEMS THAT DO SOMETHING.
          </h2>
        </div>

        {/* PROJECTS CONTAINER */}
        <div className="flex flex-col space-y-32 md:space-y-48">

          {/* 01 / URBANIQ - HERO PROJECT */}
          <div className="project-wrapper flex flex-col space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#0A0A0A]/10 pb-6 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-2 reveal-text">
                  <span className="font-editorial text-sm tracking-widest text-brand-red uppercase font-bold">01 / URBANIQ</span>
                </div>
                <h3 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-[#0A0A0A] reveal-text">
                  SMART ROAD MONITORING SYSTEM
                </h3>
              </div>
              <div className="flex flex-col md:items-end text-left md:text-right reveal-text">
                <span className="font-editorial text-xs tracking-widest text-[#666666] uppercase mb-1">BUILD TYPE</span>
                <span className="font-editorial text-sm tracking-widest text-[#0A0A0A] uppercase font-bold">IoT · FULL-STACK · MOBILE · WEB</span>
              </div>
            </div>

            {/* UrbanIQ Custom Composition Viewport */}
            <div className="project-viewport relative w-full bg-[#EAE5D9] rounded-2xl overflow-hidden group p-6 sm:p-12 md:p-16 lg:p-24 flex flex-col items-center justify-center">
              {/* Web Dashboard inside subtle browser frame */}
              <div className="w-full max-w-5xl relative z-10 bg-white rounded-xl shadow-2xl border border-[#0A0A0A]/5 overflow-hidden transform transition-transform duration-1000 group-hover:-translate-y-2">
                <div className="w-full h-8 bg-[#F5F1EA] border-b border-[#0A0A0A]/5 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E0D7C6]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E0D7C6]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E0D7C6]"></div>
                </div>
                <div className="relative w-full bg-white overflow-hidden">
                  <img src="/UrbanIQ Web.png" alt="UrbanIQ Web Dashboard" className="w-full h-auto block" />
                </div>
              </div>
              {/* Mobile App Viewport with CSS Mobile Frame */}
              <div className="absolute -bottom-8 right-4 sm:right-8 md:right-16 lg:right-24 w-[28%] max-w-[200px] z-20 transform transition-transform duration-1000 group-hover:-translate-y-6 group-hover:-translate-x-2">
                <div className="bg-[#0A0A0A] rounded-[2rem] border-[6px] md:border-[8px] border-[#0A0A0A] shadow-2xl overflow-hidden relative">
                  {/* Subtle mobile notch */}
                  <div className="absolute top-0 inset-x-0 h-3 bg-[#0A0A0A] z-30 rounded-b-lg w-1/3 mx-auto"></div>
                  <img src="/UrbanIQ App.png" alt="UrbanIQ Mobile Interface" className="w-full h-auto drop-shadow-2xl" />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-between items-start pt-4">
              <p className="font-body text-base md:text-lg text-[#0A0A0A]/70 max-w-2xl leading-relaxed reveal-text">
                A connected road-monitoring system combining embedded sensors, geospatial data, mobile applications and web interfaces to detect and communicate pothole conditions.
              </p>
              <div className="flex flex-col gap-5 w-full md:w-auto shrink-0 reveal-text">
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {['ESP32', 'React Native', 'React', 'Supabase'].map(tech => (
                    <span key={tech} className="px-3 py-1.5 border border-[#0A0A0A]/20 rounded text-xs font-editorial tracking-wider text-[#0A0A0A]">
                      {tech}
                    </span>
                  ))}
                </div>
                <a href="#" className="inline-flex items-center gap-2 font-editorial text-sm tracking-widest text-[#0A0A0A] uppercase font-bold hover:text-brand-red transition-colors md:self-end group/btn">
                  EXPLORE PROJECT
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* 02 / AI AUDIT */}
          <div className="project-wrapper flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
            <div className="flex flex-col w-full lg:w-5/12 space-y-6">
              <div className="flex items-center gap-4 reveal-text">
                <span className="font-editorial text-sm tracking-widest text-brand-red uppercase font-bold">02 / AI AUDIT</span>
              </div>
              <h3 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-[#0A0A0A] reveal-text">
                AI-POWERED AUDIT APP
              </h3>
              <span className="font-editorial text-xs tracking-widest text-[#0A0A0A] uppercase font-bold reveal-text">AI · SPEECH · APPLICATION</span>
              <p className="font-body text-base text-[#0A0A0A]/70 leading-relaxed reveal-text">
                An application integrating AI services and speech recognition to process audio and perform reasoning and analysis over transcribed text.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 reveal-text">
                {['Groq APIs', 'Whisper', 'React', 'FastAPI'].map(tech => (
                  <span key={tech} className="px-3 py-1.5 border border-[#0A0A0A]/20 rounded text-xs font-editorial tracking-wider text-[#0A0A0A]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="pt-6 reveal-text">
                <a href="https://ai-auditsystem.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-editorial text-sm tracking-widest text-[#0A0A0A] uppercase font-bold hover:text-brand-red transition-colors group/btn">
                  EXPLORE PROJECT
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                </a>
              </div>
            </div>

            {/* AI Audit Portrait Viewport */}
            <SpotlightCard className="project-viewport w-full lg:w-7/12 relative group bg-[#0A0A0A] rounded-2xl overflow-hidden flex items-center justify-center p-3 md:p-4" spotlightColor="rgba(255, 255, 255, 0.08)" spotlightSize={400}>
              <div className="w-full relative rounded-xl overflow-hidden shadow-2xl bg-[#0A0A0A] transform transition-transform duration-1000 group-hover:-translate-y-1">
                <img src="/AIAudit.png" alt="AI Audit Interface" className="w-full h-auto block" />
              </div>
            </SpotlightCard>
          </div>

          {/* 03 / ALPHAONE FITNESS CLUB */}
          <SpotlightCard className="project-wrapper relative w-full bg-[#0A0A0A] rounded-2xl overflow-hidden group pt-12 px-6 md:pt-20 md:px-16 flex flex-col" spotlightColor="rgba(175, 14, 6, 0.15)" spotlightSize={600}>
            {/* Text Content Layer */}
            <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16 text-[#FFFFFF] relative z-20">
              <div className="flex flex-col max-w-xl">
                <div className="flex items-center gap-4 mb-4 reveal-text">
                  <span className="font-editorial text-sm tracking-widest text-brand-red uppercase font-bold">03 / ALPHAONE FITNESS CLUB</span>
                  <span className="hidden md:block w-1 h-1 bg-[#FFFFFF]/50 rounded-full"></span>
                  <span className="hidden md:block font-editorial text-xs tracking-widest text-[#FFFFFF]/80 uppercase">WEB · FRONTEND · FITNESS</span>
                </div>
                <h3 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-[#FFFFFF] mb-4 reveal-text">
                  PREMIUM FITNESS EXPERIENCE
                </h3>
                <p className="font-body text-base text-[#FFFFFF]/80 leading-relaxed reveal-text">
                  A high-energy frontend web experience built for a modern fitness club, focused on visual strength and smooth user interactions.
                </p>
              </div>
              <div className="flex flex-col gap-6 md:items-end shrink-0 reveal-text">
                <div className="flex flex-wrap gap-2">
                  {['React', 'GSAP', 'Tailwind'].map(tech => (
                    <span key={tech} className="px-3 py-1.5 border border-[#FFFFFF]/30 rounded text-xs font-editorial tracking-wider text-[#FFFFFF] backdrop-blur-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <a href="https://alphaonefitnessclub.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-editorial text-sm tracking-widest text-[#FFFFFF] uppercase font-bold hover:text-brand-red transition-colors group/btn">
                  EXPLORE PROJECT
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                </a>
              </div>
            </div>

            {/* Cinematic Website Viewport (Pushes up from bottom) */}
            <div className="project-viewport relative w-full max-w-5xl mx-auto bg-[#111111] rounded-t-xl border-t border-x border-[#FFFFFF]/10 shadow-2xl overflow-hidden transform transition-transform duration-1000 group-hover:-translate-y-3">
              <div className="w-full h-8 bg-[#1A1A1A] border-b border-[#FFFFFF]/10 flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-[#444444]"></div>
                <div className="w-2 h-2 rounded-full bg-[#444444]"></div>
                <div className="w-2 h-2 rounded-full bg-[#444444]"></div>
              </div>
              <div className="w-full relative overflow-hidden bg-[#0A0A0A]">
                <img src="/Alphaone.png" alt="Alphaone Fitness Club Website" className="w-full h-auto block" />
              </div>
            </div>
          </SpotlightCard>

          {/* 04 / SP IMPRESSION HUB */}
          <div className="project-wrapper flex flex-col space-y-12">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
              <span className="font-editorial text-sm tracking-widest text-brand-red uppercase font-bold reveal-text">04 / SP IMPRESSION HUB</span>
              <h3 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-[#0A0A0A] reveal-text">
                BILINGUAL DIGITAL BUSINESS
              </h3>
              <span className="font-editorial text-xs tracking-widest text-[#0A0A0A] uppercase font-bold reveal-text">WEB · BRAND · BILINGUAL</span>
              <p className="font-body text-base text-[#0A0A0A]/70 leading-relaxed reveal-text">
                A premium bilingual web experience (EN / मराठी) combining custom personalized printing, photo gifts, and Kripa Online citizen services into one cohesive local brand.
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2 reveal-text">
                {['React', 'Vite', 'Tailwind v4', 'GSAP', 'Lenis'].map(tech => (
                  <span key={tech} className="px-3 py-1.5 border border-[#0A0A0A]/20 rounded text-xs font-editorial tracking-wider text-[#0A0A0A]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Premium Browser Viewport */}
            <div className="project-viewport w-full bg-[#FAF8F5] rounded-2xl p-6 md:p-12 lg:p-16 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5] to-[#EAE2D5] z-0 transition-opacity duration-700 group-hover:opacity-80"></div>

              <div className="w-full max-w-4xl relative z-10 bg-white rounded-xl shadow-2xl overflow-hidden transform transition-transform duration-1000 group-hover:-translate-y-2">
                <div className="w-full h-8 bg-[#F0EBE1] flex items-center px-4 gap-2 border-b border-[#EAE2D5]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E0D7C6]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E0D7C6]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E0D7C6]"></div>
                </div>
                <div className="w-full relative overflow-hidden bg-white">
                  <img src="/SpImpressionHub.png" alt="SP Impression Hub Website" className="w-full h-auto block" />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2 reveal-text">
              <a href="https://spimpressionhub.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-editorial text-sm tracking-widest text-[#0A0A0A] uppercase font-bold hover:text-[#D96C4A] transition-colors group/btn">
                EXPLORE PROJECT
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
              </a>
            </div>
          </div>

          {/* 05 / ECMACOM */}
          <div className="project-wrapper flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-center pt-10">
            {/* E-Commerce Product Viewport */}
            <div className="project-viewport w-full lg:w-7/12 bg-[#EAE5D9] rounded-2xl p-6 md:p-10 flex items-center justify-center relative overflow-hidden group">
              <div className="w-full relative z-10 bg-white rounded-xl shadow-2xl border border-[#0A0A0A]/5 overflow-hidden transform transition-transform duration-1000 group-hover:-translate-y-2 group-hover:-translate-x-2">
                <div className="w-full h-8 bg-[#F5F1EA] flex items-center px-4 gap-2 border-b border-[#0A0A0A]/5">
                  <div className="w-2 h-2 rounded-full bg-[#D8D3C8]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#D8D3C8]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#D8D3C8]"></div>
                </div>
                <div className="w-full relative overflow-hidden bg-white">
                  <img src="/Ecmacom.png" alt="Ecmacom E-commerce Interface" className="w-full h-auto block" />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-5/12 flex flex-col space-y-6">
              <span className="font-editorial text-sm tracking-widest text-brand-red uppercase font-bold reveal-text">05 / ECMACOM</span>
              <h3 className="font-display text-4xl sm:text-5xl font-bold tracking-tight uppercase text-[#0A0A0A] reveal-text">
                MODERN E-COMMERCE INTERFACE
              </h3>
              <span className="font-editorial text-xs tracking-widest text-[#0A0A0A] uppercase font-bold reveal-text">E-COMMERCE · FRONTEND · REACT</span>
              <p className="font-body text-base text-[#0A0A0A]/70 leading-relaxed max-w-md reveal-text">
                A frontend e-commerce build focused on polished product experiences, smooth user interactions, and robust catalog navigation.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 reveal-text">
                {['React', 'Frontend Engineering', 'State Management'].map(tech => (
                  <span key={tech} className="px-3 py-1.5 border border-[#0A0A0A]/20 rounded text-xs font-editorial tracking-wider text-[#0A0A0A]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="pt-8 border-t border-[#0A0A0A]/10 mt-8 max-w-md flex justify-between items-center reveal-text">
                <span className="font-editorial text-xs tracking-widest text-[#0A0A0A]/40 uppercase">FRONTEND BUILD</span>
                <a href="https://ecmacom.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-editorial text-sm tracking-widest text-[#0A0A0A] uppercase font-bold hover:text-brand-red transition-colors group/btn">
                  EXPLORE PROJECT
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* WORK OUTRO / BRIDGE */}
        <div className="mt-24 sm:mt-32 pt-16 sm:pt-24 flex flex-col items-center work-outro w-full max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
            <span className="bridge-label font-editorial text-sm tracking-widest text-brand-red uppercase font-bold mb-6 block">
              BUILT WITH INTENT.
            </span>
            <h2 className="bridge-title font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0A0A0A] uppercase leading-[1.05]">
              MORE THAN PROJECTS.<br />
              A RECORD OF HOW I BUILD.
            </h2>
          </div>

          <div className="w-full flex flex-col">
            {/* The main editorial signal line */}
            <div className="w-full relative h-[1px] mb-8">
              <div className="absolute inset-0 bg-[#0A0A0A]/10 bridge-base-line origin-left"></div>
              {/* Traveling red node */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1.5 h-1.5 bg-brand-red rounded-full bridge-node"></div>
            </div>

            {/* Build Principles */}
            <div className="w-full flex flex-col">
              {[
                { num: "01", title: "THINK IN SYSTEMS", text: "Architecture · Data · Flow" },
                { num: "02", title: "BUILD WITH PURPOSE", text: "Problems · Logic · Execution" },
                { num: "03", title: "DESIGN THE EXPERIENCE", text: "Interface · Interaction · Clarity" }
              ].map((principle) => (
                <div key={principle.num} className="bridge-principle flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12 py-8 border-b border-[#0A0A0A]/10 last:border-b-0">
                  <span className="font-editorial text-sm tracking-widest text-brand-red uppercase font-bold w-8 shrink-0">
                    {principle.num}
                  </span>
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between w-full gap-2 md:gap-4">
                    <h4 className="font-editorial text-lg md:text-xl tracking-widest text-[#0A0A0A] uppercase font-bold">
                      {principle.title}
                    </h4>
                    <span className="font-editorial text-xs md:text-sm tracking-widest text-[#0A0A0A]/50 uppercase">
                      {principle.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
