import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pipelineStages = [
  {
    id: '01',
    shortTitle: 'AUDIO',
    title: '01 / AUDIO PROCESSING',
    desc: 'Worked with audio preprocessing and speech-processing components as part of AI speech workflows.',
    tech: ['FFmpeg', 'RNNoise', 'VAD', 'Demucs']
  },
  {
    id: '02',
    shortTitle: 'PROCESS',
    title: '02 / SIGNAL PREPARATION',
    desc: 'Prepared and cleaned audio signals to optimize them for downstream transcription and analysis.',
    tech: ['FFmpeg', 'RNNoise', 'VAD', 'Demucs']
  },
  {
    id: '03',
    shortTitle: 'TRANSCRIBE',
    title: '03 / SPEECH + TRANSCRIPTION',
    desc: 'Integrated speech-recognition technologies to transform audio into structured text.',
    tech: ['Whisper', 'Multilingual Transcription']
  },
  {
    id: '04',
    shortTitle: 'AI SERVICES',
    title: '04 / AI SERVICES',
    desc: 'Integrated AI services for reasoning and analysis over transcribed text.',
    tech: ['Groq APIs', 'Whisper']
  },
  {
    id: '05',
    shortTitle: 'APPLICATION',
    title: '05 / APPLICATION ENGINEERING',
    desc: 'Integrated AI services and speech-processing capabilities into applications using modern frontend and backend architectures.',
    tech: ['React', 'FastAPI', 'AI Integration']
  }
];

