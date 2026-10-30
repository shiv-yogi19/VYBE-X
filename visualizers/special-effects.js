/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 10: Special Effects (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

export const specialEffectsPresets = [
  {
    id: 'fx-kaleidoscope',
    name: 'Kaleidoscope',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const petals = 8;
      const r = Math.min(centerX, centerY) * 0.7;

      ctx.save();
      ctx.translate(centerX, centerY);

      for (let p = 0; p < petals; p++) {
        ctx.save();
        ctx.rotate((p / petals) * Math.PI * 2 + time * 0.3);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(
          r * 0.5,
          Math.sin(time * 2) * (50 + bands.bass * 60),
          r,
          0
        );
        ctx.strokeStyle = p % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-neon-dna',
    name: 'Neon DNA',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const rungs = 24;
      const rungSpacing = height / rungs;

      ctx.save();
      for (let i = 0; i <= rungs; i++) {
        const y = i * rungSpacing;
        const phase = y * 0.015 + time * 2;
        const xOffset = Math.sin(phase) * (80 + bands.bass * 60);

        const x1 = centerX - xOffset;
        const x2 = centerX + xOffset;

        // Connecting strand rung
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node beads
        ctx.beginPath();
        ctx.arc(x1, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = palette.primary;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = palette.secondary;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-symmetry-burst',
    name: 'Symmetry Burst',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, beatIntensity } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rays = 16;
      const len = Math.min(centerX, centerY) * (0.4 + beatIntensity * 0.4);

      ctx.save();
      ctx.translate(centerX, centerY);

      for (let i = 0; i < rays; i++) {
        const a = (i / rays) * Math.PI * 2;
        const x = Math.cos(a) * len;
        const y = Math.sin(a) * len;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 3 + beatIntensity * 4;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Tip circle
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-electric-storm',
    name: 'Electric Storm',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, isBeat } = audioData;
      const bolts = isBeat ? 6 : 2;

      ctx.save();
      for (let b = 0; b < bolts; b++) {
        let curX = Math.random() * width;
        let curY = 0;

        ctx.beginPath();
        ctx.moveTo(curX, curY);

        while (curY < height) {
          curX += (Math.random() - 0.5) * 50;
          curY += Math.random() * 40 + 10;
          ctx.lineTo(curX, curY);
        }

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 + bands.bass * 3;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 20;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-mandala',
    name: 'Reactive Mandala',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 4;

      ctx.save();
      ctx.translate(centerX, centerY);

      for (let r = 1; r <= rings; r++) {
        const petals = r * 6;
        const rad = r * 45 * (1 + bands.mid * 0.2);
        const rot = time * (r % 2 === 0 ? 0.4 : -0.4);

        for (let p = 0; p < petals; p++) {
          const a = (p / petals) * Math.PI * 2 + rot;
          ctx.save();
          ctx.rotate(a);
          ctx.beginPath();
          ctx.ellipse(rad, 0, rad * 0.35, rad * 0.15, 0, 0, Math.PI * 2);
          ctx.strokeStyle = r % 2 === 0 ? palette.primary : palette.secondary;
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-light-trails',
    name: 'Light Trails',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const runners = 4;

      ctx.save();
      for (let r = 0; r < runners; r++) {
        const speed = (r + 1) * 1.5;
        const radX = (width * 0.3) * Math.sin(time * speed * 0.3 + r);
        const radY = (height * 0.3) * Math.cos(time * speed * 0.25 + r);
        const x = centerX + radX;
        const y = centerY + radY;

        ctx.beginPath();
        ctx.arc(x, y, 8 + bands.bass * 12, 0, Math.PI * 2);
        ctx.fillStyle = r % 2 === 0 ? palette.primary : palette.secondary;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 20;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-cosmic-explosion',
    name: 'Cosmic Explosion',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { beatIntensity, isBeat } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const shards = 28;

      ctx.save();
      for (let i = 0; i < shards; i++) {
        const a = (i / shards) * Math.PI * 2;
        const dist = (time * 120 + i * 30) % (Math.max(width, height) * 0.6);
        const x = centerX + Math.cos(a) * dist;
        const y = centerY + Math.sin(a) * dist;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * 25, y + Math.sin(a) * 25);
        ctx.strokeStyle = isBeat ? '#ffffff' : palette.primary;
        ctx.lineWidth = 3 + beatIntensity * 4;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-hyperspace-jump',
    name: 'Hyperspace Jump',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const streaks = 50;

      ctx.save();
      for (let i = 0; i < streaks; i++) {
        const a = i * 2.4;
        const prog = ((i / streaks) + time * (1.2 + bands.bass * 2)) % 1;
        const r1 = prog * Math.max(width, height) * 0.7;
        const r2 = Math.min(Math.max(width, height) * 0.8, r1 + 60 * (1 + bands.bass));

        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(a) * r1, centerY + Math.sin(a) * r1);
        ctx.lineTo(centerX + Math.cos(a) * r2, centerY + Math.sin(a) * r2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1 + prog * 3;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-audio-rings',
    name: 'Audio Reactive Rings',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 7;

      ctx.save();
      for (let r = 1; r <= rings; r++) {
        const radius = r * 35 + Math.sin(time * 3 + r) * (bands.bass * 30);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = r % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-neon-rain',
    name: 'Neon Rain',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const drops = 35;

      ctx.save();
      for (let i = 0; i < drops; i++) {
        const x = (i / drops) * width;
        const prog = ((i / drops) + time * (0.8 + bands.bass * 0.8)) % 1;
        const y = prog * height;
        const len = 30 + bands.mid * 50;

        const grad = ctx.createLinearGradient(x, y - len, x, y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, palette.primary);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - len);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-quantum-grid',
    name: 'Quantum Grid',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const step = 45;
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);

      ctx.save();
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * step;
          const y = r * step;
          const dist = Math.hypot(x - width / 2, y - height / 2);
          const wave = Math.sin(dist * 0.02 - time * 3) * (bands.bass * 15);

          ctx.beginPath();
          ctx.arc(x, y + wave, 2, 0, Math.PI * 2);
          ctx.fillStyle = palette.secondary;
          ctx.fill();
        }
      }
      ctx.restore();
    }
  },
  {
    id: 'fx-energy-core',
    name: 'Energy Core',
    category: 'special-effects',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, beatIntensity } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const coreR = 50 + bands.bass * 40;

      ctx.save();
      // Glowing Core
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = palette.primary;
      ctx.shadowBlur = 35 * (1 + beatIntensity);
      ctx.fill();

      // Outer plasma ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreR * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }
  }
];
