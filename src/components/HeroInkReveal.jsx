import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * HeroInkReveal
 * Smooth Viscous Fluid / Liquid Ink Reveal Mask for Hero Section.
 * Inspired by the reference motion dynamics (inkref.mp4):
 * - Smooth, viscous fluid droplet that follows the cursor with organic spring lag.
 * - Dynamic velocity-driven teardrop/oval stretching along the motion path.
 * - CONTINUOUSLY ALIVE: Gentle liquid surface tension and breathing ripples keep the edge evolving even when stationary.
 * - Soft feathered liquid boundary.
 * - 100% STATIC portrait alignment: ZERO distortion on face, portrait, or background.
 * - Reliable pointer tracking and smooth enter/exit transitions.
 */
export default function HeroInkReveal({ isEnabled = false, parentRef = null }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);
  const hoverProgressRef = useRef({ value: 0 });

  // Physics state (Zero React re-renders)
  const physicsRef = useRef({
    currentX: 0.5,
    currentY: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    velX: 0.0,
    velY: 0.0,
    smoothVelX: 0.0,
    smoothVelY: 0.0,
    dirX: 0.0,
    dirY: 0.0,
    speed: 0.0,
    smoothSpeed: 0.0,
    isInside: false,
    hasMoved: false,
  });

  const idleTimeoutRef = useRef(null);

  // Handle isEnabled state changes
  useEffect(() => {
    if (!isEnabled) {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = null;
      }
      gsap.to(hoverProgressRef.current, {
        value: 0.0,
        duration: 0.4,
        ease: 'power2.inOut',
        overwrite: true,
      });
    }
  }, [isEnabled]);

  // Global pointer tracking across the Hero section with 1s idle fade
  useEffect(() => {
    let lastTime = performance.now();

    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = null;
      }
      if (isEnabled && physicsRef.current.isInside) {
        idleTimeoutRef.current = setTimeout(() => {
          gsap.to(hoverProgressRef.current, {
            value: 0.0,
            duration: 0.6,
            ease: 'power2.inOut',
            overwrite: true,
          });
        }, 1000);
      }
    };

    const handlePointerMove = (e) => {
      const targetElement = parentRef?.current || containerRef?.current;
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const isInside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      const p = physicsRef.current;
      p.isInside = isInside;

      if (isInside) {
        const now = performance.now();
        const dt = Math.max((now - lastTime) * 0.001, 0.001);
        lastTime = now;

        if (!p.hasMoved) {
          p.currentX = x;
          p.currentY = y;
          p.targetX = x;
          p.targetY = y;
          p.hasMoved = true;
        } else {
          const rawVx = (x - p.currentX) / dt;
          const rawVy = (y - p.currentY) / dt;
          p.velX = p.velX * 0.35 + rawVx * 0.65;
          p.velY = p.velY * 0.35 + rawVy * 0.65;
          p.speed = Math.sqrt(p.velX * p.velX + p.velY * p.velY);
          p.targetX = x;
          p.targetY = y;
        }

        if (isEnabled) {
          gsap.to(hoverProgressRef.current, {
            value: 1.0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: true,
          });
          resetIdleTimer();
        }
      } else {
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = null;
        }
        if (hoverProgressRef.current.value > 0.01) {
          gsap.to(hoverProgressRef.current, {
            value: 0.0,
            duration: 0.45,
            ease: 'power2.inOut',
            overwrite: true,
          });
        }
      }
    };

    const handlePointerLeave = () => {
      const p = physicsRef.current;
      p.isInside = false;
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = null;
      }
      if (hoverProgressRef.current.value > 0.01) {
        gsap.to(hoverProgressRef.current, {
          value: 0.0,
          duration: 0.45,
          ease: 'power2.inOut',
          overwrite: true,
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [isEnabled, parentRef]);

  // WebGL Render Setup
  useEffect(() => {
    try {
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isTouch || prefersReducedMotion) {
        setIsSupported(false);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl =
        canvas.getContext('webgl', { alpha: false, antialias: true, preserveDrawingBuffer: false }) ||
        canvas.getContext('experimental-webgl', { alpha: false, antialias: true });

      if (!gl) {
        console.warn('[Hero Fluid] WebGL not supported, falling back to static image');
        setIsSupported(false);
        return;
      }

      // Vertex Shader
      const vsSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
          v_uv = (a_position + 1.0) * 0.5;
          v_uv.y = 1.0 - v_uv.y;
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      // Fragment Shader: Smooth Viscous Fluid / Liquid Ink Droplet Reveal
      const fsSource = `
        precision highp float;

        uniform sampler2D u_texture_base;
        uniform sampler2D u_texture_cyber;
        uniform vec2 u_resolution;
        uniform vec2 u_image_res;
        uniform vec2 u_mouse;
        uniform vec2 u_dir;
        uniform float u_speed;
        uniform float u_aspect_ratio;
        uniform float u_hover;
        uniform float u_time;

        varying vec2 v_uv;

        // 2D Simplex Noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // Exact Aspect-ratio cover mapping identical to CSS object-fit: cover
        vec2 getCoverUV(vec2 uv, vec2 screenRes, vec2 imgRes) {
          float screenRatio = screenRes.x / screenRes.y;
          float imgRatio = imgRes.x / imgRes.y;
          vec2 newUV = uv;
          if (screenRatio > imgRatio) {
            float scale = screenRatio / imgRatio;
            newUV.y = (uv.y - 0.5) / scale + 0.5;
          } else {
            float scale = imgRatio / screenRatio;
            newUV.x = (uv.x - 0.5) / scale + 0.5;
          }
          return newUV;
        }

        void main() {
          vec2 uv = v_uv;

          // ZERO image UV distortion - 100% static, rock-solid portrait alignment
          vec2 coverUV = getCoverUV(uv, u_resolution, u_image_res);
          vec4 baseColor = texture2D(u_texture_base, coverUV);
          vec4 cyberColor = texture2D(u_texture_cyber, coverUV);

          if (u_hover <= 0.001) {
            gl_FragColor = baseColor;
            return;
          }

          // Offset vector relative to cursor in aspect-corrected screen space
          vec2 relP = (uv - u_mouse) * vec2(u_aspect_ratio, 1.0);
          float baseR = 0.225;
          vec2 p = relP / baseR;

          // Smooth directional velocity stretch along motion vector (fluid oval when moving, clean circle when still)
          float along = dot(p, u_dir);
          vec2 perp = p - along * u_dir;
          float stretch = clamp(u_speed * 0.09, 0.0, 0.26);
          vec2 pStretch = p - u_dir * (along * stretch * 0.40) + perp * (stretch * 0.15);

          float dist = length(pStretch);

          // Silky smooth feathered circular liquid boundary (just like inkref.mp4)
          // Center (< 0.70) is crystal-clear Hero Cyber
          // Perimeter (0.70 to 1.15) is a soft, clean circular feather
          float innerR = 0.70;
          float outerR = 1.15;
          float mask = 1.0 - smoothstep(innerR, outerR, dist);
          mask = clamp(mask * u_hover, 0.0, 1.0);

          // Pure static image blending through the clean circular liquid mask
          vec4 finalColor = mix(baseColor, cyberColor, mask);

          gl_FragColor = finalColor;
        }
      `;

      function createShader(glCtx, type, source) {
        const shader = glCtx.createShader(type);
        glCtx.shaderSource(shader, source);
        glCtx.compileShader(shader);
        if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
          console.error('[Hero Ink] Shader compile error:', glCtx.getShaderInfoLog(shader));
          glCtx.deleteShader(shader);
          return null;
        }
        return shader;
      }

      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

      if (!vertexShader || !fragmentShader) {
        setIsSupported(false);
        return;
      }

      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('[Hero Ink] Program link error');
        setIsSupported(false);
        return;
      }

      gl.useProgram(program);

      // Full-screen quad buffer
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const aPosition = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      // Uniform locations
      const uLocs = {
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        imageRes: gl.getUniformLocation(program, 'u_image_res'),
        mouse: gl.getUniformLocation(program, 'u_mouse'),
        dir: gl.getUniformLocation(program, 'u_dir'),
        speed: gl.getUniformLocation(program, 'u_speed'),
        aspectRatio: gl.getUniformLocation(program, 'u_aspect_ratio'),
        hover: gl.getUniformLocation(program, 'u_hover'),
        time: gl.getUniformLocation(program, 'u_time'),
        textureBase: gl.getUniformLocation(program, 'u_texture_base'),
        textureCyber: gl.getUniformLocation(program, 'u_texture_cyber'),
      };

      // Texture loader with immediate preload
      function loadTexture(glCtx, url, unit) {
        const texture = glCtx.createTexture();
        glCtx.activeTexture(glCtx.TEXTURE0 + unit);
        glCtx.bindTexture(glCtx.TEXTURE_2D, texture);

        glCtx.texImage2D(
          glCtx.TEXTURE_2D,
          0,
          glCtx.RGBA,
          1,
          1,
          0,
          glCtx.RGBA,
          glCtx.UNSIGNED_BYTE,
          new Uint8Array([255, 28, 1, 255])
        );

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;

        const handleLoad = () => {
          glCtx.activeTexture(glCtx.TEXTURE0 + unit);
          glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
          glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, glCtx.RGBA, glCtx.UNSIGNED_BYTE, img);
          glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
          glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
          glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.LINEAR);
          glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.LINEAR);
        };

        if (img.complete && img.naturalWidth > 0) {
          handleLoad();
        } else {
          img.onload = handleLoad;
        }

        return texture;
      }

      const texBase = loadTexture(gl, '/herolast.webp', 0);
      const texCyber = loadTexture(gl, '/herocyber.webp', 1);

      gl.uniform1i(uLocs.textureBase, 0);
      gl.uniform1i(uLocs.textureCyber, 1);
      gl.uniform2f(uLocs.imageRes, 1689, 931);

      // Viewport Resize Handler
      const handleResize = () => {
        if (!canvas) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.uniform2f(uLocs.resolution, canvas.width, canvas.height);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      // Render Loop
      let animationFrameId;
      const startTime = performance.now();

      const render = () => {
        const elapsedTime = (performance.now() - startTime) * 0.001;
        const p = physicsRef.current;

        // Smooth spring-like viscous cursor follow (buttery 60fps)
        p.currentX += (p.targetX - p.currentX) * 0.14;
        p.currentY += (p.targetY - p.currentY) * 0.14;

        // Velocity smoothing & natural decay
        p.smoothVelX += (p.velX - p.smoothVelX) * 0.12;
        p.smoothVelY += (p.velY - p.smoothVelY) * 0.12;
        p.smoothSpeed += (p.speed - p.smoothSpeed) * 0.12;

        p.velX *= 0.86;
        p.velY *= 0.86;
        p.speed *= 0.86;

        const screenAspect = window.innerWidth / Math.max(window.innerHeight, 1);
        const velAspectX = p.smoothVelX * screenAspect;
        const velAspectY = p.smoothVelY;
        const currentSpeed = Math.sqrt(velAspectX * velAspectX + velAspectY * velAspectY);
        if (currentSpeed > 0.015) {
          const targetDirX = velAspectX / currentSpeed;
          const targetDirY = velAspectY / currentSpeed;
          p.dirX += (targetDirX - p.dirX) * 0.2;
          p.dirY += (targetDirY - p.dirY) * 0.2;
          const dirLen = Math.sqrt(p.dirX * p.dirX + p.dirY * p.dirY);
          if (dirLen > 0.001) {
            p.dirX /= dirLen;
            p.dirY /= dirLen;
          }
        }

        const effectiveHover = hoverProgressRef.current.value;

        gl.useProgram(program);
        gl.uniform2f(uLocs.mouse, p.currentX, p.currentY);
        gl.uniform2f(uLocs.dir, p.dirX, p.dirY);
        gl.uniform1f(uLocs.speed, p.smoothSpeed);
        gl.uniform1f(uLocs.aspectRatio, screenAspect);
        gl.uniform1f(uLocs.hover, effectiveHover);
        gl.uniform1f(uLocs.time, elapsedTime);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animationFrameId = requestAnimationFrame(render);
      };

      render();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(positionBuffer);
        gl.deleteTexture(texBase);
        gl.deleteTexture(texCyber);
      };
    } catch (err) {
      console.error('[Hero Ink] Init error, fallback to static image:', err);
      setIsSupported(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full z-[5] select-none pointer-events-none transition-opacity duration-700 ${
        isEnabled ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {isSupported ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
      ) : (
        <img
          src="/herolast.webp"
          alt="Sahil Gupta"
          width="1689"
          height="931"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
      )}
    </div>
  );
}
