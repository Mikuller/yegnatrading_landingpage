import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'motion/react';

interface RealisticRebarWeaveBackgroundProps {
  className?: string;
}

export default function RealisticRebarWeaveBackground({
  className = '',
}: RealisticRebarWeaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Dark mode detector state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Mobile / Touch screen detection: bypass heavy canvas rAF on mobile devices
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cursor coordinates
  const mouseX = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  );
  const mouseY = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  );
  // Default rest intensity: 0 so background is calm and peaceful on initial load
  const mouseIntensity = useMotionValue<number>(0);

  // Ball gliding physics: snappy, responsive, smooth momentum
  const springX = useSpring(mouseX, { stiffness: 320, damping: 28, mass: 0.22 });
  const springY = useSpring(mouseY, { stiffness: 320, damping: 28, mass: 0.22 });
  const springIntensity = useSpring(mouseIntensity, { stiffness: 220, damping: 24 });

  // Watch for html.dark class changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Main rendering engine
  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isMounted = true;
    let isLoopActive = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // Window dimensions & scale
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let prevX = springX.get();
    let prevY = springY.get();
    let prevIntensity = springIntensity.get();
    let smoothVx = 0;
    let smoothVy = 0;
    let scrollY = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
    let lastTime = performance.now();
    let settledFrames = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      wakeUp();
    };

    // Mesh & Interactive Gliding Lens Parameters
    const GRID_SPACING = 96; // Breathable architectural mesh cell size
    const BASE_DIAMETER = 12.0; // Structural steel gauge when elevated under cursor
    const RIB_SPACING = 13.0; // Transverse rib spacing
    const BALL_RADIUS = 160; // Interactive lens radius (~320px diameter)
    const BALL_RADIUS_SQ = BALL_RADIUS * BALL_RADIUS;
    const MAX_BALL_ELEVATION = 18; // 3D elevation height

    // Zero-allocation reusable scratch values for ultra-fast 120 FPS math
    let domeZ = 0;
    let domeWeight = 0;
    let domeDx = 0;
    let domeDy = 0;
    let domeDist = 0;

    const calcDome = (x: number, y: number, bx: number, by: number, intensity: number): boolean => {
      const dx = x - bx;
      const dy = y - by;
      const distSq = dx * dx + dy * dy;

      if (distSq >= BALL_RADIUS_SQ || intensity <= 0.01) {
        domeZ = 0;
        domeWeight = 0;
        domeDx = dx;
        domeDy = dy;
        domeDist = 999;
        return false;
      }

      const dist = Math.sqrt(distSq);
      const u = dist / BALL_RADIUS;
      // Smooth bell curve easing for seamless organic taper
      const weight = (1 - u * u) * (1 - u * u) * intensity;
      domeWeight = weight;
      domeZ = weight * MAX_BALL_ELEVATION;
      domeDx = dx;
      domeDy = dy;
      domeDist = dist;
      return true;
    };

    // Frame rendering routine
    const drawFrame = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - lastTime) / 1000));
      lastTime = now;

      const curX = springX.get();
      const curY = springY.get();
      const curIntensity = springIntensity.get();
      const isDark = document.documentElement.classList.contains('dark');

      // Update gliding ball velocity for subtle directional lighting bias
      const instantVx = (curX - prevX) / dt;
      const instantVy = (curY - prevY) / dt;
      smoothVx += (instantVx - smoothVx) * 0.25;
      smoothVy += (instantVy - smoothVy) * 0.25;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Calibrated architectural palettes:
      // Base mesh is quiet and low-contrast so foreground text ALWAYS pops
      // Popped dome under cursor is tactile, embossed, and entertaining!
      const p = isDark
        ? {
            // Dark Mode
            gridLine: 'rgba(148, 163, 184, 0.06)',
            gridCrosshair: 'rgba(245, 158, 11, 0.16)',
            // Popped zone: Forged structural steel catching light
            popBarCore: 'rgba(30, 41, 59, 0.78)',
            popBarSpecular: 'rgba(241, 245, 249, 0.95)',
            popRibShadow: 'rgba(2, 6, 23, 0.75)',
            popRibCrest: 'rgba(255, 255, 255, 0.92)',
            popRibAmberGlint: 'rgba(245, 158, 11, 0.80)',
            weldHAZ: 'rgba(15, 23, 42, 0.75)',
            weldNode: 'rgba(71, 85, 105, 0.70)',
            weldHot: '#f59e0b',
            ballShadow: 'rgba(0, 0, 0, 0.32)',
            ballHaloInner: 'rgba(245, 158, 11, 0.10)',
            ballHaloMid: 'rgba(245, 124, 0, 0.025)',
          }
        : {
            // Light Mode: Clean drafting blueprint watermark
            gridLine: 'rgba(71, 85, 105, 0.05)',
            gridCrosshair: 'rgba(217, 119, 6, 0.12)',
            // Popped zone: Handsome cool slate steel with bright crests
            popBarCore: 'rgba(71, 85, 105, 0.55)',
            popBarSpecular: 'rgba(255, 255, 255, 0.95)',
            popRibShadow: 'rgba(30, 41, 59, 0.45)',
            popRibCrest: 'rgba(255, 255, 255, 0.90)',
            popRibAmberGlint: 'rgba(217, 119, 6, 0.70)',
            weldHAZ: 'rgba(51, 65, 85, 0.35)',
            weldNode: 'rgba(71, 85, 105, 0.65)',
            weldHot: '#ea580c',
            ballShadow: 'rgba(15, 23, 42, 0.12)',
            ballHaloInner: 'rgba(245, 124, 0, 0.08)',
            ballHaloMid: 'rgba(217, 119, 6, 0.02)',
          };

      // Subtle scroll parallax depth (seamless modulo repeat)
      const scrollShiftY = (scrollY * 0.14) % GRID_SPACING;

      const cols = Math.ceil(width / GRID_SPACING) + 2;
      const rows = Math.ceil(height / GRID_SPACING) + 3;

      // Active bounding indices for the interactive lens
      const minActiveCol = Math.max(0, Math.floor((curX - BALL_RADIUS) / GRID_SPACING));
      const maxActiveCol = Math.min(cols - 1, Math.ceil((curX + BALL_RADIUS) / GRID_SPACING));
      const minActiveRow = Math.max(0, Math.floor((curY - BALL_RADIUS - scrollShiftY) / GRID_SPACING));
      const maxActiveRow = Math.min(rows - 1, Math.ceil((curY + BALL_RADIUS - scrollShiftY) / GRID_SPACING));

      // =========================================================================
      // STEP 1: GLIDING LIGHT BEAM & PENUMBRA (Clean, non-hazy aura)
      // =========================================================================
      if (curIntensity > 0.02 && !shouldReduceMotion) {
        // 1A. Soft 3D Contact Shadow beneath the elevated rebar
        const shadowOffsetX = 6 + Math.max(-6, Math.min(6, smoothVx * 0.01));
        const shadowOffsetY = 7 + Math.max(-6, Math.min(6, smoothVy * 0.01));
        const shadowRad = BALL_RADIUS * 0.72;

        const sphereShadow = ctx.createRadialGradient(
          curX + shadowOffsetX,
          curY + shadowOffsetY,
          6,
          curX + shadowOffsetX,
          curY + shadowOffsetY,
          shadowRad
        );
        sphereShadow.addColorStop(0, p.ballShadow);
        sphereShadow.addColorStop(0.6, isDark ? 'rgba(0, 0, 0, 0.10)' : 'rgba(15, 23, 42, 0.04)');
        sphereShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = sphereShadow;
        ctx.beginPath();
        ctx.arc(curX + shadowOffsetX, curY + shadowOffsetY, shadowRad, 0, Math.PI * 2);
        ctx.fill();

        // 1B. Luminous Gliding Ball Aura (Soft warm amber spotlight)
        const auraRad = BALL_RADIUS * 0.88;
        const ballLight = ctx.createRadialGradient(curX, curY, 6, curX, curY, auraRad);
        ballLight.addColorStop(0, p.ballHaloInner);
        ballLight.addColorStop(0.5, p.ballHaloMid);
        ballLight.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = ballLight;
        ctx.beginPath();
        ctx.arc(curX, curY, auraRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // STEP 2: CRISP ARCHITECTURAL BLUEPRINT GRID (QUIET, AIRY, NEVER COMPETES)
      // =========================================================================
      // Delicate 1px structural guidelines across the viewport
      ctx.beginPath();
      ctx.strokeStyle = p.gridLine;
      ctx.lineWidth = 1;

      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING + scrollShiftY;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      // Engineering intersection crosshairs (architectural blueprint ticks)
      ctx.beginPath();
      ctx.strokeStyle = p.gridCrosshair;
      ctx.lineWidth = 1;
      const tick = 3;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const y = r * GRID_SPACING + scrollShiftY;
          ctx.moveTo(x - tick, y);
          ctx.lineTo(x + tick, y);
          ctx.moveTo(x, y - tick);
          ctx.lineTo(x, y + tick);
        }
      }
      ctx.stroke();

      // =========================================================================
      // STEP 3: TASTEFUL 3D POP DOME (UNDER CURSOR ONLY - BOLD & ENTERTAINING)
      // =========================================================================
      if (curIntensity > 0.02 && !shouldReduceMotion) {
        // 3A. Smooth Continuous 3D Drop Shadows of Elevated Bars
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          const startY = Math.max(-GRID_SPACING, curY - BALL_RADIUS);
          const endY = Math.min(height + GRID_SPACING, curY + BALL_RADIUS);

          ctx.beginPath();
          ctx.strokeStyle = isDark ? 'rgba(0, 0, 0, 0.32)' : 'rgba(15, 23, 42, 0.12)';
          ctx.lineWidth = BASE_DIAMETER * 0.9;
          ctx.lineCap = 'round';

          let hasStarted = false;
          for (let y = startY; y <= endY; y += 6) {
            if (calcDome(baseX, y, curX, curY, curIntensity) && domeWeight > 0.04) {
              const dirX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.45);
              const dirY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.45);
              const sx = baseX + 3.0 + dirX;
              const sy = y + 4.0 + dirY;
              if (!hasStarted) {
                ctx.moveTo(sx, sy);
                hasStarted = true;
              } else {
                ctx.lineTo(sx, sy);
              }
            } else if (hasStarted) {
              break;
            }
          }
          if (hasStarted) ctx.stroke();
        }

        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          const startX = Math.max(-GRID_SPACING, curX - BALL_RADIUS);
          const endX = Math.min(width + GRID_SPACING, curX + BALL_RADIUS);

          ctx.beginPath();
          ctx.strokeStyle = isDark ? 'rgba(0, 0, 0, 0.32)' : 'rgba(15, 23, 42, 0.12)';
          ctx.lineWidth = BASE_DIAMETER * 0.9;
          ctx.lineCap = 'round';

          let hasStarted = false;
          for (let x = startX; x <= endX; x += 6) {
            if (calcDome(x, baseY, curX, curY, curIntensity) && domeWeight > 0.04) {
              const dirX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.45);
              const dirY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.45);
              const sx = x + 3.0 + dirX;
              const sy = baseY + 4.0 + dirY;
              if (!hasStarted) {
                ctx.moveTo(sx, sy);
                hasStarted = true;
              } else {
                ctx.lineTo(sx, sy);
              }
            } else if (hasStarted) {
              break;
            }
          }
          if (hasStarted) ctx.stroke();
        }

        // 3B. Vertical Bars Popping & Swelling into 3D Steel over the Dome
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          const segStep = 8;
          const startY = Math.max(-GRID_SPACING, curY - BALL_RADIUS - segStep);
          const endY = Math.min(height + GRID_SPACING, curY + BALL_RADIUS + segStep);

          for (let y = startY; y < endY; y += segStep) {
            const y0 = y;
            const y1 = y + segStep;
            const hasDome0 = calcDome(baseX, y0, curX, curY, curIntensity);
            const z0 = domeZ;
            const w0 = domeWeight;
            const flexX0 = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);

            const hasDome1 = calcDome(baseX, y1, curX, curY, curIntensity);
            const z1 = domeZ;
            const w1 = domeWeight;
            const flexX1 = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);

            if (!hasDome0 && !hasDome1) continue;
            if (w0 <= 0.02 && w1 <= 0.02) continue;

            // Smooth organic radius swelling from 0.5px blueprint line up to full gauge
            const r0 = 0.5 + (BASE_DIAMETER / 2 - 0.5) * Math.min(1, Math.sqrt(w0) * 1.5);
            const r1 = 0.5 + (BASE_DIAMETER / 2 - 0.5) * Math.min(1, Math.sqrt(w1) * 1.5);

            const x0 = baseX + flexX0;
            const x1 = baseX + flexX1;

            ctx.fillStyle = p.popBarCore;
            ctx.beginPath();
            ctx.moveTo(x0 - r0, y0);
            ctx.lineTo(x1 - r1, y1);
            ctx.lineTo(x1 + r1, y1);
            ctx.lineTo(x0 + r0, y0);
            ctx.closePath();
            ctx.fill();

            // Specular Gleam catching the light
            const midY = (y0 + y1) * 0.5;
            const distToLight = Math.hypot(baseX - curX, midY - curY);
            const lightProximity = Math.max(0, 1 - distToLight / (BALL_RADIUS * 0.85));

            ctx.strokeStyle = p.popBarSpecular;
            ctx.lineWidth = 0.8 + lightProximity * 1.4;
            ctx.beginPath();
            ctx.moveTo(x0 - r0 * 0.35, y0);
            ctx.lineTo(x1 - r1 * 0.35, y1);
            ctx.stroke();

            if (lightProximity > 0.3) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(x0 - r0 * 0.32, y0);
              ctx.lineTo(x1 - r1 * 0.32, y1);
              ctx.stroke();
            }
          }
        }

        // 3C. Horizontal Bars Popping & Swelling into 3D Steel over the Dome
        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          const segStep = 8;
          const startX = Math.max(-GRID_SPACING, curX - BALL_RADIUS - segStep);
          const endX = Math.min(width + GRID_SPACING, curX + BALL_RADIUS + segStep);

          for (let x = startX; x < endX; x += segStep) {
            const x0 = x;
            const x1 = x + segStep;
            const hasDome0 = calcDome(x0, baseY, curX, curY, curIntensity);
            const z0 = domeZ;
            const w0 = domeWeight;
            const flexY0 = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);

            const hasDome1 = calcDome(x1, baseY, curX, curY, curIntensity);
            const z1 = domeZ;
            const w1 = domeWeight;
            const flexY1 = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);

            if (!hasDome0 && !hasDome1) continue;
            if (w0 <= 0.02 && w1 <= 0.02) continue;

            const r0 = 0.5 + (BASE_DIAMETER / 2 - 0.5) * Math.min(1, Math.sqrt(w0) * 1.5);
            const r1 = 0.5 + (BASE_DIAMETER / 2 - 0.5) * Math.min(1, Math.sqrt(w1) * 1.5);

            const y0 = baseY + flexY0;
            const y1 = baseY + flexY1;

            ctx.fillStyle = p.popBarCore;
            ctx.beginPath();
            ctx.moveTo(x0, y0 - r0);
            ctx.lineTo(x1, y1 - r1);
            ctx.lineTo(x1, y1 + r1);
            ctx.lineTo(x0, y0 + r0);
            ctx.closePath();
            ctx.fill();

            // Specular Gleam
            const midX = (x0 + x1) * 0.5;
            const distToLight = Math.hypot(midX - curX, baseY - curY);
            const lightProximity = Math.max(0, 1 - distToLight / (BALL_RADIUS * 0.85));

            ctx.strokeStyle = p.popBarSpecular;
            ctx.lineWidth = 0.8 + lightProximity * 1.4;
            ctx.beginPath();
            ctx.moveTo(x0, y0 - r0 * 0.35);
            ctx.lineTo(x1, y1 - r1 * 0.35);
            ctx.stroke();

            if (lightProximity > 0.3) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(x0, y0 - r0 * 0.32);
              ctx.lineTo(x1, y1 - r1 * 0.32);
              ctx.stroke();
            }
          }
        }

        // 3D. Tactile Contoured Transverse Crescent Ribs with Embossed Relief
        // 1. Rib Shadow Grooves (Dark groove giving physical depth)
        ctx.beginPath();
        ctx.strokeStyle = p.popRibShadow;
        ctx.lineWidth = 1.6;
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS; y <= curY + BALL_RADIUS; y += RIB_SPACING) {
            if (!calcDome(baseX, y, curX, curY, curIntensity) || domeWeight < 0.08) continue;
            const r = (BASE_DIAMETER / 2) * Math.min(1, Math.sqrt(domeWeight) * 1.4);
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);
            const rx = baseX + flexX;
            ctx.moveTo(rx - r * 0.88, y - 2.5);
            ctx.quadraticCurveTo(rx, y + 1.0, rx + r * 0.88, y + 3.0);
          }
        }
        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          for (let x = curX - BALL_RADIUS; x <= curX + BALL_RADIUS; x += RIB_SPACING) {
            if (!calcDome(x, baseY, curX, curY, curIntensity) || domeWeight < 0.08) continue;
            const r = (BASE_DIAMETER / 2) * Math.min(1, Math.sqrt(domeWeight) * 1.4);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);
            const ry = baseY + flexY;
            ctx.moveTo(x - 2.5, ry - r * 0.88);
            ctx.quadraticCurveTo(x + 1.0, ry, x + 3.0, ry + r * 0.88);
          }
        }
        ctx.stroke();

        // 2. Rib Highlight Crests (Crisp metallic sheen along the ridge)
        ctx.beginPath();
        ctx.strokeStyle = p.popRibCrest;
        ctx.lineWidth = 1.3;
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS; y <= curY + BALL_RADIUS; y += RIB_SPACING) {
            if (!calcDome(baseX, y, curX, curY, curIntensity) || domeWeight < 0.08) continue;
            const r = (BASE_DIAMETER / 2) * Math.min(1, Math.sqrt(domeWeight) * 1.4);
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);
            const rx = baseX + flexX;
            ctx.moveTo(rx - r * 0.85, y - 3.5);
            ctx.quadraticCurveTo(rx, y, rx + r * 0.85, y + 2.0);
          }
        }
        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          for (let x = curX - BALL_RADIUS; x <= curX + BALL_RADIUS; x += RIB_SPACING) {
            if (!calcDome(x, baseY, curX, curY, curIntensity) || domeWeight < 0.08) continue;
            const r = (BASE_DIAMETER / 2) * Math.min(1, Math.sqrt(domeWeight) * 1.4);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);
            const ry = baseY + flexY;
            ctx.moveTo(x - 3.5, ry - r * 0.85);
            ctx.quadraticCurveTo(x, ry, x + 2.0, ry + r * 0.85);
          }
        }
        ctx.stroke();

        // 3. Warm Amber Forge Glints under spotlight
        ctx.beginPath();
        ctx.strokeStyle = p.popRibAmberGlint;
        ctx.lineWidth = 1.4;
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS * 0.6; y <= curY + BALL_RADIUS * 0.6; y += RIB_SPACING) {
            if (!calcDome(baseX, y, curX, curY, curIntensity) || domeWeight < 0.2) continue;
            const r = (BASE_DIAMETER / 2) * Math.min(1, Math.sqrt(domeWeight) * 1.4);
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);
            const rx = baseX + flexX;
            ctx.moveTo(rx - r * 0.6, y - 2.2);
            ctx.lineTo(rx + r * 0.6, y + 1.2);
          }
        }
        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          for (let x = curX - BALL_RADIUS * 0.6; x <= curX + BALL_RADIUS * 0.6; x += RIB_SPACING) {
            if (!calcDome(x, baseY, curX, curY, curIntensity) || domeWeight < 0.2) continue;
            const r = (BASE_DIAMETER / 2) * Math.min(1, Math.sqrt(domeWeight) * 1.4);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);
            const ry = baseY + flexY;
            ctx.moveTo(x - 2.2, ry - r * 0.6);
            ctx.lineTo(x + 1.2, ry + r * 0.6);
          }
        }
        ctx.stroke();

        // 3E. 3D Welded Intersections on the Elevated Dome
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const ix = c * GRID_SPACING;
          for (let r = minActiveRow; r <= maxActiveRow; r++) {
            const iy = r * GRID_SPACING + scrollShiftY;
            if (!calcDome(ix, iy, curX, curY, curIntensity) || domeWeight < 0.08) continue;

            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);
            const nx = ix + flexX;
            const ny = iy + flexY;
            const weldR = 2.8 + (domeZ / MAX_BALL_ELEVATION) * 1.4;

            // Heat-affected zone collar
            ctx.beginPath();
            ctx.fillStyle = p.weldHAZ;
            ctx.arc(nx, ny, weldR + 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Weld bead core
            ctx.beginPath();
            ctx.fillStyle = domeDist < 75 ? p.weldHot : p.weldNode;
            ctx.arc(nx, ny, weldR, 0, Math.PI * 2);
            ctx.fill();

            // Specular gleam offset towards light source
            const lightDirX = curX - nx;
            const lightDirY = curY - ny;
            const lightLen = Math.hypot(lightDirX, lightDirY) + 0.1;
            const glintOffsetX = (lightDirX / lightLen) * (weldR * 0.35);
            const glintOffsetY = (lightDirY / lightLen) * (weldR * 0.35);

            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.arc(nx + glintOffsetX, ny + glintOffsetY, Math.max(0.6, weldR * 0.30), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore(); // restore dpr scale

      // Check if gliding motion has settled to calm rest
      const deltaX = Math.abs(curX - prevX);
      const deltaY = Math.abs(curY - prevY);
      const deltaI = Math.abs(curIntensity - prevIntensity);
      prevX = curX;
      prevY = curY;
      prevIntensity = curIntensity;

      if (deltaX < 0.05 && deltaY < 0.05 && deltaI < 0.003 && curIntensity <= 0.04) {
        settledFrames++;
      } else {
        settledFrames = 0;
      }
    };

    // Animation frame loop with smart power-saving sleep
    const loop = (now: number) => {
      if (!isMounted) return;

      drawFrame(now);

      // Sleep after 45 frames of calm rest to save 100% CPU/battery
      if (settledFrames > 45) {
        isLoopActive = false;
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    // Instant wake up
    const wakeUp = () => {
      settledFrames = 0;
      if (!isLoopActive && isMounted) {
        isLoopActive = true;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    resize();
    wakeUp();

    window.addEventListener('resize', resize, { passive: true });

    // Scroll parallax tracking
    const handleScroll = () => {
      scrollY = window.scrollY || 0;
      wakeUp();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Helper to check if cursor is over interactive or focused content
    const isOverFocusElement = (target: EventTarget | null, clientX: number, clientY: number): boolean => {
      let el = target instanceof Element ? target : null;
      if (!el && typeof document !== 'undefined') {
        el = document.elementFromPoint(clientX, clientY);
      }
      if (!el) return false;

      // Check if hovering over any interactive control, form, accordion, or focus card
      return !!el.closest(
        'button, a, input, textarea, select, [role="button"], [role="region"], [role="dialog"], [role="tab"], [role="menuitem"], form, .faq-accordion, [data-rebar-suppress="true"], .rebar-focus-solid'
      );
    };

    // Pointer tracking: Bold & entertaining when moving across canvas, gracefully receding on interactive UI
    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const isFocus = isOverFocusElement(e.target, e.clientX, e.clientY);
      mouseIntensity.set(isFocus ? 0.0 : 0.95);
      wakeUp();

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        // When cursor is idle (user reading or focusing), settle to calm 0.0
        mouseIntensity.set(0.0);
        wakeUp();
      }, 1800);
    };

    const handlePointerLeave = () => {
      mouseIntensity.set(0.0);
      wakeUp();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Touch support for mobile/tablet
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const isFocus = isOverFocusElement(e.target, touch.clientX, touch.clientY);
        mouseX.set(touch.clientX);
        mouseY.set(touch.clientY);
        mouseIntensity.set(isFocus ? 0.0 : 0.95);
        wakeUp();

        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          mouseIntensity.set(0.0);
          wakeUp();
        }, 1800);
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      isMounted = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [
    isMobile,
    shouldReduceMotion,
    isDarkMode,
    mouseX,
    mouseY,
    mouseIntensity,
    springX,
    springY,
    springIntensity,
  ]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none ${className}`}
    >
      {isMobile ? (
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.055] pointer-events-none [contain:strict] [background-image:radial-gradient(#f57c00_1px,transparent_1px)] [background-size:28px_28px]" />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
        />
      )}
    </div>
  );
}
