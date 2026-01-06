// Task Templates Library - Pre-populated micro-tasks for each context
// Each task is designed to be completable in 2-5 minutes

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  context: 'nest' | 'grind' | 'self';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  icon?: string;
  subtasks?: string[];
  room?: 'kitchen' | 'bathroom' | 'bedroom' | 'living-area';
}

export const TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
  nest: [
    // KITCHEN TASKS
    {
      id: 'nest-kitchen-1',
      title: 'Kitchen cleanup',
      description: 'Get the kitchen clean and organized',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🍳',
      room: 'kitchen',
      subtasks: ['Wash dishes or load dishwasher', 'Wipe down counter', 'Sweep floor', 'Take out trash']
    },
    {
      id: 'nest-kitchen-2',
      title: 'Quick kitchen tidy',
      description: 'Fast 5-minute kitchen reset',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🧹',
      room: 'kitchen',
      subtasks: ['Clear counter', 'Wipe stove', 'Organize items']
    },
    {
      id: 'nest-kitchen-3',
      title: 'Organize fridge',
      description: 'Clean and organize refrigerator',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🧊',
      room: 'kitchen',
      subtasks: ['Remove expired items', 'Wipe shelves', 'Organize containers', 'Take out trash']
    },
    {
      id: 'nest-kitchen-4',
      title: 'Deep clean kitchen',
      description: 'Thorough kitchen cleaning',
      context: 'nest',
      difficulty: 'hard',
      estimatedMinutes: 20,
      icon: '✨',
      room: 'kitchen',
      subtasks: ['Wipe cabinets', 'Clean appliances', 'Mop floor', 'Organize pantry']
    },

    // BATHROOM TASKS
    {
      id: 'nest-bathroom-1',
      title: 'Bathroom refresh',
      description: 'Quick bathroom tidy',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 8,
      icon: '🚿',
      room: 'bathroom',
      subtasks: ['Wipe down mirror', 'Organize counter items', 'Sweep floor', 'Empty trash']
    },
    {
      id: 'nest-bathroom-2',
      title: 'Clean toilet and sink',
      description: 'Sanitize key areas',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🚽',
      room: 'bathroom',
      subtasks: ['Scrub toilet', 'Clean sink', 'Wipe faucet', 'Rinse']
    },
    {
      id: 'nest-bathroom-3',
      title: 'Shower/tub clean',
      description: 'Clean shower or bathtub',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🛁',
      room: 'bathroom',
      subtasks: ['Spray cleaner', 'Scrub walls', 'Rinse thoroughly', 'Dry']
    },
    {
      id: 'nest-bathroom-4',
      title: 'Deep clean bathroom',
      description: 'Thorough bathroom cleaning',
      context: 'nest',
      difficulty: 'hard',
      estimatedMinutes: 15,
      icon: '✨',
      room: 'bathroom',
      subtasks: ['Clean toilet', 'Scrub shower', 'Mop floor', 'Organize items']
    },

    // BEDROOM TASKS
    {
      id: 'nest-bedroom-1',
      title: 'Clean bedroom',
      description: 'Get your bedroom fresh and ready',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '🛏️',
      room: 'bedroom',
      subtasks: ['Tidy surfaces (dresser, nightstand)', 'Change sheets', 'Put misc things away', 'Vacuum floor']
    },
    {
      id: 'nest-bedroom-2',
      title: 'Make your bed',
      description: 'Start the day right',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '🛏️',
      room: 'bedroom'
    },
    {
      id: 'nest-bedroom-3',
      title: 'Organize bedroom',
      description: 'Tidy up your sleeping space',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🗄️',
      room: 'bedroom',
      subtasks: ['Pick up floor items', 'Organize dresser', 'Clear nightstand', 'Fluff pillows']
    },
    {
      id: 'nest-bedroom-4',
      title: 'Deep clean bedroom',
      description: 'Thorough bedroom cleaning',
      context: 'nest',
      difficulty: 'hard',
      estimatedMinutes: 20,
      icon: '✨',
      room: 'bedroom',
      subtasks: ['Dust surfaces', 'Vacuum thoroughly', 'Change sheets', 'Organize closet']
    },

    // LIVING AREA TASKS
    {
      id: 'nest-living-1',
      title: 'Living room reset',
      description: 'Tidy up the main living space',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🛋️',
      room: 'living-area',
      subtasks: ['Pick up items off floor', 'Fluff pillows and blankets', 'Organize remotes and magazines', 'Quick vacuum']
    },
    {
      id: 'nest-living-2',
      title: 'Tidy entryway',
      description: 'Clean up entry space',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🚪',
      room: 'living-area',
      subtasks: ['Hang up coats', 'Organize shoes', 'Clear clutter', 'Sweep']
    },
    {
      id: 'nest-living-3',
      title: 'Declutter living area',
      description: 'Remove items you dont need',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '♻️',
      room: 'living-area',
      subtasks: ['Gather items', 'Sort keep/donate', 'Bag donations', 'Organize kept items']
    },
    {
      id: 'nest-living-4',
      title: 'Deep clean living area',
      description: 'Thorough living space cleaning',
      context: 'nest',
      difficulty: 'hard',
      estimatedMinutes: 20,
      icon: '✨',
      room: 'living-area',
      subtasks: ['Dust surfaces', 'Vacuum thoroughly', 'Wipe furniture', 'Organize items']
    },

    // GENERAL TASKS
    {
      id: 'nest-general-1',
      title: 'Quick 10-minute tidy',
      description: 'Fast cleanup of main spaces',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 10,
      icon: '⚡',
      subtasks: ['Pick up floor items', 'Clear one surface', 'Fluff pillows', 'Quick sweep']
    },
    {
      id: 'nest-general-2',
      title: 'Laundry day',
      description: 'Handle one load of laundry',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '👕',
      subtasks: ['Start washer', 'Fold previous load', 'Put away clothes', 'Move to dryer']
    },
    {
      id: 'nest-general-3',
      title: 'Take out trash',
      description: 'Empty one trash can',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '🗑️'
    },
    {
      id: 'nest-general-4',
      title: 'Water the plants',
      description: 'Give your plants a drink',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🌱'
    }
  ],
  grind: [
    // The Grind - Work, study, emails
    {
      id: 'grind-1',
      title: 'Email catch-up',
      description: 'Process your inbox',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 10,
      icon: '📧',
      subtasks: ['Reply to 3 urgent emails', 'Mark spam', 'Organize folders', 'Check calendar']
    },
    {
      id: 'grind-2',
      title: 'Project kickoff',
      description: 'Start on your main project',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '📋',
      subtasks: ['Review requirements', 'Make outline', 'Write intro section', 'Save progress']
    },
    {
      id: 'grind-3',
      title: 'Study session',
      description: 'Focused learning time',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '📚',
      subtasks: ['Review notes', 'Read one section', 'Make flashcards', 'Test yourself']
    },
    {
      id: 'grind-4',
      title: 'Organize workspace',
      description: 'Set up for productivity',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 8,
      icon: '🖥️',
      subtasks: ['Clear desk', 'Arrange supplies', 'Close unnecessary tabs', 'Silence phone']
    },
    {
      id: 'grind-5',
      title: 'Plan your day',
      description: 'Get organized and focused',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '📝',
      subtasks: ['List top 3 priorities', 'Schedule breaks', 'Set time blocks', 'Review deadlines']
    },
    {
      id: 'grind-6',
      title: 'Meeting prep',
      description: 'Get ready to participate',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '📞',
      subtasks: ['Review agenda', 'Prepare notes', 'Test tech', 'Grab water']
    },
    {
      id: 'grind-7',
      title: 'Document review',
      description: 'Read and analyze',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '📄',
      subtasks: ['Skim document', 'Highlight key points', 'Make notes', 'Summarize']
    },
    {
      id: 'grind-8',
      title: 'Creative brainstorm',
      description: 'Generate ideas',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '💡',
      subtasks: ['Set timer', 'Write freely', 'Circle best ideas', 'Organize thoughts']
    },
    {
      id: 'grind-9',
      title: 'Admin catch-up',
      description: 'Handle necessary tasks',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 10,
      icon: '✅',
      subtasks: ['Update calendar', 'File documents', 'Respond to messages', 'Check deadlines']
    },
    {
      id: 'grind-10',
      title: 'Learning break',
      description: 'Quick skill boost',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🎓',
      subtasks: ['Watch tutorial', 'Read article', 'Try new tool', 'Take notes']
    },
    {
      id: 'grind-11',
      title: 'Reply to 3 emails',
      description: 'Just 3 quick emails',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 4,
      icon: '📧'
    },
    {
      id: 'grind-12',
      title: 'Read one article',
      description: 'For work or learning',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '📰'
    },
    {
      id: 'grind-13',
      title: 'Write one paragraph',
      description: 'Just one paragraph',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 4,
      icon: '✍️'
    },
    {
      id: 'grind-14',
      title: 'Check calendar',
      description: 'Review whats scheduled',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '📅'
    },
    {
      id: 'grind-15',
      title: 'Take a work break',
      description: 'Step away for 5 minutes',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '☕'
    }
  ],
  self: [
    // The Self - Hygiene, health, routine
    {
      id: 'self-1',
      title: 'Morning routine',
      description: 'Start your day right',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '🌅',
      subtasks: ['Drink water', 'Brush teeth', 'Shower', 'Get dressed']
    },
    {
      id: 'self-2',
      title: 'Evening wind-down',
      description: 'Prepare for sleep',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '🌙',
      subtasks: ['Skincare routine', 'Change into pajamas', 'Put phone away', 'Get in bed']
    },
    {
      id: 'self-3',
      title: 'Quick workout',
      description: 'Get moving',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '💪',
      subtasks: ['Warm up', 'Do exercises', 'Stretch', 'Drink water']
    },
    {
      id: 'self-4',
      title: 'Meal prep',
      description: 'Prepare healthy food',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '🥗',
      subtasks: ['Choose recipe', 'Gather ingredients', 'Cook', 'Store portions']
    },
    {
      id: 'self-5',
      title: 'Meditation session',
      description: 'Calm your mind',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🧘',
      subtasks: ['Find quiet spot', 'Set timer', 'Focus on breath', 'Reflect']
    },
    {
      id: 'self-6',
      title: 'Self-care time',
      description: 'Do something nice for yourself',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 10,
      icon: '✨',
      subtasks: ['Choose activity', 'Get comfortable', 'Enjoy fully', 'Reflect']
    },
    {
      id: 'self-7',
      title: 'Health check-in',
      description: 'Take care of your body',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '💊',
      subtasks: ['Take vitamins', 'Check how you feel', 'Note any issues', 'Hydrate']
    },
    {
      id: 'self-8',
      title: 'Outdoor time',
      description: 'Get fresh air and sunlight',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🌞',
      subtasks: ['Step outside', 'Take a walk', 'Breathe deeply', 'Notice surroundings']
    },
    {
      id: 'self-9',
      title: 'Journal session',
      description: 'Process your thoughts',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '📓',
      subtasks: ['Sit down', 'Write freely', 'Reflect', 'Close journal']
    },
    {
      id: 'self-10',
      title: 'Hobby time',
      description: 'Do something you enjoy',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 10,
      icon: '🎮',
      subtasks: ['Choose activity', 'Set up', 'Enjoy', 'Notice how you feel']
    },
    {
      id: 'self-11',
      title: 'Drink a glass of water',
      description: 'Hydrate - one full glass',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 1,
      icon: '💧'
    },
    {
      id: 'self-12',
      title: 'Take your vitamins',
      description: 'Take your daily vitamins or meds',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 1,
      icon: '💊'
    },
    {
      id: 'self-13',
      title: 'Brush your teeth',
      description: 'Full brush and floss',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🪥'
    },
    {
      id: 'self-14',
      title: 'Take a shower',
      description: 'Quick shower - you got this',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '🚿'
    },
    {
      id: 'self-15',
      title: 'Stretch for 5 minutes',
      description: 'Gentle stretching',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🧘'
    }
  ]
};

// Helper function to get templates for a specific context
export function getTemplatesForContext(context: 'nest' | 'grind' | 'self'): TaskTemplate[] {
  return TASK_TEMPLATES[context] || [];
}

// Helper function to get templates by room
export function getTemplatesByRoom(room: 'kitchen' | 'bathroom' | 'bedroom' | 'living-area'): TaskTemplate[] {
  return TASK_TEMPLATES.nest.filter(t => t.room === room) || [];
}

// Helper function to get a random template for a context
export function getRandomTemplate(context: 'nest' | 'grind' | 'self'): TaskTemplate | undefined {
  const templates = getTemplatesForContext(context);
  if (templates.length === 0) return undefined;
  return templates[Math.floor(Math.random() * templates.length)];
}

// Helper function to get templates by difficulty
export function getTemplatesByDifficulty(
  context: 'nest' | 'grind' | 'self',
  difficulty: 'easy' | 'medium' | 'hard'
): TaskTemplate[] {
  return getTemplatesForContext(context).filter(t => t.difficulty === difficulty);
}
