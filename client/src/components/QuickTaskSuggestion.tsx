import { motion } from 'framer-motion';
import { getRandomTemplate } from '@/lib/taskTemplates';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { useState } from 'react';

export default function QuickTaskSuggestion() {
  const context = useStore((state) => state.context);
  const addAction = useStore((state) => state.addAction);
  const [suggestedTask, setSuggestedTask] = useState(() => {
    if (context) {
      const contextMap: Record<string, 'nest' | 'grind' | 'self'> = {
        'The Nest': 'nest',
        'The Grind': 'grind',
        'The Self': 'self'
      };
      return getRandomTemplate(contextMap[context] || 'nest');
    }
    return null;
  });

  const handleRefresh = () => {
    if (context) {
      const contextMap: Record<string, 'nest' | 'grind' | 'self'> = {
        'The Nest': 'nest',
        'The Grind': 'grind',
        'The Self': 'self'
      };
      const newTask = getRandomTemplate(contextMap[context] || 'nest');
      setSuggestedTask(newTask);
    }
  };

  const handleAddTask = () => {
    if (suggestedTask) {
      addAction(suggestedTask.title);
      // Show a quick toast or feedback
      handleRefresh();
    }
  };

  if (!suggestedTask) return null;

  return (
    <motion.div
      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Quick Suggestion</p>
          <p className="text-lg font-bold text-gray-800 mt-1 flex items-center gap-2">
            <span className="text-2xl">{suggestedTask.icon}</span>
            {suggestedTask.title}
          </p>
          {suggestedTask.description && (
            <p className="text-sm text-gray-600 mt-1">{suggestedTask.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            ⏱️ ~{suggestedTask.estimatedMinutes} min • {suggestedTask.difficulty}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={handleRefresh}
            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            title="Get another suggestion"
          >
            <RefreshCw className="w-5 h-5 text-green-600" />
          </motion.button>
          <Button
            onClick={handleAddTask}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
