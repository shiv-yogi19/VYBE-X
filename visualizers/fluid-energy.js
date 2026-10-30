/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 9: Fluid Energy (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

export const fluidEnergyPresets = [
  {
    id: 'fluid-motion',
    name: 'Fluid Motion',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const layers = 3;
      const baseH = height * 0.65;

      ctx.save();
      for (let l = 0; l < layers; l++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 15) {
          const y = baseH +
            Math.sin(x * 0.006 + time * 1.5 + l) * (30 + bands.bass * 60) +
            Math.cos(x * 0.012 - time) * 20;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();

        ctx.fillStyle = l === 0 ? palette.primary : palette.secondary;
        ctx.globalAlpha = 0.45;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'fluid-plasma-sphere',
    name: 'Plasma Sphere',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r = 80 + bands.bass * 60;
      const tentacles = 10;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2.5;

      for (let i = 0; i < tentacles; i++) {
        const a = (i / tentacles) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        let curX = centerX;
        let curY = centerY;
        const targetX = centerX + Math.cos(a + Math.sin(time * 3 + i) * 0.4) * (r * 1.6);
        const targetY = centerY + Math.sin(a + Math.sin(time * 3 + i) * 0.4) * (r * 1.6);

        for (let step = 0; step < 5; step++) {
          const t = (step + 1) / 5;
          const nx = centerX + (targetX - centerX) * t + (Math.random() - 0.5) * 20;
          const ny = centerY + (targetY - centerY) * t + (Math.random() - 0.5) * 20;
          ctx.lineTo(nx, ny);
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = palette.primary;
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'fluid-liquid-energy',
    name: 'Liquid Energy',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const points = 36;
      const baseR = 100 + bands.bass * 80;

      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const a = (i / points) * Math.PI * 2;
        const wave = Math.sin(a * 6 + time * 3) * (20 + bands.mid * 30);
        const rad = baseR + wave;
        const x = centerX + Math.cos(a) * rad;
        const y = centerY + Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, baseR + 50);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, palette.primary);
      grad.addColorStop(1, palette.secondary);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'fluid-aurora-flow',
    name: 'Aurora Flow',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const ribbons = 4;

      ctx.save();
      for (let r = 0; r < ribbons; r++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 20) {
          const norm = x / width;
          const y = height * 0.4 +
            Math.sin(norm * 4 + time + r * 0.8) * (80 + bands.bass * 100) +
            Math.cos(norm * 8 - time * 0.6) * 40;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = r % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 4 + bands.bass * 6;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fluid-electric-pulse',
    name: 'Electric Pulse',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, beatIntensity } = audioData;
      const centerY = height / 2;
      const segments = 40;
      const segW = width / segments;

      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 + beatIntensity * 4;
      ctx.shadowColor = palette.primary;
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let i = 1; i < segments; i++) {
        const jitter = (Math.random() - 0.5) * (30 + bands.bass * 150);
        ctx.lineTo(i * segW, centerY + jitter);
      }
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'fluid-shockwave',
    name: 'Energy Shockwave',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, beatIntensity } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 5;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const prog = ((i / count) + time * 0.6) % 1;
        const r = prog * Math.max(width, height) * 0.65;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = (1 - prog) * (8 + beatIntensity * 12);
        ctx.globalAlpha = (1 - prog);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fluid-smoke',
    name: 'Reactive Smoke',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const puffs = 25;

      ctx.save();
      for (let i = 0; i < puffs; i++) {
        const prog = ((i / puffs) + time * 0.2) % 1;
        const x = width * 0.5 + Math.sin(i * 3 + time * 2) * (100 * prog);
        const y = height * (1 - prog);
        const r = 20 + prog * (80 + bands.bass * 80);

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = palette.secondary;
        ctx.globalAlpha = (1 - prog) * 0.25;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'fluid-color-fluid',
    name: 'Color Fluid',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const blobs = 6;

      ctx.save();
      for (let i = 0; i < blobs; i++) {
        const a = (i / blobs) * Math.PI * 2 + time * 0.5;
        const dist = 60 + Math.sin(time + i) * 40;
        const x = centerX + Math.cos(a) * dist;
        const y = centerY + Math.sin(a) * dist;
        const r = 50 + bands.bass * 50;

        const grad = ctx.createRadialGradient(x, y, 10, x, y, r);
        grad.addColorStop(0, i % 2 === 0 ? palette.primary : palette.secondary);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'fluid-magnetic',
    name: 'Magnetic Field',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const lines = 16;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 1.8;

      for (let i = 1; i <= lines; i++) {
        const span = i * 25 * (1 + bands.bass * 0.3);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - span * 0.3, span, span * 0.5, 0, 0, Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(centerX, centerY + span * 0.3, span, span * 0.5, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fluid-vortex',
    name: 'Energy Vortex',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const arms = 6;
      const points = 50;

      ctx.save();
      for (let a = 0; a < arms; a++) {
        const offset = (a / arms) * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const norm = i / points;
          const theta = offset + norm * Math.PI * 3 + time * 1.2;
          const r = norm * Math.min(centerX, centerY) * 0.9;
          const x = centerX + Math.cos(theta) * r;
          const y = centerY + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = a % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 3 + bands.bass * 4;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fluid-flowing-light',
    name: 'Flowing Light',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const count = 12;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const prog = ((i / count) + time * 0.2) % 1;
        const x = prog * width;
        const y = height * 0.5 + Math.sin(prog * 6 + time) * (60 + bands.bass * 60);

        ctx.beginPath();
        ctx.arc(x, y, 6 + bands.mid * 10, 0, Math.PI * 2);
        ctx.fillStyle = palette.primary;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 15;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'fluid-cosmic-plasma',
    name: 'Cosmic Plasma',
    category: 'fluid-energy',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r = 90 + bands.bass * 70;

      ctx.save();
      const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, palette.primary);
      grad.addColorStop(0.8, palette.secondary);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.fill();

      // Radiating plasma spikes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2 + time * 0.8;
        const len = r + Math.sin(i * 3 + time * 4) * 30;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(a) * (r * 0.7), centerY + Math.sin(a) * (r * 0.7));
        ctx.lineTo(centerX + Math.cos(a) * len, centerY + Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
];
