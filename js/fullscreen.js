/* ==========================================================================
   VYBE-X — Ultimate Music Visualizer
   Fullscreen & Immersion Manager (Auto-hide HUD, gestures & keyboard shortcuts)
   Creator: Shiv Yogi
   ========================================================================== */

class FullscreenManager {
  constructor() {
    this.inactivityTimeout = null;
    this.inactivityDelay = 3000;
    this.isHudHidden = false;
    this.listeners = new Set();

    this.initEvents();
  }

  initEvents() {
    // Standard fullscreen change listener
    const onFsChange = () => {
      const isFs = this.isFullscreen();
      document.body.classList.toggle('fullscreen-active', isFs);
      if (!isFs) {
        this.showHud();
      }
      this.notify(isFs);
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('mozfullscreenchange', onFsChange);
    document.addEventListener('MSFullscreenChange', onFsChange);

    // Inactivity detection for clean immersion
    const resetTimer = () => {
      this.showHud();
      if (document.body.classList.contains('fullscreen-active') || document.body.classList.contains('party-mode-active')) {
        clearTimeout(this.inactivityTimeout);
        this.inactivityTimeout = setTimeout(() => {
          this.hideHud();
        }, this.inactivityDelay);
      }
    };

    window.addEventListener('mousemove', resetTimer, { passive: true });
    window.addEventListener('touchstart', resetTimer, { passive: true });
    window.addEventListener('keydown', resetTimer, { passive: true });
  }

  isFullscreen() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  async toggleFullscreen() {
    try {
      if (!this.isFullscreen()) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('[VYBE-X Fullscreen] Error toggling fullscreen:', err);
    }
  }

  hideHud() {
    this.isHudHidden = true;
    document.body.classList.add('fullscreen-clean');
  }

  showHud() {
    this.isHudHidden = false;
    document.body.classList.remove('fullscreen-clean');
  }

  onFullscreenChange(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  notify(isFs) {
    for (const cb of this.listeners) {
      try {
        cb(isFs);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export const fullscreenManager = new FullscreenManager();
