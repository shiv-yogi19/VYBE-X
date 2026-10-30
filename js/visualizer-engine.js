/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Engine: Master Render Loop, 120+ Presets Registry & Party Mode
   Creator: Shiv Yogi
   ========================================================================== */

import { settings } from './settings.js';
import { performanceManager } from './performance.js';
import { audioEngine } from './audio-engine.js';

// Import All 10 Visualizer Modules (120+ Presets)
import { waveformPresets } from '../visualizers/waveforms.js';
import { spectrumPresets } from '../visualizers/spectrum.js';
import { circularPresets } from '../visualizers/circular.js';
import { particlePresets } from '../visualizers/particles.js';
import { geometricPresets } from '../visualizers/geometric.js';
import { rgbNeonPresets } from '../visualizers/rgb-neon.js';
import { laserPresets } from '../visualizers/lasers.js';
import { tunnelPresets } from '../visualizers/tunnels.js';
import { fluidEnergyPresets } from '../visualizers/fluid-energy.js';
import { specialEffectsPresets } from '../visualizers/special-effects.js';

// Import Reusable Animation Modules
import { RgbPulseEngine, drawBeatFlash } from '../animations/rgb-pulse.js';
import { LaserSweepEngine, applyLightTrails } from '../animations/laser-sweep.js';
import { ParticleExplosionEngine, EnergyShockwaveEngine } from '../animations/particle-explosion.js';
import { FluidMotionEngine } from '../animations/fluid-motion.js';
import { AuroraMotionEngine } from '../animations/aurora-motion.js';

class VisualizerEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationFrameId = null;
    this.startTime = performance.now();

    // Registry of all 120 presets
    this.presets = [
      ...waveformPresets,
      ...spectrumPresets,
      ...circularPresets,
      ...particlePresets,
      ...geometricPresets,
      ...rgbNeonPresets,
      ...laserPresets,
      ...tunnelPresets,
      ...fluidEnergyPresets,
      ...specialEffectsPresets
    ];

    this.presetMap = new Map();
    for (const preset of this.presets) {
      this.presetMap.set(preset.id, preset);
    }

    // Active Preset
    const savedPresetId = settings.get('currentPresetId');
    this.activePreset = this.presetMap.get(savedPresetId) || this.presets[0];
    this.transitionAlpha = 1.0;
    this.previousPreset = null;

    // Animation Subsystems
    this.rgbPulse = new RgbPulseEngine();
    this.laserSweep = new LaserSweepEngine();
    this.particleExplosion = new ParticleExplosionEngine(300);
    this.shockwave = new EnergyShockwaveEngine();
    this.fluidMotion = new FluidMotionEngine();
    this.auroraMotion = new AuroraMotionEngine();

    // Party Mode state
    this.partyMode = false;
    this.partyStrobeEl = null;

    // Auto-transition timer
    this.lastTransitionTime = performance.now();

    // Listen to settings updates
    settings.onChange((data) => {
      if (data.currentPresetId && data.currentPresetId !== this.activePreset.id) {
        this.selectPreset(data.currentPresetId, false);
      }
    });
  }

  init(canvasElement, strobeOverlayElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.partyStrobeEl = strobeOverlayElement;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Start master animation loop
    this.render = this.render.bind(this);
    this.animationFrameId = requestAnimationFrame(this.render);
  }

  resize() {
    if (!this.canvas) return;
    performanceManager.resizeCanvas(this.canvas);
  }

  getAllPresets() {
    return this.presets;
  }

  getPresetById(id) {
    return this.presetMap.get(id);
  }

  getActivePreset() {
    return this.activePreset;
  }

  selectPreset(id, persist = true) {
    const next = this.presetMap.get(id);
    if (!next || next.id === this.activePreset.id) return;

    this.previousPreset = this.activePreset;
    this.activePreset = next;
    this.transitionAlpha = 0.0;
    this.lastTransitionTime = performance.now();

    if (persist) {
      settings.set('currentPresetId', id);
      settings.addRecent(id);
    }
  }

  selectRandomPreset() {
    const randomIndex = Math.floor(Math.random() * this.presets.length);
    const chosen = this.presets[randomIndex];
    this.selectPreset(chosen.id);
  }

  selectNextPreset() {
    const currentIndex = this.presets.findIndex(p => p.id === this.activePreset.id);
    const nextIndex = (currentIndex + 1) % this.presets.length;
    this.selectPreset(this.presets[nextIndex].id);
  }

  togglePartyMode(forceState) {
    this.partyMode = typeof forceState === 'boolean' ? forceState : !this.partyMode;
    document.body.classList.toggle('party-mode-active', this.partyMode);
    return this.partyMode;
  }

  // Master Render Loop
  render(now) {
    this.animationFrameId = requestAnimationFrame(this.render);

    // Skip rendering if page is backgrounded to save mobile battery
    if (!performanceManager.isPageVisible) return;

    performanceManager.tick(now);

    const time = (now - this.startTime) * 0.001;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const profile = performanceManager.getProfile();
    const options = settings.getAll();
    const palette = settings.getActivePalette();

    // Extract real Web Audio API analysis
    const audioData = audioEngine.update();

    // Auto-transition check
    if (options.autoTransition) {
      const intervalMs = (options.autoTransitionInterval || 20) * 1000;
      if (now - this.lastTransitionTime > intervalMs) {
        if (options.randomPresetMode) {
          this.selectRandomPreset();
        } else {
          this.selectNextPreset();
        }
      }
    }

    // Handle canvas background clearing & trails
    if (profile.enableTrails) {
      applyLightTrails(ctx, width, height, profile.trailDecay, '#050508');
    } else {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);
    }

    // Party Mode Strobe Overlay
    if (this.partyStrobeEl) {
      if ((this.partyMode || audioData.isBeat) && !options.reducedFlashing) {
        this.partyStrobeEl.style.opacity = Math.min(0.35, audioData.beatIntensity * 0.45);
      } else {
        this.partyStrobeEl.style.opacity = '0';
      }
    }

    // Render Party Mode Layer if Party Mode is active
    if (this.partyMode) {
      this.laserSweep.updateAndDraw(ctx, width, height, audioData, palette, options, time);
      this.rgbPulse.updateAndDraw(ctx, width, height, audioData, palette, options, time);
      this.shockwave.updateAndDraw(ctx, width, height, audioData, palette, options);
      this.particleExplosion.updateAndDraw(ctx, width, height, audioData, palette, options);
    }

    // Mirror mode support
    ctx.save();
    if (options.mirrorMode) {
      ctx.save();
      // Render left side
      ctx.beginPath();
      ctx.rect(0, 0, width / 2, height);
      ctx.clip();
      this.renderPresetWithFade(ctx, width, height, audioData, palette, options, time);
      ctx.restore();

      // Render mirrored right side
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.beginPath();
      ctx.rect(0, 0, width / 2, height);
      ctx.clip();
      this.renderPresetWithFade(ctx, width, height, audioData, palette, options, time);
      ctx.restore();
    } else {
      this.renderPresetWithFade(ctx, width, height, audioData, palette, options, time);
    }
    ctx.restore();

    // Beat Flash & Glow overlay
    if (!options.reducedFlashing) {
      drawBeatFlash(ctx, width, height, audioData, palette, options);
    }
  }

  renderPresetWithFade(ctx, width, height, audioData, palette, options, time) {
    if (this.transitionAlpha < 1.0) {
      this.transitionAlpha = Math.min(1.0, this.transitionAlpha + 0.05);
    }

    if (this.previousPreset && this.transitionAlpha < 1.0) {
      ctx.save();
      ctx.globalAlpha = 1.0 - this.transitionAlpha;
      try {
        this.previousPreset.render(ctx, width, height, audioData, palette, options, time);
      } catch (err) {
        console.error(err);
      }
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = this.transitionAlpha;
    try {
      this.activePreset.render(ctx, width, height, audioData, palette, options, time);
    } catch (err) {
      console.error(err);
    }
    ctx.restore();
  }

  // Quick preview generator for library cards
  renderThumbnail(preset, targetCanvas) {
    if (!preset || !targetCanvas) return;
    const tCtx = targetCanvas.getContext('2d');
    const w = targetCanvas.width;
    const h = targetCanvas.height;
    const palette = settings.getActivePalette();

    tCtx.fillStyle = '#050508';
    tCtx.fillRect(0, 0, w, h);

    // Mock audio data snapshot for preview
    const mockAudio = {
      frequencyData: new Uint8Array(64).map((_, i) => Math.floor(Math.sin(i * 0.15) * 100 + 120)),
      timeDomainData: new Uint8Array(128).map((_, i) => Math.floor(Math.sin(i * 0.2) * 50 + 128)),
      bands: { bass: 0.7, mid: 0.5, treble: 0.4, overall: 0.6 },
      isBeat: false,
      beatIntensity: 0.5
    };

    tCtx.save();
    try {
      preset.render(tCtx, w, h, mockAudio, palette, {
        visualBrightness: 1.0,
        glowIntensity: 0.5,
        laserWidth: 1.5,
        waveAmplitude: 1.0
      }, 1.5);
    } catch (e) {
      /* Graceful fallback */
    }
    tCtx.restore();
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

export const visualizerEngine = new VisualizerEngine();
