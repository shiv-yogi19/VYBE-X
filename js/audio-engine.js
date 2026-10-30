/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Audio Engine: Web Audio API Processing, Frequency Bands & Beat Detection
   Creator: Shiv Yogi
   ========================================================================== */

import { settings } from './settings.js';

class AudioEngine {
  constructor() {
    this.context = null;
    this.analyser = null;

    // Sources
    this.micStream = null;
    this.micSourceNode = null;
    this.mediaElementSourceNode = null;
    this.audioElement = null;
    this.gainNode = null;

    // Built-in Synth Generator (ambient audio generator for demo/offline testing)
    this.synthInterval = null;
    this.synthGain = null;

    // Analysis Buffers
    this.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.fftSize / 2);
    this.timeDomainData = new Uint8Array(this.fftSize);

    // Band energies (0.0 to 1.0)
    this.bands = {
      bass: 0,
      mid: 0,
      treble: 0,
      overall: 0
    };

    // Beat Detection state
    this.beatThreshold = 0.32;
    this.beatDecay = 0.96;
    this.beatEnergyHold = 0;
    this.beatCutoff = 0;
    this.isBeat = false;
    this.beatIntensity = 0;

    // Source Mode: 'mic' | 'player' | 'demo' | 'idle'
    this.currentSource = 'idle';
    this.isPlaying = false;
    this.audioTrackName = '';
    this.audioTrackObjectUrl = null;

