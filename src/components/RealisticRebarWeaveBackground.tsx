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

  // Cursor coordinates
  const mouseX = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  );
  const mouseY = useMotionValue<number>(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  );
  const mouseIntensity = useMotionValue<number>(0.14);

  // Ball gliding physics: critically-damped, instantaneous & silky luxury momentum
  // (Zero perceptible latency, zero rubbery overshoot, ultra-smooth 120fps feel)
  const springX = useSpring(mouseX, { stiffness: 280, damping: 28, mass: 0.28 });
  const springY = useSpring(mouseY, { stiffness: 280, damping: 28, mass: 0.28 });
  const springIntensity = useSpring(mouseIntensity, { stiffness: 180, damping: 22 });

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

    // Mesh & Focused Gliding Ball Parameters (Moderately sized, non-overpowering)
    const GRID_SPACING = 96; // Breathable mesh cell size
    const BASE_DIAMETER = 12.5; // Authentic structural steel rebar gauge
    const RIB_SPACING = 13.5; // Transverse rib spacing
    const BALL_RADIUS = 145; // Moderately sized focus radius (~290px diameter, tight & elegant)
    const BALL_RADIUS_SQ = BALL_RADIUS * BALL_RADIUS;
    const MAX_BALL_ELEVATION = 18; // Tasteful 3D elevation dome height

    // Zero-allocation reusable scratch values for ultra-fast 120 FPS frame math
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

      // Subdued, architectural palettes that do NOT overpower text
      const p = isDark
        ? {
            // Dark Mode: Moody, deep architectural carbon steel
            floorBaseShadow: 'rgba(0, 0, 0, 0.20)',
            barRim: 'rgba(18, 23, 31, 0.45)',
            barCoreDark: 'rgba(28, 35, 48, 0.45)',
            barMidtone: 'rgba(48, 58, 75, 0.45)',
            barSpecular: 'rgba(110, 126, 150, 0.35)',
            ribGroove: 'rgba(10, 14, 20, 0.38)',
            ribHighlight: 'rgba(148, 163, 184, 0.28)',
            jointOcclusion: 'rgba(0, 0, 0, 0.50)',
            // Popped zone: Brushed titanium & platinum sheen with warm champagne/amber caustics
            popBarCore: 'rgba(42, 53, 70, 0.75)',
            popBarSpecular: 'rgba(240, 246, 255, 0.85)',
            popRibCrest: 'rgba(226, 232, 240, 0.65)',
            popRibAmberGlint: 'rgba(245, 158, 11, 0.45)',
            weldHAZ: 'rgba(15, 20, 28, 0.70)',
            weldNode: 'rgba(48, 58, 74, 0.60)',
            weldHot: '#f59e0b',
            ballShadow: 'rgba(0, 0, 0, 0.45)',
            ballHaloInner: 'rgba(245, 158, 11, 0.10)',
            ballHaloMid: 'rgba(245, 124, 0, 0.025)',
          }
        : {
            // Light Mode: Architectural blueprint slate & satin stainless steel
            floorBaseShadow: 'rgba(15, 23, 42, 0.06)',
            barRim: 'rgba(51, 65, 85, 0.22)',
            barCoreDark: 'rgba(71, 85, 105, 0.24)',
            barMidtone: 'rgba(100, 116, 139, 0.22)',
            barSpecular: 'rgba(148, 163, 184, 0.26)',
            ribGroove: 'rgba(30, 41, 59, 0.20)',
            ribHighlight: 'rgba(203, 213, 225, 0.32)',
            jointOcclusion: 'rgba(15, 23, 42, 0.18)',
            // Popped zone
            popBarCore: 'rgba(71, 85, 105, 0.65)',
            popBarSpecular: 'rgba(255, 255, 255, 0.90)',
            popRibCrest: 'rgba(203, 213, 225, 0.70)',
            popRibAmberGlint: 'rgba(217, 119, 6, 0.40)',
            weldHAZ: 'rgba(30, 41, 59, 0.45)',
            weldNode: 'rgba(71, 85, 105, 0.55)',
            weldHot: '#d97706',
            ballShadow: 'rgba(15, 23, 42, 0.22)',
            ballHaloInner: 'rgba(217, 119, 6, 0.08)',
            ballHaloMid: 'rgba(180, 83, 9, 0.02)',
          };

      // Subtle scroll parallax depth (seamless modulo repeat)
      const scrollShiftY = (scrollY * 0.14) % GRID_SPACING;

      const cols = Math.ceil(width / GRID_SPACING) + 2;
      const rows = Math.ceil(height / GRID_SPACING) + 3;

      // Active bounding indices for the moderately sized gliding ball
      const minActiveCol = Math.max(0, Math.floor((curX - BALL_RADIUS) / GRID_SPACING));
      const maxActiveCol = Math.min(cols - 1, Math.ceil((curX + BALL_RADIUS) / GRID_SPACING));
      const minActiveRow = Math.max(0, Math.floor((curY - BALL_RADIUS - scrollShiftY) / GRID_SPACING));
      const maxActiveRow = Math.min(rows - 1, Math.ceil((curY + BALL_RADIUS - scrollShiftY) / GRID_SPACING));

      // =========================================================================
      // STEP 1: MODERATE GLIDING BALL EFFECT (SHADOW & AURA)
      // Compact, elegant focus radius (~145px) that highlights without blinding
      // =========================================================================
      if (curIntensity > 0.03 && !shouldReduceMotion) {
        // 1A. Soft 3D Contact Shadow beneath the gliding ball with subtle velocity bias
        const shadowOffsetX = 7 + Math.max(-10, Math.min(10, smoothVx * 0.012));
        const shadowOffsetY = 8 + Math.max(-10, Math.min(10, smoothVy * 0.012));
        const shadowRad = BALL_RADIUS * 0.72;

        const sphereShadow = ctx.createRadialGradient(
          curX + shadowOffsetX,
          curY + shadowOffsetY,
          8,
          curX + shadowOffsetX,
          curY + shadowOffsetY,
          shadowRad
        );
        sphereShadow.addColorStop(0, p.ballShadow);
        sphereShadow.addColorStop(0.55, isDark ? 'rgba(0, 0, 0, 0.16)' : 'rgba(15, 23, 42, 0.06)');
        sphereShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = sphereShadow;
        ctx.beginPath();
        ctx.arc(curX + shadowOffsetX, curY + shadowOffsetY, shadowRad, 0, Math.PI * 2);
        ctx.fill();

        // 1B. Luminous Gliding Ball Aura (Soft champagne/amber light, non-distracting)
        const auraRad = BALL_RADIUS * 0.85;
        const ballLight = ctx.createRadialGradient(curX, curY, 8, curX, curY, auraRad);
        ballLight.addColorStop(0, p.ballHaloInner);
        ballLight.addColorStop(0.4, p.ballHaloMid);
        ballLight.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = ballLight;
        ctx.beginPath();
        ctx.arc(curX, curY, auraRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // STEP 2: BASE REBAR WEAVE (BACKGROUND LAYER - QUIET & SUBDUED)
      // =========================================================================

      // 2A. Base floor cast shadows (Single batched GPU draw call)
      ctx.beginPath();
      ctx.strokeStyle = p.floorBaseShadow;
      ctx.lineWidth = BASE_DIAMETER * 1.1;
      ctx.lineCap = 'round';

      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING + 2.5;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING + scrollShiftY + 3;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      // 2B. Vertical Rebar Cylinders (Layer 1)
      ctx.beginPath();
      ctx.strokeStyle = p.barRim;
      ctx.lineWidth = BASE_DIAMETER;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = p.barMidtone;
      ctx.lineWidth = BASE_DIAMETER - 3.5;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = p.barSpecular;
      ctx.lineWidth = 1.2;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING - 1.8;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      ctx.stroke();

      // 2C. Inter-Layer Contact Occlusion (Horizontal bar casts micro-shadow on Vertical bar)
      ctx.fillStyle = p.jointOcclusion;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const y = r * GRID_SPACING + scrollShiftY;
          ctx.fillRect(x - BASE_DIAMETER * 0.45, y - BASE_DIAMETER * 0.45, BASE_DIAMETER * 0.9, BASE_DIAMETER * 0.9);
        }
      }

      // 2D. Horizontal Rebar Cylinders (Layer 2 - Crossing on top)
      ctx.beginPath();
      ctx.strokeStyle = p.barRim;
      ctx.lineWidth = BASE_DIAMETER;
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING + scrollShiftY;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = p.barMidtone;
      ctx.lineWidth = BASE_DIAMETER - 3.5;
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING + scrollShiftY;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = p.barSpecular;
      ctx.lineWidth = 1.2;
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING + scrollShiftY - 1.8;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      // 2E. Base Transverse Ribs (Contoured deformed ridges, quiet & subtle)
      ctx.beginPath();
      ctx.strokeStyle = p.ribGroove;
      ctx.lineWidth = 1.8;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          ctx.moveTo(x - 5, y - 3);
          ctx.quadraticCurveTo(x, y + 1, x + 5, y + 3);
        }
      }
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING + scrollShiftY;
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          ctx.moveTo(x - 3, y - 5);
          ctx.quadraticCurveTo(x + 1, y, x + 3, y + 5);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = p.ribHighlight;
      ctx.lineWidth = 1.1;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          ctx.moveTo(x - 4.5, y - 3.8);
          ctx.quadraticCurveTo(x, y + 0.2, x + 4.5, y + 2.2);
        }
      }
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING + scrollShiftY;
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          ctx.moveTo(x - 3.8, y - 4.5);
          ctx.quadraticCurveTo(x + 0.2, y, x + 2.2, y + 4.5);
        }
      }
      ctx.stroke();

      // 2F. Base weld intersection dots (Clean welded wire fabric nodes)
      ctx.beginPath();
      ctx.fillStyle = p.weldNode;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const y = r * GRID_SPACING + scrollShiftY;
          ctx.moveTo(x + 2.6, y);
          ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // =========================================================================
      // STEP 3: TASTEFUL 3D POP DOME (UNDER THE GLIDING BALL ONLY)
      // Focused, authentic deformed steel look with traveling optical caustics
      // =========================================================================
      if (curIntensity > 0.03 && !shouldReduceMotion) {
        // 3A. Dynamic 3D Drop Shadows on the ball dome
        ctx.beginPath();
        ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.55)' : 'rgba(15, 23, 42, 0.25)';

        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS; y <= curY + BALL_RADIUS; y += 18) {
            if (!calcDome(baseX, y, curX, curY, curIntensity) || domeWeight <= 0.03) continue;

            const dirX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.65);
            const dirY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.65);
            const sw = BASE_DIAMETER * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.45);

            ctx.rect(baseX + 3 + dirX - sw / 2, y + 4 + dirY, sw, 19);
          }
        }

        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          for (let x = curX - BALL_RADIUS; x <= curX + BALL_RADIUS; x += 18) {
            if (!calcDome(x, baseY, curX, curY, curIntensity) || domeWeight <= 0.03) continue;

            const dirX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.65);
            const dirY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.65);
            const sh = BASE_DIAMETER * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.45);

            ctx.rect(x + 3 + dirX, baseY + 4 + dirY - sh / 2, 19, sh);
          }
        }
        ctx.fill();

        // 3B. Vertical Bars Popping over the Gliding Ball with Traveling Optical Caustics
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          const segStep = 16;
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

            const r0 = (BASE_DIAMETER / 2) * (1 + (z0 / MAX_BALL_ELEVATION) * 0.42);
            const r1 = (BASE_DIAMETER / 2) * (1 + (z1 / MAX_BALL_ELEVATION) * 0.42);

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

            // Traveling Caustic Specular Flare (Glint brightens and flares right at light apex)
            const midY = (y0 + y1) * 0.5;
            const distToLight = Math.hypot(baseX - curX, midY - curY);
            const lightProximity = Math.max(0, 1 - distToLight / (BALL_RADIUS * 0.8));

            ctx.strokeStyle = p.popBarSpecular;
            ctx.lineWidth = 1.4 + lightProximity * 1.2;
            ctx.beginPath();
            ctx.moveTo(x0 - r0 * 0.35, y0);
            ctx.lineTo(x1 - r1 * 0.35, y1);
            ctx.stroke();

            // Diamond-sharp platinum highlight core at closest light proximity
            if (lightProximity > 0.25) {
              ctx.strokeStyle = isDark ? '#ffffff' : '#ffffff';
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(x0 - r0 * 0.32, y0);
              ctx.lineTo(x1 - r1 * 0.32, y1);
              ctx.stroke();
            }
          }
        }

        // 3C. Horizontal Bars Popping over the Gliding Ball with Traveling Optical Caustics
        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          const segStep = 16;
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

            const r0 = (BASE_DIAMETER / 2) * (1 + (z0 / MAX_BALL_ELEVATION) * 0.42);
            const r1 = (BASE_DIAMETER / 2) * (1 + (z1 / MAX_BALL_ELEVATION) * 0.42);

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

            // Traveling Caustic Specular Flare
            const midX = (x0 + x1) * 0.5;
            const distToLight = Math.hypot(midX - curX, baseY - curY);
            const lightProximity = Math.max(0, 1 - distToLight / (BALL_RADIUS * 0.8));

            ctx.strokeStyle = p.popBarSpecular;
            ctx.lineWidth = 1.4 + lightProximity * 1.2;
            ctx.beginPath();
            ctx.moveTo(x0, y0 - r0 * 0.35);
            ctx.lineTo(x1, y1 - r1 * 0.35);
            ctx.stroke();

            if (lightProximity > 0.25) {
              ctx.strokeStyle = isDark ? '#ffffff' : '#ffffff';
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(x0, y0 - r0 * 0.32);
              ctx.lineTo(x1, y1 - r1 * 0.32);
              ctx.stroke();
            }
          }
        }

        // 3D. Contoured Transverse Ribs with Subtle Metallic Amber Glints
        ctx.beginPath();
        ctx.strokeStyle = p.popRibCrest;
        ctx.lineWidth = 1.5;

        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS; y <= curY + BALL_RADIUS; y += RIB_SPACING) {
            if (!calcDome(baseX, y, curX, curY, curIntensity) || domeWeight < 0.1) continue;

            const r = (BASE_DIAMETER / 2) * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.42);
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);
            const rx = baseX + flexX;

            ctx.moveTo(rx - r * 0.85, y - 3.8);
            ctx.quadraticCurveTo(rx, y + 0.4, rx + r * 0.85, y + 2.4);
          }
        }

        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          for (let x = curX - BALL_RADIUS; x <= curX + BALL_RADIUS; x += RIB_SPACING) {
            if (!calcDome(x, baseY, curX, curY, curIntensity) || domeWeight < 0.1) continue;

            const r = (BASE_DIAMETER / 2) * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.42);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);
            const ry = baseY + flexY;

            ctx.moveTo(x - 3.8, ry - r * 0.85);
            ctx.quadraticCurveTo(x + 0.4, ry, x + 2.4, ry + r * 0.85);
          }
        }
        ctx.stroke();

        // Subtle amber warmth on ribs directly under the spotlight
        ctx.beginPath();
        ctx.strokeStyle = p.popRibAmberGlint;
        ctx.lineWidth = 1.3;

        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS * 0.6; y <= curY + BALL_RADIUS * 0.6; y += RIB_SPACING) {
            if (!calcDome(baseX, y, curX, curY, curIntensity) || domeWeight < 0.22) continue;

            const r = (BASE_DIAMETER / 2) * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.42);
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);
            const rx = baseX + flexX;

            ctx.moveTo(rx - r * 0.6, y - 2.5);
            ctx.lineTo(rx + r * 0.6, y + 1.5);
          }
        }

        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          for (let x = curX - BALL_RADIUS * 0.6; x <= curX + BALL_RADIUS * 0.6; x += RIB_SPACING) {
            if (!calcDome(x, baseY, curX, curY, curIntensity) || domeWeight < 0.22) continue;

            const r = (BASE_DIAMETER / 2) * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.42);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);
            const ry = baseY + flexY;

            ctx.moveTo(x - 2.5, ry - r * 0.6);
            ctx.lineTo(x + 1.5, ry + r * 0.6);
          }
        }
        ctx.stroke();

        // 3E. 3D Precision Welded Nodes on the Ball Dome with Light-Directed Specular Glint
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const ix = c * GRID_SPACING;
          for (let r = minActiveRow; r <= maxActiveRow; r++) {
            const iy = r * GRID_SPACING + scrollShiftY;
            if (!calcDome(ix, iy, curX, curY, curIntensity) || domeWeight < 0.1) continue;

            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.12);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.12);
            const nx = ix + flexX;
            const ny = iy + flexY;
            const weldR = 3.2 + (domeZ / MAX_BALL_ELEVATION) * 1.2;

            // Heat-affected zone collar
            ctx.beginPath();
            ctx.fillStyle = p.weldHAZ;
            ctx.arc(nx, ny, weldR + 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Weld bead core
            ctx.beginPath();
            ctx.fillStyle = domeDist < 65 ? p.weldHot : p.weldNode;
            ctx.arc(nx, ny, weldR, 0, Math.PI * 2);
            ctx.fill();

            // Specular gleam offset dynamically towards the light source
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

      if (deltaX < 0.05 && deltaY < 0.05 && deltaI < 0.003 && curIntensity <= 0.2) {
        settledFrames++;
      } else {
        settledFrames = 0;
      }
    };

    // Animation frame loop with smart power-saving sleep
    const loop = (now: number) => {
      if (!isMounted) return;

      drawFrame(now);

      // Sleep after 60 frames of calm rest to save 100% CPU/battery
      if (settledFrames > 60) {
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

    // Global pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      mouseIntensity.set(1.0);
      wakeUp();

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        mouseIntensity.set(0.14);
        wakeUp();
      }, 2200);
    };

    const handlePointerLeave = () => {
      mouseIntensity.set(0.08);
      wakeUp();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Touch support for mobile/tablet
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
        }, 2000);
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
      {/* 1. Realistic Rebar Weave Canvas (Calibrated opacity so it never overpowers text) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full opacity-55 dark:opacity-60 transition-opacity duration-300"
      />

      {/* 2. Soft Content Column Scrim: softly washes rebar behind reading zones while letting margins and hover pop */}
      <div className="absolute inset-0 bg-radial-[ellipse_80%_65%_at_50%_45%] from-bg/60 via-bg/35 to-transparent dark:from-bg/65 dark:via-bg/40 to-transparent pointer-events-none" />

      {/* 3. Soft Edge Vignette to keep viewport perimeter clean */}
      <div className="absolute inset-0 bg-radial-[ellipse_90%_75%_at_50%_50%] from-transparent via-transparent to-bg/80 dark:to-bg/90 pointer-events-none" />

      {/* 4. Subtle page-level vertical gradient preserving top/bottom hierarchy */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg/75 dark:from-bg/70 dark:via-transparent dark:to-bg/85 pointer-events-none" />

      {/* 5. Left-side Reading Scrim: gently softens rebar specifically under left-aligned headlines and copy */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-bg/75 via-bg/45 to-transparent dark:from-bg/80 dark:via-bg/50 to-transparent pointer-events-none" />
    </div>
  );
}
