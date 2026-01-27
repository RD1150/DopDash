import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HOUSEHOLD_TASKS = [
  "Pick up 3 items from your room",
  "Put your books away",
  "Make your bed",
  "Wipe down the table",
  "Put dirty clothes in the hamper",
  "Organize your desk",
  "Sweep one corner",
  "Put dishes in the sink",
];

const SCHOOL_TASKS = [
  "Open your homework folder",
  "Read one page of your book",
  "Write down one thing you learned",
  "Organize your backpack",
  "Check your assignment list",
  "Write one sentence for your essay",
  "Do one math problem",
  "Review your notes for 2 minutes",
];

const ALL_HOME_TASKS = [...HOUSEHOLD_TASKS, ...SCHOOL_TASKS];

interface HomeTaskSuggestionsProps {
  onSelectTask: (task: string) => void;
}

export default function HomeTaskSuggestions({ onSelectTask }: HomeTaskSuggestionsProps) {
  const [currentTask, setCurrentTask] = useState('');
  const [taskIndex, setTaskIndex] = useState(0);

  useEffect(() => {
    // Pick a random task on mount
    const randomIndex = Math.floor(Math.random() * ALL_HOME_TASKS.length);
    setTaskIndex(randomIndex);
    setCurrentTask(ALL_HOME_TASKS[randomIndex]);
  }, []);

  const handleRotateTask = () => {
    const newIndex = (taskIndex + 1) % ALL_HOME_TASKS.length;
    setTaskIndex(newIndex);
    setCurrentTask(ALL_HOME_TASKS[newIndex]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="w-full bg-card border border-border rounded-lg p-6 mb-6"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Let's do this
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
