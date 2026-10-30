/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 1: Waveforms (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

export const waveformPresets = [
  {
    id: 'wave-neon',
    name: 'Neon Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const centerY = height / 2;
      const sliceWidth = width / (timeDomainData.length - 1);
      const amp = (options.waveAmplitude || 1.0) * (height * 0.4);

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 3 * (options.laserWidth ? options.laserWidth / 2 : 1);
      if (options.glowIntensity > 0.2) {
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 16 * options.glowIntensity;
      }

      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const y = centerY + v * amp;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'wave-dual',
    name: 'Dual Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const centerY = height / 2;
      const sliceWidth = width / (timeDomainData.length - 1);
      const amp = (options.waveAmplitude || 1.0) * (height * 0.35);

      ctx.save();
      // Wave 1 - Primary
      ctx.beginPath();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2.5;
      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const y = centerY + v * amp - 20;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2 - Secondary
      ctx.beginPath();
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 2.5;
      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const y = centerY - v * amp + 20;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'wave-mirror',
    name: 'Mirror Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const centerY = height / 2;
      const halfWidth = width / 2;
      const len = Math.floor(timeDomainData.length / 2);
      const sliceWidth = halfWidth / len;
      const amp = (options.waveAmplitude || 1.0) * (height * 0.45);

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 3;
      if (options.glowIntensity > 0.2) {
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 14 * options.glowIntensity;
      }

      for (let i = 0; i < len; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const y = centerY + v * amp;
        const xR = halfWidth + i * sliceWidth;
        const xL = halfWidth - i * sliceWidth;
        if (i === 0) {
          ctx.moveTo(xR, y);
        } else {
          ctx.lineTo(xR, y);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = palette.secondary;
      for (let i = 0; i < len; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const y = centerY + v * amp;
        const xL = halfWidth - i * sliceWidth;
        if (i === 0) ctx.moveTo(xL, y);
        else ctx.lineTo(xL, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'wave-rainbow',
    name: 'Rainbow Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const centerY = height / 2;
      const sliceWidth = width / (timeDomainData.length - 1);
      const amp = (options.waveAmplitude || 1.0) * (height * 0.4);

      ctx.save();
      ctx.lineWidth = 3;
      for (let i = 0; i < timeDomainData.length - 1; i += 2) {
        const v1 = (timeDomainData[i] - 128) / 128;
        const v2 = (timeDomainData[i + 1] - 128) / 128;
        const hue = (i / timeDomainData.length * 360 + time * 50) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;

        ctx.beginPath();
        ctx.moveTo(i * sliceWidth, centerY + v1 * amp);
        ctx.lineTo((i + 1) * sliceWidth, centerY + v2 * amp);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'wave-liquid',
    name: 'Liquid Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData, bands } = audioData;
      const centerY = height * 0.55;
      const sliceWidth = width / (timeDomainData.length - 1);
      const amp = (options.waveAmplitude || 1.0) * (height * 0.35);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const fluidOffset = Math.sin(i * 0.08 + time * 2) * (15 + bands.bass * 25);
        const y = centerY + v * amp + fluidOffset;
        const x = i * sliceWidth;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, centerY - amp, 0, height);
      grad.addColorStop(0, palette.primary);
      grad.addColorStop(0.7, palette.secondary);
      grad.addColorStop(1, 'rgba(5, 5, 8, 0.4)');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.75;
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'wave-pulse',
    name: 'Pulse Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData, isBeat, beatIntensity } = audioData;
      const centerY = height / 2;
      const sliceWidth = width / (timeDomainData.length - 1);
      const amp = (options.waveAmplitude || 1.0) * (height * (0.3 + beatIntensity * 0.3));

      ctx.save();
      ctx.lineWidth = 2 + beatIntensity * 5;
      ctx.strokeStyle = isBeat ? '#ffffff' : palette.primary;

      if (options.glowIntensity > 0.1) {
        ctx.shadowColor = palette.secondary;
        ctx.shadowBlur = 20 * (options.glowIntensity + beatIntensity);
      }

      ctx.beginPath();
      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const y = centerY + v * amp;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'wave-multi-line',
    name: 'Multi-Line Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const lines = 5;
      const sliceWidth = width / (timeDomainData.length - 1);
      const baseAmp = (options.waveAmplitude || 1.0) * (height * 0.15);

      ctx.save();
      for (let l = 0; l < lines; l++) {
        const yCenter = (height / (lines + 1)) * (l + 1);
        ctx.beginPath();
        ctx.strokeStyle = l % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = 0.8;

        for (let i = 0; i < timeDomainData.length; i += 2) {
          const v = (timeDomainData[(i + l * 40) % timeDomainData.length] - 128) / 128;
          const y = yCenter + v * baseAmp;
          const x = i * sliceWidth;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'wave-spiral',
    name: 'Spiral Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.85;

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2.5;

      for (let i = 0; i < timeDomainData.length; i++) {
        const norm = i / timeDomainData.length;
        const angle = norm * Math.PI * 8 + time;
        const v = (timeDomainData[i] - 128) / 128;
        const r = norm * maxRadius + v * 40 * (options.waveAmplitude || 1.0);
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
    id: 'wave-oscilloscope',
    name: 'Oscilloscope',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const step = 2;
      const len = Math.floor(timeDomainData.length / 2);

      ctx.save();
      ctx.strokeStyle = '#00ff66'; // Classic vector phosphorescent green
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 12 * (options.glowIntensity || 1.0);
      ctx.beginPath();

      for (let i = 0; i < len; i += step) {
        const xVal = (timeDomainData[i] - 128) / 128;
        const yVal = (timeDomainData[i + len] - 128) / 128;
        const x = centerX + xVal * (width * 0.35);
        const y = centerY + yVal * (height * 0.35);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'wave-glowing',
    name: 'Glowing Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData } = audioData;
      const centerY = height / 2;
      const sliceWidth = width / (timeDomainData.length - 1);
      const amp = (options.waveAmplitude || 1.0) * (height * 0.38);

      ctx.save();
      // Outer bloom glow
      ctx.beginPath();
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.4;
      ctx.shadowColor = palette.secondary;
      ctx.shadowBlur = 24 * (options.glowIntensity || 1.0);
      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const y = centerY + v * amp;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Sharp Core
      ctx.beginPath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1.0;
      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const y = centerY + v * amp;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'wave-frequency-ribbon',
    name: 'Frequency Ribbon',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData, frequencyData } = audioData;
      const centerY = height / 2;
      const sliceWidth = width / (timeDomainData.length - 1);
      const amp = (options.waveAmplitude || 1.0) * (height * 0.35);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, centerY);

      // Top wave
      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        const freqAmp = (frequencyData[i % frequencyData.length] / 255) * 40;
        const y = centerY + v * amp - freqAmp;
        ctx.lineTo(i * sliceWidth, y);
      }

      // Bottom wave in reverse
      for (let i = timeDomainData.length - 1; i >= 0; i--) {
        const v = (timeDomainData[i] - 128) / 128;
        const freqAmp = (frequencyData[i % frequencyData.length] / 255) * 40;
        const y = centerY + v * amp + freqAmp;
        ctx.lineTo(i * sliceWidth, y);
      }

      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, palette.primary);
      grad.addColorStop(0.5, palette.secondary);
      grad.addColorStop(1, palette.tertiary);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.restore();
    }
  },
  {
    id: 'wave-energy',
    name: 'Energy Wave',
    category: 'waveforms',
    render(ctx, width, height, audioData, palette, options, time) {
      const { timeDomainData, bands } = audioData;
      const centerY = height / 2;
      const sliceWidth = width / (timeDomainData.length - 1);
      const amp = (options.waveAmplitude || 1.0) * (height * 0.42);

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      for (let i = 0; i < timeDomainData.length; i++) {
        const v = (timeDomainData[i] - 128) / 128;
        // Jitter / electric spikes on high energy
        const jitter = (Math.random() - 0.5) * bands.treble * 30;
        const y = centerY + v * amp + jitter;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Energy particles along wave
      if (bands.bass > 0.4) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 15; i++) {
          const idx = Math.floor(Math.random() * timeDomainData.length);
          const v = (timeDomainData[idx] - 128) / 128;
          ctx.beginPath();
          ctx.arc(idx * sliceWidth, centerY + v * amp, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }
];
