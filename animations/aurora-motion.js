/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Animation Module 5: Aurora Motion, Tunnel Zoom & Kaleidoscope Motion
   Creator: Shiv Yogi
   ========================================================================== */

/**
 * Technique 13: Aurora Motion
 * Ethereal vertical light curtains swaying dynamically across the sky.
 */
export class AuroraMotionEngine {
  constructor() {
    this.time = 0;
  }

  updateAndDraw(ctx, width, height, audioData, palette, options = {}) {
    const { bands } = audioData;
    this.time += 0.015 * (options.animationSpeed || 1.0);

    const curtains = 5;
    const baseHeight = height * 0.7;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let c = 0; c < curtains; c++) {
      ctx.beginPath();
      ctx.moveTo(0, height);

      const color = c % 2 === 0 ? palette.primary : (c % 3 === 0 ? palette.secondary : palette.tertiary);
      const cOffset = c * 1.2;

      for (let x = 0; x <= width; x += 16) {
        const norm = x / width;
        const y = baseHeight -
          Math.sin(norm * 5 + this.time + cOffset) * (80 + bands.bass * 120) -
          Math.cos(norm * 9 - this.time * 0.8) * (50 + bands.mid * 60);

        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.globalAlpha = (0.2 + (curtains - c) * 0.08) * (options.visualBrightness || 1.0);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * Technique 14: Tunnel Zoom
 * Expanding concentric poly rings accelerating towards the camera.
 */
export class TunnelZoomEngine {
  constructor(ringCount = 18) {
    this.ringCount = ringCount;
    this.rings = Array.from({ length: ringCount }, (_, i) => ({
      z: i / ringCount,
      sides: 6
    }));
  }

  updateAndDraw(ctx, width, height, audioData, palette, options = {}) {
    const { bands, beatIntensity } = audioData;
    const speed = (0.008 + bands.bass * 0.02) * (options.animationSpeed || 1.0);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(width, height) * 0.85;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.rings.length; i++) {
      const r = this.rings[i];
      r.z -= speed;
      if (r.z <= 0) r.z += 1.0;

      const scale = 1 - r.z;
      const radius = scale * maxRadius;
      const alpha = Math.min(1.0, (1 - r.z) * 1.5) * (options.visualBrightness || 1.0);

      ctx.beginPath();
      const sides = 6;
      for (let s = 0; s < sides; s++) {
        const angle = (s / sides) * Math.PI * 2 + (r.z * 2);
        const px = centerX + Math.cos(angle) * radius;
        const py = centerY + Math.sin(angle) * radius;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
      ctx.lineWidth = (2 + beatIntensity * 5) * scale;
      ctx.globalAlpha = alpha;

      if (options.glowIntensity > 0.3) {
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10 * options.glowIntensity;
      }
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Technique 15: Kaleidoscope Motion
 * Replicates canvas drawings with N-fold rotational symmetry.
 */
export function applyKaleidoscopeSymmetry(ctx, width, height, segments = 8, renderSector) {
  const centerX = width / 2;
  const centerY = height / 2;
  const angleStep = (Math.PI * 2) / segments;

  ctx.save();
  ctx.translate(centerX, centerY);

  for (let s = 0; s < segments; s++) {
    ctx.save();
    ctx.rotate(s * angleStep);
    if (s % 2 === 1) {
      ctx.scale(1, -1);
    }
    renderSector(ctx);
    ctx.restore();
  }

  ctx.restore();
}
