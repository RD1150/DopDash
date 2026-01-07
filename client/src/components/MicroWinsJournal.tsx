import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface MicroWinsJournalProps {
  taskId: string;
  taskName: string;
  onComplete?: () => void;
}

export default function MicroWinsJournal({ taskId, taskName, onComplete }: MicroWinsJournalProps) {
  const [entry, setEntry] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const addMicroWinJournalEntry = useStore((state) => state.addMicroWinJournalEntry);
  const microWinsJournal = useStore((state) => state.microWinsJournal);

  const handleSave = () => {
    if (entry.trim()) {
      addMicroWinJournalEntry(taskId, entry);
      toast.success('Proof saved! 📝');
      setEntry('');
      setIsOpen(false);
      onComplete?.();
    }
  };

  const weeklyEntries = microWinsJournal.filter((e) => {
    const entryDate = new Date(e.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate > weekAgo;
  });

  return (
    <div className="space-y-4">
      {/* Journal Prompt */}
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">What did you just accomplish?</p>
            <p className="text-xs text-muted-foreground">
              Write 1-2 sentences. This is proof you did it. (Imposter syndrome, be gone!)
            </p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="w-full gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Record Your Win
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-4 bg-secondary/50 rounded-lg"
        >
          <p className="text-sm font-medium">You completed: {taskName}</p>
          <Textarea
            placeholder="What did you do? How did it go? Any wins?"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="min-h-20"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!entry.trim()}
            >
              Save to Journal
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                setEntry('');
              }}
              variant="outline"
              className="flex-1"
            >
              Skip
            </Button>
          </div>
        </motion.div>
      )}

      {/* Weekly Proof */}
      {weeklyEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Heart className="w-3 h-3 inline mr-1" />
            Your Proof This Week
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {weeklyEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-2 bg-background border border-border rounded text-xs"
              >
                <p className="text-muted-foreground line-clamp-2">{entry.entry}</p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {weeklyEntries.length} wins documented. You did that. 💪
          </p>
        </motion.div>
      )}
    </div>
  );
}
