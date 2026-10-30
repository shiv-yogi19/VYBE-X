/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 3: Circular (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

export const circularPresets = [
  {
    id: 'circ-audio-ring',
    name: 'RGB Audio Ring',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(centerX, centerY) * 0.45;
      const count = 120;
      const step = Math.floor(frequencyData.length / count);

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 3;

      for (let i = 0; i <= count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const val = (frequencyData[(i % count) * step] || 0) / 255;
        const r = baseRadius + val * 70 * (options.waveAmplitude || 1.0);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.5, centerX, centerY, baseRadius + 70);
      grad.addColorStop(0, palette.primary);
      grad.addColorStop(1, palette.secondary);
      ctx.strokeStyle = grad;
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'circ-pulsating',
    name: 'Pulsating Circle',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, isBeat, beatIntensity } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r = Math.min(centerX, centerY) * (0.35 + bands.bass * 0.3);

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.fillStyle = palette.primary;
      ctx.globalAlpha = 0.2 + beatIntensity * 0.5;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = isBeat ? '#ffffff' : palette.secondary;
      ctx.lineWidth = 4 + beatIntensity * 8;
      ctx.shadowColor = palette.secondary;
      ctx.shadowBlur = 20 * (options.glowIntensity || 1.0);
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'circ-halo',
    name: 'Energy Halo',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData, bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(centerX, centerY) * 0.4;
      const rays = 72;
      const step = Math.floor(frequencyData.length / rays);

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2;

      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2 + time * 0.5;
        const val = frequencyData[i * step] / 255;
        const rayLen = 20 + val * 90;

        const x1 = centerX + Math.cos(angle) * baseRadius;
        const y1 = centerY + Math.sin(angle) * baseRadius;
        const x2 = centerX + Math.cos(angle) * (baseRadius + rayLen);
        const y2 = centerY + Math.sin(angle) * (baseRadius + rayLen);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'circ-neon-orbit',
    name: 'Neon Orbit',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const orbitCount = 4;

      ctx.save();
      for (let o = 1; o <= orbitCount; o++) {
        const r = Math.min(centerX, centerY) * (o / (orbitCount + 1));
        const rot = time * (o % 2 === 0 ? 1 : -1) * (0.8 + bands.mid * 0.5);

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Orbiting planet bead
        const px = centerX + Math.cos(rot) * r;
        const py = centerY + Math.sin(rot) * r;
        ctx.beginPath();
        ctx.arc(px, py, 6 + bands.bass * 10, 0, Math.PI * 2);
        ctx.fillStyle = o % 2 === 0 ? palette.primary : palette.secondary;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 15;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'circ-frequency-ring',
    name: 'Circular Frequency Ring',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * 0.45;
      const count = 96;
      const step = Math.floor(frequencyData.length / count);

      ctx.save();
      ctx.lineWidth = 3;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const val = frequencyData[i * step] / 255;
        const outR = radius + val * 65;
        const inR = radius - val * 25;

        const x1 = centerX + Math.cos(angle) * inR;
        const y1 = centerY + Math.sin(angle) * inR;
        const x2 = centerX + Math.cos(angle) * outR;
        const y2 = centerY + Math.sin(angle) * outR;

        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'circ-dual-rings',
    name: 'Dual Audio Rings',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData, frequencyData } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r1 = Math.min(centerX, centerY) * 0.35;
      const r2 = Math.min(centerX, centerY) * 0.58;
      const count = 80;

      ctx.save();
      // Inner Wave Ring
      ctx.beginPath();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2.5;
      for (let i = 0; i <= count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const val = (timeDomainData[(i * 4) % timeDomainData.length] - 128) / 128;
        const r = r1 + val * 35;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Outer Frequency Ring
      ctx.beginPath();
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 2.5;
      for (let i = 0; i <= count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.PI / count;
        const val = (frequencyData[(i * 3) % frequencyData.length] || 0) / 255;
        const r = r2 + val * 45;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'circ-rotating-spectrum',
    name: 'Rotating Spectrum',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseR = Math.min(centerX, centerY) * 0.4;
      const count = 64;
      const step = Math.floor(frequencyData.length / count);
      const rot = time * 0.8;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + rot;
        const val = frequencyData[i * step] / 255;
        const len = val * 85;

        const x1 = centerX + Math.cos(angle) * baseR;
        const y1 = centerY + Math.sin(angle) * baseR;
        const x2 = centerX + Math.cos(angle) * (baseR + len);
        const y2 = centerY + Math.sin(angle) * (baseR + len);

        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'circ-cosmic',
    name: 'Cosmic Circle',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands, isBeat } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r = Math.min(centerX, centerY) * (0.4 + bands.bass * 0.25);

      ctx.save();
      const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, palette.primary);
      grad.addColorStop(0.7, palette.secondary);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.fill();

      // Cosmic dust particles in perimeter
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2 + time * 1.5;
        const dist = r + (Math.sin(i + time * 4) * 20);
        ctx.beginPath();
        ctx.arc(centerX + Math.cos(angle) * dist, centerY + Math.sin(angle) * dist, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'circ-pulse-halo',
    name: 'Pulse Halo',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { beatIntensity, bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const r = Math.min(centerX, centerY) * 0.45;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 3 + beatIntensity * 10;
      ctx.shadowColor = palette.secondary;
      ctx.shadowBlur = 25 * (options.glowIntensity || 1.0);

      ctx.beginPath();
      ctx.arc(centerX, centerY, r * (1 + beatIntensity * 0.2), 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, r * (0.7 - beatIntensity * 0.1), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'circ-orbital',
    name: 'Orbital Rings',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxR = Math.min(centerX, centerY) * 0.7;

      ctx.save();
      for (let i = 1; i <= 6; i++) {
        const r = (i / 6) * maxR;
        const tilt = i * 0.35 + time * 0.4;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(tilt);
        ctx.scale(1, 0.4 + bands.bass * 0.3);

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
  },
  {
    id: 'circ-radiant',
    name: 'Radiant Circle',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData, bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 60;
      const baseR = Math.min(centerX, centerY) * 0.3;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const val = frequencyData[i * 2] / 255;
        const length = baseR + val * 100;

        const grad = ctx.createLinearGradient(
          centerX, centerY,
          centerX + Math.cos(angle) * length,
          centerY + Math.sin(angle) * length
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, palette.primary);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(angle) * baseR, centerY + Math.sin(angle) * baseR);
        ctx.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'circ-multiring',
    name: 'Multiring Visualizer',
    category: 'circular',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData, bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 8;
      const maxR = Math.min(centerX, centerY) * 0.8;

      ctx.save();
      for (let r = 1; r <= rings; r++) {
        const radius = (r / rings) * maxR;
        const val = frequencyData[r * 12] / 255;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + val * 20, 0, Math.PI * 2);
        ctx.strokeStyle = r % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 1.5 + val * 4;
        ctx.globalAlpha = 0.5 + val * 0.5;
        ctx.stroke();
      }
      ctx.restore();
    }
  }
];
