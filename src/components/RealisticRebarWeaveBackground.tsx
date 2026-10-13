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

  // Motion physics values for fluid, liquid glide cursor tracking
  const mouseX = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  );
  const mouseY = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  );
  const mouseIntensity = useMotionValue<number>(0.14); // Calm, gentle resting water presence

  // Fluid-calibrated springs via motion/react: silky momentum with smooth hydraulic damping
  const springX = useSpring(mouseX, { stiffness: 85, damping: 24, mass: 1.15 });
  const springY = useSpring(mouseY, { stiffness: 85, damping: 24, mass: 1.15 });
  const springIntensity = useSpring(mouseIntensity, { stiffness: 65, damping: 20 });

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

  // Main rendering engine: 2D Water-Wave fluid mechanics & battery-saving sleep/wake loop
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

    // Track spring motion & cursor velocity for hydrodynamic wake
    let prevX = springX.get();
    let prevY = springY.get();
    let prevIntensity = springIntensity.get();
    let smoothVx = 0;
    let smoothVy = 0;
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

    // Mesh & Fluid Wave Parameters
    const GRID_SPACING = 96; // Breathable mesh spacing
    const BASE_DIAMETER = 12; // Sleek baseline gauge
    const RIB_SPACING = 13; // Distance between transverse ribs
    const INFLUENCE_RADIUS = 360; // Expansive fluid flood reach
    const MAX_POP_ELEVATION = 28; // Peak 3D wave crest in pixels
    const FLUID_WAVELENGTH = 54; // Liquid ripple ring wavelength
    const FLUID_SPEED = 4.2; // Radial water wave propagation speed

    // Hydrodynamic Wave Calculation helper
    const getPop = (
      x: number,
      y: number,
      cx: number,
      cy: number,
      intensity: number,
      time: number,
      vx: number,
      vy: number
    ) => {
      if (shouldReduceMotion || intensity <= 0.005) {
        return { elevation: 0, weight: 0, wavePhase: 0, dx: 0, dy: 0, dist: 999 };
      }

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);

      // Tranquil ambient water breathing (gentle 2D harmonic wave across whole mesh)
      const ambientWave =
        Math.sin(x * 0.006 + y * 0.004 + time * 0.85) *
        Math.cos(x * 0.003 - y * 0.005 + time * 0.65) *
        0.045;

      if (dist >= INFLUENCE_RADIUS) {
        const ambElevation = Math.max(0, ambientWave) * MAX_POP_ELEVATION * intensity;
        return {
          elevation: ambElevation,
          weight: Math.max(0, ambientWave) * intensity,
          wavePhase: 0,
          dx,
          dy,
          dist,
        };
      }

      const u = dist / INFLUENCE_RADIUS;

      // 1. Primary smooth water mound (central fluid displacement)
      const mound = Math.pow(1 - u * u, 2);

      // 2. Concentric propagating water ripples rolling smoothly outward
      const wavePhase = (dist / FLUID_WAVELENGTH) - time * FLUID_SPEED;
      // Damped harmonic wave
      const ripple = Math.cos(wavePhase) * Math.pow(1 - u, 1.35) * 0.32;

      // 3. Directional fluid wake (pushes in direction of cursor glide)
      const speed = Math.hypot(vx, vy);
      let wake = 0;
      if (speed > 0.8 && dist > 14) {
        const dirDot = (dx * vx + dy * vy) / (dist * speed);
        wake = dirDot * Math.min(0.38, speed * 0.007) * Math.pow(1 - u, 1.7);
      }

      // Combine into smooth water flood weight
      const combined = Math.max(0, mound * 0.68 + ripple + wake + ambientWave) * intensity;
      const elevation = combined * MAX_POP_ELEVATION;

      return { elevation, weight: combined, wavePhase, dx, dy, dist };
    };

    // Draw a single frame of the liquid rebar weave
    const drawFrame = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - lastTime) / 1000));
      lastTime = now;
      const time = now / 1000;

      const curX = springX.get();
      const curY = springY.get();
      const curIntensity = springIntensity.get();
      const isDark = document.documentElement.classList.contains('dark');

      // Update smoothed hydrodynamic velocity
      const instantVx = (curX - prevX) / dt;
      const instantVy = (curY - prevY) / dt;
      smoothVx += (instantVx - smoothVx) * 0.18;
      smoothVy += (instantVy - smoothVy) * 0.18;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Baseline resting opacity: subtle, non-intrusive architectural watermark
      const baseMeshAlpha = isDark ? 0.20 : 0.14;

      // 1. Water Flood Lighting / Fluid Sheen Aura
      if (curIntensity > 0.04 && !shouldReduceMotion) {
        const glowRad = INFLUENCE_RADIUS * 1.15;
        const radial = ctx.createRadialGradient(curX, curY, 25, curX, curY, glowRad);
        radial.addColorStop(0, isDark ? 'rgba(245, 124, 0, 0.16)' : 'rgba(180, 83, 9, 0.11)');
        radial.addColorStop(0.35, isDark ? 'rgba(245, 124, 0, 0.06)' : 'rgba(180, 83, 9, 0.04)');
        radial.addColorStop(0.7, isDark ? 'rgba(245, 124, 0, 0.015)' : 'rgba(180, 83, 9, 0.01)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(curX, curY, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }

      const cols = Math.ceil(width / GRID_SPACING) + 2;
      const rows = Math.ceil(height / GRID_SPACING) + 2;

      // =========================================================================
      // STEP 1: LIQUID DROP SHADOWS (FLOODING DEPTH)
      // Dynamic shadows roll and displace outward following the fluid wave crests
      // =========================================================================
      ctx.save();
      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        const step = 20;

        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += step) {
          const pop = getPop(baseX, y + step / 2, curX, curY, curIntensity, time, smoothVx, smoothVy);
          const z = pop.elevation;
          const ratio = z / MAX_POP_ELEVATION;

          const lightOffsetX = pop.dist > 0 ? (pop.dx / pop.dist) * (z * 0.65) : 3;
          const lightOffsetY = pop.dist > 0 ? (pop.dy / pop.dist) * (z * 0.65) : 4;

          const shadowWidth = BASE_DIAMETER * (1 + ratio * 0.45);
          const shadowX = baseX + 3 + lightOffsetX;
          const shadowY = y + 4 + lightOffsetY;

          const shadowAlpha = isDark
            ? 0.08 + pop.weight * 0.52
            : 0.04 + pop.weight * 0.26;

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
          const pop = getPop(x + step / 2, baseY, curX, curY, curIntensity, time, smoothVx, smoothVy);
          const z = pop.elevation;
          const ratio = z / MAX_POP_ELEVATION;

          const lightOffsetX = pop.dist > 0 ? (pop.dx / pop.dist) * (z * 0.65) : 3;
          const lightOffsetY = pop.dist > 0 ? (pop.dy / pop.dist) * (z * 0.65) : 4;

          const shadowHeight = BASE_DIAMETER * (1 + ratio * 0.45);
          const shadowX = x + 3 + lightOffsetX;
          const shadowY = baseY + 4 + lightOffsetY;

          const shadowAlpha = isDark
            ? 0.09 + pop.weight * 0.56
            : 0.05 + pop.weight * 0.28;

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
      // Continuous cylindrical tapered polygon with liquid lateral wave sway
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        const segStep = 18;

        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += segStep) {
          const y0 = y;
          const y1 = y + segStep;

          const pop0 = getPop(baseX, y0, curX, curY, curIntensity, time, smoothVx, smoothVy);
          const pop1 = getPop(baseX, y1, curX, curY, curIntensity, time, smoothVx, smoothVy);

          const r0 = (BASE_DIAMETER / 2) * (1 + (pop0.elevation / MAX_POP_ELEVATION) * 0.42);
          const r1 = (BASE_DIAMETER / 2) * (1 + (pop1.elevation / MAX_POP_ELEVATION) * 0.42);

          // Liquid transverse wave sway: sinusoidal flex mimics water ripples
          const sway0 = Math.sin(pop0.wavePhase) * (pop0.elevation * 0.15);
          const sway1 = Math.sin(pop1.wavePhase) * (pop1.elevation * 0.15);

          const flexX0 = pop0.dist > 0 ? (pop0.dx / pop0.dist) * sway0 : 0;
          const flexX1 = pop1.dist > 0 ? (pop1.dx / pop1.dist) * sway1 : 0;

          const x0 = baseX + flexX0;
          const x1 = baseX + flexX1;

          const midY = (y0 + y1) / 2;
          const midX = (x0 + x1) / 2;
          const midPop = getPop(baseX, midY, curX, curY, curIntensity, time, smoothVx, smoothVy);

          // Localized proximity alpha: smooth flood transition
          const segAlpha = baseMeshAlpha + midPop.weight * (0.88 - baseMeshAlpha);

          const lightOffsetX = midPop.dist > 0 && midPop.elevation > 0 ? -midPop.dx / midPop.dist : 0;
          const hlRatio = Math.max(0.2, Math.min(0.8, 0.4 + lightOffsetX * 0.25));

          const grad = ctx.createLinearGradient(midX - r0, midY, midX + r0, midY);
          if (isDark) {
            grad.addColorStop(0, `rgba(28, 34, 43, ${segAlpha})`);
            grad.addColorStop(Math.max(0.05, hlRatio - 0.2), `rgba(40, 49, 62, ${segAlpha})`);
            grad.addColorStop(
              hlRatio,
              midPop.elevation > 7
                ? `rgba(242, 246, 252, ${segAlpha})`
                : `rgba(124, 142, 166, ${segAlpha})`
            );
            grad.addColorStop(Math.min(0.95, hlRatio + 0.22), `rgba(61, 73, 90, ${segAlpha})`);
            grad.addColorStop(1, `rgba(28, 34, 43, ${segAlpha})`);
          } else {
            grad.addColorStop(0, `rgba(51, 65, 85, ${segAlpha})`);
            grad.addColorStop(Math.max(0.05, hlRatio - 0.2), `rgba(71, 85, 105, ${segAlpha})`);
            grad.addColorStop(
              hlRatio,
              midPop.elevation > 7
                ? `rgba(248, 250, 252, ${segAlpha})`
                : `rgba(148, 163, 184, ${segAlpha})`
            );
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
          ctx.fillStyle = isDark
            ? `rgba(20, 25, 32, ${segAlpha * 0.8})`
            : `rgba(30, 41, 59, ${segAlpha * 0.7})`;
          ctx.fillRect(x0 - r0 * 0.96, y0, 1.1, segStep);
          ctx.fillRect(x0 + r0 * 0.96 - 1.1, y0, 1.1, segStep);
        }

        // Render deformed transverse ribs along vertical bar
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          const pop = getPop(baseX, y, curX, curY, curIntensity, time, smoothVx, smoothVy);
          const z = pop.elevation;
          const r = (BASE_DIAMETER / 2) * (1 + (z / MAX_POP_ELEVATION) * 0.42);

          const sway = Math.sin(pop.wavePhase) * (z * 0.15);
          const flexX = pop.dist > 0 ? (pop.dx / pop.dist) * sway : 0;
          const rx = baseX + flexX;

          const ribAlpha = baseMeshAlpha + pop.weight * (0.92 - baseMeshAlpha);
          const ribYShift = 3.4;

          ctx.save();
          // 1. Dark indentation groove at root of rib
          ctx.strokeStyle = isDark
            ? `rgba(14, 18, 24, ${ribAlpha * 0.9})`
            : `rgba(30, 41, 59, ${ribAlpha * 0.8})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(rx - r * 0.92, y - ribYShift);
          ctx.quadraticCurveTo(rx, y + 1.2, rx + r * 0.92, y + ribYShift);
          ctx.stroke();

          // 2. Liquid specular crest: shines brightly at the wave crests
          const isWaveCrest = z > 6 && Math.cos(pop.wavePhase) > 0.15;
          if (isDark) {
            ctx.strokeStyle = isWaveCrest
              ? pop.dist < 140
                ? `rgba(245, 158, 11, ${ribAlpha})`
                : `rgba(251, 191, 36, ${ribAlpha})`
              : `rgba(138, 156, 181, ${ribAlpha})`;
          } else {
            ctx.strokeStyle = isWaveCrest
              ? pop.dist < 140
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
          const pop = getPop(ix, iy, curX, curY, curIntensity, time, smoothVx, smoothVy);
          const z = pop.elevation;

          const swayX = Math.sin(pop.wavePhase) * (z * 0.15);
          const swayY = Math.cos(pop.wavePhase) * (z * 0.15);
          const flexX = pop.dist > 0 ? (pop.dx / pop.dist) * swayX : 0;
          const flexY = pop.dist > 0 ? (pop.dy / pop.dist) * swayY : 0;
          const nx = ix + flexX;
          const ny = iy + flexY;

          const barW = BASE_DIAMETER * (1 + (z / MAX_POP_ELEVATION) * 0.42);
          const shadowAlpha = isDark ? 0.15 + pop.weight * 0.52 : 0.08 + pop.weight * 0.32;

          ctx.fillStyle = isDark
            ? `rgba(0, 0, 0, ${shadowAlpha})`
            : `rgba(15, 23, 42, ${shadowAlpha})`;
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

          const pop0 = getPop(x0, baseY, curX, curY, curIntensity, time, smoothVx, smoothVy);
          const pop1 = getPop(x1, baseY, curX, curY, curIntensity, time, smoothVx, smoothVy);

          const r0 = (BASE_DIAMETER / 2) * (1 + (pop0.elevation / MAX_POP_ELEVATION) * 0.42);
          const r1 = (BASE_DIAMETER / 2) * (1 + (pop1.elevation / MAX_POP_ELEVATION) * 0.42);

          const sway0 = Math.cos(pop0.wavePhase) * (pop0.elevation * 0.15);
          const sway1 = Math.cos(pop1.wavePhase) * (pop1.elevation * 0.15);

          const flexY0 = pop0.dist > 0 ? (pop0.dy / pop0.dist) * sway0 : 0;
          const flexY1 = pop1.dist > 0 ? (pop1.dy / pop1.dist) * sway1 : 0;

          const y0 = baseY + flexY0;
          const y1 = baseY + flexY1;

          const midX = (x0 + x1) / 2;
          const midY = (y0 + y1) / 2;
          const midPop = getPop(midX, baseY, curX, curY, curIntensity, time, smoothVx, smoothVy);

          const segAlpha = baseMeshAlpha + midPop.weight * (0.88 - baseMeshAlpha);

          const lightOffsetY = midPop.dist > 0 && midPop.elevation > 0 ? -midPop.dy / midPop.dist : 0;
          const hlRatio = Math.max(0.2, Math.min(0.8, 0.4 + lightOffsetY * 0.25));

          const grad = ctx.createLinearGradient(midX, midY - r0, midX, midY + r0);
          if (isDark) {
            grad.addColorStop(0, `rgba(28, 34, 43, ${segAlpha})`);
            grad.addColorStop(Math.max(0.05, hlRatio - 0.2), `rgba(40, 49, 62, ${segAlpha})`);
            grad.addColorStop(
              hlRatio,
              midPop.elevation > 7
                ? `rgba(242, 246, 252, ${segAlpha})`
                : `rgba(124, 142, 166, ${segAlpha})`
            );
            grad.addColorStop(Math.min(0.95, hlRatio + 0.22), `rgba(61, 73, 90, ${segAlpha})`);
            grad.addColorStop(1, `rgba(28, 34, 43, ${segAlpha})`);
          } else {
            grad.addColorStop(0, `rgba(51, 65, 85, ${segAlpha})`);
            grad.addColorStop(Math.max(0.05, hlRatio - 0.2), `rgba(71, 85, 105, ${segAlpha})`);
            grad.addColorStop(
              hlRatio,
              midPop.elevation > 7
                ? `rgba(248, 250, 252, ${segAlpha})`
                : `rgba(148, 163, 184, ${segAlpha})`
            );
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
          ctx.fillStyle = isDark
            ? `rgba(20, 25, 32, ${segAlpha * 0.8})`
            : `rgba(30, 41, 59, ${segAlpha * 0.7})`;
          ctx.fillRect(x0, y0 - r0 * 0.96, segStep, 1.1);
          ctx.fillRect(x0, y0 + r0 * 0.96 - 1.1, segStep, 1.1);
        }

        // Render deformed transverse ribs along horizontal bar
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          const pop = getPop(x, baseY, curX, curY, curIntensity, time, smoothVx, smoothVy);
          const z = pop.elevation;
          const r = (BASE_DIAMETER / 2) * (1 + (z / MAX_POP_ELEVATION) * 0.42);

          const sway = Math.cos(pop.wavePhase) * (z * 0.15);
          const flexY = pop.dist > 0 ? (pop.dy / pop.dist) * sway : 0;
          const ry = baseY + flexY;

          const ribAlpha = baseMeshAlpha + pop.weight * (0.92 - baseMeshAlpha);
          const ribXShift = 3.4;

          ctx.save();
          // 1. Dark indentation groove at root of rib
          ctx.strokeStyle = isDark
            ? `rgba(14, 18, 24, ${ribAlpha * 0.9})`
            : `rgba(30, 41, 59, ${ribAlpha * 0.8})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(x - ribXShift, ry - r * 0.92);
          ctx.quadraticCurveTo(x + 1.2, ry, x + ribXShift, ry + r * 0.92);
          ctx.stroke();

          // 2. Liquid specular crest
          const isWaveCrest = z > 6 && Math.cos(pop.wavePhase) > 0.15;
          if (isDark) {
            ctx.strokeStyle = isWaveCrest
              ? pop.dist < 140
                ? `rgba(245, 158, 11, ${ribAlpha})`
                : `rgba(251, 191, 36, ${ribAlpha})`
              : `rgba(138, 156, 181, ${ribAlpha})`;
          } else {
            ctx.strokeStyle = isWaveCrest
              ? pop.dist < 140
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
      // STEP 5: WELDED NODES / CROSS JOINTS (Hydrodynamic Elevation)
      // Resistance weld nugget at intersection points with fluid heat glint
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const ix = c * GRID_SPACING;
          const iy = r * GRID_SPACING;
          const pop = getPop(ix, iy, curX, curY, curIntensity, time, smoothVx, smoothVy);
          const z = pop.elevation;

          const swayX = Math.sin(pop.wavePhase) * (z * 0.15);
          const swayY = Math.cos(pop.wavePhase) * (z * 0.15);
          const flexX = pop.dist > 0 ? (pop.dx / pop.dist) * swayX : 0;
          const flexY = pop.dist > 0 ? (pop.dy / pop.dist) * swayY : 0;
          const nx = ix + flexX;
          const ny = iy + flexY;

          const nodeAlpha = baseMeshAlpha + pop.weight * (0.95 - baseMeshAlpha);
          const weldRadius = 3.2 + (z / MAX_POP_ELEVATION) * 1.5;

          // Weld shadow / halo
          ctx.fillStyle = isDark
            ? `rgba(14, 18, 24, ${nodeAlpha * 0.9})`
            : `rgba(30, 41, 59, ${nodeAlpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(nx, ny, weldRadius + 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Weld core bead
          if (isDark) {
            ctx.fillStyle =
              z > 8
                ? `rgba(245, 158, 11, ${nodeAlpha})`
                : `rgba(50, 59, 73, ${nodeAlpha})`;
          } else {
            ctx.fillStyle =
              z > 8
                ? `rgba(217, 119, 6, ${nodeAlpha})`
                : `rgba(71, 85, 105, ${nodeAlpha})`;
          }
          ctx.beginPath();
          ctx.arc(nx, ny, weldRadius, 0, Math.PI * 2);
          ctx.fill();

          // Specular glint dot on weld bead
          ctx.fillStyle = isDark
            ? `rgba(240, 244, 250, ${nodeAlpha})`
            : `rgba(255, 255, 255, ${nodeAlpha})`;
          ctx.beginPath();
          ctx.arc(nx - 0.8, ny - 0.8, Math.max(0.7, weldRadius * 0.35), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore(); // restore dpr scale

      // Check if motion and liquid ripples have settled to calm rest
      const deltaX = Math.abs(curX - prevX);
      const deltaY = Math.abs(curY - prevY);
      const deltaI = Math.abs(curIntensity - prevIntensity);
      prevX = curX;
      prevY = curY;
      prevIntensity = curIntensity;

      // Allow fluid ripples to smoothly radiate and dissipate over ~60 frames
      if (deltaX < 0.05 && deltaY < 0.05 && deltaI < 0.003 && curIntensity <= 0.16) {
        settledFrames++;
      } else {
        settledFrames = 0;
      }
    };

    // Animation frame loop with smart power-saving sleep
    const loop = (now: number) => {
      if (!isMounted) return;

      drawFrame(now);

      // If settled for more than 75 frames (liquid ripples smoothly calmed), sleep to save 100% CPU
      if (settledFrames > 75) {
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
        lastTime = performance.now();
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
        // Settle smoothly to gentle resting water breathing
        mouseIntensity.set(0.14);
        wakeUp();
      }, 2800);
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
          mouseIntensity.set(0.14);
          wakeUp();
        }, 2500);
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
      {/* 1. High-Performance Fluid Water-Wave Rebar Weave Canvas */}
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
