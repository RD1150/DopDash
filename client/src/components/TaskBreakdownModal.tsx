import { motion, AnimatePresence } from 'framer-motion';
import { useStore, SubTask } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { soundManager } from '@/lib/sound';

interface TaskBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskText: string;
}

export default function TaskBreakdownModal({
  isOpen,
  onClose,
  taskId,
  taskText,
}: TaskBreakdownModalProps) {
  const [subtasks, setSubtasks] = useState<SubTask[]>([
    { id: '1', text: 'Start the task', completed: false },
    { id: '2', text: 'Do the thing', completed: false },
    { id: '3', text: 'Finish up', completed: false },
  ]);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const addSubtasks = useStore((state) => state.addSubtasks);
  const toggleSubtask = useStore((state) => state.toggleSubtask);
  const setExpandedTask = useStore((state) => state.setExpandedTask);

  const handleAddSubtask = () => {
    if (newSubtaskText.trim()) {
      const newSubtask: SubTask = {
        id: `subtask-${Date.now()}`,
        text: newSubtaskText.trim(),
        completed: false,
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskText('');
      soundManager.playPop();
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    toggleSubtask(taskId, subtaskId);
    setSubtasks(
      subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    );
    soundManager.playPop();
  };

  const handleSave = () => {
    addSubtasks(taskId, subtasks);
    setExpandedTask(taskId);
    soundManager.playSuccess();
    onClose();
  };

  const completedCount = subtasks.filter((st) => st.completed).length;
  const progress = Math.round((completedCount / subtasks.length) * 100);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background border border-border rounded-2xl p-6 max-w-md w-full shadow-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground mb-1">Break it down</h2>
            <p className="text-sm text-muted-foreground">{taskText}</p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground">Progress</span>
              <span className="text-xs font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          {/* Subtasks List */}
          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            {subtasks.map((subtask) => (
              <motion.button
                key={subtask.id}
                whileHover={{ x: 4 }}
                onClick={() => handleToggleSubtask(subtask.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  subtask.completed
                    ? 'bg-green-100/50 dark:bg-green-900/20'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    subtask.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-muted-foreground'
                  }`}
                >
                  {subtask.completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={`text-sm flex-1 text-left ${
                    subtask.completed
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {subtask.text}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Add New Subtask */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a step..."
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSubtask();
              }}
              className="text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddSubtask}
              className="px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Start with breakdown
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
