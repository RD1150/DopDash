/**
 * Gentle completion sound for Home Tasks mode
 * Uses Web Audio API to create a simple, non-intrusive chime
 */

export const playCompletionSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a simple two-note chime
    const now = audioContext.currentTime;
    
    // First note (higher pitch)
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    
    osc1.frequency.value = 800; // Hz
    osc1.type = 'sine';
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc1.start(now);
    osc1.stop(now + 0.3);
    
    // Second note (lower pitch, slightly delayed)
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    
    osc2.frequency.value = 1000; // Hz
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.3, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio context not available for completion sound');
  }
};

/**
 * Alternative: Use a pre-recorded sound file if available
 * This would be more polished but requires hosting an audio file
 */
export const playCompletionSoundFromFile = async (soundUrl: string) => {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.3; // Keep it gentle
    await audio.play();
  } catch (error) {
    console.debug('Could not play completion sound:', error);
  }
};
