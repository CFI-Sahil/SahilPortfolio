import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa6';
import { Mail, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  {
    id: '01',
    label: 'LINKEDIN',
    handle: 'cfi-sahil',
    href: 'https://linkedin.com/in/cfi-sahil',
    icon: FaLinkedinIn,
    ariaLabel: 'Sahil Gupta on LinkedIn',
  },
  {
    id: '02',
    label: 'GITHUB',
    handle: 'CFI-Sahil',
    href: 'https://github.com/CFI-Sahil',
    icon: FaGithub,
    ariaLabel: 'Sahil Gupta on GitHub',
  },
  {
    id: '03',
    label: 'EMAIL',
    handle: 'guptasahil8361@gmail.com',
    href: 'mailto:guptasahil8361@gmail.com',
    icon: Mail,
    ariaLabel: 'Email Sahil Gupta',
  },
  {
    id: '04',
    label: 'INSTAGRAM',
    handle: 'blackmist_sahil',
    href: 'https://instagram.com/blackmist_sahil',
    icon: FaInstagram,
    ariaLabel: 'Sahil Gupta on Instagram',
  },
];

export default function Connect() {
  const containerRef = useRef(null);
  const labelRef = useRef(null);
  const thankRef = useRef(null);
  const youRef = useRef(null);
  const attentionRef = useRef(null);
  const linksContainerRef = useRef(null);
  const portraitWrapRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });



      // Phase 2: Giant THANK reveals upward
      tl.fromTo(
        thankRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.4'
      );

      // Phase 3: YOU. follows
      tl.fromTo(
        youRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.8'
      );

      // Phase 4: "for your attention" enters separately
      tl.fromTo(
        attentionRef.current,
        { opacity: 0, x: -30, y: 30, rotation: -6 },
        { opacity: 1, x: 0, y: 0, rotation: -3, duration: 1, ease: 'power3.out' },
        '-=0.6'
      );

      // Phase 5: Portrait Reveal
      tl.fromTo(
        portraitWrapRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        '-=0.8'
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full h-[100vh] sm:h-[100vh] lg:h-[100vh] bg-[#0A0A0A] text-[#F5F1EA] pt-16 sm:pt-20 lg:pt-24 flex flex-col overflow-hidden select-none"
    >
      {/* Subtle Atmospheric Red Halo behind the portrait */}
      <div
        className="pointer-events-none absolute left-[-10%] top-[20%] w-[40rem] lg:w-[60rem] h-[40rem] lg:h-[60rem] rounded-full opacity-[0.12] blur-[140px]"
        style={{
          background: 'radial-gradient(circle, #AF0E06 0%, rgba(10,10,10,0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Main Spread Container */}
      <div className="w-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex flex-col flex-1 h-full">



        {/* ======================================================= */}
        {/* EDITORIAL STAGE                                         */}
        {/* ======================================================= */}
        <div className="flex-1 relative w-full flex flex-col lg:flex-row lg:items-end mt-4 lg:mt-8">

          {/* GIANT TYPOGRAPHY - Centered/Right */}
          <div className="absolute inset-0 flex flex-col justify-start lg:items-end lg:justify-start pt-[15vh] sm:pt-[20vh] lg:pt-[18vh] z-10 pointer-events-none pb-32 lg:pb-0 lg:pr-[10%] xl:pr-[16%]">
            <div className="relative inline-block text-center lg:text-left">

              <h2 className="font-display text-[clamp(6.5rem,14vw,20rem)] font-bold tracking-tight uppercase leading-[0.85] lg:leading-[0.8] z-10 relative">
                <span ref={thankRef} className="block text-[#F5F1EA]">
                  THANK
                </span>
                <span ref={youRef} className="block text-brand-red lg:pl-[1.5em]">
                  YOU.
                </span>
              </h2>

              {/* OVERLAPPING "for your attention" */}
              <div
                ref={attentionRef}
                className="absolute left-[10%] sm:left-[25%] lg:left-[5%] bottom-[15%] sm:bottom-[20%] lg:bottom-[22%] z-40 transform -rotate-3"
              >
                <span
                  className="font-editorial italic text-3xl sm:text-5xl md:text-6xl text-transparent lowercase tracking-wide whitespace-nowrap drop-shadow-2xl"
                  style={{ WebkitTextStroke: '1px #F5F1EA' }}
                >
                  for your attention
                </span>
              </div>
            </div>
          </div>

          {/* PORTRAIT - Left */}
          <div className="relative z-20 w-full lg:w-[50%] flex items-end justify-center lg:justify-center pointer-events-none order-2 lg:order-1 mt-auto h-[50vh] sm:h-[60vh] lg:h-auto lg:min-h-[75vh]">
            <div
              ref={portraitWrapRef}
              className="relative w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[360px] flex items-end justify-center pointer-events-auto overflow-hidden lg:overflow-visible h-full lg:ml-[15%]"
            >
              <img
                src="/2FinalPic-Photoroom.webp"
                alt="Sahil Gupta — AI Developer & Full-Stack Engineer"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] will-change-transform"
                loading="lazy"
                decoding="async"
                width="360"
                height="500"
              />
            </div>
          </div>



        </div>



      </div>
    </section>
  );
}
