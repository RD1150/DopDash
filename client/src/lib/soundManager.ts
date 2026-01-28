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
    this.playLightCheer();
  }

  playSquish() {
    this.playPop();
  }

  playLightCheer() {
    try {
      // Create a light, celebratory cheer sound using Web Audio API
      if (!this.audioContext) {
        this.initAudioContext();
      }
      if (!this.audioContext) return;

      const ctx = this.audioContext;
      const now = ctx.currentTime;

      // Create three ascending notes for a cheerful effect
      const notes = [
        { freq: 800, start: 0, duration: 0.1 },
        { freq: 1000, start: 0.08, duration: 0.12 },
        { freq: 1200, start: 0.16, duration: 0.15 }
      ];

      notes.forEach(note => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.start);
        osc.frequency.exponentialRampToValueAtTime(note.freq * 1.2, now + note.start + note.duration * 0.7);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, now + note.start);
        gain.gain.exponentialRampToValueAtTime(0.02, now + note.start + note.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + note.start);
        osc.stop(now + note.start + note.duration);
      });
    } catch (error) {
      console.error('Error playing light cheer sound:', error);
    }
  }
}

export const soundManager = new SoundManager();
