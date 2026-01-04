import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '@/lib/sound';
import { Slider } from '@/components/ui/slider';
import { X, CloudRain, Trees, Waves, Coffee, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoundMixerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoundMixer({ isOpen, onClose }: SoundMixerProps) {
  const [volumes, setVolumes] = useState({
    rain: 0,
    forest: 0,
    white_noise: 0,
    cafe: 0
  });

  const handleVolumeChange = (type: 'rain' | 'forest' | 'white_noise' | 'cafe', value: number) => {
    setVolumes(prev => ({ ...prev, [type]: value }));
    if (value > 0) {
      soundManager.playAmbient(type, value);
    } else {
      soundManager.stopAmbient(type);
    }
  };

  // Stop all sounds when closing if they were just for preview? 
  // No, let them persist so user can focus!

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-24 right-4 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2 font-medium">
            <Volume2 className="w-4 h-4 text-primary" />
            <h3>Focus Mixer</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Rain */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CloudRain className="w-4 h-4" />
                <span>Rain</span>
              </div>
              <span className="text-xs font-mono">{Math.round(volumes.rain * 100)}%</span>
            </div>
            <Slider
              value={[volumes.rain]}
              max={1}
              step={0.01}
              onValueChange={([v]) => handleVolumeChange('rain', v)}
              className="cursor-pointer"
            />
          </div>

          {/* Forest */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Trees className="w-4 h-4" />
                <span>Forest</span>
              </div>
              <span className="text-xs font-mono">{Math.round(volumes.forest * 100)}%</span>
            </div>
            <Slider
              value={[volumes.forest]}
              max={1}
              step={0.01}
              onValueChange={([v]) => handleVolumeChange('forest', v)}
              className="cursor-pointer"
            />
          </div>

          {/* White Noise */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Waves className="w-4 h-4" />
                <span>White Noise</span>
              </div>
              <span className="text-xs font-mono">{Math.round(volumes.white_noise * 100)}%</span>
            </div>
            <Slider
              value={[volumes.white_noise]}
              max={1}
              step={0.01}
              onValueChange={([v]) => handleVolumeChange('white_noise', v)}
              className="cursor-pointer"
            />
          </div>

          {/* Cafe */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coffee className="w-4 h-4" />
                <span>Cafe</span>
              </div>
              <span className="text-xs font-mono">{Math.round(volumes.cafe * 100)}%</span>
            </div>
            <Slider
              value={[volumes.cafe]}
              max={1}
              step={0.01}
              onValueChange={([v]) => handleVolumeChange('cafe', v)}
              className="cursor-pointer"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
