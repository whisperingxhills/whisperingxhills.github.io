# WH Website Stack

## Live Site (CDN — no build step needed)
All client-side, works on GitHub Pages.

### Currently Using
- **GSAP** — scroll animations, transitions
  `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js`
  `https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js`

### Ready to Use
- **Three.js** — 3D graphics, fog, particles, environmental effects
  `https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.min.js`
- **Lenis** — smooth scroll (replaces native, pairs with GSAP)
  `https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js`
- **Barba.js** — seamless page transitions (/mind, /maul, /mend)
  `https://cdn.jsdelivr.net/npm/@barba/core@2/dist/barba.umd.min.js`
- **Lottie Player** — complex animations from After Effects
  `https://cdn.jsdelivr.net/npm/@lottiefiles/lottie-player@latest/dist/lottie-player.js`

## Dev Tools (npm, local only)
- **sharp** — image optimization/compression before deploy
- **Lighthouse CI** — performance audits (future: GitHub Actions)

## Hosting
- GitHub Pages: `whisperingxhills.github.io`
- Future: whisperingxhills.com via nginx on VPS (143.110.206.44)

## Design System
- Palette: cream bg (#F5F0E8), dark text (#1a1a1a), red pinstripe (#8B0000)
- Aesthetic: ghetto futurism, warm patina, retro-futuristic
- NO: sterile white, corporate clean, generic tech
- German Expressionism reserved for EP2 (maul.the.gap)
