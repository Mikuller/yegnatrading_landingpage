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

    // Mesh & 3D Spherical Pop Parameters
    const GRID_SPACING = 96; // Breathable structural mesh cell size
    const BASE_DIAMETER = 12.5; // Authentic structural steel rebar gauge
    const BASE_RADIUS = BASE_DIAMETER / 2;
    const RIB_SPACING = 13.5; // Transverse rib spacing
    const BALL_RADIUS = 165; // Balanced spherical dome radius (~330px diameter, spans ~3.4 cells)
    const BALL_RADIUS_SQ = BALL_RADIUS * BALL_RADIUS;
    const MAX_BALL_ELEVATION = 28; // Proud, sculptural 3D dome height (visible & tangible)

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

    // Pre-allocated coordinate arrays for active dome sampling (zero GC allocations)
    const MAX_SAMPLES = 24;
    const sampleX = new Float32Array(MAX_SAMPLES);
    const sampleY = new Float32Array(MAX_SAMPLES);
    const sampleR = new Float32Array(MAX_SAMPLES);
    const sampleZ = new Float32Array(MAX_SAMPLES);
    const sampleW = new Float32Array(MAX_SAMPLES);

    // Frame rendering routine
    const drawFrame = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - lastTime) / 1000));
      lastTime = now;

      const curX = springX.get();
      const curY = springY.get();
      const curIntensity = springIntensity.get();
      const isDark = document.documentElement.classList.contains('dark');

      // Update gliding ball velocity for subtle directional wake
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
            floorBaseShadow: 'rgba(0, 0, 0, 0.22)',
            floorDomeShadow: 'rgba(0, 0, 0, 0.48)',
            barRim: 'rgba(18, 23, 31, 0.45)',
            barCoreDark: 'rgba(28, 35, 48, 0.45)',
            barMidtone: 'rgba(48, 58, 75, 0.45)',
            barSpecular: 'rgba(110, 126, 150, 0.35)',
            ribGroove: 'rgba(10, 14, 20, 0.38)',
            ribHighlight: 'rgba(148, 163, 184, 0.28)',
            jointOcclusion: 'rgba(0, 0, 0, 0.50)',
            // Popped zone: Brushed titanium & platinum sheen with warm champagne/amber caustics
            popBarCore: 'rgba(42, 53, 70, 0.78)',
            popBarSpecular: 'rgba(240, 246, 255, 0.90)',
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
            floorDomeShadow: 'rgba(15, 23, 42, 0.25)',
            barRim: 'rgba(51, 65, 85, 0.22)',
            barCoreDark: 'rgba(71, 85, 105, 0.24)',
            barMidtone: 'rgba(100, 116, 139, 0.22)',
            barSpecular: 'rgba(148, 163, 184, 0.26)',
            ribGroove: 'rgba(30, 41, 59, 0.20)',
            ribHighlight: 'rgba(203, 213, 225, 0.32)',
            jointOcclusion: 'rgba(15, 23, 42, 0.18)',
            // Popped zone
            popBarCore: 'rgba(71, 85, 105, 0.68)',
            popBarSpecular: 'rgba(255, 255, 255, 0.92)',
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

      // Active ball state
      const isBallActive = curIntensity > 0.02 && !shouldReduceMotion;

      // =========================================================================
      // STEP 1: GLIDING BALL AMBIENT AURA & DEEP CONTACT OCCLUSION
      // =========================================================================
      if (isBallActive) {
        const shadowOffsetX = 8 + Math.max(-10, Math.min(10, smoothVx * 0.012));
        const shadowOffsetY = 10 + Math.max(-10, Math.min(10, smoothVy * 0.012));
        const shadowRad = BALL_RADIUS * 0.75;

        const sphereShadow = ctx.createRadialGradient(
          curX + shadowOffsetX,
          curY + shadowOffsetY,
          8,
          curX + shadowOffsetX,
          curY + shadowOffsetY,
          shadowRad
        );
        sphereShadow.addColorStop(0, p.ballShadow);
        sphereShadow.addColorStop(0.55, isDark ? 'rgba(0, 0, 0, 0.18)' : 'rgba(15, 23, 42, 0.08)');
        sphereShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = sphereShadow;
        ctx.beginPath();
        ctx.arc(curX + shadowOffsetX, curY + shadowOffsetY, shadowRad, 0, Math.PI * 2);
        ctx.fill();

        // Luminous Gliding Ball Aura (Soft champagne/amber light, non-distracting)
        const auraRad = BALL_RADIUS * 0.9;
        const ballLight = ctx.createRadialGradient(curX, curY, 8, curX, curY, auraRad);
        ballLight.addColorStop(0, p.ballHaloInner);
        ballLight.addColorStop(0.45, p.ballHaloMid);
        ballLight.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = ballLight;
        ctx.beginPath();
        ctx.arc(curX, curY, auraRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // STEP 2: FLOOR DROP SHADOWS FOR ALL CONTINUOUS RODS
      // (Both straight baseline rods and 3D bowed rods cast realistic shadows)
      // =========================================================================
      ctx.beginPath();
      ctx.strokeStyle = p.floorBaseShadow;
      ctx.lineWidth = BASE_DIAMETER * 1.1;
      ctx.lineCap = 'round';

      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        const dx = Math.abs(baseX - curX);

        if (!isBallActive || dx >= BALL_RADIUS) {
          // Straight baseline column shadow
          ctx.moveTo(baseX + 2.5, -GRID_SPACING);
          ctx.lineTo(baseX + 2.5, height + GRID_SPACING);
        } else {
          // Continuous bowed column shadow on floor
          const halfChord = Math.sqrt(BALL_RADIUS_SQ - dx * dx);
          const y0 = curY - halfChord;
          const y1 = curY + halfChord;

          ctx.moveTo(baseX + 2.5, -GRID_SPACING);
          ctx.lineTo(baseX + 2.5, y0);

          const SAMPLES = 14;
          for (let i = 0; i <= SAMPLES; i++) {
            const y = y0 + (i / SAMPLES) * (y1 - y0);
            calcDome(baseX, y, curX, curY, curIntensity);
            const sOffX = 2.5 + (domeDx / (domeDist + 0.1)) * (domeZ * 0.65);
            const sOffY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.55);
            ctx.lineTo(baseX + sOffX, y + sOffY);
          }

          ctx.lineTo(baseX + 2.5, y1);
          ctx.lineTo(baseX + 2.5, height + GRID_SPACING);
        }
      }

      for (let r = 0; r < rows; r++) {
        const baseY = r * GRID_SPACING + scrollShiftY;
        const dy = Math.abs(baseY - curY);

        if (!isBallActive || dy >= BALL_RADIUS) {
          // Straight baseline row shadow
          ctx.moveTo(-GRID_SPACING, baseY + 3);
          ctx.lineTo(width + GRID_SPACING, baseY + 3);
        } else {
          // Continuous bowed row shadow on floor
          const halfChord = Math.sqrt(BALL_RADIUS_SQ - dy * dy);
          const x0 = curX - halfChord;
          const x1 = curX + halfChord;

          ctx.moveTo(-GRID_SPACING, baseY + 3);
          ctx.lineTo(x0, baseY + 3);

          const SAMPLES = 14;
          for (let i = 0; i <= SAMPLES; i++) {
            const x = x0 + (i / SAMPLES) * (x1 - x0);
            calcDome(x, baseY, curX, curY, curIntensity);
            const sOffX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.55);
            const sOffY = 3 + (domeDy / (domeDist + 0.1)) * (domeZ * 0.65);
            ctx.lineTo(x + sOffX, baseY + sOffY);
          }

          ctx.lineTo(x1, baseY + 3);
          ctx.lineTo(width + GRID_SPACING, baseY + 3);
        }
      }
      ctx.stroke();

      // =========================================================================
      // STEP 3: VERTICAL REBAR RODS (LAYER 1 - 100% SEAMLESS & CONTINUOUS)
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        const dx = Math.abs(baseX - curX);

        if (!isBallActive || dx >= BALL_RADIUS) {
          // Straight baseline vertical bar
          ctx.beginPath();
          ctx.strokeStyle = p.barRim;
          ctx.lineWidth = BASE_DIAMETER;
          ctx.moveTo(baseX, -GRID_SPACING);
          ctx.lineTo(baseX, height + GRID_SPACING);
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = p.barMidtone;
          ctx.lineWidth = BASE_DIAMETER - 3.5;
          ctx.moveTo(baseX, -GRID_SPACING);
          ctx.lineTo(baseX, height + GRID_SPACING);
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = p.barSpecular;
          ctx.lineWidth = 1.2;
          ctx.moveTo(baseX - 1.8, -GRID_SPACING);
          ctx.lineTo(baseX - 1.8, height + GRID_SPACING);
          ctx.stroke();
        } else {
          // Column intersects the 3D ball dome: seamless, smooth arched deflection
          const halfChord = Math.sqrt(BALL_RADIUS_SQ - dx * dx);
          const y0 = curY - halfChord;
          const y1 = curY + halfChord;
          const SAMPLES = 16;

          for (let i = 0; i <= SAMPLES; i++) {
            const y = y0 + (i / SAMPLES) * (y1 - y0);
            calcDome(baseX, y, curX, curY, curIntensity);
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.14);
            sampleX[i] = baseX + flexX;
            sampleY[i] = y;
            sampleR[i] = BASE_RADIUS * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);
            sampleZ[i] = domeZ;
            sampleW[i] = domeWeight;
          }

          // 3A. Outer cylindrical body (Traced polygon seamlessly connecting top & bottom)
          ctx.beginPath();
          ctx.moveTo(baseX - BASE_RADIUS, -GRID_SPACING);
          ctx.lineTo(baseX - BASE_RADIUS, y0);
          for (let i = 0; i <= SAMPLES; i++) {
            ctx.lineTo(sampleX[i] - sampleR[i], sampleY[i]);
          }
          ctx.lineTo(baseX - BASE_RADIUS, y1);
          ctx.lineTo(baseX - BASE_RADIUS, height + GRID_SPACING);

          ctx.lineTo(baseX + BASE_RADIUS, height + GRID_SPACING);
          ctx.lineTo(baseX + BASE_RADIUS, y1);
          for (let i = SAMPLES; i >= 0; i--) {
            ctx.lineTo(sampleX[i] + sampleR[i], sampleY[i]);
          }
          ctx.lineTo(baseX + BASE_RADIUS, y0);
          ctx.lineTo(baseX + BASE_RADIUS, -GRID_SPACING);
          ctx.closePath();

          ctx.fillStyle = p.barMidtone;
          ctx.fill();

          ctx.strokeStyle = p.barRim;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // 3B. Dome core enhancement
          ctx.beginPath();
          ctx.moveTo(sampleX[0] - sampleR[0] * 0.7, sampleY[0]);
          for (let i = 0; i <= SAMPLES; i++) {
            ctx.lineTo(sampleX[i] - sampleR[i] * 0.7, sampleY[i]);
          }
          for (let i = SAMPLES; i >= 0; i--) {
            ctx.lineTo(sampleX[i] + sampleR[i] * 0.7, sampleY[i]);
          }
          ctx.closePath();
          ctx.fillStyle = p.popBarCore;
          ctx.fill();

          // 3C. Continuous specular ridge line with traveling caustic glint
          ctx.beginPath();
          ctx.strokeStyle = p.barSpecular;
          ctx.lineWidth = 1.2;
          ctx.moveTo(baseX - 1.8, -GRID_SPACING);
          ctx.lineTo(baseX - 1.8, y0);
          ctx.moveTo(baseX - 1.8, y1);
          ctx.lineTo(baseX - 1.8, height + GRID_SPACING);
          ctx.stroke();

          // Over the arched dome
          for (let i = 0; i < SAMPLES; i++) {
            const midY = (sampleY[i] + sampleY[i + 1]) * 0.5;
            const distToLight = Math.hypot(baseX - curX, midY - curY);
            const lightProximity = Math.max(0, 1 - distToLight / (BALL_RADIUS * 0.85));

            ctx.beginPath();
            ctx.strokeStyle = p.popBarSpecular;
            ctx.lineWidth = 1.4 + lightProximity * 1.4;
            ctx.moveTo(sampleX[i] - sampleR[i] * 0.35, sampleY[i]);
            ctx.lineTo(sampleX[i + 1] - sampleR[i + 1] * 0.35, sampleY[i + 1]);
            ctx.stroke();

            if (lightProximity > 0.25) {
              ctx.beginPath();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.0;
              ctx.moveTo(sampleX[i] - sampleR[i] * 0.32, sampleY[i]);
              ctx.lineTo(sampleX[i + 1] - sampleR[i + 1] * 0.32, sampleY[i + 1]);
              ctx.stroke();
            }
          }
        }
      }

      // =========================================================================
      // STEP 4: INTER-LAYER CONTACT OCCLUSION AT CROSSINGS
      // (Horizontal bars crossing over Vertical bars cast micro contact shadows)
      // =========================================================================
      ctx.fillStyle = p.jointOcclusion;
      for (let c = 0; c < cols; c++) {
        const ix = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const iy = r * GRID_SPACING + scrollShiftY;
          calcDome(ix, iy, curX, curY, curIntensity);
          const flexX = isBallActive ? (domeDx / (domeDist + 0.1)) * (domeZ * 0.14) : 0;
          const flexY = isBallActive ? (domeDy / (domeDist + 0.1)) * (domeZ * 0.14) : 0;
          const nx = ix + flexX;
          const ny = iy + flexY;
          const jSize = BASE_DIAMETER * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);

          ctx.fillRect(nx - jSize * 0.45, ny - jSize * 0.45, jSize * 0.9, jSize * 0.9);
        }
      }

      // =========================================================================
      // STEP 5: HORIZONTAL REBAR RODS (LAYER 2 - 100% SEAMLESS & CONTINUOUS)
      // =========================================================================
      for (let r = 0; r < rows; r++) {
        const baseY = r * GRID_SPACING + scrollShiftY;
        const dy = Math.abs(baseY - curY);

        if (!isBallActive || dy >= BALL_RADIUS) {
          // Straight baseline horizontal bar
          ctx.beginPath();
          ctx.strokeStyle = p.barRim;
          ctx.lineWidth = BASE_DIAMETER;
          ctx.moveTo(-GRID_SPACING, baseY);
          ctx.lineTo(width + GRID_SPACING, baseY);
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = p.barMidtone;
          ctx.lineWidth = BASE_DIAMETER - 3.5;
          ctx.moveTo(-GRID_SPACING, baseY);
          ctx.lineTo(width + GRID_SPACING, baseY);
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = p.barSpecular;
          ctx.lineWidth = 1.2;
          ctx.moveTo(-GRID_SPACING, baseY - 1.8);
          ctx.lineTo(width + GRID_SPACING, baseY - 1.8);
          ctx.stroke();
        } else {
          // Row intersects the 3D ball dome: seamless, smooth arched deflection
          const halfChord = Math.sqrt(BALL_RADIUS_SQ - dy * dy);
          const x0 = curX - halfChord;
          const x1 = curX + halfChord;
          const SAMPLES = 16;

          for (let i = 0; i <= SAMPLES; i++) {
            const x = x0 + (i / SAMPLES) * (x1 - x0);
            calcDome(x, baseY, curX, curY, curIntensity);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.14);
            sampleX[i] = x;
            sampleY[i] = baseY + flexY;
            sampleR[i] = BASE_RADIUS * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);
            sampleZ[i] = domeZ;
            sampleW[i] = domeWeight;
          }

          // 5A. Outer cylindrical body polygon
          ctx.beginPath();
          ctx.moveTo(-GRID_SPACING, baseY - BASE_RADIUS);
          ctx.lineTo(x0, baseY - BASE_RADIUS);
          for (let i = 0; i <= SAMPLES; i++) {
            ctx.lineTo(sampleX[i], sampleY[i] - sampleR[i]);
          }
          ctx.lineTo(x1, baseY - BASE_RADIUS);
          ctx.lineTo(width + GRID_SPACING, baseY - BASE_RADIUS);

          ctx.lineTo(width + GRID_SPACING, baseY + BASE_RADIUS);
          ctx.lineTo(x1, baseY + BASE_RADIUS);
          for (let i = SAMPLES; i >= 0; i--) {
            ctx.lineTo(sampleX[i], sampleY[i] + sampleR[i]);
          }
          ctx.lineTo(x0, baseY + BASE_RADIUS);
          ctx.lineTo(-GRID_SPACING, baseY + BASE_RADIUS);
          ctx.closePath();

          ctx.fillStyle = p.barMidtone;
          ctx.fill();

          ctx.strokeStyle = p.barRim;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // 5B. Dome core enhancement
          ctx.beginPath();
          ctx.moveTo(sampleX[0], sampleY[0] - sampleR[0] * 0.7);
          for (let i = 0; i <= SAMPLES; i++) {
            ctx.lineTo(sampleX[i], sampleY[i] - sampleR[i] * 0.7);
          }
          for (let i = SAMPLES; i >= 0; i--) {
            ctx.lineTo(sampleX[i], sampleY[i] + sampleR[i] * 0.7);
          }
          ctx.closePath();
          ctx.fillStyle = p.popBarCore;
          ctx.fill();

          // 5C. Continuous specular ridge line with traveling caustic glint
          ctx.beginPath();
          ctx.strokeStyle = p.barSpecular;
          ctx.lineWidth = 1.2;
          ctx.moveTo(-GRID_SPACING, baseY - 1.8);
          ctx.lineTo(x0, baseY - 1.8);
          ctx.moveTo(x1, baseY - 1.8);
          ctx.lineTo(width + GRID_SPACING, baseY - 1.8);
          ctx.stroke();

          // Over the arched dome
          for (let i = 0; i < SAMPLES; i++) {
            const midX = (sampleX[i] + sampleX[i + 1]) * 0.5;
            const distToLight = Math.hypot(midX - curX, baseY - curY);
            const lightProximity = Math.max(0, 1 - distToLight / (BALL_RADIUS * 0.85));

            ctx.beginPath();
            ctx.strokeStyle = p.popBarSpecular;
            ctx.lineWidth = 1.4 + lightProximity * 1.4;
            ctx.moveTo(sampleX[i], sampleY[i] - sampleR[i] * 0.35);
            ctx.lineTo(sampleX[i + 1], sampleY[i + 1] - sampleR[i + 1] * 0.35);
            ctx.stroke();

            if (lightProximity > 0.25) {
              ctx.beginPath();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.0;
              ctx.moveTo(sampleX[i], sampleY[i] - sampleR[i] * 0.32);
              ctx.lineTo(sampleX[i + 1], sampleY[i + 1] - sampleR[i + 1] * 0.32);
              ctx.stroke();
            }
          }
        }
      }

      // =========================================================================
      // STEP 6: CONTOURED TRANSVERSE CRESCENT RIBS (AUTHENTIC DEFORMED STEEL)
      // =========================================================================
      ctx.beginPath();
      ctx.strokeStyle = p.ribGroove;
      ctx.lineWidth = 1.6;

      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          calcDome(baseX, y, curX, curY, curIntensity);
          if (domeWeight < 0.05) {
            ctx.moveTo(baseX - 4.5, y - 3);
            ctx.quadraticCurveTo(baseX, y + 1, baseX + 4.5, y + 3);
          } else {
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.14);
            const rx = baseX + flexX;
            const r = BASE_RADIUS * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);
            ctx.moveTo(rx - r * 0.85, y - 3.8);
            ctx.quadraticCurveTo(rx, y + 0.5, rx + r * 0.85, y + 2.5);
          }
        }
      }

      for (let r = 0; r < rows; r++) {
        const baseY = r * GRID_SPACING + scrollShiftY;
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          calcDome(x, baseY, curX, curY, curIntensity);
          if (domeWeight < 0.05) {
            ctx.moveTo(x - 3, baseY - 4.5);
            ctx.quadraticCurveTo(x + 1, baseY, x + 3, baseY + 4.5);
          } else {
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.14);
            const ry = baseY + flexY;
            const r = BASE_RADIUS * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);
            ctx.moveTo(x - 3.8, ry - r * 0.85);
            ctx.quadraticCurveTo(x + 0.5, ry, x + 2.5, ry + r * 0.85);
          }
        }
      }
      ctx.stroke();

      // Highlight crest line on ribs
      ctx.beginPath();
      ctx.strokeStyle = p.ribHighlight;
      ctx.lineWidth = 1.1;

      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          calcDome(baseX, y, curX, curY, curIntensity);
          if (domeWeight < 0.05) {
            ctx.moveTo(baseX - 4.0, y - 3.6);
            ctx.quadraticCurveTo(baseX, y + 0.2, baseX + 4.0, y + 2.2);
          } else {
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.14);
            const rx = baseX + flexX;
            const r = BASE_RADIUS * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);
            ctx.moveTo(rx - r * 0.75, y - 3.4);
            ctx.quadraticCurveTo(rx, y + 0.2, rx + r * 0.75, y + 2.0);
          }
        }
      }

      for (let r = 0; r < rows; r++) {
        const baseY = r * GRID_SPACING + scrollShiftY;
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          calcDome(x, baseY, curX, curY, curIntensity);
          if (domeWeight < 0.05) {
            ctx.moveTo(x - 3.6, baseY - 4.0);
            ctx.quadraticCurveTo(x + 0.2, baseY, x + 2.2, baseY + 4.0);
          } else {
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.14);
            const ry = baseY + flexY;
            const r = BASE_RADIUS * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);
            ctx.moveTo(x - 3.4, ry - r * 0.75);
            ctx.quadraticCurveTo(x + 0.2, ry, x + 2.0, ry + r * 0.75);
          }
        }
      }
      ctx.stroke();

      // Subtle warm amber glints on ribs under the spotlight
      if (isBallActive) {
        ctx.beginPath();
        ctx.strokeStyle = p.popRibAmberGlint;
        ctx.lineWidth = 1.3;

        for (let c = 0; c < cols; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS * 0.65; y <= curY + BALL_RADIUS * 0.65; y += RIB_SPACING) {
            if (!calcDome(baseX, y, curX, curY, curIntensity) || domeWeight < 0.20) continue;

            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.14);
            const rx = baseX + flexX;
            const r = BASE_RADIUS * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);

            ctx.moveTo(rx - r * 0.6, y - 2.5);
            ctx.lineTo(rx + r * 0.6, y + 1.5);
          }
        }

        for (let r = 0; r < rows; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          for (let x = curX - BALL_RADIUS * 0.65; x <= curX + BALL_RADIUS * 0.65; x += RIB_SPACING) {
            if (!calcDome(x, baseY, curX, curY, curIntensity) || domeWeight < 0.20) continue;

            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.14);
            const ry = baseY + flexY;
            const r = BASE_RADIUS * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.35);

            ctx.moveTo(x - 2.5, ry - r * 0.6);
            ctx.lineTo(x + 1.5, ry + r * 0.6);
          }
        }
        ctx.stroke();
      }

      // =========================================================================
      // STEP 7: RESISTANCE WELDED WIRE FABRIC JOINTS WITH 3D DEPTH
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        const ix = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const iy = r * GRID_SPACING + scrollShiftY;
          calcDome(ix, iy, curX, curY, curIntensity);

          if (domeWeight <= 0.05) {
            // Flat baseline weld node
            ctx.beginPath();
            ctx.fillStyle = p.weldNode;
            ctx.arc(ix, iy, 2.6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // 3D elevated resistance weld node
            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.14);
            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.14);
            const nx = ix + flexX;
            const ny = iy + flexY;
            const weldR = 3.2 + (domeZ / MAX_BALL_ELEVATION) * 2.0;

            // Heat-affected zone collar
            ctx.beginPath();
            ctx.fillStyle = p.weldHAZ;
            ctx.arc(nx, ny, weldR + 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Molten weld core
            ctx.beginPath();
            ctx.fillStyle = domeDist < 75 ? p.weldHot : p.weldNode;
            ctx.arc(nx, ny, weldR, 0, Math.PI * 2);
            ctx.fill();

            // Specular gleam offset dynamically toward light vector
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