    // Event listeners
    this.listeners = new Set();
  }

  // Ensure AudioContext is instantiated and in 'running' state
  async ensureContext() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API is not supported in this browser.');
      }
      this.context = new AudioContextClass();

      // Configure Analyser
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = settings.get('smoothing') || 0.8;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;

      // Master gain for audio player
      this.gainNode = this.context.createGain();
      this.gainNode.gain.value = 1.0;
      this.gainNode.connect(this.context.destination);

      // Listen to settings for smoothing updates
      settings.onChange((data) => {
        if (this.analyser && typeof data.smoothing === 'number') {
          this.analyser.smoothingTimeConstant = Math.min(0.95, Math.max(0.1, data.smoothing));
        }
      });
    }

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    return this.context;
  }

  // Connect Microphone Input
  async startMicrophone() {
    await this.ensureContext();
    this.stopPlayback();
    this.stopSynth();

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone access is not supported by your browser or requires HTTPS.');
    }

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      // Disconnect prior mic if any
      if (this.micSourceNode) {
        this.micSourceNode.disconnect();
      }

      this.micSourceNode = this.context.createMediaStreamSource(this.micStream);
      // Connect ONLY to analyser - NEVER to destination to prevent feedback scream
      this.micSourceNode.connect(this.analyser);

      this.currentSource = 'mic';
      this.isPlaying = true;
      this.notify('source-change', { source: 'mic' });
      return true;
    } catch (err) {
      this.stopMicrophone();
      throw err;
    }
  }

  // Cleanly stop microphone tracks and release hardware
  stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSourceNode) {
      try {
        this.micSourceNode.disconnect();
      } catch (e) {
        /* Already disconnected */
      }
      this.micSourceNode = null;
    }
    if (this.currentSource === 'mic') {
      this.currentSource = 'idle';
      this.isPlaying = false;
      this.notify('source-change', { source: 'idle' });
    }
  }

  // Load User Audio File (blob or File object)
  async loadAudioFile(file, audioElement) {
    await this.ensureContext();
    this.stopMicrophone();
    this.stopSynth();

    if (this.audioTrackObjectUrl) {
      URL.revokeObjectURL(this.audioTrackObjectUrl);
      this.audioTrackObjectUrl = null;
    }

    this.audioElement = audioElement;
    this.audioTrackName = file.name;
    this.audioTrackObjectUrl = URL.createObjectURL(file);
    this.audioElement.src = this.audioTrackObjectUrl;
    this.audioElement.load();

    // Connect MediaElement once
    if (!this.mediaElementSourceNode) {
      this.mediaElementSourceNode = this.context.createMediaElementSource(this.audioElement);
      this.mediaElementSourceNode.connect(this.analyser);
      this.analyser.connect(this.gainNode);
    }

    this.currentSource = 'player';
    this.notify('track-loaded', { name: this.audioTrackName });
  }

  // Audio Playback Transport
  async play() {
    await this.ensureContext();
    if (this.currentSource === 'player' && this.audioElement) {
      await this.audioElement.play();
      this.isPlaying = true;
      this.notify('play-state', { isPlaying: true });
    } else if (this.currentSource === 'mic') {
      this.isPlaying = true;
      this.notify('play-state', { isPlaying: true });
    }
  }

  pause() {
    if (this.currentSource === 'player' && this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.notify('play-state', { isPlaying: false });
  }

  togglePlayPause() {
    if (this.currentSource === 'player') {
      if (this.audioElement && !this.audioElement.paused) {
        this.pause();
      } else {
        this.play();
      }
    } else if (this.currentSource === 'mic') {
      if (this.isPlaying) {
        this.stopMicrophone();
      } else {
        this.startMicrophone();
      }
    } else if (this.currentSource === 'demo') {
      if (this.isPlaying) {
        this.stopSynth();
      } else {
        this.startDemoSynth();
      }
    }
  }

  seek(ratio) {
    if (this.audioElement && this.audioElement.duration) {
      this.audioElement.currentTime = Math.max(0, Math.min(this.audioElement.duration, ratio * this.audioElement.duration));
    }
  }

  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  stopPlayback() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.isPlaying = false;
  }

  clearAudioTrack() {
    this.stopPlayback();
    if (this.audioTrackObjectUrl) {
      URL.revokeObjectURL(this.audioTrackObjectUrl);
      this.audioTrackObjectUrl = null;
    }
    if (this.audioElement) {
      this.audioElement.src = '';
    }
    this.audioTrackName = '';
    this.currentSource = 'idle';
    this.notify('source-change', { source: 'idle' });
  }

  // Built-in Demo Synth Generator (Produces rhythm bass + arpeggio pads using Web Audio oscillators)
  async startDemoSynth() {
    await this.ensureContext();
    this.stopMicrophone();
    this.stopPlayback();

    if (!this.synthGain) {
      this.synthGain = this.context.createGain();
      this.synthGain.gain.value = 0.28;
      this.synthGain.connect(this.analyser);
      this.analyser.connect(this.gainNode);
    }

    this.currentSource = 'demo';
    this.isPlaying = true;
    this.audioTrackName = 'VYBE-X Ambient Synth Demo';

    let step = 0;
    const notes = [55, 110, 220, 330, 440, 550, 660, 880];

    const playStep = () => {
      if (!this.synthGain || this.currentSource !== 'demo') return;
      try {
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const noteGain = this.context.createGain();

        // Kick / Bass on downbeats
        if (step % 2 === 0) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(130, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
          noteGain.gain.setValueAtTime(0.8, now);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.connect(noteGain);
          noteGain.connect(this.synthGain);
          osc.start(now);
          osc.stop(now + 0.3);
        }

        // Arp note
        const arpOsc = this.context.createOscillator();
        const arpGain = this.context.createGain();
        arpOsc.type = (step % 4 === 0) ? 'sawtooth' : 'triangle';
        const freq = notes[step % notes.length];
        arpOsc.frequency.setValueAtTime(freq, now);
        arpGain.gain.setValueAtTime(0.2, now);
        arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        arpOsc.connect(arpGain);
        arpGain.connect(this.synthGain);
        arpOsc.start(now);
        arpOsc.stop(now + 0.22);

        step = (step + 1) % 16;
      } catch (e) {
        /* Context suspended */
      }
    };

    if (this.synthInterval) clearInterval(this.synthInterval);
    this.synthInterval = setInterval(playStep, 175);
    this.notify('source-change', { source: 'demo' });
  }

  stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.currentSource === 'demo') {
      this.currentSource = 'idle';
      this.isPlaying = false;
      this.notify('source-change', { source: 'idle' });
    }
  }

  // Real-time Audio Data extraction for render loop
  update() {
    if (!this.analyser) {
      return {
        frequencyData: this.frequencyData,
        timeDomainData: this.timeDomainData,
        bands: this.bands,
        isBeat: false,
        beatIntensity: 0
      };
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeDomainData);

    const binCount = this.analyser.frequencyBinCount;
    const nyquist = (this.context ? this.context.sampleRate : 44100) / 2;
    const hzPerBin = nyquist / binCount;

    // DJ Sensitivity Multipliers
    const audioSensitivity = settings.get('audioSensitivity') || 1.0;
    const bassSensitivity = settings.get('bassSensitivity') || 1.0;

    // Frequency Band calculations
    let bassSum = 0, bassCount = 0;
    let midSum = 0, midCount = 0;
    let trebleSum = 0, trebleCount = 0;
    let totalSum = 0;

    for (let i = 0; i < binCount; i++) {
      const val = this.frequencyData[i] / 255;
      const freq = i * hzPerBin;
      totalSum += val;

      if (freq >= 20 && freq <= 150) {
        bassSum += val;
        bassCount++;
      } else if (freq > 150 && freq <= 2500) {
        midSum += val;
        midCount++;
      } else if (freq > 2500 && freq <= 16000) {
        trebleSum += val;
        trebleCount++;
      }
    }

    const rawBass = bassCount > 0 ? (bassSum / bassCount) * bassSensitivity : 0;
    const rawMid = midCount > 0 ? (midSum / midCount) * audioSensitivity : 0;
    const rawTreble = trebleCount > 0 ? (trebleSum / trebleCount) * audioSensitivity : 0;
    const rawOverall = (totalSum / binCount) * audioSensitivity;

    // Smooth bands
    this.bands.bass = Math.min(1.0, rawBass);
    this.bands.mid = Math.min(1.0, rawMid);
    this.bands.treble = Math.min(1.0, rawTreble);
    this.bands.overall = Math.min(1.0, rawOverall);

    // Dynamic Beat Detection on Bass Energy
    const currentBass = this.bands.bass;
    this.isBeat = false;

    if (currentBass > this.beatCutoff && currentBass > this.beatThreshold) {
      this.isBeat = true;
      this.beatCutoff = currentBass * 1.15;
      this.beatEnergyHold = 1.0;
      this.beatIntensity = currentBass;
    } else {
      this.beatCutoff *= this.beatDecay;
      this.beatCutoff = Math.max(this.beatCutoff, this.beatThreshold);
      this.beatEnergyHold *= 0.88;
      this.beatIntensity = this.beatEnergyHold;
    }

    return {
      frequencyData: this.frequencyData,
      timeDomainData: this.timeDomainData,
      bands: this.bands,
      isBeat: this.isBeat,
      beatIntensity: this.beatIntensity
    };
  }

  // Event dispatcher
  on(event, cb) {
    this.listeners.add({ event, cb });
  }

  notify(event, data) {
    for (const item of this.listeners) {
      if (item.event === event) {
        try {
          item.cb(data);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}

export const audioEngine = new AudioEngine();
