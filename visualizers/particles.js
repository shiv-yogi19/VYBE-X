/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 4: Particles (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

// Shared particle pools for high performance
const particlePool = Array.from({ length: 400 }, () => ({
  x: Math.random(),
  y: Math.random(),
  z: Math.random(),
  vx: (Math.random() - 0.5) * 2,
  vy: (Math.random() - 0.5) * 2,
  size: 1 + Math.random() * 3,
  colorIdx: Math.floor(Math.random() * 3),
  alpha: Math.random()
}));

export const particlePresets = [
  {
    id: 'part-galaxy',
    name: 'Galaxy Particles',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = Math.min(250, Math.floor(250 * (options.particleDensity || 1.0)));
      const rot = time * 0.4;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        const dist = p.z * Math.min(centerX, centerY) * 0.9;
        const angle = p.x * Math.PI * 4 + rot + (dist * 0.005);
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(x, y, p.size * (1 + bands.bass * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = p.colorIdx === 0 ? palette.primary : (p.colorIdx === 1 ? palette.secondary : '#ffffff');
        ctx.globalAlpha = 0.5 + p.alpha * 0.5;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-cosmic-dust',
    name: 'Cosmic Dust',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const count = Math.min(220, Math.floor(220 * (options.particleDensity || 1.0)));

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        p.x = (p.x + p.vx * 0.001 * (1 + bands.mid * 2) + 1) % 1;
        p.y = (p.y + p.vy * 0.001 * (1 + bands.mid * 2) + 1) % 1;

        const px = p.x * width;
        const py = p.y * height;

        ctx.beginPath();
        ctx.arc(px, py, p.size * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = p.colorIdx === 0 ? palette.primary : palette.secondary;
        ctx.globalAlpha = p.alpha * 0.8;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-explosion',
    name: 'Particle Explosion',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { isBeat, beatIntensity, bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 180;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        const speed = (p.z * 15 + beatIntensity * 25) * (options.animationSpeed || 1.0);
        const angle = p.x * Math.PI * 2;
        const dist = (time * 80 * (p.z + 0.2)) % (Math.max(width, height) * 0.6);

        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(px, py, p.size + beatIntensity * 3, 0, Math.PI * 2);
        ctx.fillStyle = isBeat ? '#ffffff' : (p.colorIdx === 0 ? palette.primary : palette.secondary);
        ctx.globalAlpha = Math.max(0, 1 - dist / (Math.max(width, height) * 0.6));
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-starfield',
    name: 'Starfield',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 200;
      const speed = (0.005 + bands.bass * 0.015) * (options.animationSpeed || 1.0);

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        p.z -= speed;
        if (p.z <= 0) {
          p.z = 1;
          p.x = Math.random() - 0.5;
          p.y = Math.random() - 0.5;
        }

        const k = 250 / p.z;
        const px = p.x * k + centerX;
        const py = p.y * k + centerY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = (1 - p.z) * 4;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 1 - p.z;
          ctx.fill();
        }
      }
      ctx.restore();
    }
  },
  {
    id: 'part-vortex',
    name: 'Particle Vortex',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 220;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        const spiralT = (time * 0.8 + p.z * 10);
        const r = (p.z * Math.min(centerX, centerY) * 0.9) * (1 - (spiralT % 1));
        const angle = spiralT * 4 + p.x * Math.PI;

        const px = centerX + Math.cos(angle) * r;
        const py = centerY + Math.sin(angle) * r;

        ctx.beginPath();
        ctx.arc(px, py, p.size * (1 + bands.mid), 0, Math.PI * 2);
        ctx.fillStyle = p.colorIdx === 0 ? palette.primary : palette.secondary;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-energy',
    name: 'Energy Particles',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData, bands } = audioData;
      const count = 150;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        const freqVal = frequencyData[i * 4] / 255;
        const px = (p.x * width + Math.sin(time + i) * 30) % width;
        const py = (p.y * height - freqVal * 80 + height) % height;

        ctx.beginPath();
        ctx.arc(px, py, 2 + freqVal * 6, 0, Math.PI * 2);
        ctx.fillStyle = palette.primary;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-fireflies',
    name: 'Firefly Field',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const count = 90;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        const px = ((p.x * width + Math.sin(time * 0.5 + i * 2) * 50) + width) % width;
        const py = ((p.y * height + Math.cos(time * 0.6 + i * 1.5) * 50) + height) % height;
        const glow = Math.sin(time * 3 + i) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(px, py, 3 + glow * 3 + bands.bass * 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 15 * glow;
        ctx.globalAlpha = 0.4 + glow * 0.6;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-stars',
    name: 'Reactive Stars',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { isBeat, beatIntensity } = audioData;
      const count = 120;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        const px = p.x * width;
        const py = p.y * height;
        const starSize = p.size * (1 + beatIntensity * 2);

        // Draw 4-point cross star
        ctx.strokeStyle = i % 2 === 0 ? palette.primary : '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px - starSize * 2, py);
        ctx.lineTo(px + starSize * 2, py);
        ctx.moveTo(px, py - starSize * 2);
        ctx.lineTo(px, py + starSize * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-spiral',
    name: 'Particle Spiral',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 160;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const norm = i / count;
        const angle = norm * Math.PI * 12 + time * 1.5;
        const dist = norm * Math.min(centerX, centerY) * 0.85;

        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(px, py, 2 + bands.bass * 4, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-cloud',
    name: 'Neon Particle Cloud',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 140;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        const angle = p.x * Math.PI * 2 + time * 0.2;
        const rad = p.y * (100 + bands.bass * 150);
        const px = centerX + Math.cos(angle) * rad;
        const py = centerY + Math.sin(angle) * rad;

        ctx.beginPath();
        ctx.arc(px, py, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = palette.secondary;
        ctx.globalAlpha = 0.4;
        ctx.shadowColor = palette.secondary;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-orbiting',
    name: 'Orbiting Particles',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 100;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const speed = (0.5 + (i % 5) * 0.3) * (time + 10);
        const rad = 40 + (i % 6) * 35;
        const px = centerX + Math.cos(speed + i) * rad;
        const py = centerY + Math.sin(speed + i) * rad;

        ctx.beginPath();
        ctx.arc(px, py, 3 + bands.mid * 4, 0, Math.PI * 2);
        ctx.fillStyle = palette.primary;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'part-burst',
    name: 'Particle Burst',
    category: 'particles',
    render(ctx, width, height, audioData, palette, options, time) {
      const { isBeat, beatIntensity, bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 180;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const p = particlePool[i];
        const angle = (i / count) * Math.PI * 2;
        const dist = 30 + (bands.bass * 180) + (isBeat ? p.z * 120 : 0);

        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(px, py, 2.5 + beatIntensity * 4, 0, Math.PI * 2);
        ctx.fillStyle = palette.primary;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();
    }
  }
];
