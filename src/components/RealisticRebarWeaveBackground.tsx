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

  // Motion physics values for smooth, organic cursor tracking
  const mouseX = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  );
  const mouseY = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  );
  const mouseIntensity = useMotionValue<number>(0.25); // Subtle ambient presence at load

  // Physical springs via motion/react: heavy, taut structural reinforcement steel
  const springX = useSpring(mouseX, { stiffness: 160, damping: 20, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 160, damping: 20, mass: 0.8 });
  const springIntensity = useSpring(mouseIntensity, { stiffness: 120, damping: 18 });

  // Watch for html.dark class changes to immediately update color palette
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

  // Main rendering engine with intelligent power-saving sleep/wake loop
  useEffect(() => {
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

    // Track previous spring values to detect settled resting state
    let prevX = springX.get();
    let prevY = springY.get();
    let prevIntensity = springIntensity.get();
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

    // Rebar mesh parameters matching industrial ASTM / BS welded wire fabric
    const GRID_SPACING = 96; // Center-to-center mesh cell size
    const BASE_DIAMETER = 14; // Base rebar bar diameter in pixels
    const RIB_SPACING = 13; // Distance between transverse ribs
    const INFLUENCE_RADIUS = 310; // Pop-out cursor influence radius
    const MAX_POP_ELEVATION = 28; // Peak 3D lift in pixels

    // Helper: calculate 3D pop elevation and elastic displacement at any 2D point
    const getPop = (x: number, y: number, cx: number, cy: number, intensity: number) => {
      if (shouldReduceMotion || intensity <= 0.01) {
        return { elevation: 0, weight: 0, dx: 0, dy: 0, dist: 999 };
      }
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist >= INFLUENCE_RADIUS) {
        return { elevation: 0, weight: 0, dx, dy, dist };
      }

      const u = dist / INFLUENCE_RADIUS;
      // Smooth C2-continuous bell curve
      const weight = Math.pow(1 - u * u, 2) * intensity;
      const elevation = weight * MAX_POP_ELEVATION;
      return { elevation, weight, dx, dy, dist };
    };

    // Draw a single frame of the realistic rebar weave
    const drawFrame = () => {
      const curX = springX.get();
      const curY = springY.get();
      const curIntensity = springIntensity.get();
      const isDark = document.documentElement.classList.contains('dark');

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Industrial steel color palette
      const colors = isDark
        ? {
            // Dark Mode: Cold-rolled structural steel with chrome highlights & amber oxidation
            steelBase: '#1c222b',
            steelCore: '#28313e',
            steelMid: '#3d495a',
            steelHighlight: '#7c8ea6',
            steelPeak: '#e2e8f0',
            ribDark: '#0e1218',
            ribLight: '#8a9cb5',
            ribGlint: '#fbbf24',
            ribGlintHot: '#f59e0b',
            shadowBase: 'rgba(0, 0, 0, 0.45)',
            shadowPop: 'rgba(0, 0, 0, 0.8)',
            weldJoint: '#323b49',
            weldGlint: '#e2e8f0',
            emberHalo: 'rgba(245, 124, 0, 0.16)',
            emberHaloOuter: 'rgba(245, 124, 0, 0.03)',
          }
        : {
            // Light Mode: Architectural structural steel mesh with crisp shadows
            steelBase: '#334155',
            steelCore: '#475569',
            steelMid: '#64748b',
            steelHighlight: '#94a3b8',
            steelPeak: '#f8fafc',
            ribDark: '#1e293b',
            ribLight: '#cbd5e1',
            ribGlint: '#b45309',
            ribGlintHot: '#d97706',
            shadowBase: 'rgba(15, 23, 42, 0.15)',
            shadowPop: 'rgba(15, 23, 42, 0.35)',
            weldJoint: '#475569',
            weldGlint: '#ffffff',
            emberHalo: 'rgba(180, 83, 9, 0.12)',
            emberHaloOuter: 'rgba(180, 83, 9, 0.02)',
          };

      // 1. Dynamic Cursor Light / Thermal Specular Halo
      if (curIntensity > 0.05 && !shouldReduceMotion) {
        const glowRad = INFLUENCE_RADIUS * 1.1;
        const radial = ctx.createRadialGradient(curX, curY, 20, curX, curY, glowRad);
        radial.addColorStop(0, colors.emberHalo);
        radial.addColorStop(0.55, colors.emberHaloOuter);
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(curX, curY, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }

      const cols = Math.ceil(width / GRID_SPACING) + 2;
      const rows = Math.ceil(height / GRID_SPACING) + 2;

      // =========================================================================
      // STEP 1: DROP SHADOWS FOR ENTIRE REBAR MESH
      // Cast shadows project away from cursor point source and expand on 3D lift
      // =========================================================================
      ctx.save();
      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        const step = 20;

        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += step) {
          const pop = getPop(baseX, y + step / 2, curX, curY, curIntensity);
          const z = pop.elevation;
          const ratio = z / MAX_POP_ELEVATION;

          const lightOffsetX = pop.dist > 0 ? (pop.dx / pop.dist) * (z * 0.65) : 3;
          const lightOffsetY = pop.dist > 0 ? (pop.dy / pop.dist) * (z * 0.65) : 4;

          const shadowWidth = BASE_DIAMETER * (1 + ratio * 0.42);
          const shadowX = baseX + 3 + lightOffsetX;
          const shadowY = y + 4 + lightOffsetY;

          const shadowAlpha = isDark ? 0.25 + ratio * 0.45 : 0.12 + ratio * 0.28;
          ctx.fillStyle = isDark
            ? `rgba(0, 0, 0, ${shadowAlpha})`
            : `rgba(15, 23, 42, ${shadowAlpha})`;

          ctx.beginPath();
          ctx.rect(shadowX - shadowWidth / 2, shadowY, shadowWidth, step + 1);
          ctx.fill();
        }
      }

      for (let r = 0; r < rows; r++) {
        const baseY = r * GRID_SPACING;
        const step = 20;

        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += step) {
          const pop = getPop(x + step / 2, baseY, curX, curY, curIntensity);
          const z = pop.elevation;
          const ratio = z / MAX_POP_ELEVATION;

          const lightOffsetX = pop.dist > 0 ? (pop.dx / pop.dist) * (z * 0.65) : 3;
          const lightOffsetY = pop.dist > 0 ? (pop.dy / pop.dist) * (z * 0.65) : 4;

          const shadowHeight = BASE_DIAMETER * (1 + ratio * 0.42);
          const shadowX = x + 3 + lightOffsetX;
          const shadowY = baseY + 4 + lightOffsetY;

          const shadowAlpha = isDark ? 0.32 + ratio * 0.48 : 0.15 + ratio * 0.3;
          ctx.fillStyle = isDark
            ? `rgba(0, 0, 0, ${shadowAlpha})`
            : `rgba(15, 23, 42, ${shadowAlpha})`;

          ctx.beginPath();
          ctx.rect(shadowX, shadowY - shadowHeight / 2, step + 1, shadowHeight);
          ctx.fill();
        }
      }
      ctx.restore();

      // =========================================================================
      // STEP 2: DRAW VERTICAL BARS (LAYER 1 - Running top to bottom)
      // Continuous cylindrical tapered polygon with dynamic specular angle
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        const segStep = 18;

        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += segStep) {
          const y0 = y;
          const y1 = y + segStep;

          const pop0 = getPop(baseX, y0, curX, curY, curIntensity);
          const pop1 = getPop(baseX, y1, curX, curY, curIntensity);

          const r0 = (BASE_DIAMETER / 2) * (1 + (pop0.elevation / MAX_POP_ELEVATION) * 0.38);
          const r1 = (BASE_DIAMETER / 2) * (1 + (pop1.elevation / MAX_POP_ELEVATION) * 0.38);

          const flexX0 = pop0.dist > 0 && pop0.elevation > 0 ? (pop0.dx / pop0.dist) * (pop0.elevation * 0.12) : 0;
          const flexX1 = pop1.dist > 0 && pop1.elevation > 0 ? (pop1.dx / pop1.dist) * (pop1.elevation * 0.12) : 0;

          const x0 = baseX + flexX0;
          const x1 = baseX + flexX1;

          const midY = (y0 + y1) / 2;
          const midX = (x0 + x1) / 2;
          const midPop = getPop(baseX, midY, curX, curY, curIntensity);

          const lightOffsetX = midPop.dist > 0 && midPop.elevation > 0 ? -midPop.dx / midPop.dist : 0;
          const hlRatio = Math.max(0.2, Math.min(0.8, 0.4 + lightOffsetX * 0.25));

          const grad = ctx.createLinearGradient(midX - r0, midY, midX + r0, midY);
          grad.addColorStop(0, colors.steelBase);
          grad.addColorStop(Math.max(0.05, hlRatio - 0.2), colors.steelCore);
          grad.addColorStop(hlRatio, midPop.elevation > 8 ? colors.steelPeak : colors.steelHighlight);
          grad.addColorStop(Math.min(0.95, hlRatio + 0.22), colors.steelMid);
          grad.addColorStop(1, colors.steelBase);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(x0 - r0, y0);
          ctx.lineTo(x1 - r1, y1);
          ctx.lineTo(x1 + r1, y1);
          ctx.lineTo(x0 + r0, y0);
          ctx.closePath();
          ctx.fill();

          // Longitudinal mill parting seam lines
          ctx.fillStyle = colors.steelBase;
          ctx.fillRect(x0 - r0 * 0.96, y0, 1.2, segStep);
          ctx.fillRect(x0 + r0 * 0.96 - 1.2, y0, 1.2, segStep);
        }

        // Render deformed transverse ribs along vertical bar
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          const pop = getPop(baseX, y, curX, curY, curIntensity);
          const z = pop.elevation;
          const r = (BASE_DIAMETER / 2) * (1 + (z / MAX_POP_ELEVATION) * 0.38);
          const flexX = pop.dist > 0 && z > 0 ? (pop.dx / pop.dist) * (z * 0.12) : 0;
          const rx = baseX + flexX;

          const ribYShift = 3.6;

          ctx.save();
          // 1. Dark indentation groove at root of rib
          ctx.strokeStyle = colors.ribDark;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(rx - r * 0.92, y - ribYShift);
          ctx.quadraticCurveTo(rx, y + 1.2, rx + r * 0.92, y + ribYShift);
          ctx.stroke();

          // 2. Raised metallic specular ridge crest
          const isHot = z > 7;
          ctx.strokeStyle = isHot
            ? pop.dist < 130
              ? colors.ribGlintHot
              : colors.ribGlint
            : colors.ribLight;
          ctx.lineWidth = 1.6 + (z / MAX_POP_ELEVATION) * 1.0;
          ctx.beginPath();
          ctx.moveTo(rx - r * 0.88, y - ribYShift - 1);
          ctx.quadraticCurveTo(rx, y + 0.2, rx + r * 0.88, y + ribYShift - 1);
          ctx.stroke();
          ctx.restore();
        }
      }

      // =========================================================================
      // STEP 3: CONTACT SHADOWS AT INTERSECTIONS
      // Deep contact shadow cast directly by horizontal bars onto vertical bars
      // =========================================================================
      ctx.save();
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const ix = c * GRID_SPACING;
          const iy = r * GRID_SPACING;
          const pop = getPop(ix, iy, curX, curY, curIntensity);
          const z = pop.elevation;
          const flexX = pop.dist > 0 && z > 0 ? (pop.dx / pop.dist) * (z * 0.12) : 0;
          const flexY = pop.dist > 0 && z > 0 ? (pop.dy / pop.dist) * (z * 0.12) : 0;
          const nx = ix + flexX;
          const ny = iy + flexY;

          const barW = BASE_DIAMETER * (1 + (z / MAX_POP_ELEVATION) * 0.38);

          ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.72)' : 'rgba(15, 23, 42, 0.42)';
          ctx.fillRect(nx - barW / 2, ny - 4.5, barW, 9);
        }
      }
      ctx.restore();

      // =========================================================================
      // STEP 4: DRAW HORIZONTAL BARS (LAYER 2 - CROSSING OVER ON TOP)
      // =========================================================================
      for (let r = 0; r < rows; r++) {
        const baseY = r * GRID_SPACING;
        const segStep = 18;

        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += segStep) {
          const x0 = x;
          const x1 = x + segStep;

          const pop0 = getPop(x0, baseY, curX, curY, curIntensity);
          const pop1 = getPop(x1, baseY, curX, curY, curIntensity);

          const r0 = (BASE_DIAMETER / 2) * (1 + (pop0.elevation / MAX_POP_ELEVATION) * 0.38);
          const r1 = (BASE_DIAMETER / 2) * (1 + (pop1.elevation / MAX_POP_ELEVATION) * 0.38);

          const flexY0 = pop0.dist > 0 && pop0.elevation > 0 ? (pop0.dy / pop0.dist) * (pop0.elevation * 0.12) : 0;
          const flexY1 = pop1.dist > 0 && pop1.elevation > 0 ? (pop1.dy / pop1.dist) * (pop1.elevation * 0.12) : 0;

          const y0 = baseY + flexY0;
          const y1 = baseY + flexY1;

          const midX = (x0 + x1) / 2;
          const midY = (y0 + y1) / 2;
          const midPop = getPop(midX, baseY, curX, curY, curIntensity);

          const lightOffsetY = midPop.dist > 0 && midPop.elevation > 0 ? -midPop.dy / midPop.dist : 0;
          const hlRatio = Math.max(0.2, Math.min(0.8, 0.4 + lightOffsetY * 0.25));

          const grad = ctx.createLinearGradient(midX, midY - r0, midX, midY + r0);
          grad.addColorStop(0, colors.steelBase);
          grad.addColorStop(Math.max(0.05, hlRatio - 0.2), colors.steelCore);
          grad.addColorStop(hlRatio, midPop.elevation > 8 ? colors.steelPeak : colors.steelHighlight);
          grad.addColorStop(Math.min(0.95, hlRatio + 0.22), colors.steelMid);
          grad.addColorStop(1, colors.steelBase);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(x0, y0 - r0);
          ctx.lineTo(x1, y1 - r1);
          ctx.lineTo(x1, y1 + r1);
          ctx.lineTo(x0, y0 + r0);
          ctx.closePath();
          ctx.fill();

          // Longitudinal seams
          ctx.fillStyle = colors.steelBase;
          ctx.fillRect(x0, y0 - r0 * 0.96, segStep, 1.2);
          ctx.fillRect(x0, y0 + r0 * 0.96 - 1.2, segStep, 1.2);
        }

        // Render deformed transverse ribs along horizontal bar
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          const pop = getPop(x, baseY, curX, curY, curIntensity);
          const z = pop.elevation;
          const r = (BASE_DIAMETER / 2) * (1 + (z / MAX_POP_ELEVATION) * 0.38);
          const flexY = pop.dist > 0 && z > 0 ? (pop.dy / pop.dist) * (z * 0.12) : 0;
          const ry = baseY + flexY;

          const ribXShift = 3.6;

          ctx.save();
          // 1. Dark indentation groove at root of rib
          ctx.strokeStyle = colors.ribDark;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(x - ribXShift, ry - r * 0.92);
          ctx.quadraticCurveTo(x + 1.2, ry, x + ribXShift, ry + r * 0.92);
          ctx.stroke();

          // 2. Raised metallic specular ridge crest
          const isHot = z > 7;
          ctx.strokeStyle = isHot
            ? pop.dist < 130
              ? colors.ribGlintHot
              : colors.ribGlint
            : colors.ribLight;
          ctx.lineWidth = 1.6 + (z / MAX_POP_ELEVATION) * 1.0;
          ctx.beginPath();
          ctx.moveTo(x - ribXShift - 1, ry - r * 0.88);
          ctx.quadraticCurveTo(x + 0.2, ry, x + ribXShift - 1, ry + r * 0.88);
          ctx.stroke();
          ctx.restore();
        }
      }

      // =========================================================================
      // STEP 5: WELDED NODES / CROSS JOINTS (With 3D Elevation Pop)
      // Resistance weld nugget at intersection points with metallic heat tint
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const ix = c * GRID_SPACING;
          const iy = r * GRID_SPACING;
          const pop = getPop(ix, iy, curX, curY, curIntensity);
          const z = pop.elevation;
          const flexX = pop.dist > 0 && z > 0 ? (pop.dx / pop.dist) * (z * 0.12) : 0;
          const flexY = pop.dist > 0 && z > 0 ? (pop.dy / pop.dist) * (z * 0.12) : 0;
          const nx = ix + flexX;
          const ny = iy + flexY;

          const weldRadius = 3.6 + (z / MAX_POP_ELEVATION) * 1.6;

          // Weld shadow / heat-tint halo
          ctx.fillStyle = colors.ribDark;
          ctx.beginPath();
          ctx.arc(nx, ny, weldRadius + 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Weld core bead
          ctx.fillStyle = z > 9 ? colors.ribGlintHot : colors.weldJoint;
          ctx.beginPath();
          ctx.arc(nx, ny, weldRadius, 0, Math.PI * 2);
          ctx.fill();

          // Specular glint dot on weld bead
          ctx.fillStyle = colors.steelPeak;
          ctx.beginPath();
          ctx.arc(nx - 1, ny - 1, Math.max(0.8, weldRadius * 0.36), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore(); // restore dpr scale

      // Check if motion has settled to rest
      const deltaX = Math.abs(curX - prevX);
      const deltaY = Math.abs(curY - prevY);
      const deltaI = Math.abs(curIntensity - prevIntensity);
      prevX = curX;
      prevY = curY;
      prevIntensity = curIntensity;

      if (deltaX < 0.08 && deltaY < 0.08 && deltaI < 0.005) {
        settledFrames++;
      } else {
        settledFrames = 0;
      }
    };

    // Animation frame loop with smart sleep
    const loop = () => {
      if (!isMounted) return;

      drawFrame();

      // If settled for more than 40 frames, pause loop to save 100% CPU/battery
      if (settledFrames > 40) {
        isLoopActive = false;
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    // Wake up render loop on any interaction
    const wakeUp = () => {
      settledFrames = 0;
      if (!isLoopActive && isMounted) {
        isLoopActive = true;
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    resize();
    wakeUp();

    window.addEventListener('resize', resize, { passive: true });

    // Global pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      mouseIntensity.set(1.0);
      wakeUp();

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        // Settle smoothly to gentle resting state
        mouseIntensity.set(0.2);
        wakeUp();
      }, 2400);
    };

    const handlePointerLeave = () => {
      mouseIntensity.set(0.1);
      wakeUp();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Touch events for mobile/tablet
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseX.set(touch.clientX);
        mouseY.set(touch.clientY);
        mouseIntensity.set(1.0);
        wakeUp();

        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          mouseIntensity.set(0.2);
          wakeUp();
        }, 2200);
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      isMounted = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [
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
      {/* 1. High-Performance Interactive Rebar Weave Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full opacity-80 dark:opacity-90 transition-opacity duration-500"
      />

      {/* 2. Soft Edge Vignette to keep viewport perimeter clean */}
      <div className="absolute inset-0 bg-radial-[ellipse_85%_65%_at_50%_45%] from-transparent via-transparent to-bg/85 dark:to-bg/90 pointer-events-none" />

      {/* 3. Subtle page-level depth gradient preserving text hierarchy */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-bg/50 dark:from-bg/40 dark:via-transparent dark:to-bg/70 pointer-events-none" />
    </div>
  );
}
