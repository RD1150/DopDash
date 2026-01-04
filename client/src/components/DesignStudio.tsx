import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shuffle, Palette, Shapes, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { soundManager } from '@/lib/sound';
import canvasConfetti from 'canvas-confetti';

interface DesignStudioProps {
  onClose: () => void;
}

export type AccessoryBase = 'cap' | 'badge' | 'orb';
export type AccessoryColor = 'sage' | 'periwinkle' | 'sand' | 'gold';
export type AccessorySymbol = 'star' | 'heart' | 'bolt';

export interface CustomAccessory {
  id: string;
  name: string;
  base: AccessoryBase;
  color: AccessoryColor;
  symbol: AccessorySymbol;
}

export default function DesignStudio({ onClose }: DesignStudioProps) {
  const [base, setBase] = useState<AccessoryBase>('cap');
  const [color, setColor] = useState<AccessoryColor>('sage');
  const [symbol, setSymbol] = useState<AccessorySymbol>('star');
  const [name, setName] = useState('');
  const setCustomAccessory = useStore(state => state.setCustomAccessory);

  const BASES: { id: AccessoryBase; label: string; icon: any }[] = [
    { id: 'cap', label: 'Cap', icon: Shapes },
    { id: 'badge', label: 'Badge', icon: Star },
    { id: 'orb', label: 'Orb', icon: Sparkles },
  ];

  const COLORS: { id: AccessoryColor; label: string; hex: string }[] = [
    { id: 'sage', label: 'Sage', hex: '#A8B5A0' },
    { id: 'periwinkle', label: 'Periwinkle', hex: '#B4C5E4' },
    { id: 'sand', label: 'Sand', hex: '#D4C5B0' },
    { id: 'gold', label: 'Gold', hex: '#FFD700' },
  ];

  const SYMBOLS: { id: AccessorySymbol; label: string; icon: string }[] = [
    { id: 'star', label: 'Star', icon: '⭐' },
    { id: 'heart', label: 'Heart', icon: '❤️' },
    { id: 'bolt', label: 'Bolt', icon: '⚡' },
  ];

  const randomize = () => {
    const randomBase = BASES[Math.floor(Math.random() * BASES.length)].id;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)].id;
    const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id;
    
    setBase(randomBase);
    setColor(randomColor);
    setSymbol(randomSymbol);
    soundManager.playPop();
  };

  const saveDesign = () => {
    const newAccessory: CustomAccessory = {
      id: `custom-${Date.now()}`,
      name: name || `My ${base}`,
      base,
      color,
      symbol
    };
    
    setCustomAccessory(newAccessory);
    soundManager.playSuccess();
    
    canvasConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border-2 border-primary/20 rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Design Studio</h2>
          <p className="text-muted-foreground text-sm">Create your unique accessory!</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 px-2">
          {/* Preview Area */}
          <div className="bg-secondary/30 rounded-2xl p-8 flex items-center justify-center relative h-48">
            <div className="relative w-32 h-32">
              {/* Mock Mascot Head */}
              <div className="w-full h-full bg-white rounded-full opacity-20 absolute inset-0" />
              
              {/* Accessory Preview */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-300"
                style={{ 
                  filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.1))`
                }}
              >
                {/* Base Shape */}
                <div 
                  className="w-24 h-24 flex items-center justify-center transition-colors duration-300"
                  style={{ 
                    backgroundColor: COLORS.find(c => c.id === color)?.hex,
                    borderRadius: base === 'cap' ? '20px 20px 0 0' : base === 'badge' ? '50%' : '50%',
                    clipPath: base === 'badge' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : undefined,
                    boxShadow: base === 'orb' ? '0 0 20px currentColor' : undefined
                  }}
                >
                  <span className="text-4xl filter drop-shadow-md">
                    {SYMBOLS.find(s => s.id === symbol)?.icon}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Base Selector */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Base Shape</label>
              <div className="flex gap-2">
                {BASES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBase(b.id)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      base === b.id 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-transparent bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <b.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{b.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Color</label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`flex-1 h-12 rounded-xl border-2 transition-all relative ${
                      color === c.id ? 'border-primary scale-105' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.id && (
                      <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Symbol Selector */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Symbol</label>
              <div className="flex gap-2">
                {SYMBOLS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSymbol(s.id)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all text-2xl ${
                      symbol === s.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-transparent bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-2 border-t flex gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={randomize}
            className="shrink-0"
            title="Randomize"
          >
            <Shuffle className="w-5 h-5" />
          </Button>
          <Button 
            className="flex-1 font-bold text-lg" 
            onClick={saveDesign}
          >
            Save & Wear
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}
