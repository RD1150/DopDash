import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Battery, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TASK_TEMPLATES } from '@/lib/taskTemplates';

interface MoodState {
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 'low' | 'medium' | 'high';
  motivation: 'low' | 'medium' | 'high';
}

interface SmartTaskSuggestionsProps {
  currentMood?: MoodState;
  onSelectTask?: (taskId: string) => void;
}

export default function SmartTaskSuggestions({
  currentMood = { mood: 3, energy: 'medium', motivation: 'medium' },
  onSelectTask
}: SmartTaskSuggestionsProps) {
  const [mood, setMood] = useState<MoodState>(currentMood);
  const [showReasoning, setShowReasoning] = useState(false);

  // Smart recommendation algorithm
  const suggestedTasks = useMemo(() => {
    const allTasks = [...TASK_TEMPLATES.nest, ...TASK_TEMPLATES.grind, ...TASK_TEMPLATES.self];
    
    // Filter based on mood and energy
    let filtered = allTasks.filter(task => {
      // Low energy: only easy tasks, 2-5 minutes
      if (mood.energy === 'low') {
        return task.difficulty === 'easy' && task.estimatedMinutes <= 5;
      }
      
      // Medium energy: easy to medium tasks, 5-15 minutes
      if (mood.energy === 'medium') {
        return (task.difficulty === 'easy' || task.difficulty === 'medium') && 
               task.estimatedMinutes <= 15;
      }
      
      // High energy: all difficulties, any time
      return true;
    });

    // Boost motivation with context-specific tasks
    if (mood.motivation === 'low') {
      // Prioritize quick wins and self-care
      const quickWins = filtered.filter(t => t.context === 'self' || t.estimatedMinutes <= 5);
      return quickWins.slice(0, 3);
    }

    if (mood.motivation === 'medium') {
      // Mix of easy and medium
      const mixed = filtered.filter(t => t.difficulty !== 'hard');
      return mixed.slice(0, 3);
    }

    // High motivation: show challenging tasks
    return filtered.slice(0, 3);
  }, [mood]);

  // Get reasoning for suggestions
  const getReasoning = (): string => {
    const energyText = mood.energy === 'low' ? 'low energy' : mood.energy === 'high' ? 'high energy' : 'medium energy';
    const moodText = mood.mood <= 2 ? 'not feeling great' : mood.mood === 3 ? 'neutral' : 'feeling good';
    const motivationText = mood.motivation === 'low' ? 'low motivation' : mood.motivation === 'high' ? 'high motivation' : 'medium motivation';
    
    return `Based on your ${energyText}, ${moodText} mood, and ${motivationText}, I'm suggesting ${suggestedTasks.length} tasks that match your current state. These should feel achievable and rewarding!`;
  };

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold">Smart Task Suggestions</h2>
        </div>
        <p className="text-gray-600">Tell me how you're feeling, and I'll suggest the perfect tasks for right now.</p>
      </div>

      {/* Mood Assessment */}
      <motion.div
        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-bold text-lg">How are you feeling right now?</h3>

        {/* Mood Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Mood
            </label>
            <span className="text-2xl">{moodEmojis[mood.mood - 1]}</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                onClick={() => setMood({ ...mood, mood: value as 1 | 2 | 3 | 4 | 5 })}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  mood.mood === value
                    ? 'bg-purple-500 text-white scale-105'
                    : 'bg-white border-2 border-purple-200 text-gray-600 hover:border-purple-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {value}
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-gray-600">1 = Struggling, 5 = Thriving</p>
        </div>

        {/* Energy Level */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Energy Level
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <motion.button
                key={level}
                onClick={() => setMood({ ...mood, energy: level })}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  mood.energy === level
                    ? 'bg-yellow-500 text-white scale-105'
                    : 'bg-white border-2 border-yellow-200 text-gray-600 hover:border-yellow-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Motivation
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <motion.button
                key={level}
                onClick={() => setMood({ ...mood, motivation: level })}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  mood.motivation === level
                    ? 'bg-green-500 text-white scale-105'
                    : 'bg-white border-2 border-green-200 text-gray-600 hover:border-green-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Reasoning */}
      <motion.div
        className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <p className="text-sm text-blue-900">
          <strong>💡 Why these tasks?</strong> {getReasoning()}
        </p>
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="text-xs text-blue-600 hover:underline mt-2"
        >
          {showReasoning ? 'Hide' : 'Show'} detailed reasoning
        </button>
      </motion.div>

      {/* Suggested Tasks */}
      <div>
        <h3 className="font-bold text-lg mb-3">Recommended for you:</h3>
        <AnimatePresence mode="wait">
          {suggestedTasks.length > 0 ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {suggestedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">
                        {task.icon} {task.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap ml-2">
                      {task.estimatedMinutes}m
                    </span>
                  </div>

                  {/* Why this task */}
                  <div className="bg-green-50 border-l-2 border-green-500 pl-2 py-1 mb-3 text-xs text-green-700">
                    ✓ Perfect for your current {mood.energy} energy level
                  </div>

                  <Button
                    onClick={() => onSelectTask?.(task.id)}
                    size="sm"
                    className="w-full"
                  >
                    Start Task
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-gray-600"
            >
              <p>No tasks match your current state. Try adjusting your mood or energy level!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tips */}
      <motion.div
        className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm font-semibold text-amber-900 mb-2">💡 Pro Tips:</p>
        <ul className="text-xs text-amber-800 space-y-1">
          <li>✓ Low energy? Pick quick wins to build momentum</li>
          <li>✓ High motivation? Challenge yourself with harder tasks</li>
          <li>✓ Update your mood anytime to get new suggestions</li>
        </ul>
      </motion.div>
    </div>
  );
}
