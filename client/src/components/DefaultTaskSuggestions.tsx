import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_TASKS = [
  "Stand up and stretch for 30 seconds",
  "Take 3 slow breaths",
  "Put one item away",
  "Open the document you're avoiding",
  "Drink a glass of water",
  "Step outside for 10 seconds",
  "Text one person something kind",
  "Write down one thing you're proud of",
];

interface DefaultTaskSuggestionsProps {
  onSelectTask: (task: string) => void;
}

export default function DefaultTaskSuggestions({ onSelectTask }: DefaultTaskSuggestionsProps) {
  const [currentTask, setCurrentTask] = useState('');
  const [taskIndex, setTaskIndex] = useState(0);

  useEffect(() => {
    // Pick a random task on mount
    const randomIndex = Math.floor(Math.random() * DEFAULT_TASKS.length);
    setTaskIndex(randomIndex);
    setCurrentTask(DEFAULT_TASKS[randomIndex]);
  }, []);

  const handleRotateTask = () => {
    const newIndex = (taskIndex + 1) % DEFAULT_TASKS.length;
    setTaskIndex(newIndex);
    setCurrentTask(DEFAULT_TASKS[newIndex]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="w-full bg-card border border-border rounded-lg p-6 mb-6"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Start with this
      </p>
      <motion.div
        key={currentTask}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4"
      >
        <p className="text-lg font-semibold text-foreground">{currentTask}</p>
      </motion.div>
      <div className="flex gap-3">
        <button
          onClick={handleRotateTask}
          className="flex-1 px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 transition-colors font-medium text-sm"
        >
          Try another
        </button>
        <button
          onClick={() => onSelectTask(currentTask)}
          className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-md"
        >
          Start this
        </button>
      </div>
    </motion.div>
  );
}
