/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 2: Spectrum (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

// Peak hold cache for peak-hold visualizer
const peakHoldValues = new Float32Array(128);

export const spectrumPresets = [
  {
    id: 'spec-classic',
    name: 'Classic Spectrum',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const barCount = 64;
      const barWidth = (width / barCount) * 0.8;
      const gap = (width / barCount) * 0.2;
      const step = Math.floor(frequencyData.length / barCount);

      ctx.save();
      ctx.fillStyle = palette.primary;

      for (let i = 0; i < barCount; i++) {
        const val = frequencyData[i * step] / 255;
        const barHeight = val * height * 0.75 * (options.visualBrightness || 1.0);
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        ctx.fillRect(x, y, barWidth, barHeight);
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-rgb',
    name: 'RGB Spectrum',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const barCount = 72;
      const barWidth = width / barCount;
      const step = Math.floor(frequencyData.length / barCount);

      ctx.save();
      for (let i = 0; i < barCount; i++) {
        const val = frequencyData[i * step] / 255;
        const barHeight = val * height * 0.8;
        const hue = (i / barCount * 300 + time * 30) % 360;

        ctx.fillStyle = `hsl(${hue}, 100%, 55%)`;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-mirrored',
    name: 'Mirrored Spectrum',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const halfCount = 48;
      const halfWidth = width / 2;
      const barWidth = (halfWidth / halfCount) * 0.85;
      const step = Math.floor(frequencyData.length / (halfCount * 2));
      const centerY = height / 2;

      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, palette.secondary);
      grad.addColorStop(0.5, palette.primary);
      grad.addColorStop(1, palette.secondary);
      ctx.fillStyle = grad;

      for (let i = 0; i < halfCount; i++) {
        const val = frequencyData[i * step] / 255;
        const barH = val * (height * 0.42);
        const offset = i * (halfWidth / halfCount);

        // Right side
        ctx.fillRect(halfWidth + offset, centerY - barH, barWidth, barH * 2);
        // Left side
        ctx.fillRect(halfWidth - offset - barWidth, centerY - barH, barWidth, barH * 2);
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-gradient-bars',
    name: 'Gradient Bars',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const barCount = 50;
      const barWidth = width / barCount - 3;
      const step = Math.floor(frequencyData.length / barCount);

      ctx.save();
      const grad = ctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, palette.tertiary);
      grad.addColorStop(0.5, palette.primary);
      grad.addColorStop(1, palette.secondary);

      for (let i = 0; i < barCount; i++) {
        const val = frequencyData[i * step] / 255;
        const barHeight = val * height * 0.85;
        ctx.fillStyle = grad;
        ctx.fillRect(i * (barWidth + 3), height - barHeight, barWidth, barHeight);
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-neon-bars',
    name: 'Neon Bars',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const barCount = 40;
      const barWidth = width / barCount - 4;
      const step = Math.floor(frequencyData.length / barCount);

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.fillStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.lineWidth = 2;

      if (options.glowIntensity > 0.2) {
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 15 * options.glowIntensity;
      }

      for (let i = 0; i < barCount; i++) {
        const val = frequencyData[i * step] / 255;
        const barHeight = val * height * 0.78;
        const x = i * (barWidth + 4);
        const y = height - barHeight;

        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.strokeRect(x, y, barWidth, barHeight);
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-circular-bars',
    name: 'Circular Spectrum Bars',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const count = 90;
      const centerX = width / 2;
      const centerY = height / 2;
      const innerRadius = Math.min(centerX, centerY) * 0.35;
      const maxBarLength = Math.min(centerX, centerY) * 0.55;
      const step = Math.floor(frequencyData.length / count);

      ctx.save();
      ctx.lineWidth = 3;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const val = frequencyData[i * step] / 255;
        const barLen = val * maxBarLength;

        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * (innerRadius + barLen);
        const y2 = centerY + Math.sin(angle) * (innerRadius + barLen);

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
    id: 'spec-columns',
    name: 'Frequency Columns',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const cols = 24;
      const colWidth = width / cols;
      const step = Math.floor(frequencyData.length / cols);

      ctx.save();
      for (let i = 0; i < cols; i++) {
        const val = frequencyData[i * step] / 255;
        const colHeight = val * height * 0.85;

        // Draw segmented column dots
        const segments = 25;
        const activeSegments = Math.floor(val * segments);
        const segHeight = height / segments;

        for (let s = 0; s < activeSegments; s++) {
          const sy = height - (s + 1) * segHeight;
          const ratio = s / segments;
          ctx.fillStyle = ratio > 0.75 ? '#ff007f' : (ratio > 0.4 ? '#00f3ff' : '#00ff88');
          ctx.fillRect(i * colWidth + 4, sy + 2, colWidth - 8, segHeight - 4);
        }
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-floating',
    name: 'Floating Spectrum',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const count = 48;
      const step = Math.floor(frequencyData.length / count);
      const slotWidth = width / count;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const val = frequencyData[i * step] / 255;
        const y = height * (0.85 - val * 0.7);
        const size = 3 + val * 12;

        ctx.beginPath();
        ctx.arc(i * slotWidth + slotWidth / 2, y, size, 0, Math.PI * 2);
        ctx.fillStyle = palette.primary;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Dropping trail line
        ctx.beginPath();
        ctx.moveTo(i * slotWidth + slotWidth / 2, y + size);
        ctx.lineTo(i * slotWidth + slotWidth / 2, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-blocks',
    name: 'Spectrum Blocks',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const count = 36;
      const step = Math.floor(frequencyData.length / count);
      const blockWidth = width / count - 4;
      const blockH = 8;
      const gap = 3;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const val = frequencyData[i * step] / 255;
        const maxBlocks = Math.floor((height * 0.75) / (blockH + gap));
        const numBlocks = Math.floor(val * maxBlocks);

        for (let b = 0; b < numBlocks; b++) {
          const y = height - (b + 1) * (blockH + gap);
          ctx.fillStyle = b > maxBlocks * 0.7 ? palette.secondary : palette.primary;
          ctx.fillRect(i * (blockWidth + 4), y, blockWidth, blockH);
        }
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-peak-hold',
    name: 'Peak-Hold Spectrum',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const count = 64;
      const barWidth = width / count - 2;
      const step = Math.floor(frequencyData.length / count);

      ctx.save();
      for (let i = 0; i < count; i++) {
        const val = frequencyData[i * step] / 255;
        const curHeight = val * height * 0.8;

        // Decay peak hold
        if (curHeight >= peakHoldValues[i]) {
          peakHoldValues[i] = curHeight;
        } else {
          peakHoldValues[i] = Math.max(0, peakHoldValues[i] - 1.8);
        }

        const x = i * (barWidth + 2);
        // Bar
        ctx.fillStyle = palette.primary;
        ctx.fillRect(x, height - curHeight, barWidth, curHeight);

        // Peak line
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, height - peakHoldValues[i] - 3, barWidth, 3);
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-glass',
    name: 'Glass Spectrum',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const count = 30;
      const barWidth = width / count - 6;
      const step = Math.floor(frequencyData.length / count);

      ctx.save();
      for (let i = 0; i < count; i++) {
        const val = frequencyData[i * step] / 255;
        const barHeight = val * height * 0.75;
        const x = i * (barWidth + 6) + 3;
        const y = height - barHeight;

        // Frosted glass bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Glass top highlight
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, barWidth, 3);

        // Neon border
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
      }
      ctx.restore();
    }
  },
  {
    id: 'spec-equalizer',
    name: 'Reactive Equalizer',
    category: 'spectrum',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData, bands } = audioData;
      const count = 48;
      const barWidth = width / count - 3;
      const step = Math.floor(frequencyData.length / count);
      const centerY = height / 2;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const val = frequencyData[i * step] / 255;
        const h = val * (height * 0.45);
        const x = i * (barWidth + 3);

        const grad = ctx.createLinearGradient(0, centerY - h, 0, centerY + h);
        grad.addColorStop(0, palette.secondary);
        grad.addColorStop(0.5, palette.primary);
        grad.addColorStop(1, palette.secondary);

        ctx.fillStyle = grad;
        ctx.fillRect(x, centerY - h, barWidth, h * 2);
      }
      ctx.restore();
    }
  }
];
