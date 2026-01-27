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
    this.playLightOing();
  }

  playSquish() {
    this.playPop();
  }

  playLightOing() {
    try {
      // Create a lighter, softer oing sound using Web Audio API
      if (!this.audioContext) {
        this.initAudioContext();
      }
      if (!this.audioContext) return;

      const ctx = this.audioContext;
      const now = ctx.currentTime;
      const duration = 0.3; // Shorter, lighter duration

      // Create oscillator for the tone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now); // Higher pitch for lighter feel
      osc.frequency.exponentialRampToValueAtTime(600, now + duration);

      // Create gain for volume envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now); // Much quieter
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      // Connect and play
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (error) {
      console.error('Error playing light oing sound:', error);
    }
  }
}

export const soundManager = new SoundManager();
