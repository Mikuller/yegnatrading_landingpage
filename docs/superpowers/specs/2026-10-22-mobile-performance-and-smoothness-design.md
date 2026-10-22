# Architectural Design: Mobile Performance, 120 FPS Smoothness & Architectural Page Transitions

**Date:** 2026-10-22  
**Status:** Approved by User, Ready for Planning  
**Scope:** Whole-site mobile responsiveness, CPU/GPU rendering optimization, asset compression, bundle code-splitting, and architectural page redirection transition.

---

## 1. Intent & Success Criteria

### Target Outcomes
- **"Smooth like butter":** Sustained 60–120 FPS scrolling and interaction on mobile phones (iOS Safari, Android Chrome). No frame drops, touch stutter, or compositor freezing.
- **"Fast like a jet":** Sub-second initial page render (First Contentful Paint < 1.0s) on mobile networks.
- **Payload reduction:** Reduce total page asset weight from over 12 MB down to under 800 KB (a 93%+ diet).
- **Cinematic architectural transitions:** Replace the central logo modal spinner during page redirects with a 4-pillar staggered architectural column wipe and laser leading edge.
- **Zero desktop regression:** Full 3D canvas physics, UTM flex tests, and interactive bundle features remain 100% active on desktop screens.

---

## 2. Architecture & Subsystems

### 2.1. Mobile-Adaptive Background (`RealisticRebarWeaveBackground.tsx`)
- **Problem:** A 741-line 2D canvas continuously executing spring physics, radial gradients, shadow blurs, and path calculations in a `requestAnimationFrame` loop at full device pixel ratio (2x–3x on mobile retina screens).
- **Architecture:**
  - Introduce capability detection: `isMobileOrTouch = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches`.
  - On mobile: completely skip initializing the 2D canvas context, spring listeners, and rAF loop. Render a pure CSS hardware-accelerated subtle architectural blueprint grid (`background-image: radial-gradient(...)`) with `contain: strict;`.
  - On desktop (`>= 768px` and `pointer: fine`): initialize and run the full 2D interactive canvas physics.
  - Listen for breakpoint resize with clean teardown (`cancelAnimationFrame`, nullifying listeners) to prevent memory leaks.

### 2.2. Hero Section & Mobile Rebar Showcase (`Hero.tsx`)
- **Problem:** The hero section renders `InteractiveRebarBundle.tsx` (1,666 lines, 3 complex 3D/audio modes, 1,400+ SVG nodes with nested drop-shadow filters) immediately in the mobile viewport.
- **Architecture:**
  - Desktop: Retain `InteractiveRebarBundle` in the hero with full 3D stack, scale lineup, and UTM bending test physics with Web Audio.
  - Mobile (`< 768px`): Render a dedicated, lightweight `MobileRebarShowcase`:
    - Clean horizontal pill selector for standard metric diameters (8mm, 10mm, 12mm, 14mm, 16mm, 20mm, 24mm, 32mm).
    - Pre-rendered, high-resolution rebar render with subtle glow.
    - Live metric specs (pcs/quintal, yield strength, application).
    - Direct "Request Quote" CTA prefilling the quote builder.
    - Zero Web Audio contexts created, zero SVG filter lag, zero touch gesture conflicts with vertical page scrolling.

### 2.3. Architectural Staggered Column Wipe Transition (`ArchitecturalTransition.tsx`)
- **Problem:** Currently, page redirection displays `NavigationTransitionOverlay.tsx`, which renders a floating glassmorphic box with a spinning logo in the center. The user requested a genuine transition animation look.
- **Architecture:**
  - Replace `NavigationTransitionOverlay` with `ArchitecturalTransition`.
  - Structure: 4 vertical steel/obsidian architectural columns (`grid grid-cols-4 fixed inset-0 z-[80] pointer-events-none`).
  - **Exit Wipe (Departing Page):**
    - Triggered on internal navigation link click.
    - Columns scale up from bottom to top with a 0.04s stagger across the 4 columns (duration: ~220ms).
    - An amber laser hairline sweeps across the leading edge with subtle ember bloom (`box-shadow: 0 0 24px rgba(245,124,0,0.8)`).
    - Writes `sessionStorage.setItem('yegna_page_transition', '1')` before `window.location.href = href`.
  - **Enter Reveal (Arriving Page):**
    - On component mount in `PageShell`, checks `sessionStorage.getItem('yegna_page_transition')`.
    - If present, columns start at full coverage and swiftly slide upward (`translateY(-100%)`) in a reverse staggered wave (~200ms), seamlessly unveiling the new page with zero white flash.
    - Clears the flag upon completion.
  - **Safety Failsafes:**
    - Listen for `pageshow` and `popstate` to reset state if the user navigates via browser history.
    - 500ms fallback timer to automatically clear the overlay if navigation is aborted.

