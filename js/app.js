/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Main Controller: App Initialization, UI Binding & Audio/Visual Orchestration
   Creator: Shiv Yogi
   ========================================================================== */

import { settings, COLOR_PALETTES } from './settings.js';
import { performanceManager } from './performance.js';
import { fullscreenManager } from './fullscreen.js';
import { audioEngine } from './audio-engine.js';
import { visualizerEngine } from './visualizer-engine.js';

class VybeXApp {
  constructor() {
    this.elements = {};
    this.activeCategory = 'all';
    this.searchQuery = '';
  }

  init() {
    this.queryElements();
    this.initVisualizer();
    this.initStartupIntro();
    this.initAudioPlayerEvents();
    this.initHeaderEvents();
    this.initDjPanelEvents();
    this.initLibraryModalEvents();
    this.initKeyboardShortcuts();
    this.initPaletteButtons();
    this.registerServiceWorker();
  }

  queryElements() {
    // Canvases & Overlays
    this.elements.canvas = document.getElementById('visualizer-canvas');
    this.elements.strobeOverlay = document.getElementById('party-strobe-overlay');
    this.elements.introScreen = document.getElementById('intro-screen');

    // Header & Badges
    this.elements.activePresetBadge = document.getElementById('active-preset-badge');
    this.elements.activePresetName = document.getElementById('active-preset-name');
    this.elements.activePresetCategory = document.getElementById('active-preset-category');
    this.elements.micStatusPill = document.getElementById('mic-status-pill');
    this.elements.btnToggleMic = document.getElementById('btn-toggle-mic');
    this.elements.btnPartyMode = document.getElementById('btn-party-mode');
    this.elements.btnOpenDj = document.getElementById('btn-open-dj');
    this.elements.btnOpenLibrary = document.getElementById('btn-open-library');
    this.elements.btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');
    this.elements.btnExitFullscreen = document.getElementById('btn-exit-fullscreen');

    // Bottom Audio Dock
    this.elements.audioElement = document.getElementById('local-audio-element');
    this.elements.audioFileInput = document.getElementById('audio-file-input');
    this.elements.btnUploadTrack = document.getElementById('btn-upload-track');
    this.elements.btnPlayPause = document.getElementById('btn-play-pause');
    this.elements.trackTitle = document.getElementById('track-title');
    this.elements.trackTimeCurrent = document.getElementById('track-time-current');
    this.elements.trackTimeDuration = document.getElementById('track-time-duration');
    this.elements.progressSlider = document.getElementById('progress-slider');
    this.elements.volumeSlider = document.getElementById('volume-slider');
    this.elements.btnClearTrack = document.getElementById('btn-clear-track');
    this.elements.btnDemoSynth = document.getElementById('btn-demo-synth');

    // Modals & Drawers
    this.elements.djDrawer = document.getElementById('dj-drawer');
    this.elements.btnCloseDj = document.getElementById('btn-close-dj');
    this.elements.libraryModal = document.getElementById('library-modal');
    this.elements.btnCloseLibrary = document.getElementById('btn-close-library');
    this.elements.librarySearchInput = document.getElementById('library-search-input');
    this.elements.categoryScroll = document.getElementById('category-filter-scroll');
    this.elements.presetsGrid = document.getElementById('presets-grid');
    this.elements.btnLibraryShuffle = document.getElementById('btn-library-shuffle');

    // Microphone Permission Modal
    this.elements.micModal = document.getElementById('mic-permission-modal');
    this.elements.btnGrantMic = document.getElementById('btn-grant-mic');
    this.elements.btnDismissMic = document.getElementById('btn-dismiss-mic');
    this.elements.btnRetryMic = document.getElementById('btn-retry-mic');
    this.elements.micModalExplanation = document.getElementById('mic-modal-explanation');
    this.elements.micErrorBox = document.getElementById('mic-error-box');
  }

