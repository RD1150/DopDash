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
    this.playDing();
  }

  playSquish() {
    this.playPop();
  }
}

export const soundManager = new SoundManager();
