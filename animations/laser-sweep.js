/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Animation Module 2: Laser Sweep, Light Trails & 3D Rotation
   Creator: Shiv Yogi
   ========================================================================== */

/**
 * Technique 4: Laser Sweep
 * High-intensity laser beam scanning across the viewport with audio-driven divergence.
 */
export class LaserSweepEngine {
  constructor() {
    this.sweepAngle = 0;
  }

  updateAndDraw(ctx, width, height, audioData, palette, options = {}, time = 0) {
    const { bands, beatIntensity } = audioData;
    const speed = (options.animationSpeed || 1.0) * 0.02;
    this.sweepAngle += speed;

    const laserWidth = (options.laserWidth || 2.0);
    const intensity = (options.rgbIntensity || 1.0) * (options.visualBrightness || 1.0);
    const count = 7;
    const originX = width / 2;
    const originY = height + 40;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < count; i++) {
      const offset = (i - Math.floor(count / 2)) * 0.28;
      const angle = -Math.PI / 2 + Math.sin(this.sweepAngle + offset) * (0.65 + bands.mid * 0.35);
      const targetLength = Math.max(width, height) * 1.5;

      const endX = originX + Math.cos(angle) * targetLength;
      const endY = originY + Math.sin(angle) * targetLength;

      const grad = ctx.createLinearGradient(originX, originY, endX, endY);
      const color = i % 2 === 0 ? palette.primary : palette.secondary;
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = (laserWidth + beatIntensity * 4) * intensity;

      if (options.glowIntensity > 0.2) {
        ctx.shadowColor = color;
        ctx.shadowBlur = (12 * options.glowIntensity);
      }
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Technique 5: Light Trails
 * Applies an alpha decay layer across the canvas to leave persistent glowing motion trails.
 */
export function applyLightTrails(ctx, width, height, decayRatio = 0.2, backgroundColor = '#050508') {
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = backgroundColor;
  ctx.globalAlpha = Math.max(0.05, Math.min(0.8, decayRatio));
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Technique 6: 3D Rotation
 * Projects 3D points (x, y, z) into 2D viewport coordinates using perspective projection.
 */
export class Rotation3DEngine {
  constructor() {
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
  }

  update(speed = 0.01) {
    this.rotX += speed * 0.8;
    this.rotY += speed * 1.1;
    this.rotZ += speed * 0.5;
  }

  projectPoint(x, y, z, width, height, fov = 350) {
    // Rotate around X
    const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;

    // Rotate around Y
    const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;

    // Rotate around Z
    const cosZ = Math.cos(this.rotZ), sinZ = Math.sin(this.rotZ);
    const x3 = x2 * cosZ - y1 * sinZ;
    const y3 = x2 * sinZ + y1 * cosZ;

    // Perspective projection
    const distance = 400;
    const scale = fov / (distance + z2);
    const projX = width / 2 + x3 * scale;
    const projY = height / 2 + y3 * scale;

    return { x: projX, y: projY, z: z2, scale };
  }
}
