import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TASK_TEMPLATES } from '@/lib/taskTemplates';

interface QuickTaskSelectorProps {
  context: 'nest' | 'grind' | 'self';
  onSelectTask: (taskId: string, taskTitle: string) => void;
}

type EnergyLevel = 'quick' | 'medium' | 'deep';

export default function QuickTaskSelector({
  context,
  onSelectTask
}: QuickTaskSelectorProps) {
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>('quick');

  const energyLevels: Record<EnergyLevel, { label: string; icon: string; minutes: number[] }> = {
    quick: { label: '⚡ Quick (2 min)', icon: '⚡', minutes: [2] },
    medium: { label: '🔋 Medium (5 min)', icon: '🔋', minutes: [5] },
    deep: { label: '🎯 Deep (10 min)', icon: '🎯', minutes: [10] }
  };

  const templates = TASK_TEMPLATES[context] || [];
  
  const filteredTasks = templates.filter(task => {
    const energyMinutes = energyLevels[selectedEnergy].minutes;
    return energyMinutes.includes(task.estimatedMinutes);
  });

  return (
    <div className="space-y-4">
      {/* Energy Level Selector */}
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

      {/* Task List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedEnergy}
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
                    <p className="font-medium text-sm">{task.title}</p>
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
    </div>
  );
}
