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
  const mouseIntensity = useMotionValue<number>(0.18);

  // Ball gliding physics: calibrated momentum with silky smooth rolling inertia
  const springX = useSpring(mouseX, { stiffness: 175, damping: 22, mass: 0.55 });
  const springY = useSpring(mouseY, { stiffness: 175, damping: 22, mass: 0.55 });
  const springIntensity = useSpring(mouseIntensity, { stiffness: 140, damping: 20 });

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

    // Mesh & Gliding Ball Parameters
    const GRID_SPACING = 94; // Mesh cell size
    const BASE_DIAMETER = 13.5; // Heavy authentic steel rebar gauge
    const RIB_SPACING = 13; // Distinctive transverse rib pitch
    const BALL_RADIUS = 300; // Gliding sphere radius of influence
    const BALL_RADIUS_SQ = BALL_RADIUS * BALL_RADIUS;
    const MAX_BALL_ELEVATION = 32; // 3D dome height at the ball apex

    // Fast spherical dome height & displacement math
    const getBallDome = (x: number, y: number, bx: number, by: number, intensity: number) => {
      const dx = x - bx;
      const dy = y - by;
      const distSq = dx * dx + dy * dy;

      if (distSq >= BALL_RADIUS_SQ || intensity <= 0.01) {
        return { z: 0, weight: 0, dx, dy, dist: 999 };
      }

      const dist = Math.sqrt(distSq);
      const u = dist / BALL_RADIUS;
      // Smooth spherical bell dome curve
      const weight = Math.pow(1 - u * u, 2) * intensity;
      const z = weight * MAX_BALL_ELEVATION;

      return { z, weight, dx, dy, dist };
    };

    // Frame rendering routine
    const drawFrame = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - lastTime) / 1000));
      lastTime = now;

      const curX = springX.get();
      const curY = springY.get();
      const curIntensity = springIntensity.get();
      const isDark = document.documentElement.classList.contains('dark');

      // Update gliding ball velocity for directional momentum wake
      const instantVx = (curX - prevX) / dt;
      const instantVy = (curY - prevY) / dt;
      smoothVx += (instantVx - smoothVx) * 0.22;
      smoothVy += (instantVy - smoothVy) * 0.22;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Pre-cached authentic industrial steel palettes (matching photos)
      const p = isDark
        ? {
            // Dark Mode: Cold-rolled dark structural steel, chrome ridges & warm amber glints
            floorBaseShadow: 'rgba(0, 0, 0, 0.25)',
            barRim: '#151921',
            barCoreDark: '#202632',
            barMidtone: '#354050',
            barSpecular: '#7d8fa6',
            barPeakWhite: '#e2e8f0',
            ribGroove: '#0c0f14',
            ribHighlight: 'rgba(148, 163, 184, 0.42)',
            popRibHot: '#f59e0b',
            popRibGlint: '#fbbf24',
            weldNode: '#2d3542',
            weldHot: '#f59e0b',
            ballShadow: 'rgba(0, 0, 0, 0.65)',
            ballHaloInner: 'rgba(245, 124, 0, 0.20)',
            ballHaloMid: 'rgba(245, 124, 0, 0.05)',
          }
        : {
            // Light Mode: High-tensile slate steel reinforcement fabric with crisp architectural shadows
            floorBaseShadow: 'rgba(15, 23, 42, 0.08)',
            barRim: '#334155',
            barCoreDark: '#475569',
            barMidtone: '#64748b',
            barSpecular: '#94a3b8',
            barPeakWhite: '#ffffff',
            ribGroove: '#1e293b',
            ribHighlight: 'rgba(203, 213, 225, 0.55)',
            popRibHot: '#d97706',
            popRibGlint: '#b45309',
            weldNode: '#475569',
            weldHot: '#d97706',
            ballShadow: 'rgba(15, 23, 42, 0.35)',
            ballHaloInner: 'rgba(180, 83, 9, 0.14)',
            ballHaloMid: 'rgba(180, 83, 9, 0.035)',
          };

      const cols = Math.ceil(width / GRID_SPACING) + 2;
      const rows = Math.ceil(height / GRID_SPACING) + 2;

      // Active bounding indices for the gliding ball
      const minActiveCol = Math.max(0, Math.floor((curX - BALL_RADIUS) / GRID_SPACING));
      const maxActiveCol = Math.min(cols - 1, Math.ceil((curX + BALL_RADIUS) / GRID_SPACING));
      const minActiveRow = Math.max(0, Math.floor((curY - BALL_RADIUS) / GRID_SPACING));
      const maxActiveRow = Math.min(rows - 1, Math.ceil((curY + BALL_RADIUS) / GRID_SPACING));

      // =========================================================================
      // STEP 1: THE GLIDING BALL SPHERE EFFECT (SHADOW, LIGHT & AURA)
      // This restores the iconic ball gliding underneath the rebar cage!
      // =========================================================================
      if (curIntensity > 0.03 && !shouldReduceMotion) {
        // 1A. Deep 3D Contact Shadow cast by the heavy gliding sphere
        const shadowOffsetX = 14 + smoothVx * 0.015;
        const shadowOffsetY = 18 + smoothVy * 0.015;
        const shadowRad = BALL_RADIUS * 0.85;

        const sphereShadow = ctx.createRadialGradient(
          curX + shadowOffsetX,
          curY + shadowOffsetY,
          20,
          curX + shadowOffsetX,
          curY + shadowOffsetY,
          shadowRad
        );
        sphereShadow.addColorStop(0, p.ballShadow);
        sphereShadow.addColorStop(0.5, isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(15, 23, 42, 0.16)');
        sphereShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = sphereShadow;
        ctx.beginPath();
        ctx.arc(curX + shadowOffsetX, curY + shadowOffsetY, shadowRad, 0, Math.PI * 2);
        ctx.fill();

        // 1B. Luminous Gliding Sphere Aura & Specular Flare
        const auraRad = BALL_RADIUS * 1.05;
        const ballLight = ctx.createRadialGradient(curX, curY, 15, curX, curY, auraRad);
        ballLight.addColorStop(0, p.ballHaloInner);
        ballLight.addColorStop(0.45, p.ballHaloMid);
        ballLight.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = ballLight;
        ctx.beginPath();
        ctx.arc(curX, curY, auraRad, 0, Math.PI * 2);
        ctx.fill();

        // 1C. Specular apex hotspot on the gliding sphere
        const spotX = curX - 25;
        const spotY = curY - 25;
        const apexSpot = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 90);
        apexSpot.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.35)');
        apexSpot.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = apexSpot;
        ctx.beginPath();
        ctx.arc(spotX, spotY, 90, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // STEP 2: BASE REALISTIC REBAR WEAVE (BACKGROUND GRID)
      // High-fidelity cylindrical steel bars with realistic herringbone ribs
      // =========================================================================

      // 2A. Base floor cast shadows (Batched single draw call)
      ctx.beginPath();
      ctx.strokeStyle = p.floorBaseShadow;
      ctx.lineWidth = BASE_DIAMETER * 1.15;
      ctx.lineCap = 'round';

      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING + 3;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING + 4;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      // 2B. Vertical Rebar Cylinders (Layer 1)
      // Dark rim
      ctx.beginPath();
      ctx.strokeStyle = p.barRim;
      ctx.lineWidth = BASE_DIAMETER;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      ctx.stroke();

      // Midtone steel core
      ctx.beginPath();
      ctx.strokeStyle = p.barMidtone;
      ctx.lineWidth = BASE_DIAMETER - 4;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      ctx.stroke();

      // Crisp specular steel highlight ridge line
      ctx.beginPath();
      ctx.strokeStyle = p.barSpecular;
      ctx.lineWidth = 1.6;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING - 2.2;
        ctx.moveTo(x, -GRID_SPACING);
        ctx.lineTo(x, height + GRID_SPACING);
      }
      ctx.stroke();

      // 2C. Horizontal Rebar Cylinders (Layer 2 - Crossing on top)
      // Contact shadow at crossings
      ctx.beginPath();
      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(15, 23, 42, 0.22)';
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const y = r * GRID_SPACING;
          ctx.rect(x - BASE_DIAMETER / 2, y - 4, BASE_DIAMETER, 8);
        }
      }
      ctx.fill();

      // Horizontal outer rim
      ctx.beginPath();
      ctx.strokeStyle = p.barRim;
      ctx.lineWidth = BASE_DIAMETER;
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      // Horizontal midtone core
      ctx.beginPath();
      ctx.strokeStyle = p.barMidtone;
      ctx.lineWidth = BASE_DIAMETER - 4;
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      // Horizontal specular highlight ridge line
      ctx.beginPath();
      ctx.strokeStyle = p.barSpecular;
      ctx.lineWidth = 1.6;
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING - 2.2;
        ctx.moveTo(-GRID_SPACING, y);
        ctx.lineTo(width + GRID_SPACING, y);
      }
      ctx.stroke();

      // 2D. Realistic Herringbone Transverse Ribs (Grooves + Raised Metallic Crests)
      // Dark indented groove behind every rib
      ctx.beginPath();
      ctx.strokeStyle = p.ribGroove;
      ctx.lineWidth = 2.2;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          ctx.moveTo(x - 5.5, y - 3.5);
          ctx.lineTo(x + 5.5, y + 3.5);
        }
      }
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING;
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          ctx.moveTo(x - 3.5, y - 5.5);
          ctx.lineTo(x + 3.5, y + 5.5);
        }
      }
      ctx.stroke();

      // Raised metallic crest on every rib
      ctx.beginPath();
      ctx.strokeStyle = p.ribHighlight;
      ctx.lineWidth = 1.4;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let y = -GRID_SPACING; y < height + GRID_SPACING; y += RIB_SPACING) {
          ctx.moveTo(x - 5, y - 4.2);
          ctx.lineTo(x + 5, y + 2.8);
        }
      }
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SPACING;
        for (let x = -GRID_SPACING; x < width + GRID_SPACING; x += RIB_SPACING) {
          ctx.moveTo(x - 4.2, y - 5);
          ctx.lineTo(x + 2.8, y + 5);
        }
      }
      ctx.stroke();

      // 2E. Base Welded Intersection Nuggets
      ctx.beginPath();
      ctx.fillStyle = p.weldNode;
      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        for (let r = 0; r < rows; r++) {
          const y = r * GRID_SPACING;
          ctx.moveTo(x + 3, y);
          ctx.arc(x, y, 3, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // =========================================================================
      // STEP 3: THE 3D POPPING DOME (REBARS BULGING AROUND THE GLIDING BALL)
      // When the ball glides, the rebars bulge out in a 3D spherical dome with
      // perspective magnification, deep dynamic shadows, and glowing hot amber ribs!
      // =========================================================================
      if (curIntensity > 0.03 && !shouldReduceMotion) {
        // 3A. 3D Elevated Pop Shadows for bars on the ball dome
        ctx.beginPath();
        ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.40)';

        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS; y <= curY + BALL_RADIUS; y += 18) {
            const dome = getBallDome(baseX, y, curX, curY, curIntensity);
            if (dome.weight <= 0.03) continue;

            const z = dome.z;
            const dirX = (dome.dx / (dome.dist + 0.1)) * (z * 0.75);
            const dirY = (dome.dy / (dome.dist + 0.1)) * (z * 0.75);
            const sw = BASE_DIAMETER * (1 + (z / MAX_BALL_ELEVATION) * 0.55);

            ctx.rect(baseX + 3 + dirX - sw / 2, y + 4 + dirY, sw, 19);
          }
        }

        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING;
          for (let x = curX - BALL_RADIUS; x <= curX + BALL_RADIUS; x += 18) {
            const dome = getBallDome(x, baseY, curX, curY, curIntensity);
            if (dome.weight <= 0.03) continue;

            const z = dome.z;
            const dirX = (dome.dx / (dome.dist + 0.1)) * (z * 0.75);
            const dirY = (dome.dy / (dome.dist + 0.1)) * (z * 0.75);
            const sh = BASE_DIAMETER * (1 + (z / MAX_BALL_ELEVATION) * 0.55);

            ctx.rect(x + 3 + dirX, baseY + 4 + dirY - sh / 2, 19, sh);
          }
        }
        ctx.fill();

        // 3B. Popped Vertical Bars Riding Over the Gliding Ball
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          const segStep = 16;
          const startY = Math.max(-GRID_SPACING, curY - BALL_RADIUS - segStep);
          const endY = Math.min(height + GRID_SPACING, curY + BALL_RADIUS + segStep);

          for (let y = startY; y < endY; y += segStep) {
            const y0 = y;
            const y1 = y + segStep;
            const dome0 = getBallDome(baseX, y0, curX, curY, curIntensity);
            const dome1 = getBallDome(baseX, y1, curX, curY, curIntensity);
            if (dome0.weight <= 0.015 && dome1.weight <= 0.015) continue;

            // Bar diameter swells as it climbs the ball dome
            const r0 = (BASE_DIAMETER / 2) * (1 + (dome0.z / MAX_BALL_ELEVATION) * 0.5);
            const r1 = (BASE_DIAMETER / 2) * (1 + (dome1.z / MAX_BALL_ELEVATION) * 0.5);

            // Lateral elastic deflection (rebar bows over the spherical ball)
            const flexX0 = (dome0.dx / (dome0.dist + 0.1)) * (dome0.z * 0.14);
            const flexX1 = (dome1.dx / (dome1.dist + 0.1)) * (dome1.z * 0.14);

            const x0 = baseX + flexX0;
            const x1 = baseX + flexX1;
            const midDome = getBallDome(baseX, (y0 + y1) / 2, curX, curY, curIntensity);
            const alpha = 0.35 + midDome.weight * 0.65;

            // 3D cylindrical polygon body
            ctx.fillStyle = isDark
              ? `rgba(40, 50, 65, ${alpha})`
              : `rgba(80, 95, 115, ${alpha})`;

            ctx.beginPath();
            ctx.moveTo(x0 - r0, y0);
            ctx.lineTo(x1 - r1, y1);
            ctx.lineTo(x1 + r1, y1);
            ctx.lineTo(x0 + r0, y0);
            ctx.closePath();
            ctx.fill();

            // Specular chrome ridge gleam
            ctx.strokeStyle = isDark
              ? `rgba(240, 246, 255, ${alpha})`
              : `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(x0 - r0 * 0.4, y0);
            ctx.lineTo(x1 - r1 * 0.4, y1);
            ctx.stroke();
          }
        }

        // 3C. Popped Horizontal Bars Riding Over the Gliding Ball
        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING;
          const segStep = 16;
          const startX = Math.max(-GRID_SPACING, curX - BALL_RADIUS - segStep);
          const endX = Math.min(width + GRID_SPACING, curX + BALL_RADIUS + segStep);

          for (let x = startX; x < endX; x += segStep) {
            const x0 = x;
            const x1 = x + segStep;
            const dome0 = getBallDome(x0, baseY, curX, curY, curIntensity);
            const dome1 = getBallDome(x1, baseY, curX, curY, curIntensity);
            if (dome0.weight <= 0.015 && dome1.weight <= 0.015) continue;

            const r0 = (BASE_DIAMETER / 2) * (1 + (dome0.z / MAX_BALL_ELEVATION) * 0.5);
            const r1 = (BASE_DIAMETER / 2) * (1 + (dome1.z / MAX_BALL_ELEVATION) * 0.5);

            const flexY0 = (dome0.dy / (dome0.dist + 0.1)) * (dome0.z * 0.14);
            const flexY1 = (dome1.dy / (dome1.dist + 0.1)) * (dome1.z * 0.14);

            const y0 = baseY + flexY0;
            const y1 = baseY + flexY1;
            const midDome = getBallDome((x0 + x1) / 2, baseY, curX, curY, curIntensity);
            const alpha = 0.35 + midDome.weight * 0.65;

            ctx.fillStyle = isDark
              ? `rgba(40, 50, 65, ${alpha})`
              : `rgba(80, 95, 115, ${alpha})`;

            ctx.beginPath();
            ctx.moveTo(x0, y0 - r0);
            ctx.lineTo(x1, y1 - r1);
            ctx.lineTo(x1, y1 + r1);
            ctx.lineTo(x0, y0 + r0);
            ctx.closePath();
            ctx.fill();

            // Specular ridge gleam
            ctx.strokeStyle = isDark
              ? `rgba(240, 246, 255, ${alpha})`
              : `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(x0, y0 - r0 * 0.4);
            ctx.lineTo(x1, y1 - r1 * 0.4);
            ctx.stroke();
          }
        }

        // 3D. Hot Amber Transverse Ribs Popping on the Gliding Ball
        ctx.beginPath();
        ctx.strokeStyle = isDark ? p.popRibGlint : p.popRibHot;
        ctx.lineWidth = 2.8;

        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const baseX = c * GRID_SPACING;
          for (let y = curY - BALL_RADIUS; y <= curY + BALL_RADIUS; y += RIB_SPACING) {
            const dome = getBallDome(baseX, y, curX, curY, curIntensity);
            if (dome.weight < 0.1) continue;

            const r = (BASE_DIAMETER / 2) * (1 + (dome.z / MAX_BALL_ELEVATION) * 0.5);
            const flexX = (dome.dx / (dome.dist + 0.1)) * (dome.z * 0.14);
            const rx = baseX + flexX;

            ctx.moveTo(rx - r * 0.88, y - 4.5);
            ctx.lineTo(rx + r * 0.88, y + 4.5);
          }
        }

        for (let r = minActiveRow; r <= maxActiveRow; r++) {
          const baseY = r * GRID_SPACING;
          for (let x = curX - BALL_RADIUS; x <= curX + BALL_RADIUS; x += RIB_SPACING) {
            const dome = getBallDome(x, baseY, curX, curY, curIntensity);
            if (dome.weight < 0.1) continue;

            const r = (BASE_DIAMETER / 2) * (1 + (dome.z / MAX_BALL_ELEVATION) * 0.5);
            const flexY = (dome.dy / (dome.dist + 0.1)) * (dome.z * 0.14);
            const ry = baseY + flexY;

            ctx.moveTo(x - 4.5, ry - r * 0.88);
            ctx.lineTo(x + 4.5, ry + r * 0.88);
          }
        }
        ctx.stroke();

        // 3E. 3D Elevated Resistance Weld Nodes on the Ball Dome
        for (let c = minActiveCol; c <= maxActiveCol; c++) {
          const ix = c * GRID_SPACING;
          for (let r = minActiveRow; r <= maxActiveRow; r++) {
            const iy = r * GRID_SPACING;
            const dome = getBallDome(ix, iy, curX, curY, curIntensity);
            if (dome.weight < 0.08) continue;

            const flexX = (dome.dx / (dome.dist + 0.1)) * (dome.z * 0.14);
            const flexY = (dome.dy / (dome.dist + 0.1)) * (dome.z * 0.14);
            const nx = ix + flexX;
            const ny = iy + flexY;
            const weldR = 4.0 + (dome.z / MAX_BALL_ELEVATION) * 2.2;

            // Weld bead body
            ctx.beginPath();
            ctx.fillStyle = dome.dist < 130 ? p.weldHot : p.weldNode;
            ctx.arc(nx, ny, weldR, 0, Math.PI * 2);
            ctx.fill();

            // Specular molten glint
            ctx.beginPath();
            ctx.fillStyle = p.barPeakWhite;
            ctx.arc(nx - 1, ny - 1, Math.max(1, weldR * 0.36), 0, Math.PI * 2);
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

      if (deltaX < 0.06 && deltaY < 0.06 && deltaI < 0.004 && curIntensity <= 0.2) {
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

    // Global pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      mouseIntensity.set(1.0);
      wakeUp();

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        mouseIntensity.set(0.18);
        wakeUp();
      }, 2400);
    };

    const handlePointerLeave = () => {
      mouseIntensity.set(0.1);
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
          mouseIntensity.set(0.18);
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
      {/* 1. Realistic Rebar Weave with Gliding Ball Mechanics Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full opacity-90 transition-opacity duration-300"
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
