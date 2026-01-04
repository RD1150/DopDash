// Using Web Audio API for procedural sound generation
// This avoids external dependencies and ensures sounds work immediately

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientNodes: { [key: string]: AudioNode[] } = {};
  private currentAmbient: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playPop() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSquish() {
    if (!this.ctx) return;
    // Squish is a bit more complex, maybe a low frequency noise or filtered saw
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playCombo(count: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Pentatonic scale: C4, D4, E4, G4, A4, C5...
    const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    // Clamp to available notes
    const noteIndex = Math.min(count - 1, baseFreqs.length - 1);
    const freq = baseFreqs[noteIndex];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'triangle'; // Brighter sound for combos
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.1); // Slide up slightly
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playSuccess() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Arpeggio
    [440, 554, 659].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  stopAmbient() {
    if (!this.ctx || !this.currentAmbient) return;
    
    const nodes = this.ambientNodes[this.currentAmbient];
    if (nodes) {
      nodes.forEach(node => {
        try {
          if (node instanceof AudioScheduledSourceNode) {
            node.stop();
          }
          node.disconnect();
        } catch (e) {
          // Ignore errors if already stopped
        }
      });
    }
    
    delete this.ambientNodes[this.currentAmbient];
    this.currentAmbient = null;
  }

  playAmbient(type: 'white_noise' | 'rain' | 'forest') {
    if (!this.ctx) return;
    
    // Stop current if any
    if (this.currentAmbient) {
      this.stopAmbient();
    }
    
    this.currentAmbient = type;
    const nodes: AudioNode[] = [];
    
    try {
      if (type === 'white_noise') {
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const gain = this.ctx.createGain();
        gain.gain.value = 0.05;
        
        noise.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
        
        nodes.push(noise, gain);
      } 
      else if (type === 'rain') {
        // Pink noise approximation for rain
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // (roughly) compensate for gain
          b6 = white * 0.115926;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const gain = this.ctx.createGain();
        gain.gain.value = 0.15;
        
        // Lowpass filter to make it sound more like heavy rain
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
        
        nodes.push(noise, filter, gain);
      }
      else if (type === 'forest') {
        // Wind (filtered noise)
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        const gain = this.ctx.createGain();
        gain.gain.value = 0.08;
        
        // Modulate gain for wind effect
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // Slow wind
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.05;
        
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        noise.start();
        lfo.start();
        
        nodes.push(noise, filter, gain, lfo, lfoGain);
      }
      
      this.ambientNodes[type] = nodes;
    } catch (e) {
      console.error("Failed to play ambient sound", e);
    }
  }
}

export const soundManager = new SoundManager();
