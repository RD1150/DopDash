import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { soundManager } from '@/lib/sound';

export default function Someday() {
  const [, setLocation] = useLocation();
  const archivedTasks = useStore((state) => state.archivedTasks);
  const restoreArchivedTask = useStore((state) => state.restoreArchivedTask);

  const handleRestore = (taskId: string) => {
    restoreArchivedTask(taskId);
    soundManager.playPop();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation('/dash')}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Someday</h1>
        </div>

        {/* Empty State */}
        {archivedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-lg text-muted-foreground mb-2">No archived tasks yet</p>
            <p className="text-sm text-muted-foreground">Tasks you archive will appear here</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground mb-4">
              {archivedTasks.length} {archivedTasks.length === 1 ? 'task' : 'tasks'} waiting for later
            </p>
            <AnimatePresence>
              {archivedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{task.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.category === 'focus' && '🎯 Focus'}
                      {task.category === 'energy' && '⚡ Energy'}
                      {task.category === 'momentum' && '🚀 Momentum'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestore(task.id)}
                    className="p-2 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                    title="Move back to today"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
