/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Animation Module 4: Fluid Motion, Plasma Flow & Wave Distortion
   Creator: Shiv Yogi
   ========================================================================== */

/**
 * Technique 10: Fluid Motion
 * Multi-layer harmonic sine waves creating fluid surface undulating dynamics.
 */
export class FluidMotionEngine {
  constructor() {
    this.phase = 0;
  }

  updateAndDraw(ctx, width, height, audioData, palette, options = {}) {
    const { bands } = audioData;
    const speed = (options.animationSpeed || 1.0) * 0.03;
    this.phase += speed;

    const layers = 4;
    const baseY = height * 0.65;
    const waveAmp = (options.waveAmplitude || 1.0) * (30 + bands.bass * 80);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let l = 0; l < layers; l++) {
      ctx.beginPath();
      ctx.moveTo(0, height);

      const color = l % 2 === 0 ? palette.primary : palette.secondary;
      const layerOffset = l * 0.7;

      for (let x = 0; x <= width; x += 12) {
        const normX = x / width;
        const y = baseY +
          Math.sin(normX * 8 + this.phase + layerOffset) * (waveAmp * (1 - l * 0.18)) +
          Math.cos(normX * 14 - this.phase * 0.7) * (waveAmp * 0.4);

        if (x === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, baseY - waveAmp, 0, height);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(5, 5, 8, 0.2)');

      ctx.fillStyle = grad;
      ctx.globalAlpha = (0.35 + (layers - l) * 0.12) * (options.visualBrightness || 1.0);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * Technique 11: Plasma Flow
 * Cellular plasma field based on interacting trigonometric sine interference.
 */
export class PlasmaFlowEngine {
  constructor() {
    this.t = 0;
  }

  render(ctx, width, height, audioData, palette, options = {}) {
    const { bands } = audioData;
    this.t += 0.02 * (options.animationSpeed || 1.0);

    const step = 28; // Optimized grid step
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < cols; i++) {
      const x = i * step;
      for (let j = 0; j < rows; j++) {
        const y = j * step;
        const v1 = Math.sin(x * 0.01 + this.t);
        const v2 = Math.sin(y * 0.01 + this.t * 0.7);
        const v3 = Math.sin((x + y) * 0.01 + this.t * 0.5 + bands.mid * 2);
        const val = (v1 + v2 + v3 + 3) / 6; // 0 to 1

        const radius = (step * 0.5) * val * (0.8 + bands.bass * 0.8);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, radius), 0, Math.PI * 2);
        ctx.fillStyle = val > 0.5 ? palette.primary : palette.secondary;
        ctx.globalAlpha = val * 0.6 * (options.visualBrightness || 1.0);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

/**
 * Technique 12: Wave Distortion
 * Applies non-linear mathematical distortion to time-domain waveforms.
 */
export function applyWaveDistortion(ctx, points, distortionAmount = 1.0, width, height) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;

    // Apply distortion offset
    const warp = Math.sin(i * 0.15) * distortionAmount * 15;
    ctx.quadraticCurveTo(points[i].x, points[i].y + warp, xc, yc);
  }

  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
}
