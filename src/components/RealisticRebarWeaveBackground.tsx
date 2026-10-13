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

  // Motion physics values for smooth cursor tracking
  const mouseX = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  );
  const mouseY = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  );
  const mouseIntensity = useMotionValue<number>(0.15); // Calm resting presence at load

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

  // Main rendering engine with localized proximity spotlight & battery-saving sleep/wake loop
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

    // Mesh specifications tuned for non-intrusive readability + dramatic cursor pop-out
    const GRID_SPACING = 98; // Clean, breathable mesh spacing
    const BASE_DIAMETER = 12; // Sleek baseline gauge (less visual clutter behind text)
    const RIB_SPACING = 13; // Distance between transverse ribs
    const INFLUENCE_RADIUS = 310; // Pop-out cursor influence zone
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

      // Base opacity when at rest / far away from cursor (keeps text 100% readable)
      const baseMeshAlpha = isDark ? 0.20 : 0.14;

      // 1. Dynamic Cursor Light / Thermal Specular Halo
      if (curIntensity > 0.05 && !shouldReduceMotion) {
        const glowRad = INFLUENCE_RADIUS * 1.05;
        const radial = ctx.createRadialGradient(curX, curY, 20, curX, curY, glowRad);
        radial.addColorStop(0, isDark ? 'rgba(245, 124, 0, 0.14)' : 'rgba(180, 83, 9, 0.10)');
        radial.addColorStop(0.55, isDark ? 'rgba(245, 124, 0, 0.03)' : 'rgba(180, 83, 9, 0.02)');
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
      // Floor shadows stay faint at rest and expand dramatically under the cursor
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

          const shadowWidth = BASE_DIAMETER * (1 + ratio * 0.45);
          const shadowX = baseX + 3 + lightOffsetX;
          const shadowY = y + 4 + lightOffsetY;

          // Shadow alpha surges from subtle baseline to deep 3D lift under cursor
          const shadowAlpha = isDark
            ? 0.08 + pop.weight * 0.55
            : 0.04 + pop.weight * 0.28;

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

          const shadowHeight = BASE_DIAMETER * (1 + ratio * 0.45);
          const shadowX = x + 3 + lightOffsetX;
          const shadowY = baseY + 4 + lightOffsetY;

          const shadowAlpha = isDark
            ? 0.10 + pop.weight * 0.60
            : 0.05 + pop.weight * 0.30;

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
      // Continuous cylindrical tapered polygon with dynamic proximity alpha
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        const segStep = 18;

        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += segStep) {
          const y0 = y;
          const y1 = y + segStep;

          const pop0 = getPop(baseX, y0, curX, curY, curIntensity);
          const pop1 = getPop(baseX, y1, curX, curY, curIntensity);

          const r0 = (BASE_DIAMETER / 2) * (1 + (pop0.elevation / MAX_POP_ELEVATION) * 0.42);
          const r1 = (BASE_DIAMETER / 2) * (1 + (pop1.elevation / MAX_POP_ELEVATION) * 0.42);

          const flexX0 = pop0.dist > 0 && pop0.elevation > 0 ? (pop0.dx / pop0.dist) * (pop0.elevation * 0.12) : 0;
          const flexX1 = pop1.dist > 0 && pop1.elevation > 0 ? (pop1.dx / pop1.dist) * (pop1.elevation * 0.12) : 0;

          const x0 = baseX + flexX0;
          const x1 = baseX + flexX1;

          const midY = (y0 + y1) / 2;
          const midX = (x0 + x1) / 2;
          const midPop = getPop(baseX, midY, curX, curY, curIntensity);

          // Localized proximity alpha: quiet at rest, vividly pops out under cursor
          const segAlpha = baseMeshAlpha + midPop.weight * (0.88 - baseMeshAlpha);

          const lightOffsetX = midPop.dist > 0 && midPop.elevation > 0 ? -midPop.dx / midPop.dist : 0;
          const hlRatio = Math.max(0.2, Math.min(0.8, 0.4 + lightOffsetX * 0.25));

          const grad = ctx.createLinearGradient(midX - r0, midY, midX + r0, midY);
          if (isDark) {
            grad.addColorStop(0, `rgba(28, 34, 43, ${segAlpha})`);
            grad.addColorStop(Math.max(0.05, hlRatio - 0.2), `rgba(40, 49, 62, ${segAlpha})`);
            grad.addColorStop(hlRatio, midPop.elevation > 8 ? `rgba(240, 244, 250, ${segAlpha})` : `rgba(124, 142, 166, ${segAlpha})`);
            grad.addColorStop(Math.min(0.95, hlRatio + 0.22), `rgba(61, 73, 90, ${segAlpha})`);
            grad.addColorStop(1, `rgba(28, 34, 43, ${segAlpha})`);
          } else {
            grad.addColorStop(0, `rgba(51, 65, 85, ${segAlpha})`);
            grad.addColorStop(Math.max(0.05, hlRatio - 0.2), `rgba(71, 85, 105, ${segAlpha})`);
            grad.addColorStop(hlRatio, midPop.elevation > 8 ? `rgba(248, 250, 252, ${segAlpha})` : `rgba(148, 163, 184, ${segAlpha})`);
            grad.addColorStop(Math.min(0.95, hlRatio + 0.22), `rgba(100, 116, 139, ${segAlpha})`);
            grad.addColorStop(1, `rgba(51, 65, 85, ${segAlpha})`);
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(x0 - r0, y0);
          ctx.lineTo(x1 - r1, y1);
          ctx.lineTo(x1 + r1, y1);
          ctx.lineTo(x0 + r0, y0);
          ctx.closePath();
          ctx.fill();

          // Longitudinal mill parting seams
          ctx.fillStyle = isDark ? `rgba(20, 25, 32, ${segAlpha * 0.8})` : `rgba(30, 41, 59, ${segAlpha * 0.7})`;
          ctx.fillRect(x0 - r0 * 0.96, y0, 1.1, segStep);
          ctx.fillRect(x0 + r0 * 0.96 - 1.1, y0, 1.1, segStep);
        }

        // Render deformed transverse ribs along vertical bar
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          const pop = getPop(baseX, y, curX, curY, curIntensity);
          const z = pop.elevation;
          const r = (BASE_DIAMETER / 2) * (1 + (z / MAX_POP_ELEVATION) * 0.42);
          const flexX = pop.dist > 0 && z > 0 ? (pop.dx / pop.dist) * (z * 0.12) : 0;
          const rx = baseX + flexX;

          const ribAlpha = baseMeshAlpha + pop.weight * (0.92 - baseMeshAlpha);
          const ribYShift = 3.4;

          ctx.save();
          // 1. Dark indentation groove at root of rib
          ctx.strokeStyle = isDark ? `rgba(14, 18, 24, ${ribAlpha * 0.9})` : `rgba(30, 41, 59, ${ribAlpha * 0.8})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(rx - r * 0.92, y - ribYShift);
          ctx.quadraticCurveTo(rx, y + 1.2, rx + r * 0.92, y + ribYShift);
          ctx.stroke();

          // 2. Raised metallic specular ridge crest
          const isHot = z > 7;
          if (isDark) {
            ctx.strokeStyle = isHot
              ? pop.dist < 130
                ? `rgba(245, 158, 11, ${ribAlpha})`
                : `rgba(251, 191, 36, ${ribAlpha})`
              : `rgba(138, 156, 181, ${ribAlpha})`;
          } else {
            ctx.strokeStyle = isHot
              ? pop.dist < 130
                ? `rgba(217, 119, 6, ${ribAlpha})`
                : `rgba(180, 83, 9, ${ribAlpha})`
              : `rgba(203, 213, 225, ${ribAlpha})`;
          }
          ctx.lineWidth = 1.4 + (z / MAX_POP_ELEVATION) * 1.0;
          ctx.beginPath();
          ctx.moveTo(rx - r * 0.88, y - ribYShift - 1);
          ctx.quadraticCurveTo(rx, y + 0.2, rx + r * 0.88, y + ribYShift - 1);
          ctx.stroke();
          ctx.restore();
        }
      }

      // =========================================================================
      // STEP 3: CONTACT SHADOWS AT INTERSECTIONS
      // Soft contact shadow cast by crossing horizontal bars onto vertical bars
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

          const barW = BASE_DIAMETER * (1 + (z / MAX_POP_ELEVATION) * 0.42);
          const shadowAlpha = isDark ? 0.15 + pop.weight * 0.55 : 0.08 + pop.weight * 0.35;

          ctx.fillStyle = isDark ? `rgba(0, 0, 0, ${shadowAlpha})` : `rgba(15, 23, 42, ${shadowAlpha})`;
          ctx.fillRect(nx - barW / 2, ny - 4, barW, 8);
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

          const r0 = (BASE_DIAMETER / 2) * (1 + (pop0.elevation / MAX_POP_ELEVATION) * 0.42);
          const r1 = (BASE_DIAMETER / 2) * (1 + (pop1.elevation / MAX_POP_ELEVATION) * 0.42);

          const flexY0 = pop0.dist > 0 && pop0.elevation > 0 ? (pop0.dy / pop0.dist) * (pop0.elevation * 0.12) : 0;
          const flexY1 = pop1.dist > 0 && pop1.elevation > 0 ? (pop1.dy / pop1.dist) * (pop1.elevation * 0.12) : 0;

          const y0 = baseY + flexY0;
          const y1 = baseY + flexY1;

          const midX = (x0 + x1) / 2;
          const midY = (y0 + y1) / 2;
          const midPop = getPop(midX, baseY, curX, curY, curIntensity);

          const segAlpha = baseMeshAlpha + midPop.weight * (0.88 - baseMeshAlpha);

          const lightOffsetY = midPop.dist > 0 && midPop.elevation > 0 ? -midPop.dy / midPop.dist : 0;
          const hlRatio = Math.max(0.2, Math.min(0.8, 0.4 + lightOffsetY * 0.25));

          const grad = ctx.createLinearGradient(midX, midY - r0, midX, midY + r0);
          if (isDark) {
            grad.addColorStop(0, `rgba(28, 34, 43, ${segAlpha})`);
            grad.addColorStop(Math.max(0.05, hlRatio - 0.2), `rgba(40, 49, 62, ${segAlpha})`);
            grad.addColorStop(hlRatio, midPop.elevation > 8 ? `rgba(240, 244, 250, ${segAlpha})` : `rgba(124, 142, 166, ${segAlpha})`);
            grad.addColorStop(Math.min(0.95, hlRatio + 0.22), `rgba(61, 73, 90, ${segAlpha})`);
            grad.addColorStop(1, `rgba(28, 34, 43, ${segAlpha})`);
          } else {
            grad.addColorStop(0, `rgba(51, 65, 85, ${segAlpha})`);
            grad.addColorStop(Math.max(0.05, hlRatio - 0.2), `rgba(71, 85, 105, ${segAlpha})`);
            grad.addColorStop(hlRatio, midPop.elevation > 8 ? `rgba(248, 250, 252, ${segAlpha})` : `rgba(148, 163, 184, ${segAlpha})`);
            grad.addColorStop(Math.min(0.95, hlRatio + 0.22), `rgba(100, 116, 139, ${segAlpha})`);
            grad.addColorStop(1, `rgba(51, 65, 85, ${segAlpha})`);
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(x0, y0 - r0);
          ctx.lineTo(x1, y1 - r1);
          ctx.lineTo(x1, y1 + r1);
          ctx.lineTo(x0, y0 + r0);
          ctx.closePath();
          ctx.fill();

          // Longitudinal seams
          ctx.fillStyle = isDark ? `rgba(20, 25, 32, ${segAlpha * 0.8})` : `rgba(30, 41, 59, ${segAlpha * 0.7})`;
          ctx.fillRect(x0, y0 - r0 * 0.96, segStep, 1.1);
          ctx.fillRect(x0, y0 + r0 * 0.96 - 1.1, segStep, 1.1);
        }

        // Render deformed transverse ribs along horizontal bar
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          const pop = getPop(x, baseY, curX, curY, curIntensity);
          const z = pop.elevation;
          const r = (BASE_DIAMETER / 2) * (1 + (z / MAX_POP_ELEVATION) * 0.42);
          const flexY = pop.dist > 0 && z > 0 ? (pop.dy / pop.dist) * (z * 0.12) : 0;
          const ry = baseY + flexY;

          const ribAlpha = baseMeshAlpha + pop.weight * (0.92 - baseMeshAlpha);
          const ribXShift = 3.4;

          ctx.save();
          // 1. Dark indentation groove at root of rib
          ctx.strokeStyle = isDark ? `rgba(14, 18, 24, ${ribAlpha * 0.9})` : `rgba(30, 41, 59, ${ribAlpha * 0.8})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(x - ribXShift, ry - r * 0.92);
          ctx.quadraticCurveTo(x + 1.2, ry, x + ribXShift, ry + r * 0.92);
          ctx.stroke();

          // 2. Raised metallic specular ridge crest
          const isHot = z > 7;
          if (isDark) {
            ctx.strokeStyle = isHot
              ? pop.dist < 130
                ? `rgba(245, 158, 11, ${ribAlpha})`
                : `rgba(251, 191, 36, ${ribAlpha})`
              : `rgba(138, 156, 181, ${ribAlpha})`;
          } else {
            ctx.strokeStyle = isHot
              ? pop.dist < 130
                ? `rgba(217, 119, 6, ${ribAlpha})`
                : `rgba(180, 83, 9, ${ribAlpha})`
              : `rgba(203, 213, 225, ${ribAlpha})`;
          }
          ctx.lineWidth = 1.4 + (z / MAX_POP_ELEVATION) * 1.0;
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

          const nodeAlpha = baseMeshAlpha + pop.weight * (0.95 - baseMeshAlpha);
          const weldRadius = 3.2 + (z / MAX_POP_ELEVATION) * 1.5;

          // Weld shadow / heat-tint halo
          ctx.fillStyle = isDark ? `rgba(14, 18, 24, ${nodeAlpha * 0.9})` : `rgba(30, 41, 59, ${nodeAlpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(nx, ny, weldRadius + 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Weld core bead
          if (isDark) {
            ctx.fillStyle = z > 9 ? `rgba(245, 158, 11, ${nodeAlpha})` : `rgba(50, 59, 73, ${nodeAlpha})`;
          } else {
            ctx.fillStyle = z > 9 ? `rgba(217, 119, 6, ${nodeAlpha})` : `rgba(71, 85, 105, ${nodeAlpha})`;
          }
          ctx.beginPath();
          ctx.arc(nx, ny, weldRadius, 0, Math.PI * 2);
          ctx.fill();

          // Specular glint dot on weld bead
          ctx.fillStyle = isDark ? `rgba(240, 244, 250, ${nodeAlpha})` : `rgba(255, 255, 255, ${nodeAlpha})`;
          ctx.beginPath();
          ctx.arc(nx - 0.8, ny - 0.8, Math.max(0.7, weldRadius * 0.35), 0, Math.PI * 2);
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
        mouseIntensity.set(0.15);
        wakeUp();
      }, 2400);
    };

    const handlePointerLeave = () => {
      mouseIntensity.set(0.08);
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
          mouseIntensity.set(0.15);
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
        className="absolute inset-0 block h-full w-full opacity-90 transition-opacity duration-500"
      />

      {/* 2. Soft Content Column Scrim: softly washes rebar behind reading zones while letting margins and hover pop */}
      <div className="absolute inset-0 bg-radial-[ellipse_80%_65%_at_50%_45%] from-bg/30 via-bg/15 to-transparent dark:from-bg/35 dark:via-bg/20 to-transparent pointer-events-none" />

      {/* 3. Soft Edge Vignette to keep viewport perimeter clean */}
      <div className="absolute inset-0 bg-radial-[ellipse_90%_75%_at_50%_50%] from-transparent via-transparent to-bg/75 dark:to-bg/85 pointer-events-none" />

      {/* 4. Subtle page-level vertical gradient preserving top/bottom hierarchy */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-transparent to-bg/50 dark:from-bg/45 dark:via-transparent dark:to-bg/65 pointer-events-none" />
    </div>
  );
}
