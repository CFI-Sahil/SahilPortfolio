import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mail, ArrowUpRight } from 'lucide-react';
import { FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa6';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'ABOUT', href: '#about' },
  { label: 'STACK', href: '#stack' },
  { label: 'EXPERIENCE', href: '#experience-section' },
  { label: 'WORK', href: '#work-section' },
];

const SOCIAL_LINKS = [
  {
    id: '01',
    label: 'LINKEDIN',
    href: 'https://linkedin.com/in/cfi-sahil',
    icon: FaLinkedinIn,
    ariaLabel: 'Sahil Gupta on LinkedIn',
  },
  {
    id: '02',
    label: 'GITHUB',
    href: 'https://github.com/CFI-Sahil',
    icon: FaGithub,
    ariaLabel: 'Sahil Gupta on GitHub',
  },
  {
    id: '03',
    label: 'EMAIL',
    href: 'mailto:guptasahil8361@gmail.com',
    icon: Mail,
    ariaLabel: 'Email Sahil Gupta',
  },
  {
    id: '04',
    label: 'INSTAGRAM',
    href: 'https://instagram.com/blackmist_sahil',
    icon: FaInstagram,
    ariaLabel: 'Sahil Gupta on Instagram',
  },
];

export default function Navbar({ isVisible = true }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isContactOverlayOpen, setIsContactOverlayOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const headerRef = useRef(null);
  const lastScrollY = useRef(0);
  const isNavbarHiddenRef = useRef(false);
  const mobileMenuOpenRef = useRef(mobileMenuOpen);

  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen;
    if (mobileMenuOpen && isNavbarHiddenRef.current && headerRef.current) {
      isNavbarHiddenRef.current = false;
      gsap.to(headerRef.current, {
        yPercent: 0,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: true,
      });
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const threshold = 10; // 8-12px threshold to prevent jitter

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Theme / Background state transition (past Hero threshold)
      if (currentScrollY > 60) {
        setIsScrolled((prev) => (!prev ? true : prev));
      } else {
        setIsScrolled((prev) => (prev ? false : prev));
      }

      // 2. If mobile menu is open, keep navbar visible
      if (mobileMenuOpenRef.current) {
        if (isNavbarHiddenRef.current && headerRef.current) {
          isNavbarHiddenRef.current = false;
          gsap.to(headerRef.current, {
            yPercent: 0,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true,
          });
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      // 3. Top of page: always visible
      if (currentScrollY <= 10) {
        if (isNavbarHiddenRef.current && headerRef.current) {
          isNavbarHiddenRef.current = false;
          gsap.to(headerRef.current, {
            yPercent: 0,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true,
          });
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      // 4. Direction detection with threshold
      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) < threshold) {
        return;
      }

      if (diff > 0) {
        // Scrolling DOWN -> Hide Navbar smoothly upward
        if (!isNavbarHiddenRef.current && headerRef.current) {
          isNavbarHiddenRef.current = true;
          gsap.to(headerRef.current, {
            yPercent: -100,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true,
          });
        }
      } else {
        // Scrolling UP -> Show Navbar smoothly downward
        if (isNavbarHiddenRef.current && headerRef.current) {
          isNavbarHiddenRef.current = false;
          gsap.to(headerRef.current, {
            yPercent: 0,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true,
          });
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenContact = () => setIsContactOverlayOpen(true);
    window.addEventListener('open-contact-overlay', handleOpenContact);
    return () => window.removeEventListener('open-contact-overlay', handleOpenContact);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id === 'hero' ? '' : entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    NAV_LINKS.forEach((link) => {
      const id = link.href.substring(1);
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const heroElement = document.getElementById('hero');
    if (heroElement) observer.observe(heroElement);

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setIsContactOverlayOpen(true);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 will-change-transform transition-[background-color,border-color,padding,opacity] duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
          } ${isScrolled
            ? 'bg-[#F5F1EA]/92 backdrop-blur-md border-b border-[#0A0A0A]/8 py-3.5 shadow-sm'
            : 'bg-transparent py-6 lg:py-7'
          }`}
      >
        <div className="w-full px-[var(--page-padding)] flex items-center justify-between">
          {/* Brand Left */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className={`group flex items-center gap-2.5 font-display font-medium text-lg sm:text-xl tracking-tight transition-colors ${(isScrolled || mobileMenuOpen) ? 'text-[#0A0A0A] hover:text-[#333333]' : 'text-white hover:text-off-white'
              }`}
          >
            <img
              src="/transparentLogoDark.png"
              alt="SG Logo"
              className="h-7 sm:h-8 w-auto max-w-[32px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span>SAHIL GUPTA</span>
          </a>

          {/* Desktop Center Navigation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-body text-xs lg:text-sm tracking-wider transition-colors duration-200 ${isActive
                      ? 'text-brand-red font-semibold'
                      : isScrolled
                        ? 'text-[#333333] hover:text-[#0A0A0A] font-medium'
                        : 'text-off-white/80 hover:text-white'
                    }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleContactClick}
              className="inline-flex items-center justify-center px-4 py-2 bg-brand-red hover:bg-[#e01900] text-white font-body text-xs font-medium tracking-wider rounded transition-colors duration-200 shadow-sm cursor-pointer"
            >
              LET&apos;S CONNECT
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`p-2 focus:outline-none transition-colors cursor-pointer ${isScrolled ? 'text-[#0A0A0A] hover:text-[#333333]' : 'text-off-white hover:text-white'
                }`}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="text-[#0A0A0A] w-7 h-7 sm:w-8 sm:h-8" /> : <Menu className="w-7 h-7 sm:w-8 sm:h-8" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-30 bg-[#F5F1EA]/98 backdrop-blur-xl pt-28 px-[var(--page-padding)] flex flex-col justify-between pb-12 md:hidden"
          >
            <div className="space-y-6">
              <span className="font-editorial text-xs tracking-widest text-brand-red uppercase">
                Navigation
              </span>
              <div className="flex flex-col space-y-5">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`font-display text-2xl font-medium tracking-tight transition-colors ${isActive ? 'text-brand-red font-bold' : 'text-[#0A0A0A] hover:text-brand-red'
                        }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="pt-8 border-t border-[#0A0A0A]/10">
              <button
                onClick={handleContactClick}
                className="w-full py-3.5 bg-brand-red hover:bg-[#e01900] text-white font-body text-sm font-medium tracking-wider rounded flex items-center justify-center transition-colors cursor-pointer"
              >
                LET&apos;S CONNECT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Overlay */}
      <AnimatePresence>
        {isContactOverlayOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col justify-center items-center select-none"
          >
            <button
              onClick={() => setIsContactOverlayOpen(false)}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 text-[#F5F1EA]/50 hover:text-brand-red transition-colors p-2 cursor-pointer outline-none"
              aria-label="Close Contact Overlay"
            >
              <motion.div whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                <X size={32} strokeWidth={1.5} />
              </motion.div>
            </button>

            <div className="w-full max-w-lg px-6 sm:px-12 flex flex-col mt-12 sm:mt-0">
              <div className="font-editorial text-xs sm:text-sm tracking-[0.2em] text-[#F5F1EA]/50 uppercase mb-8 pl-2">
                CONNECT
              </div>

              <ul className="flex flex-col border-t border-white/10 w-full">
                {SOCIAL_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.id} className="group">
                      <a
                        href={link.href}
                        target={link.id === '03' ? '_self' : '_blank'}
                        rel={link.id === '03' ? undefined : 'noopener noreferrer'}
                        aria-label={link.ariaLabel}
                        onClick={() => setIsContactOverlayOpen(false)}
                        className="flex items-center justify-between py-6 border-b border-white/10 hover:border-brand-red/50 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-5 sm:gap-6 pl-2">
                          <span className="font-editorial text-xs text-white/30 group-hover:text-brand-red transition-colors duration-300">
                            {link.id}
                          </span>
                          <span className="font-display text-xl sm:text-2xl tracking-[0.15em] uppercase font-semibold text-[#F5F1EA] group-hover:text-white group-hover:translate-x-2 transition-transform duration-300">
                            {link.label}
                          </span>
                        </div>
                        <div className="pr-2 flex items-center gap-4 sm:gap-5 text-white/30 group-hover:text-brand-red transition-all duration-300">
                          <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                          <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
