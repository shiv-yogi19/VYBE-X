/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Animation Module 1: RGB Pulse, Beat Flash & Glow Bloom
   Creator: Shiv Yogi
   ========================================================================== */

/**
 * Technique 1: RGB Pulse
 * Expands chromatic concentric rings synchronized to audio bass and beat transients.
 */
export class RgbPulseEngine {
  constructor() {
    this.rings = [];
    this.maxRings = 16;
  }

  updateAndDraw(ctx, width, height, audioData, palette, options = {}, time = 0) {
    const { isBeat, beatIntensity, bands } = audioData;
    const intensity = (options.rgbIntensity || 1.0) * (options.visualBrightness || 1.0);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.hypot(centerX, centerY);

    // Spawn new pulse on beat or heavy bass
    if (isBeat || bands.bass > 0.6) {
      this.rings.push({
        radius: 10,
        width: 3 + beatIntensity * 8,
        color: Math.random() > 0.5 ? palette.primary : palette.secondary,
        alpha: 0.9 * intensity,
        speed: 4 + beatIntensity * 12
      });
      if (this.rings.length > this.maxRings) {
        this.rings.shift();
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ring.radius += ring.speed * (options.animationSpeed || 1.0);
      ring.alpha *= 0.97;

      if (ring.radius > maxRadius || ring.alpha < 0.01) {
        this.rings.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.width;
      ctx.globalAlpha = Math.min(1.0, ring.alpha);

      if (options.glowIntensity > 0.3) {
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 15 * options.glowIntensity;
      }

      ctx.stroke();
    }

    ctx.restore();
  }

  reset() {
    this.rings = [];
  }
}

/**
 * Technique 2: Beat Flash
 * Renders controlled ambient screen edge vignette flash during rhythmic drops.
 */
export function drawBeatFlash(ctx, width, height, audioData, palette, options = {}) {
  const { beatIntensity, isBeat } = audioData;
  if (!isBeat && beatIntensity < 0.2) return;
  if (options.reducedFlashing) return;

  const alpha = Math.min(0.45, beatIntensity * 0.45 * (options.visualBrightness || 1.0));
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.2,
    width / 2, height / 2, Math.max(width, height) * 0.7
  );

  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, palette.glow.replace(/[\d.]+\)$/g, `${alpha})`));

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Technique 3: Glow Bloom
 * Reusable wrapper that sets shadow glow bloom parameters around rendering callbacks.
 */
export function applyGlowBloom(ctx, glowColor, blurAmount, renderCallback) {
  ctx.save();
  if (blurAmount > 0) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = blurAmount;
  }
  renderCallback();
  ctx.restore();
}
