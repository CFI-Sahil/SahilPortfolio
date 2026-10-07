import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProfileCard from './ProfileCard';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const TECHNICAL_CAPABILITIES = [
  {
    category: 'AI SYSTEMS',
    details: 'LLMs · Speech AI · AI Integration',
  },
  {
    category: 'FULL-STACK',
    details: 'React · FastAPI · REST APIs',
  },
  {
    category: 'SYSTEMS',
    details: 'Architecture · Data Flow · Cloud',
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const cardWrapperRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const mindsetLabelRef = useRef(null);
  const mindsetTextRef = useRef(null);
  const techItemsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. ProfileCard gentle section entrance
      if (cardWrapperRef.current) {
        gsap.fromTo(
          cardWrapperRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Right-column editorial text reveals
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Section Marker & Heading
      tl.fromTo(
        labelRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      )
        .fromTo(
          headingRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )
        // Engineering Mindset Subsection
        .fromTo(
          [mindsetLabelRef.current, mindsetTextRef.current],
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.2'
        )
        // Technical Identity Strip
        .fromTo(
          techItemsRef.current.filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.2'
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#F5F1EA] text-[#0A0A0A] py-24 sm:py-28 md:py-36 border-t border-[#0A0A0A]/8 overflow-hidden"
    >
      <div className="w-full page-container">
        {/* Two-Column Editorial Layout */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 sm:gap-16 lg:gap-20">
          {/* LEFT COLUMN: Sticky React Bits ProfileCard */}
          <div
            ref={cardWrapperRef}
            className="w-full lg:w-[42%] flex justify-center lg:justify-start lg:sticky lg:top-28 sm:lg:top-32 px-5 sm:px-0 will-change-transform z-10"
          >
            <ProfileCard
              avatarUrl="/about-portrait.webp"
              name="SAHIL GUPTA"
              title="AI / FULL-STACK ENGINEER"
              handle="cfi-sahil"
              status="Building Intelligent Systems"
              contactText="VIEW RESUME"
              onContactClick={() => window.open('/Sahil_Gupta_Resume.pdf', '_blank')}
              showUserInfo={true}
              enableTilt={true}
              behindGlowEnabled={true}
            />
          </div>

          {/* RIGHT COLUMN: Editorial Narrative & Engineering Identity */}
          <div className="w-full lg:w-[58%] flex flex-col space-y-12 sm:space-y-16">
            {/* 1. Header Group */}
            <div className="space-y-3">
              <div className="overflow-hidden">
                <span
                  ref={labelRef}
                  className="inline-block font-editorial text-xs sm:text-sm tracking-widest text-brand-red uppercase font-bold will-change-transform"
                >
                  01 / ABOUT
                </span>
              </div>

              <div className="overflow-hidden">
                <h2
                  ref={headingRef}
                  className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0A0A0A] uppercase leading-[1] will-change-transform"
                >
                  ABOUT ME
                </h2>
              </div>
            </div>

            {/* 2. Narrative Paragraphs */}
            <div className="space-y-6 sm:space-y-7 text-[#222222] font-body text-base sm:text-lg md:text-xl leading-relaxed">
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur={true}
                baseRotation={3}
                blurStrength={4}
                rotationEnd="bottom 40%"
                wordAnimationEnd="bottom 40%"
                textClassName="whitespace-pre-wrap will-change-transform"
              >{`I'm Sahil Gupta, an AI-focused full-stack engineer who enjoys building intelligent digital products from the ground up.

My approach goes beyond writing code. I care about how a system works — from architecture and data flow to AI integration, performance, and the experience users actually interact with.

I work across AI, web development, and modern application engineering, turning ideas into systems that are functional, scalable, and thoughtfully designed.`}</ScrollReveal>
            </div>

            {/* 3. Engineering Mindset Subsection */}
            <div className="pt-4 border-t border-[#0A0A0A]/10 space-y-3">
              <div className="overflow-hidden">
                <span
                  ref={mindsetLabelRef}
                  className="inline-block font-editorial text-xs sm:text-sm tracking-widest text-brand-red uppercase font-bold will-change-transform"
                >
                  ENGINEERING MINDSET
                </span>
              </div>

              <p
                ref={mindsetTextRef}
                className="font-body text-base sm:text-lg text-[#1A1A1A] font-medium leading-relaxed will-change-transform"
              >
                &ldquo;I don&apos;t just focus on what gets built. I focus on why it works, how the pieces connect, and how the system can evolve.&rdquo;
              </p>
            </div>

            {/* 4. Technical Identity Specification Strip */}
            <div className="pt-4 space-y-4">
              <div className="border-t border-[#0A0A0A]/10">
                {TECHNICAL_CAPABILITIES.map((item, index) => (
                  <div
                    key={item.category}
                    ref={(el) => (techItemsRef.current[index] = el)}
                    className="py-4 border-b border-[#0A0A0A]/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 will-change-transform group hover:border-[#0A0A0A]/30 transition-colors duration-200"
                  >
                    <span className="font-display text-sm sm:text-base font-bold tracking-wider text-[#0A0A0A] uppercase shrink-0">
                      {item.category}
                    </span>
                    <span className="font-body text-xs sm:text-sm font-medium tracking-wide text-[#555555] group-hover:text-brand-red transition-colors duration-200">
                      {item.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
