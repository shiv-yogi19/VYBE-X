/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 7: Lasers (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

export const laserPresets = [
  {
    id: 'laser-tunnel',
    name: 'Laser Tunnel',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const beams = 16;
      const maxLen = Math.max(width, height);

      ctx.save();
      for (let i = 0; i < beams; i++) {
        const a = (i / beams) * Math.PI * 2 + time * 0.4;
        const x2 = centerX + Math.cos(a) * maxLen;
        const y2 = centerY + Math.sin(a) * maxLen;

        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2 * (options.laserWidth || 2);
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Center laser aperture
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15 + bands.bass * 25, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'laser-grid',
    name: 'RGB Laser Grid',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const rays = 12;

      ctx.save();
      for (let i = 0; i < rays; i++) {
        const x = (i / (rays - 1)) * width;
        const hue = (i * 30 + time * 50) % 360;

        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.lineWidth = options.laserWidth || 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(width - x, height);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-crossfire',
    name: 'Laser Crossfire',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, beatIntensity } = audioData;
      const count = 8;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const yL = ((i / count) * height + time * 60) % height;
        const yR = ((i / count) * height - time * 60 + height) % height;

        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = (options.laserWidth || 2) + beatIntensity * 3;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.moveTo(0, yL);
        ctx.lineTo(width, yR);
        ctx.stroke();

        ctx.strokeStyle = palette.secondary;
        ctx.beginPath();
        ctx.moveTo(width, yL);
        ctx.lineTo(0, yR);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-fan',
    name: 'Rotating Laser Fan',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const originX = width / 2;
      const originY = height;
      const count = 15;
      const spread = 1.2;
      const baseAngle = -Math.PI / 2 + Math.sin(time) * 0.4;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const offset = (i / (count - 1) - 0.5) * spread;
        const a = baseAngle + offset;
        const len = Math.max(width, height) * 1.4;

        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = options.laserWidth || 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + Math.cos(a) * len, originY + Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-storm',
    name: 'Rainbow Laser Storm',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const count = 20;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const x1 = ((Math.sin(i * 1.5 + time) * 0.5 + 0.5) * width);
        const y1 = 0;
        const x2 = ((Math.cos(i * 1.2 + time) * 0.5 + 0.5) * width);
        const y2 = height;
        const hue = (i * 20 + time * 80) % 360;

        ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.lineWidth = 1.5 * (options.laserWidth || 2);
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-horizon',
    name: 'Laser Horizon',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const horizonY = height * 0.55;
      const vanishingX = width / 2;
      const lines = 18;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = options.laserWidth || 2;

      // Perspective laser rays
      for (let i = 0; i < lines; i++) {
        const bottomX = (i / (lines - 1)) * width;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let j = 1; j <= 8; j++) {
        const y = horizonY + Math.pow(j / 8, 2) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-beam-matrix',
    name: 'Moving Beam Matrix',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const cols = 6;
      const rows = 4;

      ctx.save();
      for (let c = 1; c < cols; c++) {
        const x = (c / cols) * width + Math.sin(time + c) * 30;
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = options.laserWidth || 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let r = 1; r < rows; r++) {
        const y = (r / rows) * height + Math.cos(time + r) * 30;
        ctx.strokeStyle = palette.secondary;
        ctx.lineWidth = options.laserWidth || 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-cage',
    name: 'Circular Laser Cage',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r = Math.min(centerX, centerY) * 0.7;
      const nodes = 12;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = options.laserWidth || 1.8;
      ctx.shadowColor = palette.primary;
      ctx.shadowBlur = 10;

      const points = [];
      for (let i = 0; i < nodes; i++) {
        const a = (i / nodes) * Math.PI * 2 + time * 0.3;
        points.push({
          x: centerX + Math.cos(a) * r,
          y: centerY + Math.sin(a) * r
        });
      }

      for (let i = 0; i < nodes; i++) {
        for (let j = i + 1; j < nodes; j++) {
          if ((j - i) % 3 === 0) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-beam-tunnel',
    name: 'Neon Beam Tunnel',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 8;

      ctx.save();
      for (let i = 0; i < rings; i++) {
        const prog = ((i / rings) + time * 0.5) % 1;
        const w = prog * width;
        const h = prog * height;

        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = (options.laserWidth || 2) * prog;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 15;
        ctx.strokeRect(centerX - w / 2, centerY - h / 2, w, h);
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-spiral',
    name: 'Laser Spiral',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const arms = 4;
      const points = 60;

      ctx.save();
      for (let a = 0; a < arms; a++) {
        const armAngle = (a / arms) * Math.PI * 2;
        ctx.strokeStyle = a % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = options.laserWidth || 2;
        ctx.beginPath();

        for (let i = 0; i < points; i++) {
          const norm = i / points;
          const theta = armAngle + norm * Math.PI * 4 + time;
          const r = norm * Math.min(centerX, centerY) * 0.9;
          const x = centerX + Math.cos(theta) * r;
          const y = centerY + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-sweep-field',
    name: 'Laser Sweep Field',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const sweepAngle = Math.sin(time * 1.5) * 0.8;
      const centerX = width / 2;
      const count = 11;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const a = -Math.PI / 2 + sweepAngle + (i - count / 2) * 0.12;
        const len = Math.max(width, height) * 1.2;

        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = (options.laserWidth || 2) * (1 + bands.bass);
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 16;

        ctx.beginPath();
        ctx.moveTo(centerX, height);
        ctx.lineTo(centerX + Math.cos(a) * len, height + Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'laser-light-beams',
    name: 'Reactive Light Beams',
    category: 'lasers',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData, bands } = audioData;
      const beams = 12;

      ctx.save();
      for (let i = 0; i < beams; i++) {
        const val = frequencyData[i * 8] / 255;
        const x = (i / (beams - 1)) * width;
        const beamH = val * height * 0.9;

        const grad = ctx.createLinearGradient(x, height, x, height - beamH);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, palette.primary);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = (options.laserWidth || 2) * 2;
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, height - beamH);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
];
