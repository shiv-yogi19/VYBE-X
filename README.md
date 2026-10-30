# VYBE-X — Ultimate Music Visualizer

> **Creator & Lead Architect:** Shiv Yogi  
> **Platform:** Production-Ready HTML5 / Web Audio API / Canvas / PWA  
> **Target Hosting:** GitHub Pages & Modern Web Browsers (No backend, database, or build step required)

---

## 🌟 Overview

**VYBE-X** is a complete, production-grade music visualizer web application designed and built by **Shiv Yogi**. Engineered from the ground up for maximum visual performance, audio precision, and aesthetic fidelity, VYBE-X features over **120 genuinely distinct audio-reactive visualizer presets**, **15+ modular animation engines**, an immersive **RGB Laser Party Mode**, an interactive **DJ Control Panel**, a full-featured **Local Audio Player**, live **Microphone input processing**, and seamless **PWA (Progressive Web App)** offline capabilities.

Built exclusively with native Web standards (ES6+ Modules, HTML5 Canvas 2D, CSS3 Liquid Glassmorphism, and the Web Audio API), VYBE-X runs effortlessly on GitHub Pages, local servers, and Android / iOS devices with zero compilation or external dependencies.

---

## 🚀 Key Features

### 1. 120+ Distinct Visualizer Presets
Organized logically across 10 specialized modules (12 unique presets per module):
- **Waveforms (`visualizers/waveforms.js`):** Neon Wave, Dual Wave, Mirror Wave, Rainbow Wave, Liquid Wave, Pulse Wave, Multi-Line Wave, Spiral Wave, Oscilloscope, Glowing Wave, Frequency Ribbon, Energy Wave.
- **Spectrum (`visualizers/spectrum.js`):** Classic Spectrum, RGB Spectrum, Mirrored Spectrum, Gradient Bars, Neon Bars, Circular Spectrum Bars, Frequency Columns, Floating Spectrum, Spectrum Blocks, Peak-Hold Spectrum, Glass Spectrum, Reactive Equalizer.
- **Circular (`visualizers/circular.js`):** RGB Audio Ring, Pulsating Circle, Energy Halo, Neon Orbit, Circular Frequency Ring, Dual Audio Rings, Rotating Spectrum, Cosmic Circle, Pulse Halo, Orbital Rings, Radiant Circle, Multiring Visualizer.
- **Particles (`visualizers/particles.js`):** Galaxy Particles, Cosmic Dust, Particle Explosion, Starfield, Particle Vortex, Energy Particles, Firefly Field, Reactive Stars, Particle Spiral, Neon Particle Cloud, Orbiting Particles, Particle Burst.
- **Geometric (`visualizers/geometric.js`):** Rotating Polygon, Neon Grid, Reactive Triangles, Geometric Tunnel, Wireframe Sphere, Rotating Cube, Symmetry Grid, Dynamic Hexagons, Fractal Geometry, Neon Diamonds, Geometric Rings, Reactive Wireframe.
- **RGB Neon (`visualizers/rgb-neon.js`):** RGB Pulse, Rainbow Flow, Neon Glow, RGB Edge Glow, Color Burst, Neon Aura, Chromatic Wave, Rainbow Tunnel, Reactive Gradient, Neon Plasma, RGB Horizon, Aurora Neon.
- **Lasers (`visualizers/lasers.js`):** Laser Tunnel, RGB Laser Grid, Laser Crossfire, Rotating Laser Fan, Rainbow Laser Storm, Laser Horizon, Moving Beam Matrix, Circular Laser Cage, Neon Beam Tunnel, Laser Spiral, Laser Sweep Field, Reactive Light Beams.
- **Tunnels (`visualizers/tunnels.js`):** Hyperspace Tunnel, Cosmic Tunnel, Neon Tunnel, Rotating Tunnel, Star Tunnel, Energy Tunnel, Wireframe Tunnel, Particle Tunnel, Infinite Grid, Radial Zoom, Plasma Tunnel, Rainbow Tunnel.
- **Fluid Energy (`visualizers/fluid-energy.js`):** Fluid Motion, Plasma Sphere, Liquid Energy, Aurora Flow, Electric Pulse, Energy Shockwave, Reactive Smoke, Color Fluid, Magnetic Field, Energy Vortex, Flowing Light, Cosmic Plasma.
- **Special Effects (`visualizers/special-effects.js`):** Kaleidoscope, Neon DNA, Symmetry Burst, Electric Storm, Reactive Mandala, Light Trails, Cosmic Explosion, Hyperspace Jump, Audio Reactive Rings, Neon Rain, Quantum Grid, Energy Core.