### 2.4. Code Splitting & Dynamic Lazy-Loading (`HomePage.tsx` & Subpages)
- **Problem:** `PageShell` chunk is 435.58 kB and `RebarLab` chunk is 110.04 kB, parsed synchronously on load.
- **Architecture:**
  - Use `React.lazy()` and `Suspense` for below-the-fold modules:
    - `RebarLab.tsx` (~110 kB bundle)
    - `Quote.tsx` (~31 kB bundle)
    - `Ceo.tsx`, `Why.tsx`, `Insights.tsx`, `Faq.tsx`
  - Skeleton fallback containers with explicit min-height (`min-h-[400px]`) prevent layout shifts.
  - Drops initial critical JS payload from ~550 kB down to ~65 kB.

### 2.5. Asset Compression & Delivery Pipeline
- **Problem:** Over 10 MB of raw uncompressed images in `public/` (`ceo.jpg` 2.02 MB, `team-getahun.jpg` 2.18 MB, `team-mulugeta.jpg` 2.15 MB, `team-tilahun.png` 2.02 MB, `rebar-hero.png` 1.05 MB), plus a blocking preload tag in `index.html`.
- **Architecture:**
  - Compress the heavy images into modern, web-optimized WebP format (~80–160 KB each, preserving sharp visual fidelity).
  - Remove the 1.05 MB high-priority preload tag for `rebar-hero.png` from `index.html` on mobile.
  - Ensure all `<img>` tags throughout `src/` specify `loading="lazy"`, `decoding="async"`, and explicit aspect ratios.

### 2.6. Mobile CSS & Compositor Optimization
- **Problem:** Heavy `backdrop-filter: blur(24px)` over moving elements and complex layouts causes severe composite layer repaints on iOS Safari and Android Chrome.
- **Architecture:**
  - On mobile breakpoints, replace heavy multi-layer backdrop blurs on sticky bars and cards with performant semi-translucent background colors (`bg-panel/95` or `bg-slate-900/95`).
  - Add `content-visibility: auto; contain-intrinsic-size: 1px 600px;` to heavy below-the-fold sections, allowing the mobile browser engine to skip layout and rendering calculations until scrolled into view.

---

## 3. Data Flow & State Management

```
User Action: Tap Link (/products/)
   │
   ▼
PageShell Anchor Interceptor
   │
   ├─► Set transition flag in sessionStorage ('yegna_page_transition' = '1')
   ├─► Animate 4 Architectural Columns IN (staggered, 220ms)
   └─► Trigger window.location.href = '/products/'
         │
         ▼
      New Page Mounts (SSG Pre-rendered HTML arrives)
         │
         ▼
      PageShell mounts on new page
         │
         ├─► Detects 'yegna_page_transition' in sessionStorage
         ├─► Animates 4 Architectural Columns OUT (upward staggered reveal, 200ms)
         └─► Removes flag from sessionStorage
```

---

## 4. Verification & Testing Plan

1. **Build Integrity:** Run `npm run build` to verify TypeScript compile (`tsc -b`), Vite build chunks, and SSG prerendering (`node scripts/prerender.js`).
2. **Bundle Size Verification:** Verify that the primary bundle chunk is drastically reduced and below-the-fold components are correctly isolated in lazy chunks.
3. **Mobile Device Emulation:** Test under simulated 3G/4G throttling and 4x CPU slowdown (Chrome DevTools Mobile iPhone/Pixel presets):
   - Background canvas does not boot or burn CPU on mobile.
   - Hero mobile showcase displays snappy diameter pills and instant CTA response.
   - Page redirection displays the 4-column staggered wipe with laser leading edge smoothly.
   - Smooth 60–120 FPS scrolling throughout the entire home page.
4. **Desktop Sanity Check:** Verify desktop view retains the full 2D interactive canvas and 3D UTM bending test suite.
