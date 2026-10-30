/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 6: RGB Neon (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

export const rgbNeonPresets = [
  {
    id: 'rgb-pulse',
    name: 'RGB Pulse',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, beatIntensity } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 8;
      const maxR = Math.min(centerX, centerY) * 0.9;

      ctx.save();
      for (let i = 1; i <= rings; i++) {
        const r = (i / rings) * maxR * (1 + beatIntensity * 0.15);
        const hue = (time * 60 + i * 35) % 360;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.lineWidth = 3 + beatIntensity * 5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 18;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'rgb-rainbow-flow',
    name: 'Rainbow Flow',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const lines = 20;
      const spacing = height / lines;

      ctx.save();
      for (let i = 0; i < lines; i++) {
        const yBase = i * spacing;
        const hue = (i * 18 + time * 50) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 55%)`;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 20) {
          const y = yBase + Math.sin(x * 0.01 + time * 2 + i * 0.3) * (15 + bands.bass * 35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'rgb-neon-glow',
    name: 'Neon Glow',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r = 80 + bands.bass * 120;

      ctx.save();
      // Multi-layer diffuse glow
      const colors = ['#00f3ff', '#ff007f', '#8a2be2'];
      for (let i = 0; i < colors.length; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * (1 - i * 0.2), 0, Math.PI * 2);
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 6;
        ctx.shadowColor = colors[i];
        ctx.shadowBlur = 30 * (i + 1);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'rgb-edge-glow',
    name: 'RGB Edge Glow',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { beatIntensity } = audioData;
      const thickness = 10 + beatIntensity * 25;

      ctx.save();
      const hue = (time * 80) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.lineWidth = thickness;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 35;
      ctx.strokeRect(0, 0, width, height);
      ctx.restore();
    }
  },
  {
    id: 'rgb-color-burst',
    name: 'Color Burst',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rays = 36;

      ctx.save();
      for (let i = 0; i < rays; i++) {
        const a = (i / rays) * Math.PI * 2 + time * 0.4;
        const len = Math.max(width, height) * (0.3 + bands.mid * 0.4);
        const hue = (i * 10 + time * 40) % 360;

        ctx.strokeStyle = `hsl(${hue}, 100%, 55%)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(a) * len, centerY + Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'rgb-aura',
    name: 'Neon Aura',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r = 100 + bands.bass * 100;

      ctx.save();
      const grad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, palette.primary);
      grad.addColorStop(0.7, palette.secondary);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'rgb-chromatic-wave',
    name: 'Chromatic Wave',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const centerY = height / 2;
      const slice = width / timeDomainData.length;

      ctx.save();
      const channels = [
        { color: '#ff0055', offset: -6 },
        { color: '#00ffcc', offset: 0 },
        { color: '#0066ff', offset: 6 }
      ];

      for (const ch of channels) {
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < timeDomainData.length; i++) {
          const v = (timeDomainData[i] - 128) / 128;
          const y = centerY + v * 120 + ch.offset;
          const x = i * slice;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'rgb-rainbow-tunnel',
    name: 'Rainbow Tunnel',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 10;

      ctx.save();
      for (let i = 0; i < rings; i++) {
        const prog = ((i / rings) + time * 0.4) % 1;
        const r = prog * Math.max(width, height) * 0.65;
        const hue = (prog * 360 + time * 80) % 360;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.lineWidth = 3 + bands.bass * 4;
        ctx.globalAlpha = prog;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'rgb-gradient',
    name: 'Reactive Gradient',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      const h1 = (time * 30) % 360;
      const h2 = (h1 + 120 + bands.bass * 60) % 360;

      grad.addColorStop(0, `hsla(${h1}, 90%, 45%, 0.7)`);
      grad.addColorStop(1, `hsla(${h2}, 90%, 45%, 0.7)`);

      ctx.save();
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Center geometric cut
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 70 + bands.bass * 90, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'rgb-plasma',
    name: 'Neon Plasma',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const step = 32;
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);

      ctx.save();
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * step;
          const y = j * step;
          const v = Math.sin(x * 0.02 + time) + Math.cos(y * 0.02 + time * 0.8) + bands.bass;
          const hue = ((v * 60) + time * 40) % 360;

          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          ctx.beginPath();
          ctx.arc(x, y, 3 + Math.abs(v) * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  },
  {
    id: 'rgb-horizon',
    name: 'RGB Horizon',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const horizonY = height * 0.65;

      ctx.save();
      // Glowing sun on horizon
      const sunR = 80 + bands.bass * 40;
      const grad = ctx.createLinearGradient(0, horizonY - sunR, 0, horizonY);
      grad.addColorStop(0, '#ff007f');
      grad.addColorStop(1, '#ffaa00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(width / 2, horizonY, sunR, Math.PI, 0);
      ctx.fill();

      // Horizon line
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'rgb-aurora',
    name: 'Aurora Neon',
    category: 'rgb-neon',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const bandsCount = 5;

      ctx.save();
      for (let b = 0; b < bandsCount; b++) {
        const hue = (b * 50 + time * 40) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.lineWidth = 3;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 15) {
          const y = (height * 0.4) + Math.sin(x * 0.008 + time * 1.5 + b) * (60 + bands.bass * 80);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  }
];
