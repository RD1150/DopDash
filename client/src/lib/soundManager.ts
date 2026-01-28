/**
 * Sound manager for playing celebratory sounds during task completion
 */

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      document.addEventListener('click', () => this.initAudioContext(), { once: true });
    }
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private getAudio(soundName: string): HTMLAudioElement {
    if (!this.sounds.has(soundName)) {
      const audio = new Audio(`/sounds/${soundName}.wav`);
      audio.volume = 0.7;
      this.sounds.set(soundName, audio);
    }
    return this.sounds.get(soundName)!;
  }

  playDing() {
    try {
      const audio = this.getAudio('ding');
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Silently fail if audio can't play (muted, etc)
      });
    } catch (error) {
      console.error('Error playing ding sound:', error);
    }
  }

  playPop() {
    try {
      const audio = this.getAudio('pop');
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Silently fail if audio can't play (muted, etc)
      });
    } catch (error) {
      console.error('Error playing pop sound:', error);
    }
  }

  playLevelUp() {
    try {
      const audio = this.getAudio('levelup');
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Silently fail if audio can't play (muted, etc)
      });
    } catch (error) {
      console.error('Error playing level up sound:', error);
    }
  }

  // Play a sequence of sounds for maximum dopamine hit
  playCompletionSequence() {
    this.playPop();
    setTimeout(() => this.playDing(), 100);
    setTimeout(() => this.playLevelUp(), 300);
  }

  // Alias methods for compatibility
  playCombo(count: number) {
    this.playDing();
  }

  playCompletion() {
    this.playLevelUp();
  }

  playSuccess() {
    this.playSubtleCompletion();
  }

  playSquish() {
    this.playPop();
  }

  playSubtleCompletion() {
    try {
      // Create a subtle, quiet confirmation tone (like a soft period at end of sentence)
      // Under 0.5 seconds, barely noticeable, no celebration
      if (!this.audioContext) {
        this.initAudioContext();
      }
      if (!this.audioContext) return;

      const ctx = this.audioContext;
      const now = ctx.currentTime;
      const duration = 0.25; // Very short - under 0.5s requirement

      // Single, simple sine wave - quiet confirmation tone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now); // Mid-range frequency
      osc.frequency.exponentialRampToValueAtTime(550, now + duration); // Slight downward glide

      // Very subtle volume - barely audible
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now); // Very quiet
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Fade out

      // Connect and play
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (error) {
      console.error('Error playing subtle completion sound:', error);
    }
  }
}

export const soundManager = new SoundManager();
