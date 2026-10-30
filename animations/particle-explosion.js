/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Animation Module 3: Particle Explosion, Energy Shockwave & Spectrum Morphing
   Creator: Shiv Yogi
   ========================================================================== */

/**
 * Technique 7: Particle Explosion
 * Emits radial burst particles with velocity, friction, and audio responsiveness.
 */
export class ParticleExplosionEngine {
  constructor(maxParticles = 300) {
    this.particles = [];
    this.maxParticles = maxParticles;
  }

  trigger(x, y, count = 40, palette, force = 1.0) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }
      const angle = Math.random() * Math.PI * 2;
      const speed = (2 + Math.random() * 8) * force;
      const color = Math.random() > 0.4 ? palette.primary : (Math.random() > 0.5 ? palette.secondary : palette.tertiary);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 3.5,
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.02,
        color
      });
    }
  }

  updateAndDraw(ctx, width, height, audioData, palette, options = {}) {
    const { isBeat, beatIntensity } = audioData;

    // Trigger on strong beats
    if (isBeat && beatIntensity > 0.45) {
      const burstCount = Math.floor(25 * (options.particleDensity || 1.0));
      this.trigger(width / 2, height / 2, burstCount, palette, 1 + beatIntensity);
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * (options.animationSpeed || 1.0);
      p.y += p.vy * (options.animationSpeed || 1.0);
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * p.alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * (options.visualBrightness || 1.0);

      if (options.glowIntensity > 0.3) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6 * options.glowIntensity;
      }
      ctx.fill();
    }

    ctx.restore();
  }

  reset() {
    this.particles = [];
  }
}

/**
 * Technique 8: Energy Shockwave
 * Dynamic circular shockwave with gradient border and distortion on transients.
 */
export class EnergyShockwaveEngine {
  constructor() {
    this.waves = [];
  }

  updateAndDraw(ctx, width, height, audioData, palette, options = {}) {
    const { isBeat, beatIntensity } = audioData;
    const centerX = width / 2;
    const centerY = height / 2;

    if (isBeat && beatIntensity > 0.3) {
      this.waves.push({
        radius: 10,
        maxRadius: Math.max(width, height) * 0.75,
        alpha: 0.9,
        lineWidth: 4 + beatIntensity * 8,
        color: palette.secondary
      });
    }

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let i = this.waves.length - 1; i >= 0; i--) {
      const w = this.waves[i];
      w.radius += (8 + beatIntensity * 14) * (options.animationSpeed || 1.0);
      w.alpha *= 0.95;

      if (w.radius >= w.maxRadius || w.alpha <= 0.01) {
        this.waves.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, w.radius, 0, Math.PI * 2);
      ctx.strokeStyle = w.color;
      ctx.lineWidth = w.lineWidth;
      ctx.globalAlpha = w.alpha * (options.rgbIntensity || 1.0);

      if (options.glowIntensity > 0.2) {
        ctx.shadowColor = w.color;
        ctx.shadowBlur = 20 * options.glowIntensity;
      }

      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Technique 9: Spectrum Morphing
 * Interpolates historical frequency snapshots to generate continuous curved paths.
 */
export class SpectrumMorphEngine {
  constructor(length = 64) {
    this.length = length;
    this.history = new Float32Array(length);
  }

  morph(currentArray, smoothing = 0.75) {
    const step = Math.floor(currentArray.length / this.length);
    for (let i = 0; i < this.length; i++) {
      const raw = (currentArray[i * step] || 0) / 255;
      this.history[i] = this.history[i] * smoothing + raw * (1 - smoothing);
    }
    return this.history;
  }
}
