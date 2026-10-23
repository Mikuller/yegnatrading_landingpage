# Mobile Performance & Architectural Page Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the website into an ultra-fast, 120 FPS buttery-smooth experience on mobile devices and replace the central spinner modal with a cinematic 4-pillar staggered architectural page transition.

**Architecture:** Detect mobile/touch devices to cleanly bypass continuous canvas loops and heavy SVG 3D bundles, code-split below-the-fold components via `React.lazy()`, compress multi-megabyte images to WebP, optimize mobile CSS compositing layers, and implement a 4-pillar staggered architectural wipe with sessionStorage route coordination.

**Tech Stack:** React 19, Motion (`motion/react`), Tailwind CSS v4, Vite 6, TypeScript 5.7, Node.js scripts.

**Spec:** `docs/superpowers/specs/2026-10-22-mobile-performance-and-smoothness-design.md`

## Global Constraints

- Keep `.verdentc.json` aligned with the actual publish build contract.
- Run `npm run build` (`tsc -b && vite build && node scripts/prerender.js`) to verify all changes.
- Never compromise desktop 3D fidelity: full interactive canvas and UTM flex testing remain active on desktop (`>= 768px`).
- Keep all existing copy, bilingual Amharic/English translations, and contact information intact.

## Review Focus

- Viewport boundary flip: resizing browser across 768px must mount or teardown canvas loop cleanly without duplicate listeners or memory leaks.
- Page transition navigation cancellation: pressing browser Back button or canceling navigation must gracefully unmount transition columns within 500ms.
- Pre-render SSG compatibility: all dynamic imports and client-side device checks must safely guard `window` and `document` during server-side pre-rendering.
- Image fallbacks: WebP assets must gracefully load or fallback without broken image placeholders.
- Layout stability (CLS): lazy-loaded sections and images must declare fixed min-heights and aspect ratios.

---

### Task 1: Mobile-Adaptive Background & Zero-CPU Mesh

**Files:**
- Modify: `src/components/RealisticRebarWeaveBackground.tsx`

**Interfaces:**
- Consumes: Standard React hooks, `motion/react`
- Produces: `<RealisticRebarWeaveBackground />` component that checks mobile/touch and skips canvas rAF on mobile screens.

- [ ] **Step 1: Inspect and update `RealisticRebarWeaveBackground.tsx` with mobile guard**
  Add device capability check (`window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches`). If true, skip initializing canvas 2D context and render hardware-accelerated CSS pattern.
- [ ] **Step 2: Add window resize listener with clean teardown**
  Enable clean transition if window resizes across breakpoint, canceling active rAF.
- [ ] **Step 3: Verify TypeScript and build**
  Run: `npm run build`
  Expected: Clean build with 0 TypeScript errors.
- [ ] **Step 4: Commit**
  Run: `git add src/components/RealisticRebarWeaveBackground.tsx; git commit -m "perf: adapt rebar weave background to zero-cpu css on mobile"`

---

### Task 2: Mobile Rebar Showcase & Hero Optimization

**Files:**
- Create: `src/components/MobileRebarShowcase.tsx`
- Modify: `src/sections/Hero.tsx`

**Interfaces:**
- Consumes: `COMMERCIAL_SPECS` from `InteractiveRebarBundle.tsx`, `QuotePrefill` from `RebarLab.tsx`, `useApp()` for localization.
- Produces: `<MobileRebarShowcase onQuote={onQuote} />` rendered in `Hero.tsx` when viewport `< 768px`.

- [ ] **Step 1: Create `src/components/MobileRebarShowcase.tsx`**
  Implement touch-friendly horizontal diameter pills (8mm to 32mm), instant spec badge cards (pcs/quintal, yield strength, structural application), and direct "Request Quote" button prefilling quote builder.
- [ ] **Step 2: Integrate into `src/sections/Hero.tsx`**
  Render `MobileRebarShowcase` on mobile screens and keep `InteractiveRebarBundle` for desktop screens (`hidden md:block` / `md:hidden`).
- [ ] **Step 3: Verify build**
  Run: `npm run build`
  Expected: Build passes with SSG prerendering successful.
- [ ] **Step 4: Commit**
  Run: `git add src/components/MobileRebarShowcase.tsx src/sections/Hero.tsx; git commit -m "feat: add touch-optimized mobile rebar showcase in hero"`

---

### Task 3: Architectural 4-Column Staggered Page Transition

**Files:**
- Create: `src/components/ArchitecturalTransition.tsx`
- Modify: `src/components/PageShell.tsx`
- Delete / Replace: `src/components/NavigationTransitionOverlay.tsx`

