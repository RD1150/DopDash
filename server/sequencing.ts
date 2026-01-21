/**
 * Task Sequencing Algorithm
 * 
 * This module implements the ADHD-informed decision tree logic that sequences tasks
 * based on user's nervous system state, available time, and task activation energy.
 */

export type UserState = "squirrel" | "tired" | "focused" | "hurting";
export type ActivationEnergy = "micro" | "easy" | "medium" | "deep";
export type TimeAvailable = "15min" | "30min" | "1hour" | "2plus";

export interface Task {
  id: number;
  title: string;
  durationMinutes: number;
  activationEnergy: ActivationEnergy;
  recommendedState?: string;
  sequenceGroup?: string;
  sequenceOrder?: number;
}

export interface SequencedTask {
  taskId: number;
  title: string;
  order: number;
  estimatedDuration: number;
  reason: string; // Why this task was recommended
}

/**
 * Time allocation in minutes for each time bracket
 */
const TIME_BRACKETS: Record<TimeAvailable, number> = {
  "15min": 15,
  "30min": 30,
  "1hour": 60,
  "2plus": 120,
};

/**
 * Task sequencing strategy for each nervous system state
 * Defines the order of activation energy levels to prioritize
 */
const STATE_STRATEGIES: Record<UserState, {
  sequence: ActivationEnergy[];
  requiresWarmup: boolean;
  warmupDuration: number;
  warmupActivity: string;
}> = {
  squirrel: {
    // Overwhelmed: Start TINY, build momentum
    sequence: ["micro", "easy", "medium", "deep"],
    requiresWarmup: false,
    warmupDuration: 0,
    warmupActivity: "",
  },
  tired: {
    // Low energy: Movement first, then tasks
    sequence: ["easy", "medium", "deep"],
    requiresWarmup: true,
    warmupDuration: 5,
    warmupActivity: "Movement/Stretch (5 min)",
  },
  focused: {
    // Good energy: Can jump to deep work
    sequence: ["medium", "deep", "easy"],
    requiresWarmup: false,
    warmupDuration: 0,
    warmupActivity: "",
  },
  hurting: {
    // Pain/dysregulated: Rest first
    sequence: [],
    requiresWarmup: true,
    warmupDuration: 20,
    warmupActivity: "Rest Activity (Bath/Nap/Quiet time - 20 min)",
  },
};

/**
 * Main sequencing function
 * Takes user state, available time, and task list, returns optimized sequence
 */
export function sequenceTasks(
  userState: UserState,
  timeAvailable: TimeAvailable,
  tasks: Task[]
): SequencedTask[] {
  const strategy = STATE_STRATEGIES[userState];
  const totalTime = TIME_BRACKETS[timeAvailable];
  const sequenced: SequencedTask[] = [];
  let timeUsed = 0;
  let taskOrder = 1;

  // Handle special case: Hurting state needs rest first
  if (userState === "hurting") {
    sequenced.push({
      taskId: 0,
      title: strategy.warmupActivity,
      order: taskOrder++,
      estimatedDuration: strategy.warmupDuration,
      reason: "Nervous system regulation - rest is productive",
    });
    timeUsed += strategy.warmupDuration;

    // After rest, can only do gentle tasks if time remains
    if (timeUsed < totalTime) {
      const remainingTime = totalTime - timeUsed;
      const gentleTasks = tasks.filter(t => t.activationEnergy === "micro" || t.activationEnergy === "easy");
      
      for (const task of gentleTasks) {
        if (timeUsed + task.durationMinutes <= totalTime) {
          sequenced.push({
            taskId: task.id,
            title: task.title,
            order: taskOrder++,
            estimatedDuration: task.durationMinutes,
            reason: "Gentle re-engagement after rest",
          });
          timeUsed += task.durationMinutes;
        }
      }
    }

    return sequenced;
  }

  // Add warmup activity if needed (for Tired state)
  if (strategy.requiresWarmup) {
    sequenced.push({
      taskId: 0,
      title: strategy.warmupActivity,
      order: taskOrder++,
      estimatedDuration: strategy.warmupDuration,
      reason: "Nervous system activation - movement increases dopamine",
    });
    timeUsed += strategy.warmupDuration;
  }

  // Sequence tasks according to state strategy
  for (const energyLevel of strategy.sequence) {
    const tasksAtLevel = tasks.filter(t => t.activationEnergy === energyLevel);
    
    // Sort by duration (shorter first for momentum building in Squirrel state)
    const sortedTasks = energyLevel === "micro" || energyLevel === "easy"
      ? tasksAtLevel.sort((a, b) => a.durationMinutes - b.durationMinutes)
      : tasksAtLevel;

    for (const task of sortedTasks) {
      // Check if task fits in remaining time
      if (timeUsed + task.durationMinutes <= totalTime) {
        sequenced.push({
          taskId: task.id,
          title: task.title,
          order: taskOrder++,
          estimatedDuration: task.durationMinutes,
          reason: getReason(userState, energyLevel, taskOrder - 1),
        });
        timeUsed += task.durationMinutes;
      }
    }
  }

  return sequenced;
}

