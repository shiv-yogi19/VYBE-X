/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Settings & State Manager (LocalStorage persistence & color palettes)
   Creator: Shiv Yogi
   ========================================================================== */

const STORAGE_KEY = 'vybe_x_settings_v1';

// Available Color Palettes
export const COLOR_PALETTES = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    primary: '#00f3ff',
    secondary: '#ff007f',
    tertiary: '#8a2be2',
    glow: 'rgba(0, 243, 255, 0.45)',
    gradient: 'linear-gradient(135deg, #00f3ff, #ff007f)'
  },
  synthwave: {
    id: 'synthwave',
    name: 'Sunset Synthwave',
    primary: '#ff5e36',
    secondary: '#ff007f',
    tertiary: '#9900ef',
    glow: 'rgba(255, 0, 127, 0.45)',
    gradient: 'linear-gradient(135deg, #ff5e36, #ff007f)'
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Emerald',
    primary: '#00ff66',
    secondary: '#76ff03',
    tertiary: '#00e676',
    glow: 'rgba(0, 255, 102, 0.45)',
    gradient: 'linear-gradient(135deg, #00ff66, #00e676)'
  },
  'electric-ice': {
    id: 'electric-ice',
    name: 'Electric Ice',
    primary: '#00f3ff',
    secondary: '#0070f3',
    tertiary: '#ffffff',
    glow: 'rgba(0, 112, 243, 0.45)',
    gradient: 'linear-gradient(135deg, #00f3ff, #0070f3)'
  },
  'solar-flare': {
    id: 'solar-flare',
    name: 'Solar Flare',
    primary: '#ffaa00',
    secondary: '#ff1744',
    tertiary: '#ff6d00',
    glow: 'rgba(255, 170, 0, 0.45)',
    gradient: 'linear-gradient(135deg, #ffaa00, #ff1744)'
  },
  'deep-space': {
    id: 'deep-space',
    name: 'Deep Cosmos',
    primary: '#7c4dff',
    secondary: '#304ffe',
    tertiary: '#00e5ff',
    glow: 'rgba(124, 77, 255, 0.45)',
    gradient: 'linear-gradient(135deg, #7c4dff, #304ffe)'
  },
  'acid-rainbow': {
    id: 'acid-rainbow',
    name: 'Acid Rainbow',
    primary: '#ff007f',
    secondary: '#00f3ff',
    tertiary: '#00ff88',
    glow: 'rgba(255, 255, 255, 0.45)',
    gradient: 'linear-gradient(135deg, #ff007f, #00f3ff, #00ff88)'
  },
  'monochrome-laser': {
    id: 'monochrome-laser',
    name: 'Monochrome Laser',
    primary: '#ffffff',
    secondary: '#90caf9',
    tertiary: '#37474f',
    glow: 'rgba(255, 255, 255, 0.5)',
    gradient: 'linear-gradient(135deg, #ffffff, #90caf9)'
  }
};

// Default Configuration
const DEFAULT_SETTINGS = {
  currentPresetId: 'wave-neon',
  recentPresets: ['wave-neon'],
  favorites: ['wave-neon', 'spec-rgb', 'circ-audio-ring', 'part-galaxy', 'laser-crossfire'],
  paletteId: 'cyberpunk',
  performanceProfile: 'balanced', // 'performance' | 'balanced' | 'quality'
  reducedFlashing: false,
  mirrorMode: false,
  randomPresetMode: false,
  autoTransition: false,
  autoTransitionInterval: 20, // seconds

  // DJ Audio & Visual Controls
  bassSensitivity: 1.0,
  audioSensitivity: 1.0,
  animationSpeed: 1.0,
  visualBrightness: 1.0,
  glowIntensity: 1.0,
  laserWidth: 2.0,
  rgbIntensity: 1.0,
  particleDensity: 1.0,
  waveAmplitude: 1.0,
  smoothing: 0.8
};

class SettingsManager {
  constructor() {
    this.data = this.load();
    this.listeners = new Set();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_SETTINGS };
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (err) {
      console.warn('[VYBE-X Settings] Could not load localStorage:', err);
      return { ...DEFAULT_SETTINGS };
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.warn('[VYBE-X Settings] Could not write to localStorage:', err);
    }
    this.notify();
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  getAll() {
    return { ...this.data };
  }

  update(partial) {
    Object.assign(this.data, partial);
    this.save();
  }

  reset() {
    this.data = { ...DEFAULT_SETTINGS };
    this.save();
  }

  // Favorites management
  isFavorite(presetId) {
    return this.data.favorites.includes(presetId);
  }

  toggleFavorite(presetId) {
    const favs = [...this.data.favorites];
    const idx = favs.indexOf(presetId);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(presetId);
    }
    this.set('favorites', favs);
    return idx < 0;
  }

  // Recents management
  addRecent(presetId) {
    let recents = this.data.recentPresets.filter(id => id !== presetId);
    recents.unshift(presetId);
    if (recents.length > 20) recents = recents.slice(0, 20);
    this.set('recentPresets', recents);
  }

  // Active Palette Object
  getActivePalette() {
    return COLOR_PALETTES[this.data.paletteId] || COLOR_PALETTES.cyberpunk;
  }

  // Change notification
  onChange(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  notify() {
    for (const cb of this.listeners) {
      try {
        cb(this.data);
      } catch (err) {
        console.error('[VYBE-X Settings] Listener error:', err);
      }
    }
  }
}

export const settings = new SettingsManager();
