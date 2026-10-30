/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Performance Manager: Adaptive DPR, FPS Monitoring & Mobile Optimization
   Creator: Shiv Yogi
   ========================================================================== */

import { settings } from './settings.js';

export const PROFILES = {
  performance: {
    name: 'Performance',
    dprCap: 1.0,
    maxParticles: 90,
    enableGlow: false,
    enableTrails: false,
    trailDecay: 0.35,
    blurLevel: 0
  },
  balanced: {
    name: 'Balanced',
    dprCap: 1.25,
    maxParticles: 220,
    enableGlow: true,
    enableTrails: true,
    trailDecay: 0.22,
    blurLevel: 8
  },
  quality: {
    name: 'Quality',
    dprCap: 2.0,
    maxParticles: 450,
    enableGlow: true,
    enableTrails: true,
    trailDecay: 0.15,
    blurLevel: 18
  }
};

class PerformanceManager {
  constructor() {
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.isPageVisible = !document.hidden;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.profileKey = settings.get('performanceProfile') || 'balanced';
    this.activeProfile = PROFILES[this.profileKey] || PROFILES.balanced;

    this.setupListeners();
  }

  setupListeners() {
    // Visibility change (pause/throttle when tab is backgrounded)
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
    });

    // Reduced motion preference
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
      });
    } catch (e) {
      // Ignore unsupported browsers
    }

    // Settings listener
    settings.onChange((data) => {
      if (data.performanceProfile !== this.profileKey) {
        this.setProfile(data.performanceProfile);
      }
    });
  }

  setProfile(key) {
    if (PROFILES[key]) {
      this.profileKey = key;
      this.activeProfile = PROFILES[key];
      settings.set('performanceProfile', key);
    }
  }

  getProfile() {
    return this.activeProfile;
  }

  getEffectiveDpr() {
    const rawDpr = window.devicePixelRatio || 1;
    return Math.min(rawDpr, this.activeProfile.dprCap);
  }

  // Update FPS count
  tick(timestamp) {
    this.frameCount++;
    const delta = timestamp - this.lastFpsUpdate;
    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastFpsUpdate = timestamp;
    }
  }

  getFps() {
    return this.fps;
  }

  // Utility to resize canvas with crisp high-DPI scaling
  resizeCanvas(canvas, container = window) {
    const width = container.innerWidth || container.clientWidth || window.innerWidth;
    const height = container.innerHeight || container.clientHeight || window.innerHeight;
    const dpr = this.getEffectiveDpr();

    const displayWidth = Math.floor(width * dpr);
    const displayHeight = Math.floor(height * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    return { width: displayWidth, height: displayHeight, dpr, logicalWidth: width, logicalHeight: height };
  }
}

export const performanceManager = new PerformanceManager();