export default function Experience() {
  const containerRef = useRef(null);
  const pinSectionRef = useRef(null);
  const contentSectionRef = useRef(null);

  // Refs for intro animation elements
  const labelRef = useRef(null);
  const heading2Ref = useRef(null);
  const heading3Ref = useRef(null);

  // Pipeline refs
  const zeexIntroRef = useRef(null);
  const certRef = useRef(null);

  // Desktop Pipeline Refs
  const pinPipelineRef = useRef(null);
  const progressLineRef = useRef(null);
  const nodeRefs = useRef([]);
  const labelRefs = useRef([]);
  const contentRefs = useRef([]);

  // Mobile Pipeline Refs
  const progressLineMobileRef = useRef(null);
  const nodeMobileRefs = useRef([]);
  const labelMobileRefs = useRef([]);
  const contentMobileRefs = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Reveal everything instantly for reduced motion
      gsap.set([zeexIntroRef.current, certRef.current], { opacity: 1, y: 0 });
      gsap.set(contentRefs.current, { opacity: 1, y: 0, position: 'relative' }); // Unstack content
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Reveal Intro Text Normally
      gsap.fromTo([labelRef.current, heading2Ref.current, heading3Ref.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pinSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // 2. Pin the Background Layer, let content scroll over it
      ScrollTrigger.create({
        trigger: pinSectionRef.current,
        start: 'top top',
        end: () => "+=" + window.innerHeight,
        pin: true,
        pinSpacing: false,
      });

      // 3. ZEEX AI Intro Reveal
      gsap.fromTo(zeexIntroRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: contentSectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        }
      );

      // 3. MatchMedia for Pipeline Animations
      const mm = gsap.matchMedia();

      // Desktop Pipeline (Pinned scrub)
      mm.add("(min-width: 768px)", () => {
        const pipelineTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinPipelineRef.current,
            start: 'center center',
            end: '+=400%',
            pin: true,
            scrub: 1,
          }
        });

        // Line grows from 0 to 1
        pipelineTl.to(progressLineRef.current, { scaleX: 1, ease: 'none', duration: 4 }, 0);

        pipelineStages.forEach((stage, i) => {
          if (i === 0) return;
          const startTime = i - 0.5;

          // Node styling
          pipelineTl.to(nodeRefs.current[i], {
            borderColor: '#AF0E06',
            color: '#AF0E06',
            boxShadow: '0 0 15px rgba(175,14,6,0.2)',
            duration: 0.2
          }, startTime);

          pipelineTl.to(labelRefs.current[i], { color: '#FFFFFF', duration: 0.2 }, startTime);

          // Content transition
          pipelineTl.to(contentRefs.current[i - 1], { opacity: 0, y: -20, duration: 0.4 }, startTime);

          // Enable pointer events on new content and disable on old
          pipelineTl.set(contentRefs.current[i - 1], { pointerEvents: 'none' }, startTime);
          pipelineTl.set(contentRefs.current[i], { pointerEvents: 'auto' }, startTime);

          pipelineTl.fromTo(contentRefs.current[i],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4 },
            startTime + 0.2
          );
        });
      });

      // Mobile Pipeline (Natural scroll, toggle classes)
      mm.add("(max-width: 767px)", () => {
        // Line grows with scroll
        gsap.to(progressLineMobileRef.current, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: progressLineMobileRef.current,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: 1,
          }
        });

        pipelineStages.forEach((stage, i) => {
          if (i === 0) return;

          gsap.to(nodeMobileRefs.current[i], {
            borderColor: '#AF0E06',
            color: '#AF0E06',
            boxShadow: '0 0 15px rgba(175,14,6,0.2)',
            scrollTrigger: {
              trigger: contentMobileRefs.current[i],
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          });

          gsap.to(labelMobileRefs.current[i], {
            color: '#FFFFFF',
            scrollTrigger: {
              trigger: contentMobileRefs.current[i],
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          });
        });
      });

      // 4. Certificate Reveal
      gsap.fromTo(certRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: certRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="experience-section" className="relative w-full overflow-hidden">
      {/* PINNED INTRO SECTION */}
      <div ref={pinSectionRef} className="h-screen w-full relative bg-[#F5F1EA] flex flex-col justify-center items-start page-container overflow-hidden z-0">

        <div className="relative z-10 w-full max-w-5xl">
          <div className="overflow-hidden mb-8 sm:mb-12">
            <span
              ref={labelRef}
              className="inline-block font-editorial text-xs sm:text-sm tracking-widest text-brand-red uppercase font-bold will-change-transform"
            >
              03 / EXPERIENCE
            </span>
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-4">
            <div className="overflow-hidden">
              <h2
                ref={heading2Ref}
                className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[#0A0A0A] uppercase leading-[1.05] will-change-transform"
              >
                WHERE IDEAS MEET
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2
                ref={heading3Ref}
                className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-brand-red uppercase leading-[1.05] will-change-transform"
              >
                REAL SYSTEMS.
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* DARK CONTENT SECTION */}
      <div ref={contentSectionRef} className="w-full bg-[#0A0A0A] text-[#FFFFFF] pt-12 pb-32 sm:pb-40 page-container relative z-10">

        {/* ZEEX AI Intro */}
        <div ref={zeexIntroRef} className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8 opacity-0">
          <h3 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight uppercase text-[#FFFFFF]">
            ZEEX AI
          </h3>
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <h4 className="font-editorial text-lg sm:text-xl tracking-widest text-[#FFFFFF] uppercase font-bold">
              ARTIFICIAL INTELLIGENCE INTERN
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 font-body text-xs sm:text-sm text-[#A0A0A0] uppercase tracking-wide">
              <span>MARCH 2026 — JULY 2026</span>
              <span className="hidden sm:inline text-brand-red">|</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full"></span>
                4 MONTHS
              </span>
              <span className="hidden sm:inline text-brand-red">|</span>
              <span>REMOTE · MUMBAI, INDIA</span>
            </div>
          </div>
          <p className="font-body text-sm sm:text-base text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed mt-6">
            Worked on AI speech-processing pipelines and AI-powered application integration, combining audio preprocessing, speech transcription, AI APIs, and modern web application engineering.
          </p>
        </div>

        {/* DESKTOP PIPELINE (Pinned Horizontal) */}
        <div ref={pinPipelineRef} className="hidden md:flex flex-col justify-center w-full max-w-5xl mx-auto my-12">
          <div className="text-center mb-20">
            <span className="font-editorial text-xs sm:text-sm tracking-widest text-brand-red uppercase font-bold">
              AI SPEECH PROCESSING SYSTEM
            </span>
          </div>

          <div className="relative w-full border border-[#FFFFFF]/10 rounded-lg p-12 bg-[#FFFFFF]/[0.02]">
            {/* Background Line */}
            <div className="absolute top-[4.5rem] left-12 right-12 h-[1px] bg-[#FFFFFF]/10 z-0"></div>
            {/* Active Progress Line */}
            <div ref={progressLineRef} className="absolute top-[4.5rem] left-12 right-12 h-[1px] bg-brand-red z-0 origin-left scale-x-0"></div>

            <div className="flex items-start justify-between relative z-10">
              {pipelineStages.map((stage, i) => (
                <div key={stage.id} className="flex flex-col items-center bg-[#0A0A0A] px-2">
                  <div
                    ref={el => nodeRefs.current[i] = el}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center bg-[#0A0A0A] mb-4 font-editorial text-xs font-bold transition-colors ${i === 0 ? 'border-brand-red text-brand-red shadow-[0_0_15px_rgba(175,14,6,0.2)]' : 'border-[#FFFFFF]/20 text-[#666666]'}`}
                  >
                    {stage.id}
                  </div>
                  <span
                    ref={el => labelRefs.current[i] = el}
                    className={`font-editorial text-xs tracking-widest uppercase transition-colors ${i === 0 ? 'text-[#FFFFFF]' : 'text-[#666666]'}`}
                  >
                    {stage.shortTitle}
                  </span>
                </div>
              ))}
            </div>

            {/* Pipeline Content Area */}
            <div className="relative h-56 mt-20 w-full max-w-3xl mx-auto overflow-hidden">
              {pipelineStages.map((stage, i) => (
                <div
                  key={stage.id}
                  ref={el => contentRefs.current[i] = el}
                  className={`absolute inset-0 flex flex-col items-center text-center ${i === 0 ? 'opacity-100' : 'opacity-0 translate-y-8 pointer-events-none'}`}
                >
                  <span className="font-editorial text-sm sm:text-base tracking-widest text-[#FFFFFF] uppercase font-bold mb-4">
                    {stage.title}
                  </span>
                  <p className="font-body text-sm sm:text-base text-[#A0A0A0] leading-relaxed mb-8 max-w-2xl">
                    {stage.desc}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {stage.tech.map(tech => (
                      <span key={tech} className="px-4 py-2 border border-[#FFFFFF]/10 rounded text-xs font-editorial tracking-wider text-[#FFFFFF]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE PIPELINE (Vertical Natural Scroll) */}
        <div className="md:hidden flex flex-col items-center relative mb-32 w-full max-w-lg mx-auto">
          <div className="text-center mb-12">
            <span className="font-editorial text-xs sm:text-sm tracking-widest text-brand-red uppercase font-bold">
              AI SPEECH PROCESSING SYSTEM
            </span>
          </div>

          <div className="relative border border-[#FFFFFF]/10 rounded-lg p-6 bg-[#FFFFFF]/[0.02] w-full overflow-hidden">
            {/* Background Vertical Line */}
            <div className="absolute left-[39px] top-10 bottom-10 w-[1px] bg-[#FFFFFF]/10 z-0"></div>
            {/* Active Vertical Progress Line */}
            <div ref={progressLineMobileRef} className="absolute left-[39px] top-10 w-[1px] bg-brand-red z-0 origin-top scale-y-0 h-[calc(100%-5rem)]"></div>

            <div className="flex flex-col space-y-16 relative z-10">
              {pipelineStages.map((stage, i) => (
                <div key={stage.id} className="flex flex-col items-start w-full relative" ref={el => contentMobileRefs.current[i] = el}>
                  <div className="flex items-center gap-6 mb-4 w-full bg-[#0A0A0A] py-1">
                    <div
                      ref={el => nodeMobileRefs.current[i] = el}
                      className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center bg-[#0A0A0A] font-editorial text-xs font-bold transition-colors duration-300 ${i === 0 ? 'border-brand-red text-brand-red shadow-[0_0_15px_rgba(175,14,6,0.2)]' : 'border-[#FFFFFF]/20 text-[#666666]'}`}
                    >
                      {stage.id}
                    </div>
                    <span
                      ref={el => labelMobileRefs.current[i] = el}
                      className={`font-editorial text-sm tracking-widest uppercase transition-colors duration-300 ${i === 0 ? 'text-[#FFFFFF]' : 'text-[#666666]'}`}
                    >
                      {stage.title}
                    </span>
                  </div>

                  <div className="pl-16 w-full">
                    <p className="font-body text-sm text-[#A0A0A0] leading-relaxed mb-6">
                      {stage.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {stage.tech.map(tech => (
                        <span key={tech} className="px-3 py-1.5 border border-[#FFFFFF]/10 rounded text-[10px] sm:text-xs font-editorial tracking-wider text-[#FFFFFF]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VERIFIED EXPERIENCE (Certificate) */}
        <div ref={certRef} className="max-w-4xl mx-auto flex flex-col items-center opacity-0 pt-20 md:pt-0">
          <div className="text-center mb-10 sm:mb-12">
            <h3 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] uppercase mb-4">
              VERIFIED EXPERIENCE
            </h3>
            <span className="font-editorial text-xs sm:text-sm tracking-widest text-[#888888] uppercase font-medium">
              INTERNSHIP CERTIFICATE
            </span>
          </div>

          <a
            href="/Zeex Certificate.png"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full border border-[#FFFFFF]/10 rounded-xl overflow-hidden bg-[#FFFFFF]/[0.02] p-4 sm:p-8 transition-all duration-500 hover:border-brand-red/40 hover:bg-[#FFFFFF]/[0.04]"
          >
            <div className="relative w-full aspect-[1.414/1] bg-[#0A0A0A] overflow-hidden rounded shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] border border-[#FFFFFF]/5">
              <img
                src="/Zeex Certificate.png"
                alt="Zeex AI Artificial Intelligence Internship Certificate - Sahil Gupta"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <span className="inline-flex items-center gap-2 font-editorial text-sm tracking-widest text-[#FFFFFF] uppercase font-bold group-hover:text-brand-red transition-colors duration-300">
                VIEW FULL CERTIFICATE
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </span>
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}
