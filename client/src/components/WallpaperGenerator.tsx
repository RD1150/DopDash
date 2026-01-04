import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import Mascot from '@/components/Mascot';
import html2canvas from 'html2canvas';
import { soundManager } from '@/lib/sound';

interface WallpaperGeneratorProps {
  onClose: () => void;
}

export default function WallpaperGenerator({ onClose }: WallpaperGeneratorProps) {
  const wallpaperRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const streak = useStore(state => state.streak);
  const flavor = useStore(state => state.flavor);
  
  const AFFIRMATIONS = [
    "Just start. That's enough.",
    "Small steps, big progress.",
    "You are doing great.",
    "Focus on the next step.",
    "Breathe. You got this.",
    "Progress over perfection.",
    "One thing at a time.",
    "Your best is enough."
  ];

  const randomAffirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];

  const handleDownload = async () => {
    if (!wallpaperRef.current) return;
    
    setIsGenerating(true);
    soundManager.playPop();

    try {
      const canvas = await html2canvas(wallpaperRef.current, {
        scale: 2, // High res
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `dopamine-dasher-wallpaper-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      soundManager.playSuccess();
    } catch (err) {
      console.error('Failed to generate wallpaper:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border-2 border-primary/20 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Wallpaper Widget</h2>
            <p className="text-xs text-muted-foreground">Set as your lock screen for daily motivation!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto flex justify-center bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4 mb-4">
          {/* Wallpaper Preview / Capture Area */}
          <div 
            ref={wallpaperRef}
            className="relative w-[280px] h-[600px] bg-[#F5F1E8] dark:bg-zinc-900 overflow-hidden shadow-2xl rounded-[30px] flex flex-col items-center justify-between py-20 text-center select-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 181, 160, 0.1) 0%, transparent 70%)'
            }}
          >
            {/* Top Section: Date & Time Placeholder (to show where system clock goes) */}
            <div className="absolute top-12 w-full opacity-30 text-4xl font-bold text-zinc-400">
              12:00
            </div>

            {/* Middle Section: Mascot & Streak */}
            <div className="flex flex-col items-center gap-6 mt-20">
              <div className="relative w-48 h-48">
                <Mascot pose={streak > 3 ? "jumping" : "hero"} className="w-full h-full" />
              </div>
              
              <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-primary/10">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Streak</div>
                <div className="text-4xl font-black text-primary flex items-center justify-center gap-2">
                  <span>🔥</span> {streak}
                </div>
              </div>
            </div>

            {/* Bottom Section: Affirmation */}
            <div className="px-8 pb-12">
              <p className="text-lg font-medium text-zinc-600 dark:text-zinc-300 italic">
                "{randomAffirmation}"
              </p>
            </div>

            {/* Branding */}
            <div className="absolute bottom-6 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
              Dopamine Dasher
            </div>
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full font-bold text-lg gap-2"
          onClick={handleDownload}
          disabled={isGenerating}
        >
          {isGenerating ? (
            'Generating...'
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download Wallpaper
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
