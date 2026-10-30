/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 8: Tunnels (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

export const tunnelPresets = [
  {
    id: 'tunnel-hyperspace',
    name: 'Hyperspace Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const stars = 70;
      const speed = (0.01 + bands.bass * 0.03) * (options.animationSpeed || 1.0);

      ctx.save();
      for (let i = 0; i < stars; i++) {
        const prog = ((i / stars) + time * 0.8) % 1;
        const angle = i * 2.39996; // Golden angle
        const r1 = Math.pow(prog, 2) * Math.max(width, height) * 0.8;
        const r2 = Math.pow(Math.min(1, prog + speed * 2), 2) * Math.max(width, height) * 0.8;

        const x1 = centerX + Math.cos(angle) * r1;
        const y1 = centerY + Math.sin(angle) * r1;
        const x2 = centerX + Math.cos(angle) * r2;
        const y2 = centerY + Math.sin(angle) * r2;

        ctx.strokeStyle = i % 2 === 0 ? palette.primary : '#ffffff';
        ctx.lineWidth = 1 + prog * 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-cosmic',
    name: 'Cosmic Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 12;

      ctx.save();
      for (let i = 0; i < rings; i++) {
        const prog = ((i / rings) + time * 0.4) % 1;
        const r = Math.pow(prog, 2.2) * Math.max(width, height) * 0.75;
        const tilt = prog * Math.PI + time;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(tilt);

        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.65, 0, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2 + prog * 3;
        ctx.globalAlpha = prog;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-neon',
    name: 'Neon Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 10;

      ctx.save();
      for (let i = 0; i < rings; i++) {
        const prog = ((i / rings) + time * 0.5) % 1;
        const r = prog * Math.min(centerX, centerY) * 1.5;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 2 + bands.bass * 4;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = prog;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-rotating',
    name: 'Rotating Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 10;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const prog = ((i / count) + time * 0.3) % 1;
        const size = prog * Math.max(width, height) * 0.7;
        const rot = time * 0.8 + prog * Math.PI;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rot);

        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 3;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-star',
    name: 'Star Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 8;

      function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.save();
      for (let i = 0; i < rings; i++) {
        const prog = ((i / rings) + time * 0.4) % 1;
        const outR = prog * Math.min(centerX, centerY) * 1.4;
        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2.5;
        drawStar(centerX, centerY, 5, outR, outR * 0.5);
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-energy',
    name: 'Energy Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const spokes = 12;
      const rings = 8;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 1.5;

      // Spokes
      for (let s = 0; s < spokes; s++) {
        const a = (s / spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(a) * Math.max(width, height), centerY + Math.sin(a) * Math.max(width, height));
        ctx.stroke();
      }

      // Expanding rings
      for (let r = 0; r < rings; r++) {
        const prog = ((r / rings) + time * 0.5) % 1;
        const rad = Math.pow(prog, 2) * Math.min(centerX, centerY) * 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, rad, 0, Math.PI * 2);
        ctx.strokeStyle = palette.secondary;
        ctx.lineWidth = 2 + bands.bass * 3;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-wireframe',
    name: 'Wireframe Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 10;
      const sides = 6;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2;

      for (let i = 0; i < rings; i++) {
        const prog = ((i / rings) + time * 0.4) % 1;
        const rad = prog * Math.max(width, height) * 0.7;

        ctx.beginPath();
        for (let s = 0; s < sides; s++) {
          const a = (s / sides) * Math.PI * 2;
          const x = centerX + Math.cos(a) * rad;
          const y = centerY + Math.sin(a) * rad;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-particle',
    name: 'Particle Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 120;

      ctx.save();
      for (let i = 0; i < count; i++) {
        const prog = ((i / count) + time * 0.6) % 1;
        const angle = i * 0.4;
        const rad = Math.pow(prog, 2) * Math.max(width, height) * 0.8;

        const x = centerX + Math.cos(angle) * rad;
        const y = centerY + Math.sin(angle) * rad;

        ctx.beginPath();
        ctx.arc(x, y, 1.5 + prog * 5 * (1 + bands.bass), 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.globalAlpha = prog;
        ctx.fill();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-infinite-grid',
    name: 'Infinite Grid',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const horizonY = height * 0.5;
      const vX = width / 2;
      const lines = 14;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 1.5;

      // Bottom grid lines
      for (let i = 0; i <= lines; i++) {
        const bottomX = (i / lines) * width * 1.5 - width * 0.25;
        ctx.beginPath();
        ctx.moveTo(vX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Moving cross rungs
      for (let j = 1; j <= 8; j++) {
        const prog = ((j / 8) + time * 0.4) % 1;
        const y = horizonY + Math.pow(prog, 2) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-radial-zoom',
    name: 'Radial Zoom',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const spokes = 24;

      ctx.save();
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2 + Math.sin(time) * 0.2;
        const r1 = 30 + bands.bass * 20;
        const r2 = Math.max(width, height) * 0.8;

        const grad = ctx.createLinearGradient(
          centerX + Math.cos(a) * r1, centerY + Math.sin(a) * r1,
          centerX + Math.cos(a) * r2, centerY + Math.sin(a) * r2
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, palette.primary);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(a) * r1, centerY + Math.sin(a) * r1);
        ctx.lineTo(centerX + Math.cos(a) * r2, centerY + Math.sin(a) * r2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-plasma',
    name: 'Plasma Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 9;

      ctx.save();
      for (let i = 0; i < rings; i++) {
        const prog = ((i / rings) + time * 0.4) % 1;
        const r = prog * Math.min(centerX, centerY) * 1.5;
        const hue = (prog * 360 + time * 90) % 360;

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.2) {
          const wobble = Math.sin(a * 4 + time * 3) * (10 + bands.bass * 20);
          const px = centerX + Math.cos(a) * (r + wobble);
          const py = centerY + Math.sin(a) * (r + wobble);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsl(${hue}, 100%, 55%)`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'tunnel-rainbow',
    name: 'Rainbow Tunnel',
    category: 'tunnels',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 12;

      ctx.save();
      for (let i = 0; i < rings; i++) {
        const prog = ((i / rings) + time * 0.5) % 1;
        const r = prog * Math.max(width, height) * 0.7;
        const hue = (i * 30 + time * 60) % 360;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      ctx.restore();
    }
  }
];
