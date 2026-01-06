import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Battery, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TASK_TEMPLATES, getCategoriesForContext, getTemplatesByContextAndCategory } from '@/lib/taskTemplates';

interface QuickTaskSelectorProps {
  context: 'nest' | 'grind' | 'self';
  onSelectTask: (taskId: string, taskTitle: string) => void;
}

type EnergyLevel = 'quick' | 'medium' | 'deep';

export default function QuickTaskSelector({
  context,
  onSelectTask
}: QuickTaskSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>('quick');

  const categories = getCategoriesForContext(context);
  const energyLevels: Record<EnergyLevel, { label: string; icon: string; minutes: number[] }> = {
    quick: { label: '⚡ Quick (2 min)', icon: '⚡', minutes: [1, 2] },
    medium: { label: '🔋 Medium (5 min)', icon: '🔋', minutes: [3, 4, 5] },
    deep: { label: '🎯 Deep (10+ min)', icon: '🎯', minutes: [8, 10, 15, 20] }
  };

  // Get tasks for selected category and energy level
  let filteredTasks: typeof TASK_TEMPLATES[keyof typeof TASK_TEMPLATES] = [];
  if (selectedCategory) {
    const categoryTasks = getTemplatesByContextAndCategory(context, selectedCategory);
    const energyMinutes = energyLevels[selectedEnergy].minutes;
    filteredTasks = categoryTasks.filter(task => 
      energyMinutes.includes(task.estimatedMinutes)
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      {!selectedCategory ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Pick a category:</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="p-3 rounded-lg border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="font-medium text-sm">{category}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to categories
          </Button>

          {/* Energy Level Selector */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">How much energy do you have?</h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(energyLevels) as [EnergyLevel, typeof energyLevels[EnergyLevel]][]).map(([level, config]) => (
                <Button
                  key={level}
                  onClick={() => setSelectedEnergy(level)}
                  variant={selectedEnergy === level ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {config.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${selectedEnergy}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.button
                    key={task.id}
                    onClick={() => onSelectTask(task.id, task.title)}
                    className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.icon} {task.title}</p>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-600">{task.estimatedMinutes}m</span>
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">No tasks available for this energy level</p>
                  <p className="text-xs mt-2">Try a different energy level!</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Energy Level Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>💡 Tip:</strong> Pick tasks based on how much energy and focus you have right now. There's no "wrong" choice!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
