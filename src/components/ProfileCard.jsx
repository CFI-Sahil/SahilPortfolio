'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg, #161c2e 0%, #0a0d18 100%)';
const DEFAULT_GRAIN_URL = `data:image/svg+xml;utf8,<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><filter id='stardustNoise'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -13'/></filter><rect width='100%25' height='100%25' filter='url(%23stardustNoise)'/></svg>`;

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCardComponent = ({
  avatarUrl = '/about-portrait.webp',
  iconUrl = '',
  grainUrl = '',
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor = 'rgba(70, 110, 200, 0.45)',
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'SAHIL GUPTA',
  title = 'AI / FULL-STACK ENGINEER',
  handle = 'cfi-sahil',
  status = 'Building Intelligent Systems',
  contactText = 'VIEW RESUME',
  showUserInfo = true,
  onContactClick
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);

  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`,
        '--card-opacity': '1'
      };

      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = ts => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x, y) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      }
    };
  }, [enableTilt]);

  const getOffsets = (evt, el) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    event => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    event => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add('active');
      shell.classList.add('entering');
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove('entering');
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(
    event => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight
      );

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    shell.addEventListener('pointerenter', pointerMoveHandler);
    shell.addEventListener('pointermove', pointerMoveHandler);
    shell.addEventListener('pointerleave', pointerLeaveHandler);

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      const anyMotion = window.DeviceMotionEvent;
      if (anyMotion && typeof anyMotion.requestPermission === 'function') {
        anyMotion
          .requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };
    shell.addEventListener('click', handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', pointerEnterHandler);
      shell.removeEventListener('pointermove', pointerMoveHandler);
      shell.removeEventListener('pointerleave', pointerLeaveHandler);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove('entering');
    };
  }, [
    enableTilt,
    enableMobileTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation
  ]);

  const cardRadius = '28px';

  const cardStyle = useMemo(
    () => ({
      '--icon': iconUrl ? `url(${iconUrl})` : 'none',
      '--grain': grainUrl ? `url(${grainUrl})` : `url("${DEFAULT_GRAIN_URL}")`,
      '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
      '--behind-glow-color': behindGlowColor ?? 'rgba(70, 110, 200, 0.45)',
      '--behind-glow-size': behindGlowSize ?? '50%',
      '--pointer-x': '50%',
      '--pointer-y': '50%',
      '--pointer-from-center': '0',
      '--pointer-from-top': '0.5',
      '--pointer-from-left': '0.5',
      '--card-opacity': '0',
      '--rotate-x': '0deg',
      '--rotate-y': '0deg',
      '--background-x': '50%',
      '--background-y': '50%',
      '--card-radius': cardRadius
    }),
    [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize, cardRadius]
  );

  const handleContactClick = useCallback((e) => {
    if (onContactClick) {
      onContactClick(e);
    } else {
      const contactEl = document.querySelector('#contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [onContactClick]);

  // Specular radial flare that follows the mouse
  const glareStyle = {
    transform: 'translate3d(0, 0, 1.1px)',
    overflow: 'hidden',
    backgroundImage: `
      radial-gradient(
        farthest-corner circle at var(--pointer-x) var(--pointer-y),
        hsla(215, 80%, 75%, 0.35) 10%,
        hsla(240, 50%, 40%, 0.15) 45%,
        transparent 75%
      )
    `.replace(/\s+/g, ' '),
    mixBlendMode: 'screen',
    filter: 'brightness(1.05) contrast(1.15)',
    zIndex: 3,
    gridArea: '1 / -1',
    borderRadius: cardRadius,
    pointerEvents: 'none'
  };

  return (
    <div
      ref={wrapRef}
      className={`relative touch-none select-none ${className}`.trim()}
      style={{ perspective: '500px', transform: 'translate3d(0, 0, 0.1px)', ...cardStyle }}
    >
      <style>{`
        @keyframes shineContinuous {
          0% { transform: rotate(45deg) translateX(-50%); }
          100% { transform: rotate(45deg) translateX(0%); }
        }
        .animate-shine-ray {
          animation: shineContinuous 7s linear infinite;
        }
      `}</style>
      {behindGlowEnabled && (
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color) 0%, transparent var(--behind-glow-size))`,
            filter: 'blur(50px) saturate(1.2)',
            opacity: 'calc(0.85 * var(--card-opacity))'
          }}
        />
      )}
      <div ref={shellRef} className="relative z-[1] group">
        <section
          className="grid relative overflow-hidden backface-hidden"
          style={{
            height: '80svh',
            maxHeight: '540px',
            aspectRatio: '0.718',
            borderRadius: cardRadius,
            boxShadow:
              'rgba(0, 0, 0, 0.75) calc((var(--pointer-from-left) * 10px) - 3px) calc((var(--pointer-from-top) * 20px) - 6px) 24px -5px',
            transition: 'transform 1s ease',
            transform: 'translateZ(0) rotateX(0deg) rotateY(0deg)',
            background: 'linear-gradient(180deg, #182035 0%, #0a0d18 100%)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transition = 'none';
            e.currentTarget.style.transform = 'translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))';
          }}
          onMouseLeave={e => {
            const shell = shellRef.current;
            if (shell?.classList.contains('entering')) {
              e.currentTarget.style.transition = 'transform 180ms ease-out';
            } else {
              e.currentTarget.style.transition = 'transform 1s ease';
            }
            e.currentTarget.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'var(--inner-gradient)',
              backgroundColor: '#0c101d',
              borderRadius: cardRadius,
              display: 'grid',
              gridArea: '1 / -1'
            }}
          >
            {/* Continuous animated diagonal light rays */}
            <div 
              className="absolute inset-0 overflow-hidden pointer-events-none z-[3]"
              style={{ borderRadius: cardRadius, gridArea: '1 / -1' }}
            >
              <div
                className="absolute animate-shine-ray"
                style={{
                  top: '-100%',
                  left: '-100%',
                  width: '300%',
                  height: '300%',
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent 0%,
                    transparent 10%,
                    rgba(255, 255, 255, 0.0) 13%,
                    rgba(255, 255, 255, 0.12) 15%,
                    rgba(255, 255, 255, 0.0) 17%,
                    transparent 20%,
                    
                    transparent 30%,
                    rgba(255, 255, 255, 0.0) 33%,
                    rgba(255, 255, 255, 0.22) 35%,
                    rgba(255, 255, 255, 0.0) 37%,
                    transparent 40%,

                    transparent 50%
                  )`,
                  mixBlendMode: 'screen',
                }}
              />
            </div>

            {/* Radial hover flare */}
            <div style={glareStyle} />

            {/* Stardust particle sparkle layer (Reveals dynamically on pointer movement & hover) */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
              style={{
                backgroundImage: `url("${DEFAULT_GRAIN_URL}")`,
                backgroundSize: '150px 150px',
                backgroundRepeat: 'repeat',
                mixBlendMode: 'color-dodge',
                opacity: 'calc(0.95 * var(--pointer-from-center, 0))',
                filter: 'brightness(1.5) contrast(2)',
                transform: 'translate3d(0, 0, 1.2px)',
                borderRadius: cardRadius,
                gridArea: '1 / -1',
                zIndex: 4
              }}
            />

            {/* Avatar content */}
            <div
              className="overflow-visible backface-hidden"
              style={{
                transform: 'translateZ(2px)',
                gridArea: '1 / -1',
                borderRadius: cardRadius,
                pointerEvents: 'none'
              }}
            >
              <img
                className="w-full absolute left-1/2 bottom-0 backface-hidden will-change-transform transition-transform duration-[120ms] ease-out object-cover object-top"
                src={avatarUrl}
                alt={`${name || 'Sahil Gupta'} avatar`}
                loading="lazy"
                decoding="async"
                style={{
                  height: '100%',
                  transformOrigin: '50% 100%',
                  transform:
                    'translateX(calc(-50% + (var(--pointer-from-left) - 0.5) * 6px)) translateZ(0) scaleY(calc(1 + (var(--pointer-from-top) - 0.5) * 0.02)) scaleX(calc(1 + (var(--pointer-from-left) - 0.5) * 0.01))',
                  borderRadius: cardRadius
                }}
                onError={e => {
                  const t = e.target;
                  t.style.display = 'none';
                }}
              />

              {/* Bottom vignette overlay */}
              <div
                className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a0d18] via-[#0a0d18]/60 to-transparent z-[1] pointer-events-none"
                style={{ borderRadius: `0 0 ${cardRadius} ${cardRadius}` }}
              />

              {showUserInfo && (
                <div
                  className="absolute z-[2] flex items-center justify-between backdrop-blur-[24px] border border-white/10 pointer-events-auto shadow-2xl"
                  style={{
                    '--ui-inset': '16px',
                    '--ui-radius-bias': '6px',
                    bottom: 'var(--ui-inset)',
                    left: 'var(--ui-inset)',
                    right: 'var(--ui-inset)',
                    background: 'rgba(15, 20, 35, 0.72)',
                    borderRadius: 'calc(max(0px, var(--card-radius) - var(--ui-inset) + var(--ui-radius-bias)))',
                    padding: '12px 14px'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-full overflow-hidden border border-white/15 flex-shrink-0"
                      style={{ width: '42px', height: '42px' }}
                    >
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={miniAvatarUrl || avatarUrl}
                        alt={`${name || 'User'} mini avatar`}
                        loading="lazy"
                        decoding="async"
                        style={{ display: 'block', gridArea: 'auto', borderRadius: '50%', pointerEvents: 'auto' }}
                        onError={e => {
                          const t = e.target;
                          t.style.opacity = '0.5';
                          t.src = avatarUrl;
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <div className="text-xs sm:text-sm font-medium text-white/95 leading-none font-mono">@{handle}</div>
                      <div className="text-[11px] text-white/70 leading-none font-body">{status}</div>
                    </div>
                  </div>
                  <button
                    className="border border-white/15 bg-white/10 hover:bg-white/20 rounded-lg px-3.5 py-2.5 text-[11px] font-semibold text-white/95 cursor-pointer backdrop-blur-[10px] transition-all duration-200 ease-out hover:border-white/30 hover:-translate-y-px active:scale-95 shadow-sm"
                    onClick={handleContactClick}
                    style={{ pointerEvents: 'auto', display: 'block', gridArea: 'auto', borderRadius: '8px' }}
                    type="button"
                    aria-label={`Contact ${name || 'user'}`}
                  >
                    {contactText}
                  </button>
                </div>
              )}
            </div>

            {/* Header Details content */}
            <div
              className="max-h-full overflow-hidden text-center relative z-[5]"
              style={{
                transform:
                  'translate3d(calc(var(--pointer-from-left) * -6px + 3px), calc(var(--pointer-from-top) * -6px + 3px), 0.1px)',
                gridArea: '1 / -1',
                borderRadius: cardRadius,
                pointerEvents: 'none'
              }}
            >
              <div className="w-full absolute flex flex-col items-center" style={{ top: '2.5rem', display: 'flex', gridArea: 'auto' }}>
                <h3
                  className="font-medium tracking-tight m-0 text-white"
                  style={{
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                    backgroundImage: 'linear-gradient(to bottom, #FFFFFF 60%, rgba(200, 220, 255, 0.8) 100%)',
                    backgroundSize: '100%',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    display: 'block',
                    gridArea: 'auto',
                    borderRadius: '0',
                    pointerEvents: 'auto',
                    lineHeight: '1.1'
                  }}
                >
                  {name}
                </h3>
                <p
                  className="font-normal text-xs sm:text-sm tracking-wide text-white/75 mx-auto pt-1"
                  style={{
                    margin: '0 auto',
                    display: 'block',
                    gridArea: 'auto',
                    pointerEvents: 'auto'
                  }}
                >
                  {title}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