/**
 * Generate human-readable reason for task recommendation
 */
function getReason(state: UserState, energyLevel: ActivationEnergy, position: number): string {
  if (position === 1) {
    if (state === "squirrel") {
      return "Start tiny to build momentum";
    } else if (state === "tired") {
      return "After movement, tackle easy wins";
    } else if (state === "focused") {
      return "You're ready for meaningful work";
    }
  }

  if (energyLevel === "micro") {
    return "Micro-win to build momentum";
  } else if (energyLevel === "easy") {
    return "Easy win to build confidence";
  } else if (energyLevel === "medium") {
    return "Medium task - you have momentum now";
  } else if (energyLevel === "deep") {
    return "Deep work - you're in the zone";
  }

  return "Recommended task";
}

/**
 * Calculate total estimated duration of a sequence
 */
export function calculateTotalDuration(sequenced: SequencedTask[]): number {
  return sequenced.reduce((total, task) => total + task.estimatedDuration, 0);
}

/**
 * Get encouragement message based on state and position in sequence
 */
export function getEncouragementMessage(state: UserState, taskPosition: number, totalTasks: number): string {
  const messages: Record<UserState, string[]> = {
    squirrel: [
      "Just start with this one tiny thing. You've got this! 💪",
      "Look at you building momentum! 🚀",
      "You're on a roll! Keep going! ✨",
      "You're crushing it! One more? 🎉",
    ],
    tired: [
      "That movement helped! Now let's tackle something easy 💪",
      "You're waking up! Great job! ⚡",
      "Energy is building! Keep it going! 🔥",
      "You're doing amazing! 🌟",
    ],
    focused: [
      "You're in the zone! Let's use this energy 🎯",
      "This is your peak time - go deep! 🚀",
      "You're crushing it! Keep the momentum! 💪",
      "Perfect focus! You've got this! ✨",
    ],
    hurting: [
      "Rest is productive. Be gentle with yourself 💚",
      "Take the time you need. You're doing great 🌿",
      "Healing is progress. You've got this 🧘",
      "Listen to your body. You're doing amazing 💚",
    ],
  };

  const stateMessages = messages[state];
  return stateMessages[Math.min(taskPosition - 1, stateMessages.length - 1)];
}

/**
 * Validate that a task sequence is realistic given time constraints
 */
export function validateSequence(sequenced: SequencedTask[], timeAvailable: TimeAvailable): {
  isValid: boolean;
  totalDuration: number;
  timeRemaining: number;
  warnings: string[];
} {
  const totalTime = TIME_BRACKETS[timeAvailable];
  const totalDuration = calculateTotalDuration(sequenced);
  const timeRemaining = totalTime - totalDuration;
  const warnings: string[] = [];

  if (totalDuration > totalTime) {
    warnings.push(`Sequence exceeds available time by ${totalDuration - totalTime} minutes`);
  }

  if (sequenced.length === 0) {
    warnings.push("No tasks in sequence");
  }

  return {
    isValid: totalDuration <= totalTime && sequenced.length > 0,
    totalDuration,
    timeRemaining: Math.max(0, timeRemaining),
    warnings,
  };
}