### 2. 15+ Reusable Animation Techniques
Implemented across 5 modular animation libraries:
- `animations/rgb-pulse.js`: RGB Pulse, Beat Flash, Glow Bloom.
- `animations/laser-sweep.js`: Laser Sweep, Light Trails, 3D Rotation.
- `animations/particle-explosion.js`: Particle Explosion, Energy Shockwave, Spectrum Morphing.
- `animations/fluid-motion.js`: Fluid Motion, Plasma Flow, Wave Distortion.
- `animations/aurora-motion.js`: Aurora Motion, Tunnel Zoom, Kaleidoscope Motion.

### 3. Dedicated RGB Laser Party Mode
- Ultra-high-energy laser party visual experience.
- Moving beam matrix, laser crossfire sweeps, and rotating fan beams.
- Rhythmic beat strobes and pulse rings synchronized to low-frequency audio transients.
- Neon edge glows and phosphorescent light trails.
- Photosensitivity protection: Instant toggle for reduced-flashing mode.

### 4. Real Web Audio API Engine
- **Live Microphone Input:** Direct `getUserMedia` audio stream connected solely to an `AnalyserNode` to prevent acoustic feedback loops.
- **Local Audio Player:** HTML5 `<audio>` element with `createMediaElementSource`, object URL management, progress scrubbing, duration display, and volume control.
- **Built-in Ambient Synth Generator:** Produces rhythmic bass and arpeggio chords directly in Web Audio for instant testing without mic or local files.
- **Frequency Analysis & Beat Detection:** Separates audio into Sub-bass/Bass (20–150Hz), Midrange (150–2500Hz), and Treble (2500–16000Hz) with dynamic energy peak thresholding for transient beat detection.

### 5. Interactive DJ Control Panel
- Sliders for: Bass Sensitivity, Audio Sensitivity, FFT Smoothing, Animation Speed, Visual Brightness, Glow Intensity, Laser Width, RGB Intensity, Particle Density, and Wave Amplitude.
- 8 Curated RGB Neon Color Palettes: Cyberpunk Neon, Sunset Synthwave, Matrix Emerald, Electric Ice, Solar Flare, Deep Cosmos, Acid Rainbow, and Monochrome Laser.
- Performance profiles: Performance (low resource, high FPS), Balanced (optimal), Quality (maximum particle count & bloom).
- Modes: Mirror Mode, Random Preset Mode, Auto-Transition (10s, 20s, 30s, 60s intervals).

### 6. Searchable Visualizer Library
- Modal library with real-time text search.
- Category filter pills (All, Favorites, Recent, and each of the 10 categories).
- Interactive card grid with live canvas preview thumbnails.
- Instant one-tap preset switching and favorite star toggles.

### 7. Liquid Glass Design System
- Dark glassmorphism interface with deep black `#050508` backdrops.
- Frosted glass panels with `backdrop-filter: blur(16px)` and RGB neon borders.
- Crisp vector SVG icons for all controls (zero cartoonish emoji placeholders).
- Fullscreen auto-hiding HUD (fades out after 3 seconds of stillness for complete immersion).

### 8. PWA & Offline Support
- Installable Web App with `manifest.json` and 192px / 512px SVG icons.
- `service-worker.js` with relative URL caching, automatic old-cache cleanup, and offline asset caching.
- Compatible with GitHub Pages repository subpaths (e.g. `https://username.github.io/repository/`).

---

## 📁 Strict File Structure

```text
VYBE-X/
├── index.html                   # Semantic HTML5 shell & UI layout
├── README.md                    # Project documentation & deployment guide
├── manifest.json                # PWA web app metadata
├── service-worker.js            # PWA offline cache manager
├── assets/
│   ├── logo.svg                 # Neon vector logo
│   └── icons/
│       ├── icon-192.svg         # 192x192 PWA app icon
│       └── icon-512.svg         # 512x512 PWA app icon
├── css/
│   ├── main.css                 # Typography, variables, header & dock layout
│   ├── liquid-glass.css         # Glassmorphism panels, sliders & controls
│   ├── visualizers.css          # Library grid, search, filters & cards
│   └── animations.css           # Intro animations, keyframes & RGB sweeps
├── js/
│   ├── app.js                   # Application coordinator & event bindings
│   ├── audio-engine.js          # Web Audio API pipeline & beat detection
│   ├── visualizer-engine.js     # Master render loop & preset dispatcher
│   ├── fullscreen.js            # Fullscreen API & inactivity timer
│   ├── settings.js              # LocalStorage persistence & palettes
│   └── performance.js           # Adaptive DPR, FPS monitor & mobile profiles
├── visualizers/
│   ├── waveforms.js             # 12 Waveform presets
│   ├── spectrum.js              # 12 Spectrum presets
│   ├── circular.js              # 12 Circular presets
│   ├── particles.js             # 12 Particle presets
│   ├── geometric.js             # 12 Geometric presets
│   ├── rgb-neon.js              # 12 RGB Neon presets
│   ├── lasers.js                # 12 Laser presets
│   ├── tunnels.js               # 12 Tunnel presets
│   ├── fluid-energy.js          # 12 Fluid Energy presets
│   └── special-effects.js       # 12 Special Effects presets
└── animations/
    ├── rgb-pulse.js             # RGB Pulse, Beat Flash, Glow Bloom
    ├── laser-sweep.js           # Laser Sweep, Light Trails, 3D Rotation
    ├── particle-explosion.js    # Particle Explosion, Shockwave, Morphing
    ├── fluid-motion.js          # Fluid Motion, Plasma Flow, Distortion
    └── aurora-motion.js         # Aurora Motion, Tunnel Zoom, Kaleidoscope
```