  initVisualizer() {
    visualizerEngine.init(this.elements.canvas, this.elements.strobeOverlay);
    this.updateActivePresetDisplay();

    // Listen to settings for dynamic preset changes
    settings.onChange(() => {
      this.updateActivePresetDisplay();
      this.updatePaletteStyles();
    });
  }

  // Startup Intro Sequence
  initStartupIntro() {
    const introDuration = 3200; // 3.2 seconds smooth startup sequence
    setTimeout(() => {
      if (this.elements.introScreen) {
        this.elements.introScreen.classList.add('fade-out');
        setTimeout(() => {
          this.elements.introScreen.style.display = 'none';
          // Prompt for microphone permission flow once intro finishes
          this.openMicModal();
        }, 800);
      }
    }, introDuration);
  }

  // Audio Dock & Player Events
  initAudioPlayerEvents() {
    // Local File Picker
    this.elements.btnUploadTrack.addEventListener('click', () => {
      this.elements.audioFileInput.click();
    });

    this.elements.audioFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        audioEngine.loadAudioFile(file, this.elements.audioElement);
        this.elements.audioElement.play().catch(() => {});
        this.elements.btnPlayPause.classList.add('active');
        this.updatePlayPauseIcon(true);
      }
    });

    // Play / Pause
    this.elements.btnPlayPause.addEventListener('click', () => {
      audioEngine.togglePlayPause();
    });

    // Seek Slider
    this.elements.progressSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 100;
      audioEngine.seek(val);
    });

    // Volume Slider
    this.elements.volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 100;
      audioEngine.setVolume(val);
    });

    // Audio Element timeupdate
    this.elements.audioElement.addEventListener('timeupdate', () => {
      const cur = this.elements.audioElement.currentTime || 0;
      const dur = this.elements.audioElement.duration || 0;
      this.elements.trackTimeCurrent.textContent = this.formatTime(cur);
      this.elements.trackTimeDuration.textContent = this.formatTime(dur);

      if (dur > 0) {
        this.elements.progressSlider.value = (cur / dur) * 100;
      }
    });

    this.elements.audioElement.addEventListener('play', () => {
      this.updatePlayPauseIcon(true);
    });

    this.elements.audioElement.addEventListener('pause', () => {
      this.updatePlayPauseIcon(false);
    });

    this.elements.audioElement.addEventListener('ended', () => {
      this.updatePlayPauseIcon(false);
    });

    // Clear Track
    this.elements.btnClearTrack.addEventListener('click', () => {
      audioEngine.clearAudioTrack();
      this.elements.trackTitle.textContent = 'No track loaded';
      this.elements.trackTimeCurrent.textContent = '00:00';
      this.elements.trackTimeDuration.textContent = '00:00';
      this.elements.progressSlider.value = 0;
      this.updatePlayPauseIcon(false);
    });

    // Demo Synth Button
    this.elements.btnDemoSynth.addEventListener('click', () => {
      if (audioEngine.currentSource === 'demo') {
        audioEngine.stopSynth();
        this.elements.btnDemoSynth.classList.remove('active');
        this.elements.trackTitle.textContent = 'No track loaded';
      } else {
        audioEngine.startDemoSynth();
        this.elements.btnDemoSynth.classList.add('active');
        this.elements.trackTitle.textContent = 'VYBE-X Ambient Synth Demo';
        this.updatePlayPauseIcon(true);
      }
    });

    // Audio Engine Listeners
    audioEngine.on('track-loaded', (data) => {
      this.elements.trackTitle.textContent = data.name;
    });

    audioEngine.on('source-change', (data) => {
      const isMic = data.source === 'mic';
      this.elements.micStatusPill.classList.toggle('recording', isMic);
      this.elements.btnToggleMic.classList.toggle('active', isMic);
      if (isMic) {
        this.elements.trackTitle.textContent = 'Live Microphone Input';
        this.elements.btnDemoSynth.classList.remove('active');
      }
    });
  }

  // Header & Tools Events
  initHeaderEvents() {
    // Open Library on badge click
    this.elements.activePresetBadge.addEventListener('click', () => {
      this.openLibraryModal();
    });

    // Toggle Microphone
    this.elements.btnToggleMic.addEventListener('click', () => {
      if (audioEngine.currentSource === 'mic') {
        audioEngine.stopMicrophone();
      } else {
        this.openMicModal();
      }
    });

    // Toggle Party Mode
    this.elements.btnPartyMode.addEventListener('click', () => {
      const isActive = visualizerEngine.togglePartyMode();
      this.elements.btnPartyMode.classList.toggle('active', isActive);
    });

    // Open DJ Panel
    this.elements.btnOpenDj.addEventListener('click', () => {
      this.elements.djDrawer.classList.add('active');
    });

    this.elements.btnCloseDj.addEventListener('click', () => {
      this.elements.djDrawer.classList.remove('active');
    });

    // Open Library
    this.elements.btnOpenLibrary.addEventListener('click', () => {
      this.openLibraryModal();
    });

    // Fullscreen Toggles
    this.elements.btnToggleFullscreen.addEventListener('click', () => {
      fullscreenManager.toggleFullscreen();
    });

    this.elements.btnExitFullscreen.addEventListener('click', () => {
      fullscreenManager.toggleFullscreen();
    });

    fullscreenManager.onFullscreenChange((isFs) => {
      this.elements.btnToggleFullscreen.classList.toggle('active', isFs);
    });

    // Mic Modal Events
    this.elements.btnGrantMic.addEventListener('click', async () => {
      try {
        await audioEngine.startMicrophone();
        this.closeMicModal();
      } catch (err) {
        this.handleMicError(err);
      }
    });

    this.elements.btnRetryMic.addEventListener('click', async () => {
      this.elements.micErrorBox.style.display = 'none';
      try {
        await audioEngine.startMicrophone();
        this.closeMicModal();
      } catch (err) {
        this.handleMicError(err);
      }
    });

    this.elements.btnDismissMic.addEventListener('click', () => {
      this.closeMicModal();
    });
  }

  openMicModal() {
    this.elements.micModal.classList.add('active');
    this.elements.micErrorBox.style.display = 'none';
  }

  closeMicModal() {
    this.elements.micModal.classList.remove('active');
  }

  handleMicError(err) {
    this.elements.micErrorBox.style.display = 'block';
    this.elements.micErrorBox.textContent = `Permission notice: ${err.message || 'Microphone access denied.'}. Please check browser address bar permissions or use Audio File mode.`;
  }

  // DJ Control Panel Sliders & Toggles
  initDjPanelEvents() {
    const sliderBindings = [
      { id: 'dj-bass-sens', key: 'bassSensitivity', valId: 'val-bass-sens', suffix: 'x' },
      { id: 'dj-audio-sens', key: 'audioSensitivity', valId: 'val-audio-sens', suffix: 'x' },
      { id: 'dj-anim-speed', key: 'animationSpeed', valId: 'val-anim-speed', suffix: 'x' },
      { id: 'dj-brightness', key: 'visualBrightness', valId: 'val-brightness', suffix: 'x' },
      { id: 'dj-glow-intensity', key: 'glowIntensity', valId: 'val-glow-intensity', suffix: 'x' },
      { id: 'dj-laser-width', key: 'laserWidth', valId: 'val-laser-width', suffix: 'px' },
      { id: 'dj-rgb-intensity', key: 'rgbIntensity', valId: 'val-rgb-intensity', suffix: 'x' },
      { id: 'dj-particle-density', key: 'particleDensity', valId: 'val-particle-density', suffix: 'x' },
      { id: 'dj-wave-amp', key: 'waveAmplitude', valId: 'val-wave-amp', suffix: 'x' },
      { id: 'dj-smoothing', key: 'smoothing', valId: 'val-smoothing', suffix: '' }
    ];

    for (const item of sliderBindings) {
      const el = document.getElementById(item.id);
      const valEl = document.getElementById(item.valId);
      if (el) {
        el.value = settings.get(item.key);
        if (valEl) valEl.textContent = `${el.value}${item.suffix}`;

        el.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          settings.set(item.key, val);
          if (valEl) valEl.textContent = `${val}${item.suffix}`;
        });
      }
    }

    // Toggle Switches
    const switchBindings = [
      { id: 'dj-toggle-mirror', key: 'mirrorMode' },
      { id: 'dj-toggle-random', key: 'randomPresetMode' },
      { id: 'dj-toggle-auto', key: 'autoTransition' },
      { id: 'dj-toggle-reduced-flash', key: 'reducedFlashing' }
    ];

    for (const sw of switchBindings) {
      const el = document.getElementById(sw.id);
      if (el) {
        el.checked = Boolean(settings.get(sw.key));
        el.addEventListener('change', (e) => {
          settings.set(sw.key, e.target.checked);
        });
      }
    }

    // Performance Profile Segments
    const perfButtons = document.querySelectorAll('[data-perf-profile]');
    const activePerf = settings.get('performanceProfile') || 'balanced';
    perfButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.perfProfile === activePerf);
      btn.addEventListener('click', () => {
        perfButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        performanceManager.setProfile(btn.dataset.perfProfile);
      });
    });

    // Auto Transition Interval Pills
    const intervalButtons = document.querySelectorAll('[data-trans-interval]');
    const activeInterval = settings.get('autoTransitionInterval') || 20;
    intervalButtons.forEach((btn) => {
      btn.classList.toggle('active', parseInt(btn.dataset.transInterval, 10) === activeInterval);
      btn.addEventListener('click', () => {
        intervalButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.set('autoTransitionInterval', parseInt(btn.dataset.transInterval, 10));
      });
    });

    // Reset Defaults
    const btnReset = document.getElementById('btn-reset-dj');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        settings.reset();
        window.location.reload();
      });
    }
  }

  // Color Palette Swatches
  initPaletteButtons() {
    const container = document.getElementById('palette-swatches-grid');
    if (!container) return;

    container.innerHTML = '';
    const currentPalette = settings.get('paletteId');

    for (const [key, pal] of Object.entries(COLOR_PALETTES)) {
      const btn = document.createElement('button');
      btn.className = `palette-swatch-btn ${key === currentPalette ? 'active' : ''}`;
      btn.style.background = pal.gradient;
      btn.title = pal.name;
      btn.dataset.palette = key;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.palette-swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.set('paletteId', key);
      });

      container.appendChild(btn);
    }

    this.updatePaletteStyles();
  }

  updatePaletteStyles() {
    const pal = settings.getActivePalette();
    document.documentElement.style.setProperty('--accent-primary', pal.primary);
    document.documentElement.style.setProperty('--accent-secondary', pal.secondary);
    document.documentElement.style.setProperty('--accent-tertiary', pal.tertiary);
    document.documentElement.style.setProperty('--accent-glow', pal.glow);
  }

  // Visualizer Library Modal & Cards Grid
  initLibraryModalEvents() {
    this.elements.btnCloseLibrary.addEventListener('click', () => {
      this.closeLibraryModal();
    });

    // Category Filter Pills
    this.elements.categoryScroll.querySelectorAll('.category-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.elements.categoryScroll.querySelectorAll('.category-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.dataset.category;
        this.renderLibraryGrid();
      });
    });

    // Search Input
    this.elements.librarySearchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderLibraryGrid();
    });

    // Shuffle button
    this.elements.btnLibraryShuffle.addEventListener('click', () => {
      visualizerEngine.selectRandomPreset();
      this.closeLibraryModal();
    });
  }

  openLibraryModal() {
    this.elements.libraryModal.classList.add('active');
    this.renderLibraryGrid();
  }

  closeLibraryModal() {
    this.elements.libraryModal.classList.remove('active');
  }

  renderLibraryGrid() {
    const grid = this.elements.presetsGrid;
    grid.innerHTML = '';

    const allPresets = visualizerEngine.getAllPresets();
    const activePreset = visualizerEngine.getActivePreset();

    const filtered = allPresets.filter((p) => {
      // Category filter
      if (this.activeCategory === 'favorites') {
        if (!settings.isFavorite(p.id)) return false;
      } else if (this.activeCategory === 'recent') {
        const recents = settings.get('recentPresets') || [];
        if (!recents.includes(p.id)) return false;
      } else if (this.activeCategory !== 'all') {
        if (p.category !== this.activeCategory) return false;
      }

      // Search query
      if (this.searchQuery) {
        return p.name.toLowerCase().includes(this.searchQuery) || p.category.toLowerCase().includes(this.searchQuery);
      }

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-library-state">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <p>No visualizers found matching "${this.searchQuery || this.activeCategory}".</p>
        </div>
      `;
      return;
    }

    filtered.forEach((preset) => {
      const card = document.createElement('div');
      card.className = `preset-card ${preset.id === activePreset.id ? 'active' : ''}`;

      // Thumbnail Container
      const thumb = document.createElement('div');
      thumb.className = 'preset-thumbnail-container';

      const canvas = document.createElement('canvas');
      canvas.className = 'preset-preview-canvas';
      canvas.width = 180;
      canvas.height = 96;
      thumb.appendChild(canvas);

      // Render representative thumbnail
      visualizerEngine.renderThumbnail(preset, canvas);

      // Card Body
      const body = document.createElement('div');
      body.className = 'preset-card-body';

      const details = document.createElement('div');
      details.className = 'preset-details';

      const title = document.createElement('div');
      title.className = 'preset-card-name';
      title.textContent = preset.name;

      const cat = document.createElement('div');
      cat.className = 'preset-card-category';
      cat.textContent = preset.category;

      details.appendChild(title);
      details.appendChild(cat);

      // Favorite Star Button
      const favBtn = document.createElement('button');
      favBtn.className = `btn-star-fav ${settings.isFavorite(preset.id) ? 'is-favorite' : ''}`;
      favBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      `;

      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isFav = settings.toggleFavorite(preset.id);
        favBtn.classList.toggle('is-favorite', isFav);
      });

      body.appendChild(details);
      body.appendChild(favBtn);

      card.appendChild(thumb);
      card.appendChild(body);

      card.addEventListener('click', () => {
        visualizerEngine.selectPreset(preset.id);
        this.closeLibraryModal();
      });

      grid.appendChild(card);
    });
  }

  updateActivePresetDisplay() {
    const active = visualizerEngine.getActivePreset();
    if (!active) return;
    this.elements.activePresetName.textContent = active.name;
    this.elements.activePresetCategory.textContent = active.category;
  }

  updatePlayPauseIcon(isPlaying) {
    const playSvg = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    const pauseSvg = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    this.elements.btnPlayPause.innerHTML = isPlaying ? pauseSvg : playSvg;
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Keyboard Navigation & Shortcuts
  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger when typing in search input
      if (e.target.tagName === 'INPUT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          audioEngine.togglePlayPause();
          break;
        case 'KeyF':
          fullscreenManager.toggleFullscreen();
          break;
        case 'KeyL':
          if (this.elements.libraryModal.classList.contains('active')) {
            this.closeLibraryModal();
          } else {
            this.openLibraryModal();
          }
          break;
        case 'KeyD':
          this.elements.djDrawer.classList.toggle('active');
          break;
        case 'KeyP':
          this.elements.btnPartyMode.click();
          break;
        case 'KeyM':
          this.elements.btnToggleMic.click();
          break;
        case 'ArrowRight':
          visualizerEngine.selectNextPreset();
          break;
        case 'ArrowLeft':
          visualizerEngine.selectRandomPreset();
          break;
      }
    });
  }

  // PWA Service Worker Registration
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then((reg) => {
            console.log('[VYBE-X PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[VYBE-X PWA] Service Worker registration failed:', err);
          });
      });
    }
  }
}

// Instantiate and start VYBE-X on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const app = new VybeXApp();
  app.init();
});
