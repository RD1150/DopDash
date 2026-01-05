import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedMinutes?: number;
  completed?: boolean;
  onComplete?: (id: string) => void;
  onRateDifficulty?: (id: string, rating: 'easy' | 'medium' | 'hard') => void;
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

const DIFFICULTY_LABELS = {
  easy: '✨ Easy',
  medium: '⚡ Medium',
  hard: '🔥 Hard'
};

export default function TaskCard({
  id,
  title,
  description,
  difficulty,
  estimatedMinutes,
  completed = false,
  onComplete,
  onRateDifficulty
}: TaskCardProps) {
  const [showRating, setShowRating] = useState(false);

  const handleComplete = () => {
    onComplete?.(id);
    setShowRating(true);
  };

  const handleRateDifficulty = (rating: 'easy' | 'medium' | 'hard') => {
    onRateDifficulty?.(id, rating);
    setShowRating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-primary'
      }`}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h3 className={`font-semibold ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0"
          >
            <Check className="w-5 h-5 text-green-600" />
          </motion.div>
        )}
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Difficulty Tag */}
        {difficulty && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${DIFFICULTY_COLORS[difficulty]}`}>
            {DIFFICULTY_LABELS[difficulty]}
          </span>
        )}

        {/* Time Estimate */}
        {estimatedMinutes && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {estimatedMinutes} min
          </span>
        )}
      </div>

      {/* Action Buttons */}
      {!completed ? (
        <Button
          onClick={handleComplete}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          <Check className="w-4 h-4 mr-2" />
          Complete
        </Button>
      ) : showRating ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <p className="text-sm font-medium text-gray-700">How hard was this really?</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRateDifficulty('easy')}
              className="text-xs"
            >
              ✨ Easy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRateDifficulty('medium')}
              className="text-xs"
            >
              ⚡ Medium
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRateDifficulty('hard')}
              className="text-xs"
            >
              🔥 Hard
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="text-sm text-green-600 font-medium flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Great job! Keep it up!
        </div>
      )}
    </motion.div>
  );
}
