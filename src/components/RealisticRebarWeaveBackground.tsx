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

    // Mesh & 3D Gliding Dome Parameters (Moderately sized, realistic proportions)
    const GRID_SPACING = 96; // Breathable mesh cell size
    const BASE_DIAMETER = 12.5; // Authentic structural steel rebar gauge
    const BASE_RADIUS = BASE_DIAMETER / 2;
    const RIB_SPACING = 14; // Transverse rib spacing
    const BALL_RADIUS = 165; // Focused, elegant dome radius (~330px diameter)
    const BALL_RADIUS_SQ = BALL_RADIUS * BALL_RADIUS;
    const MAX_BALL_ELEVATION = 28; // Pronounced, tangible 3D pop elevation

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
      // Smooth C2 hermite bell curve: (1 - u^2)^2 with smooth tangent at perimeter
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
            floorBaseShadow: 'rgba(0, 0, 0, 0.22)',
            domeDropShadow: 'rgba(0, 0, 0, 0.55)',
            barRim: 'rgba(18, 23, 31, 0.50)',
            barCoreDark: 'rgba(28, 35, 48, 0.48)',
            barMidtone: 'rgba(48, 58, 75, 0.48)',
            barSpecular: 'rgba(110, 126, 150, 0.35)',
            ribGroove: 'rgba(10, 14, 20, 0.40)',
            ribHighlight: 'rgba(148, 163, 184, 0.30)',
            jointOcclusion: 'rgba(0, 0, 0, 0.52)',
            // Popped zone: Brushed titanium & platinum sheen with warm champagne/amber caustics
            popBarCore: 'rgba(42, 53, 70, 0.82)',
            popBarSpecular: 'rgba(240, 246, 255, 0.90)',
            popRibCrest: 'rgba(226, 232, 240, 0.72)',
            popRibAmberGlint: 'rgba(245, 158, 11, 0.48)',
            weldHAZ: 'rgba(15, 20, 28, 0.75)',
            weldNode: 'rgba(48, 58, 74, 0.65)',
            weldHot: '#f59e0b',
            ballShadow: 'rgba(0, 0, 0, 0.45)',
            ballHaloInner: 'rgba(245, 158, 11, 0.10)',
            ballHaloMid: 'rgba(245, 124, 0, 0.025)',
          }
        : {
            // Light Mode: Architectural blueprint slate & satin stainless steel
            floorBaseShadow: 'rgba(15, 23, 42, 0.06)',
            domeDropShadow: 'rgba(15, 23, 42, 0.28)',
            barRim: 'rgba(51, 65, 85, 0.24)',
            barCoreDark: 'rgba(71, 85, 105, 0.26)',
            barMidtone: 'rgba(100, 116, 139, 0.24)',
            barSpecular: 'rgba(148, 163, 184, 0.28)',
            ribGroove: 'rgba(30, 41, 59, 0.22)',
            ribHighlight: 'rgba(203, 213, 225, 0.35)',
            jointOcclusion: 'rgba(15, 23, 42, 0.20)',
            // Popped zone
            popBarCore: 'rgba(71, 85, 105, 0.70)',
            popBarSpecular: 'rgba(255, 255, 255, 0.92)',
            popRibCrest: 'rgba(203, 213, 225, 0.75)',
            popRibAmberGlint: 'rgba(217, 119, 6, 0.42)',
            weldHAZ: 'rgba(30, 41, 59, 0.50)',
            weldNode: 'rgba(71, 85, 105, 0.60)',
            weldHot: '#d97706',
            ballShadow: 'rgba(15, 23, 42, 0.22)',
            ballHaloInner: 'rgba(217, 119, 6, 0.08)',
            ballHaloMid: 'rgba(180, 83, 9, 0.02)',
          };

      // Subtle scroll parallax depth (seamless modulo repeat)
      const scrollShiftY = (scrollY * 0.14) % GRID_SPACING;

      const cols = Math.ceil(width / GRID_SPACING) + 2;
      const rows = Math.ceil(height / GRID_SPACING) + 3;

      const shadowOffsetX = 8 + Math.max(-10, Math.min(10, smoothVx * 0.012));
      const shadowOffsetY = 10 + Math.max(-10, Math.min(10, smoothVy * 0.012));

      // =========================================================================
      // STEP 1: MODERATE GLIDING BALL EFFECT (SHADOW & AURA)
      // Compact, elegant focus radius (~165px) that highlights without blinding
      // =========================================================================
      if (curIntensity > 0.03 && !shouldReduceMotion) {
        // 1A. Soft 3D Contact Shadow beneath the gliding ball with directional velocity bias
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
        sphereShadow.addColorStop(0.55, isDark ? 'rgba(0, 0, 0, 0.16)' : 'rgba(15, 23, 42, 0.06)');
        sphereShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = sphereShadow;
        ctx.beginPath();
        ctx.arc(curX + shadowOffsetX, curY + shadowOffsetY, shadowRad, 0, Math.PI * 2);
        ctx.fill();

        // 1B. Luminous Gliding Ball Aura (Soft champagne/amber light, non-distracting)
        const auraRad = BALL_RADIUS * 0.88;
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
      // STEP 2: CONTINUOUS 3D DROP SHADOWS ON CONCRETE FLOOR
      // Cast beneath elevated continuous bars, connecting seamlessly
      // =========================================================================
      if (curIntensity > 0.03 && !shouldReduceMotion) {
        ctx.fillStyle = p.domeDropShadow;

        // Vertical bars cast shadow
        for (let c = 0; c < cols; c++) {
          const baseX = c * GRID_SPACING;
          if (Math.abs(baseX - curX) >= BALL_RADIUS) continue;

          const startY = curY - BALL_RADIUS;
          const endY = curY + BALL_RADIUS;
          const segStep = 14;

          ctx.beginPath();
          for (let y = startY; y <= endY; y += segStep) {
            if (!calcDome(baseX, y, curX, curY, curIntensity) || domeWeight <= 0.02) continue;

            const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.16);
            const sw = BASE_DIAMETER * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.5);
            const sx = baseX + flexX + shadowOffsetX;
            const sy = y + shadowOffsetY;

            ctx.rect(sx - sw / 2, sy - segStep / 2, sw, segStep + 1);
          }
          ctx.fill();
        }

        // Horizontal bars cast shadow
        for (let r = 0; r < rows; r++) {
          const baseY = r * GRID_SPACING + scrollShiftY;
          if (Math.abs(baseY - curY) >= BALL_RADIUS) continue;

          const startX = curX - BALL_RADIUS;
          const endX = curX + BALL_RADIUS;
          const segStep = 14;

          ctx.beginPath();
          for (let x = startX; x <= endX; x += segStep) {
            if (!calcDome(x, baseY, curX, curY, curIntensity) || domeWeight <= 0.02) continue;

            const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.16);
            const sh = BASE_DIAMETER * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.5);
            const sx = x + shadowOffsetX;
            const sy = baseY + flexY + shadowOffsetY;

            ctx.rect(sx - segStep / 2, sy - sh / 2, segStep + 1, sh);
          }
          ctx.fill();
        }
      }

      // Base floor flat shadows for un-elevated bars
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

      // =========================================================================
      // STEP 3: CONTINUOUS VERTICAL REBAR RODS (LAYER 1)
      // Unbroken steel rods from top to bottom with continuous 3D dome curvature
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        const baseX = c * GRID_SPACING;
        const isNearBall = curIntensity > 0.01 && !shouldReduceMotion && Math.abs(baseX - curX) < BALL_RADIUS;

        if (!isNearBall) {
          // Flat undisturbed continuous steel bar
          // 1. Outer cylinder rim
          ctx.beginPath();
          ctx.strokeStyle = p.barRim;
          ctx.lineWidth = BASE_DIAMETER;
          ctx.moveTo(baseX, -GRID_SPACING);
          ctx.lineTo(baseX, height + GRID_SPACING);
          ctx.stroke();

          // 2. Midtone metallic core
          ctx.beginPath();
          ctx.strokeStyle = p.barMidtone;
          ctx.lineWidth = BASE_DIAMETER - 3.5;
          ctx.moveTo(baseX, -GRID_SPACING);
          ctx.lineTo(baseX, height + GRID_SPACING);
          ctx.stroke();

          // 3. Specular satin ridge
          ctx.beginPath();
          ctx.strokeStyle = p.barSpecular;
          ctx.lineWidth = 1.2;
          ctx.moveTo(baseX - 1.8, -GRID_SPACING);
          ctx.lineTo(baseX - 1.8, height + GRID_SPACING);
          ctx.stroke();

          // 4. Transverse crescent ribs (Intact along entire bar)
          ctx.beginPath();
          ctx.strokeStyle = p.ribGroove;
          ctx.lineWidth = 1.8;
          for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
            ctx.moveTo(baseX - 5, y - 3);
            ctx.quadraticCurveTo(baseX, y + 1, baseX + 5, y + 3);
          }
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = p.ribHighlight;
          ctx.lineWidth = 1.1;
          for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
            ctx.moveTo(baseX - 4.5, y - 3.8);
            ctx.quadraticCurveTo(baseX, y + 0.2, baseX + 4.5, y + 2.2);
          }
          ctx.stroke();
        } else {
          // Continuous 3D elevated rod with smooth perspective swelling
          const segStep = 12;
          const domeStartY = curY - BALL_RADIUS;
          const domeEndY = curY + BALL_RADIUS;

          // 3A. Draw straight top section (outside dome)
          if (domeStartY > -GRID_SPACING) {
            ctx.beginPath();
            ctx.strokeStyle = p.barRim;
            ctx.lineWidth = BASE_DIAMETER;
            ctx.moveTo(baseX, -GRID_SPACING);
            ctx.lineTo(baseX, domeStartY);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = p.barMidtone;
            ctx.lineWidth = BASE_DIAMETER - 3.5;
            ctx.moveTo(baseX, -GRID_SPACING);
            ctx.lineTo(baseX, domeStartY);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = p.barSpecular;
            ctx.lineWidth = 1.2;
            ctx.moveTo(baseX - 1.8, -GRID_SPACING);
            ctx.lineTo(baseX - 1.8, domeStartY);
            ctx.stroke();
          }

          // 3B. Draw 3D curved arch through the dome
          for (let y = domeStartY; y < domeEndY; y += segStep) {
            const y0 = y;
            const y1 = Math.min(domeEndY, y + segStep);

            calcDome(baseX, y0, curX, curY, curIntensity);
            const z0 = domeZ;
            const flexX0 = (domeDx / (domeDist + 0.1)) * (z0 * 0.16);
            const r0 = BASE_RADIUS * (1 + (z0 / MAX_BALL_ELEVATION) * 0.48);
            const x0 = baseX + flexX0;

            calcDome(baseX, y1, curX, curY, curIntensity);
            const z1 = domeZ;
            const flexX1 = (domeDx / (domeDist + 0.1)) * (z1 * 0.16);
            const r1 = BASE_RADIUS * (1 + (z1 / MAX_BALL_ELEVATION) * 0.48);
            const x1 = baseX + flexX1;

            const isPopped = z0 > 1 || z1 > 1;

            // Outer rim polygon
            ctx.fillStyle = isPopped ? p.popBarCore : p.barRim;
            ctx.beginPath();
            ctx.moveTo(x0 - r0, y0);
            ctx.lineTo(x1 - r1, y1);
            ctx.lineTo(x1 + r1, y1);
            ctx.lineTo(x0 + r0, y0);
            ctx.closePath();
            ctx.fill();

            // Specular ridge line with traveling caustic flare
            const midY = (y0 + y1) * 0.5;
            const distToLight = Math.hypot(baseX - curX, midY - curY);
            const lightProximity = Math.max(0, 1 - distToLight / (BALL_RADIUS * 0.8));

            ctx.strokeStyle = isPopped ? p.popBarSpecular : p.barSpecular;
            ctx.lineWidth = isPopped ? 1.4 + lightProximity * 1.4 : 1.2;
            ctx.beginPath();
            ctx.moveTo(x0 - r0 * 0.35, y0);
            ctx.lineTo(x1 - r1 * 0.35, y1);
            ctx.stroke();

            // Diamond-sharp platinum highlight core at closest light proximity
            if (isPopped && lightProximity > 0.25) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(x0 - r0 * 0.32, y0);
              ctx.lineTo(x1 - r1 * 0.32, y1);
              ctx.stroke();
            }
          }

          // 3C. Draw straight bottom section (outside dome)
          if (domeEndY < height + GRID_SPACING) {
            ctx.beginPath();
            ctx.strokeStyle = p.barRim;
            ctx.lineWidth = BASE_DIAMETER;
            ctx.moveTo(baseX, domeEndY);
            ctx.lineTo(baseX, height + GRID_SPACING);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = p.barMidtone;
            ctx.lineWidth = BASE_DIAMETER - 3.5;
            ctx.moveTo(baseX, domeEndY);
            ctx.lineTo(baseX, height + GRID_SPACING);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = p.barSpecular;
            ctx.lineWidth = 1.2;
            ctx.moveTo(baseX - 1.8, domeEndY);
            ctx.lineTo(baseX - 1.8, height + GRID_SPACING);
            ctx.stroke();
          }

          // 3D. Continuous Transverse Deformed Crescent Ribs along the ENTIRE rod
          for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
            calcDome(baseX, y, curX, curY, curIntensity);
            const z = domeZ;
            const flexX = (domeDx / (domeDist + 0.1)) * (z * 0.16);
            const r = BASE_RADIUS * (1 + (z / MAX_BALL_ELEVATION) * 0.48);
            const rx = baseX + flexX;

            const isPopped = z > 1.5;

            // Rib groove (concave shadow under deformation)
            ctx.beginPath();
            ctx.strokeStyle = p.ribGroove;
            ctx.lineWidth = isPopped ? 2.0 : 1.8;
            ctx.moveTo(rx - r * 0.82, y - 3.2);
            ctx.quadraticCurveTo(rx, y + 0.6, rx + r * 0.82, y + 2.8);
            ctx.stroke();

            // Rib highlight crest
            ctx.beginPath();
            ctx.strokeStyle = isPopped ? p.popRibCrest : p.ribHighlight;
            ctx.lineWidth = isPopped ? 1.5 : 1.1;
            ctx.moveTo(rx - r * 0.78, y - 3.8);
            ctx.quadraticCurveTo(rx, y + 0.2, rx + r * 0.78, y + 2.2);
            ctx.stroke();

            // Subtle warm amber heat glow on ribs directly under the spotlight
            if (isPopped && domeDist < BALL_RADIUS * 0.65) {
              ctx.beginPath();
              ctx.strokeStyle = p.popRibAmberGlint;
              ctx.lineWidth = 1.3;
              ctx.moveTo(rx - r * 0.55, y - 2.5);
              ctx.lineTo(rx + r * 0.55, y + 1.5);
              ctx.stroke();
            }
          }
        }
      }

      // =========================================================================
      // STEP 4: INTER-LAYER CONTACT OCCLUSION
      // Horizontal bars cross over vertical bars, casting contact micro-shadows
      // =========================================================================
      ctx.fillStyle = p.jointOcclusion;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const y = r * GRID_SPACING + scrollShiftY;
          calcDome(x, y, curX, curY, curIntensity);
          const flexX = (domeDx / (domeDist + 0.1)) * (domeZ * 0.16);
          const flexY = (domeDy / (domeDist + 0.1)) * (domeZ * 0.16);
          const rx = x + flexX;
          const ry = y + flexY;
          const d = BASE_DIAMETER * (1 + (domeZ / MAX_BALL_ELEVATION) * 0.48);

          ctx.fillRect(rx - d * 0.45, ry - d * 0.45, d * 0.9, d * 0.9);
        }
      }

      // =========================================================================
      // STEP 5: CONTINUOUS HORIZONTAL REBAR RODS (LAYER 2 - CROSSING ON TOP)
      // Unbroken steel rods from left to right with continuous 3D dome curvature
      // =========================================================================
      for (let r = 0; r < rows; r++) {
        const baseY = r * GRID_SPACING + scrollShiftY;
        const isNearBall = curIntensity > 0.01 && !shouldReduceMotion && Math.abs(baseY - curY) < BALL_RADIUS;

        if (!isNearBall) {
          // Flat undisturbed continuous horizontal bar
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

          // Transverse crescent ribs
          ctx.beginPath();
          ctx.strokeStyle = p.ribGroove;
          ctx.lineWidth = 1.8;
          for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
            ctx.moveTo(x - 3, baseY - 5);
            ctx.quadraticCurveTo(x + 1, baseY, x + 3, baseY + 5);
          }
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = p.ribHighlight;
          ctx.lineWidth = 1.1;
          for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
            ctx.moveTo(x - 3.8, baseY - 4.5);
            ctx.quadraticCurveTo(x + 0.2, baseY, x + 2.2, baseY + 4.5);
          }
          ctx.stroke();
        } else {
          // Continuous 3D elevated rod with smooth perspective swelling
          const segStep = 12;
          const domeStartX = curX - BALL_RADIUS;
          const domeEndX = curX + BALL_RADIUS;

          // 5A. Draw straight left section (outside dome)
          if (domeStartX > -GRID_SPACING) {
            ctx.beginPath();
            ctx.strokeStyle = p.barRim;
            ctx.lineWidth = BASE_DIAMETER;
            ctx.moveTo(-GRID_SPACING, baseY);
            ctx.lineTo(domeStartX, baseY);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = p.barMidtone;
            ctx.lineWidth = BASE_DIAMETER - 3.5;
            ctx.moveTo(-GRID_SPACING, baseY);
            ctx.lineTo(domeStartX, baseY);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = p.barSpecular;
            ctx.lineWidth = 1.2;
            ctx.moveTo(-GRID_SPACING, baseY - 1.8);
            ctx.lineTo(domeStartX, baseY - 1.8);
            ctx.stroke();
          }

          // 5B. Draw 3D curved arch through the dome
          for (let x = domeStartX; x < domeEndX; x += segStep) {
            const x0 = x;
            const x1 = Math.min(domeEndX, x + segStep);

            calcDome(x0, baseY, curX, curY, curIntensity);
            const z0 = domeZ;
            const flexY0 = (domeDy / (domeDist + 0.1)) * (z0 * 0.16);
            const r0 = BASE_RADIUS * (1 + (z0 / MAX_BALL_ELEVATION) * 0.48);
            const y0 = baseY + flexY0;

            calcDome(x1, baseY, curX, curY, curIntensity);
            const z1 = domeZ;
            const flexY1 = (domeDy / (domeDist + 0.1)) * (z1 * 0.16);
            const r1 = BASE_RADIUS * (1 + (z1 / MAX_BALL_ELEVATION) * 0.48);
            const y1 = baseY + flexY1;

            const isPopped = z0 > 1 || z1 > 1;

            // Outer rim polygon
            ctx.fillStyle = isPopped ? p.popBarCore : p.barRim;
            ctx.beginPath();
            ctx.moveTo(x0, y0 - r0);
            ctx.lineTo(x1, y1 - r1);
            ctx.lineTo(x1, y1 + r1);
            ctx.lineTo(x0, y0 + r0);
            ctx.closePath();
            ctx.fill();

            // Specular ridge line with traveling caustic flare
            const midX = (x0 + x1) * 0.5;
            const distToLight = Math.hypot(midX - curX, baseY - curY);
            const lightProximity = Math.max(0, 1 - distToLight / (BALL_RADIUS * 0.8));

            ctx.strokeStyle = isPopped ? p.popBarSpecular : p.barSpecular;
            ctx.lineWidth = isPopped ? 1.4 + lightProximity * 1.4 : 1.2;
            ctx.beginPath();
            ctx.moveTo(x0, y0 - r0 * 0.35);
            ctx.lineTo(x1, y1 - r1 * 0.35);
            ctx.stroke();

            if (isPopped && lightProximity > 0.25) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(x0, y0 - r0 * 0.32);
              ctx.lineTo(x1, y1 - r1 * 0.32);
              ctx.stroke();
            }
          }

          // 5C. Draw straight right section (outside dome)
          if (domeEndX < width + GRID_SPACING) {
            ctx.beginPath();
            ctx.strokeStyle = p.barRim;
            ctx.lineWidth = BASE_DIAMETER;
            ctx.moveTo(domeEndX, baseY);
            ctx.lineTo(width + GRID_SPACING, baseY);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = p.barMidtone;
            ctx.lineWidth = BASE_DIAMETER - 3.5;
            ctx.moveTo(domeEndX, baseY);
            ctx.lineTo(width + GRID_SPACING, baseY);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = p.barSpecular;
            ctx.lineWidth = 1.2;
            ctx.moveTo(domeEndX, baseY - 1.8);
            ctx.lineTo(width + GRID_SPACING, baseY - 1.8);
            ctx.stroke();
          }

          // 5D. Continuous Transverse Deformed Crescent Ribs along the ENTIRE rod
          for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
            calcDome(x, baseY, curX, curY, curIntensity);
            const z = domeZ;
            const flexY = (domeDy / (domeDist + 0.1)) * (z * 0.16);
            const r = BASE_RADIUS * (1 + (z / MAX_BALL_ELEVATION) * 0.48);
            const ry = baseY + flexY;

            const isPopped = z > 1.5;

            // Rib groove
            ctx.beginPath();
            ctx.strokeStyle = p.ribGroove;
            ctx.lineWidth = isPopped ? 2.0 : 1.8;
            ctx.moveTo(x - 3.2, ry - r * 0.82);
            ctx.quadraticCurveTo(x + 0.6, ry, x + 2.8, ry + r * 0.82);
            ctx.stroke();

            // Rib highlight crest
            ctx.beginPath();
            ctx.strokeStyle = isPopped ? p.popRibCrest : p.ribHighlight;
            ctx.lineWidth = isPopped ? 1.5 : 1.1;
            ctx.moveTo(x - 3.8, ry - r * 0.78);
            ctx.quadraticCurveTo(x + 0.2, ry, x + 2.2, ry + r * 0.78);
            ctx.stroke();

            // Subtle warm amber heat glow on ribs directly under the spotlight
            if (isPopped && domeDist < BALL_RADIUS * 0.65) {
              ctx.beginPath();
              ctx.strokeStyle = p.popRibAmberGlint;
              ctx.lineWidth = 1.3;
              ctx.moveTo(x - 2.5, ry - r * 0.55);
              ctx.lineTo(x + 1.5, ry + r * 0.55);
              ctx.stroke();
            }
          }
        }
      }

      // =========================================================================
      // STEP 6: RESISTANCE WELDED INTERSECTION JOINTS
      // Anchored at grid nodes, popping in 3D with dynamic light-directed gleams
      // =========================================================================
      for (let c = 0; c < cols; c++) {
        const ix = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const iy = r * GRID_SPACING + scrollShiftY;
          calcDome(ix, iy, curX, curY, curIntensity);

          const isPopped = domeZ > 1.2;
          const flexX = isPopped ? (domeDx / (domeDist + 0.1)) * (domeZ * 0.16) : 0;
          const flexY = isPopped ? (domeDy / (domeDist + 0.1)) * (domeZ * 0.16) : 0;
          const nx = ix + flexX;
          const ny = iy + flexY;

          if (!isPopped) {
            // Quiet base welded dot
            ctx.beginPath();
            ctx.fillStyle = p.weldNode;
            ctx.arc(nx, ny, 2.6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Elevated 3D precision weld bead
            const weldR = 3.4 + (domeZ / MAX_BALL_ELEVATION) * 1.6;

            // Heat-affected zone collar
            ctx.beginPath();
            ctx.fillStyle = p.weldHAZ;
            ctx.arc(nx, ny, weldR + 1.4, 0, Math.PI * 2);
            ctx.fill();

            // Electric molten bead core
            ctx.beginPath();
            ctx.fillStyle = domeDist < 70 ? p.weldHot : p.weldNode;
            ctx.arc(nx, ny, weldR, 0, Math.PI * 2);
            ctx.fill();

            // Dynamic specular gleam angled towards the light source
            const lightDirX = curX - nx;
            const lightDirY = curY - ny;
            const lightLen = Math.hypot(lightDirX, lightDirY) + 0.1;
            const glintOffsetX = (lightDirX / lightLen) * (weldR * 0.35);
            const glintOffsetY = (lightDirY / lightLen) * (weldR * 0.35);

            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.arc(nx + glintOffsetX, ny + glintOffsetY, Math.max(0.7, weldR * 0.32), 0, Math.PI * 2);
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