---

## 💻 Local Testing Instructions

Because VYBE-X uses native standard ES Modules (`import`/`export`), it should be served via an HTTP/HTTPS server rather than directly via `file://` (due to browser CORS security restrictions on ES module loading from local disk).

### Option 1: Python Built-in HTTP Server
```bash
cd VYBE-X
python3 -m http.server 8080
```
Open your browser and navigate to `http://localhost:8080`.

### Option 2: Node.js / npx
```bash
cd VYBE-X
npx serve .
```

### Option 3: VS Code Live Server
Right-click on `index.html` inside VS Code and select **Open with Live Server**.

---

## 🌐 GitHub Pages Deployment Instructions

VYBE-X is engineered to work on GitHub Pages immediately without any build steps or compilation:

1. Create a new GitHub repository (e.g., `vybe-x`).
2. Clone or copy the contents of the `VYBE-X` folder directly into your repository root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of VYBE-X by Shiv Yogi"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vybe-x.git
   git push -u origin main
   ```
3. On GitHub, navigate to **Settings** → **Pages**.
4. Under **Source**, select `Deploy from a branch`.
5. Under **Branch**, select `main` / `root` and click **Save**.
6. GitHub Pages will build and deploy your site within 1–2 minutes at:
   `https://YOUR_USERNAME.github.io/vybe-x/`

> **Note:** Because all paths in HTML, CSS, JavaScript, and the Service Worker use relative notation (`./`), VYBE-X runs seamlessly on any repository subpath without configuration changes!

---

## 🔒 Privacy & Microphone Permissions

- **Zero Data Collection:** VYBE-X does not collect, record, save, or transmit your audio. All Web Audio API signal processing takes place entirely in client-side memory on your device.
- **HTTPS Requirement:** Browsers strictly require a secure context (`HTTPS` or `http://localhost`) to grant microphone access via `navigator.mediaDevices.getUserMedia`. GitHub Pages automatically provides HTTPS.
- **Troubleshooting Microphone Permission:**
  - If you accidentally click "Block" or "Deny", click the lock / tune icon in your browser's address bar next to the URL.
  - Set **Microphone** to **Allow**.
  - Refresh the page and click **Enable Microphone**.
  - If your device has no microphone or access is restricted by policy, you can still enjoy full visualization by loading any local audio file (`.mp3`, `.wav`, `.m4a`, `.ogg`, `.flac`) or using the built-in **Ambient Synth Demo**.

---

## 📱 Mobile & PWA Installation

- **Android Chrome:** Tap the 3-dots menu in Chrome and select **Install app** or **Add to Home screen**.
- **iOS Safari:** Tap the Share button in Safari and select **Add to Home Screen**.
- **Desktop Chrome / Edge:** Click the Install icon in the right side of the address bar.
- **Adaptive Performance:** If you experience battery drain or lower frame rates on older mobile phones, open the **DJ Control Panel** and select the **Performance** profile to optimize particle count and disable heavy blur passes.

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Play / Pause Audio Player |
| <kbd>F</kbd> | Toggle Fullscreen Mode |
| <kbd>L</kbd> | Open / Close 120+ Visualizer Library |
| <kbd>D</kbd> | Open / Close DJ Control Panel |
| <kbd>P</kbd> | Toggle RGB Laser Party Mode |
| <kbd>M</kbd> | Toggle Microphone Input |
| <kbd>→</kbd> | Next Visualizer Preset |
| <kbd>←</kbd> | Random Visualizer Preset |

---

## 📄 License & Credits

**VYBE-X — Ultimate Music Visualizer**  
Designed, engineered, and created by **Shiv Yogi**.  
All rights reserved. Free for personal, non-commercial, and creative audio performance use.