**Interfaces:**
- Consumes: `useApp()`, `motion/react`, `sessionStorage`
- Produces: `<ArchitecturalTransition isNavigating={isNavigating} />` with 4 vertical steel/obsidian pillars, 0.04s stagger, amber laser leading edge, and entry reveal on new route.

- [ ] **Step 1: Create `src/components/ArchitecturalTransition.tsx`**
  Implement 4 vertical columns with staggered scale/translate animation, glowing amber laser rim, and automatic `sessionStorage` entry detection.
- [ ] **Step 2: Update `PageShell.tsx` navigation click interceptor**
  Wire internal anchor clicks to trigger `ArchitecturalTransition`, save pending transition in `sessionStorage`, and trigger route change after 220ms.
- [ ] **Step 3: Remove obsolete center modal `NavigationTransitionOverlay`**
  Clean up references from `PageShell.tsx`.
- [ ] **Step 4: Verify build**
  Run: `npm run build`
  Expected: Build succeeds with 0 errors.
- [ ] **Step 5: Commit**
  Run: `git add src/components/ArchitecturalTransition.tsx src/components/PageShell.tsx; git commit -m "feat: implement 4-column architectural staggered page transition"`

---

### Task 4: Dynamic Code-Splitting & Preloader Streamlining

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/BrandPreloader.tsx`

**Interfaces:**
- Consumes: `React.lazy`, `Suspense`
- Produces: Lazy-loaded below-the-fold sections with lightweight skeleton fallbacks.

- [ ] **Step 1: Convert heavy sections in `HomePage.tsx` to `React.lazy`**
  Split `RebarLab`, `Quote`, `Ceo`, `Why`, `Insights`, `Faq` into lazy imports wrapped with clean `Suspense` containers.
- [ ] **Step 2: Streamline `BrandPreloader.tsx` on mobile**
  Cap preloader delay on mobile to instant/300ms once DOM is ready so mobile users do not wait 1,200ms.
- [ ] **Step 3: Run build & verify chunk sizes**
  Run: `npm run build`
  Expected: Primary chunk decreases significantly, and lazy chunks are emitted (`RebarLab`, `Quote`, etc.).
- [ ] **Step 4: Commit**
  Run: `git add src/pages/HomePage.tsx src/components/BrandPreloader.tsx; git commit -m "perf: code-split homepage sections and streamline mobile preloader"`

---

### Task 5: Image Optimization, WebP Conversion & Preload Tuning

**Files:**
- Create: `scripts/optimize-images.mjs`
- Modify: `index.html`
- Modify: references in `src/data.ts`, `src/sections/Ceo.tsx`, `src/sections/Team.tsx`

**Interfaces:**
- Consumes: Node built-ins / sharp or canvas or image compression script
- Produces: Web-optimized WebP image assets in `public/images/` reducing payload from >10 MB to <600 KB.

- [ ] **Step 1: Write and run image optimization script `scripts/optimize-images.mjs`**
  Compress `ceo.jpg` (2.02MB), `team-getahun.jpg` (2.18MB), `team-mulugeta.jpg` (2.15MB), `team-tilahun.png` (2.02MB), `rebar-hero.png` (1.05MB) to high-quality WebP.
- [ ] **Step 2: Update image references to use `.webp` with native `loading="lazy"` and `decoding="async"`**
  Update `src/data.ts`, `Team.tsx`, `Ceo.tsx`.
- [ ] **Step 3: Update `index.html` preloads**
  Remove heavy 1.05 MB `rebar-hero.png` preload or point to compressed asset.
- [ ] **Step 4: Run build & verify images**
  Run: `npm run build`
  Expected: Build passes and all images resolve with reduced byte sizes.
- [ ] **Step 5: Commit**
  Run: `git add public/ scripts/optimize-images.mjs src/ index.html; git commit -m "perf: compress hero and team imagery to modern webp"`

---

### Task 6: Mobile CSS, Compositor Performance & Final Verification

**Files:**
- Modify: `src/components/PageShell.tsx`
- Modify: `src/style.css`

**Interfaces:**
- Consumes: CSS containment, Tailwind classes
- Produces: 60-120 FPS buttery scrolling without GPU composite lag.

- [ ] **Step 1: Replace heavy `backdrop-blur` on mobile sticky bars and overlays**
  Use performant `bg-panel/95` background on mobile viewports.
- [ ] **Step 2: Add `content-visibility: auto` to offscreen sections**
  Add CSS utility in `src/style.css` for heavy offscreen sections.
- [ ] **Step 3: Full production build & SSG prerender verification**
  Run: `npm run build`
  Expected: Complete success across all MPA routes (`/`, `/about/`, `/products/`, `/careers/`, `/insights/`, `/contact/`).
- [ ] **Step 4: Commit**
  Run: `git add src/components/PageShell.tsx src/style.css; git commit -m "perf: optimize mobile compositor layers and css containment"`
