/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Visualizer Module 5: Geometric (12 Presets)
   Creator: Shiv Yogi
   ========================================================================== */

export const geometricPresets = [
  {
    id: 'geom-polygon',
    name: 'Rotating Polygon',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const sides = 5 + Math.floor(bands.mid * 4);
      const radius = Math.min(centerX, centerY) * (0.35 + bands.bass * 0.25);
      const rot = time * 0.8;

      ctx.save();
      ctx.beginPath();
      for (let s = 0; s < sides; s++) {
        const a = (s / sides) * Math.PI * 2 + rot;
        const x = centerX + Math.cos(a) * radius;
        const y = centerY + Math.sin(a) * radius;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 3;
      ctx.shadowColor = palette.primary;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'geom-grid',
    name: 'Neon Grid',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const step = 40;
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);

      ctx.save();
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;

      // Vertical lines with wave bending
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const x = c * step + Math.sin(r * 0.2 + time + c * 0.1) * (bands.bass * 25);
          const y = r * step;
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * step);
        ctx.lineTo(width, r * step);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-triangles',
    name: 'Reactive Triangles',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const layers = 6;
      const maxR = Math.min(centerX, centerY) * 0.75;

      ctx.save();
      for (let l = 1; l <= layers; l++) {
        const r = (l / layers) * maxR * (1 + (l === layers ? bands.bass * 0.2 : 0));
        const rot = time * (l % 2 === 0 ? 0.6 : -0.6) + l * 0.3;

        ctx.beginPath();
        for (let s = 0; s < 3; s++) {
          const a = (s / 3) * Math.PI * 2 + rot;
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = l % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-tunnel',
    name: 'Geometric Tunnel',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const rings = 12;

      ctx.save();
      for (let i = 0; i < rings; i++) {
        const progress = ((i / rings) + time * 0.3) % 1;
        const r = progress * Math.max(width, height) * 0.7;
        const sides = 8;
        const rot = progress * Math.PI;

        ctx.beginPath();
        for (let s = 0; s < sides; s++) {
          const a = (s / sides) * Math.PI * 2 + rot;
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2 * (1 + bands.bass);
        ctx.globalAlpha = progress;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-sphere',
    name: 'Wireframe Sphere',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * (0.45 + bands.bass * 0.15);
      const rings = 8;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 1.8;

      // Latitudes
      for (let i = 1; i < rings; i++) {
        const phi = (i / rings) * Math.PI - Math.PI / 2;
        const rLat = radius * Math.cos(phi);
        const yLat = centerY + radius * Math.sin(phi);

        ctx.beginPath();
        ctx.ellipse(centerX, yLat, rLat, rLat * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitudes
      for (let j = 0; j < rings; j++) {
        const theta = (j / rings) * Math.PI + time * 0.5;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * Math.cos(theta), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-cube',
    name: 'Rotating Cube',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const size = 90 * (1 + bands.bass * 0.4);

      // 8 Vertices of a 3D Cube
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      const rotX = time * 0.7;
      const rotY = time * 0.9;

      ctx.save();
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = 3;
      ctx.shadowColor = palette.secondary;
      ctx.shadowBlur = 12;

      const projected = vertices.map(([x, y, z]) => {
        // Rotate around X
        const y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
        const z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
        // Rotate around Y
        const x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
        const z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);

        const dist = 3.5;
        const scale = 1 / (dist + z2);
        return [
          centerX + x2 * size * scale * 3,
          centerY + y1 * size * scale * 3
        ];
      });

      for (const [v1, v2] of edges) {
        ctx.beginPath();
        ctx.moveTo(projected[v1][0], projected[v1][1]);
        ctx.lineTo(projected[v2][0], projected[v2][1]);
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-symmetry',
    name: 'Symmetry Grid',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const spokes = 8;
      const rings = 6;
      const maxR = Math.min(centerX, centerY) * 0.8;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 2;

      // Radial spokes
      for (let s = 0; s < spokes; s++) {
        const a = (s / spokes) * Math.PI * 2 + time * 0.2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(a) * maxR, centerY + Math.sin(a) * maxR);
        ctx.stroke();
      }

      // Connecting web
      for (let r = 1; r <= rings; r++) {
        const rad = (r / rings) * maxR * (1 + bands.mid * 0.2);
        ctx.beginPath();
        for (let s = 0; s <= spokes; s++) {
          const a = (s / spokes) * Math.PI * 2 + time * 0.2;
          const x = centerX + Math.cos(a) * rad;
          const y = centerY + Math.sin(a) * rad;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-hexagons',
    name: 'Dynamic Hexagons',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 7;

      ctx.save();
      for (let i = 1; i <= count; i++) {
        const r = i * 35 * (1 + bands.bass * 0.25);
        const rot = time * (i % 2 === 0 ? 0.5 : -0.5);

        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * Math.PI * 2 + rot;
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-fractal',
    name: 'Fractal Geometry',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;

      function drawBranch(x, y, len, angle, depth) {
        if (depth <= 0) return;
        const x2 = x + Math.cos(angle) * len;
        const y2 = y + Math.sin(angle) * len;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const branchAngle = 0.5 + bands.mid * 0.4;
        drawBranch(x2, y2, len * 0.72, angle - branchAngle, depth - 1);
        drawBranch(x2, y2, len * 0.72, angle + branchAngle, depth - 1);
      }

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 1.5;
      const baseLen = 60 * (1 + bands.bass * 0.5);
      for (let i = 0; i < 4; i++) {
        const rootAngle = (i / 4) * Math.PI * 2 + time * 0.3;
        drawBranch(centerX, centerY, baseLen, rootAngle, 5);
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-diamonds',
    name: 'Neon Diamonds',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 8;

      ctx.save();
      for (let i = 1; i <= count; i++) {
        const sizeX = i * 28 * (1 + bands.treble * 0.3);
        const sizeY = i * 40 * (1 + bands.bass * 0.3);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - sizeY);
        ctx.lineTo(centerX + sizeX, centerY);
        ctx.lineTo(centerX, centerY + sizeY);
        ctx.lineTo(centerX - sizeX, centerY);
        ctx.closePath();

        ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-rings',
    name: 'Geometric Rings',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { bands } = audioData;
      const centerX = width / 2;
      const centerY = height / 2;
      const count = 5;

      ctx.save();
      for (let i = 1; i <= count; i++) {
        const r = i * 45;
        const sides = 3 + i;
        ctx.beginPath();
        for (let s = 0; s < sides; s++) {
          const a = (s / sides) * Math.PI * 2 + time * 0.4 * i;
          const x = centerX + Math.cos(a) * r * (1 + bands.bass * 0.2);
          const y = centerY + Math.sin(a) * r * (1 + bands.bass * 0.2);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
    }
  },
  {
    id: 'geom-wireframe',
    name: 'Reactive Wireframe',
    category: 'geometric',
    render(ctx, width, height, audioData, palette, options, time) {
      const { frequencyData } = audioData;
      const rows = 12;
      const cols = 16;
      const cellW = width / cols;
      const cellH = height / rows;

      ctx.save();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const val = frequencyData[(r * cols + c) % frequencyData.length] / 255;
          const x = c * cellW;
          const y = r * cellH + val * 30;
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  }
];
