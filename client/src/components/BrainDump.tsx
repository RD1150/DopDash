import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BrainDumpProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrainDump({ isOpen, onClose }: BrainDumpProps) {
  const [content, setContent] = useState('');

  // Load saved dump
  useEffect(() => {
    const saved = localStorage.getItem('brain-dump');
    if (saved) setContent(saved);
  }, []);

  // Auto-save
  useEffect(() => {
    localStorage.setItem('brain-dump', content);
  }, [content]);

  const clearDump = () => {
    if (confirm('Clear your mind (and this text)?')) {
      setContent('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col p-6 sm:p-12"
      >
        <div className="max-w-2xl w-full mx-auto flex flex-col h-full gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Brain Dump</h2>
              <p className="text-muted-foreground">Get it out of your head so you can focus.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type everything that's cluttering your mind..."
            className="flex-1 resize-none text-lg p-6 bg-card border-none shadow-inner focus-visible:ring-1"
            autoFocus
          />

          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={clearDump}
              className="text-muted-foreground hover:text-destructive gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
            <Button onClick={onClose}>
              <Save className="w-4 h-4 mr-2" />
              Done for now
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
