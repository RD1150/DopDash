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
  category?: string; // Clean, Rearrange, Organize for Nest; Email, Writing, etc for Grind; Morning, Midday, Evening for Self
  room?: 'kitchen' | 'bathroom' | 'bedroom' | 'living-area';
}

// Categories for each context
export const CATEGORIES = {
  nest: ['Clean', 'Rearrange', 'Organize'],
  grind: ['Email', 'Writing', 'Meetings', 'Learning', 'Admin'],
  self: ['Morning', 'Midday', 'Evening', 'Quick wins']
};

export const TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
  nest: [
    // CLEAN CATEGORY - Kitchen
    {
      id: 'nest-clean-kitchen-1',
      title: 'Kitchen cleanup',
      description: 'Get the kitchen clean and organized',
      context: 'nest',
      category: 'Clean',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🍳',
      room: 'kitchen',
      subtasks: ['Wash dishes or load dishwasher', 'Wipe down counter', 'Sweep floor', 'Take out trash']
    },
    {
      id: 'nest-clean-kitchen-2',
      title: 'Quick kitchen tidy',
      description: 'Fast 5-minute kitchen reset',
      context: 'nest',
      category: 'Clean',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🧹',
      room: 'kitchen',
      subtasks: ['Clear counter', 'Wipe stove', 'Organize items']
    },
    // CLEAN CATEGORY - Bathroom
    {
      id: 'nest-clean-bathroom-1',
      title: 'Bathroom refresh',
      description: 'Quick bathroom tidy',
      context: 'nest',
      category: 'Clean',
      difficulty: 'easy',
      estimatedMinutes: 8,
      icon: '🚿',
      room: 'bathroom',
      subtasks: ['Wipe down mirror', 'Organize counter items', 'Sweep floor', 'Empty trash']
    },
    {
      id: 'nest-clean-bathroom-2',
      title: 'Clean toilet and sink',
      description: 'Sanitize key areas',
      context: 'nest',
      category: 'Clean',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🚽',
      room: 'bathroom',
      subtasks: ['Scrub toilet', 'Clean sink', 'Wipe faucet', 'Rinse']
    },
    // CLEAN CATEGORY - Bedroom
    {
      id: 'nest-clean-bedroom-1',
      title: 'Clean bedroom',
      description: 'Get your bedroom fresh and ready',
      context: 'nest',
      category: 'Clean',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '🛏️',
      room: 'bedroom',
      subtasks: ['Tidy surfaces (dresser, nightstand)', 'Change sheets', 'Put misc things away', 'Vacuum floor']
    },
    // CLEAN CATEGORY - Living Area
    {
      id: 'nest-clean-living-1',
      title: 'Living room reset',
      description: 'Tidy up the main living space',
      context: 'nest',
      category: 'Clean',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🛋️',
      room: 'living-area',
      subtasks: ['Pick up items off floor', 'Fluff pillows and blankets', 'Organize remotes and magazines', 'Quick vacuum']
    },

    // REARRANGE CATEGORY - Kitchen
    {
      id: 'nest-rearrange-kitchen-1',
      title: 'Organize fridge',
      description: 'Clean and organize refrigerator',
      context: 'nest',
      category: 'Rearrange',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🧊',
      room: 'kitchen',
      subtasks: ['Remove expired items', 'Wipe shelves', 'Organize containers', 'Take out trash']
    },
    // REARRANGE CATEGORY - Bedroom
    {
      id: 'nest-rearrange-bedroom-1',
      title: 'Organize bedroom',
      description: 'Tidy up your sleeping space',
      context: 'nest',
      category: 'Rearrange',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🗄️',
      room: 'bedroom',
      subtasks: ['Pick up floor items', 'Organize dresser', 'Clear nightstand', 'Fluff pillows']
    },
    // REARRANGE CATEGORY - Living Area
    {
      id: 'nest-rearrange-living-1',
      title: 'Tidy entryway',
      description: 'Clean up entry space',
      context: 'nest',
      category: 'Rearrange',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🚪',
      room: 'living-area',
      subtasks: ['Hang up coats', 'Organize shoes', 'Clear clutter', 'Sweep']
    },

    // ORGANIZE CATEGORY - Kitchen
    {
      id: 'nest-organize-kitchen-1',
      title: 'Organize kitchen cabinets',
      description: 'Organize one cabinet or drawer',
      context: 'nest',
      category: 'Organize',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🗄️',
      room: 'kitchen',
      subtasks: ['Remove everything', 'Wipe down', 'Put back organized', 'Donate extras']
    },
    // ORGANIZE CATEGORY - Bedroom
    {
      id: 'nest-organize-bedroom-1',
      title: 'Organize closet',
      description: 'Tidy up your closet space',
      context: 'nest',
      category: 'Organize',
      difficulty: 'hard',
      estimatedMinutes: 20,
      icon: '👔',
      room: 'bedroom',
      subtasks: ['Remove items', 'Sort by category', 'Donate unwanted', 'Hang/fold neatly']
    },
    // ORGANIZE CATEGORY - Living Area
    {
      id: 'nest-organize-living-1',
      title: 'Declutter living area',
      description: 'Remove items you dont need',
      context: 'nest',
      category: 'Organize',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '♻️',
      room: 'living-area',
      subtasks: ['Gather items', 'Sort keep/donate', 'Bag donations', 'Organize kept items']
    },

    // GENERAL TASKS (no category)
    {
      id: 'nest-general-1',
      title: 'Laundry day',
      description: 'Handle one load of laundry',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '👕',
      subtasks: ['Start washer', 'Fold previous load', 'Put away clothes', 'Move to dryer']
    },
    {
      id: 'nest-general-2',
      title: 'Take out trash',
      description: 'Empty one trash can',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '🗑️'
    },
    {
      id: 'nest-general-3',
      title: 'Water the plants',
      description: 'Give your plants a drink',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🌱'
    }
  ],
  grind: [
    // EMAIL CATEGORY
    {
      id: 'grind-email-1',
      title: 'Email catch-up',
      description: 'Process your inbox',
      context: 'grind',
      category: 'Email',
      difficulty: 'easy',
      estimatedMinutes: 10,
      icon: '📧',
      subtasks: ['Reply to 3 urgent emails', 'Mark spam', 'Organize folders', 'Check calendar']
    },
    {
      id: 'grind-email-2',
      title: 'Reply to 3 emails',
      description: 'Just 3 quick emails',
      context: 'grind',
      category: 'Email',
      difficulty: 'easy',
      estimatedMinutes: 4,
      icon: '📧'
    },

    // WRITING CATEGORY
    {
      id: 'grind-writing-1',
      title: 'Project kickoff',
      description: 'Start on your main project',
      context: 'grind',
      category: 'Writing',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '📋',
      subtasks: ['Review requirements', 'Make outline', 'Write intro section', 'Save progress']
    },
    {
      id: 'grind-writing-2',
      title: 'Write one paragraph',
      description: 'Just one paragraph',
      context: 'grind',
      category: 'Writing',
      difficulty: 'medium',
      estimatedMinutes: 4,
      icon: '✍️'
    },

    // MEETINGS CATEGORY
    {
      id: 'grind-meetings-1',
      title: 'Meeting prep',
      description: 'Get ready to participate',
      context: 'grind',
      category: 'Meetings',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '📞',
      subtasks: ['Review agenda', 'Prepare notes', 'Test tech', 'Grab water']
    },

    // LEARNING CATEGORY
    {
      id: 'grind-learning-1',
      title: 'Study session',
      description: 'Focused learning time',
      context: 'grind',
      category: 'Learning',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '📚',
      subtasks: ['Review notes', 'Read one section', 'Make flashcards', 'Test yourself']
    },
    {
      id: 'grind-learning-2',
      title: 'Read one article',
      description: 'For work or learning',
      context: 'grind',
      category: 'Learning',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '📰'
    },

    // ADMIN CATEGORY
    {
      id: 'grind-admin-1',
      title: 'Plan your day',
      description: 'Get organized and focused',
      context: 'grind',
      category: 'Admin',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '📝',
      subtasks: ['List top 3 priorities', 'Schedule breaks', 'Set time blocks', 'Review deadlines']
    },
    {
      id: 'grind-admin-2',
      title: 'Organize workspace',
      description: 'Set up for productivity',
      context: 'grind',
      category: 'Admin',
      difficulty: 'easy',
      estimatedMinutes: 8,
      icon: '🖥️',
      subtasks: ['Clear desk', 'Arrange supplies', 'Close unnecessary tabs', 'Silence phone']
    },
    {
      id: 'grind-admin-3',
      title: 'Check calendar',
      description: 'Review whats scheduled',
      context: 'grind',
      category: 'Admin',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '📅'
    }
  ],
  self: [
    // MORNING CATEGORY
    {
      id: 'self-morning-1',
      title: 'Morning routine',
      description: 'Start your day right',
      context: 'self',
      category: 'Morning',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '🌅',
      subtasks: ['Drink water', 'Brush teeth', 'Shower', 'Get dressed']
    },
    {
      id: 'self-morning-2',
      title: 'Make your bed',
      description: 'Start the day right',
      context: 'self',
      category: 'Morning',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '🛏️'
    },

    // MIDDAY CATEGORY
    {
      id: 'self-midday-1',
      title: 'Meal prep',
      description: 'Prepare healthy food',
      context: 'self',
      category: 'Midday',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '🥗',
      subtasks: ['Choose recipe', 'Gather ingredients', 'Cook', 'Store portions']
    },
    {
      id: 'self-midday-2',
      title: 'Quick workout',
      description: 'Get moving',
      context: 'self',
      category: 'Midday',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '💪',
      subtasks: ['Warm up', 'Do exercises', 'Stretch', 'Drink water']
    },
    {
      id: 'self-midday-3',
      title: 'Outdoor time',
      description: 'Get fresh air and sunlight',
      context: 'self',
      category: 'Midday',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🌞',
      subtasks: ['Step outside', 'Take a walk', 'Breathe deeply', 'Notice surroundings']
    },

    // EVENING CATEGORY
    {
      id: 'self-evening-1',
      title: 'Evening wind-down',
      description: 'Prepare for sleep',
      context: 'self',
      category: 'Evening',
      difficulty: 'medium',
      estimatedMinutes: 15,
      icon: '🌙',
      subtasks: ['Skincare routine', 'Change into pajamas', 'Put phone away', 'Get in bed']
    },
    {
      id: 'self-evening-2',
      title: 'Journal session',
      description: 'Process your thoughts',
      context: 'self',
      category: 'Evening',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '📓',
      subtasks: ['Sit down', 'Write freely', 'Reflect', 'Close journal']
    },

    // QUICK WINS CATEGORY
    {
      id: 'self-quick-1',
      title: 'Drink a glass of water',
      description: 'Hydrate - one full glass',
      context: 'self',
      category: 'Quick wins',
      difficulty: 'easy',
      estimatedMinutes: 1,
      icon: '💧'
    },
    {
      id: 'self-quick-2',
      title: 'Take your vitamins',
      description: 'Take your daily vitamins or meds',
      context: 'self',
      category: 'Quick wins',
      difficulty: 'easy',
      estimatedMinutes: 1,
      icon: '💊'
    },
    {
      id: 'self-quick-3',
      title: 'Brush your teeth',
      description: 'Full brush and floss',
      context: 'self',
      category: 'Quick wins',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🪥'
    },
    {
      id: 'self-quick-4',
      title: 'Stretch for 5 minutes',
      description: 'Gentle stretching',
      context: 'self',
      category: 'Quick wins',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🧘'
    },
    {
      id: 'self-quick-5',
      title: 'Meditation session',
      description: 'Calm your mind',
      context: 'self',
      category: 'Quick wins',
      difficulty: 'medium',
      estimatedMinutes: 10,
      icon: '🧘',
      subtasks: ['Find quiet spot', 'Set timer', 'Focus on breath', 'Reflect']
    }
  ]
};

// Helper function to get categories for a context
export function getCategoriesForContext(context: 'nest' | 'grind' | 'self'): string[] {
  return CATEGORIES[context] || [];
}

// Helper function to get templates for a specific context and category
export function getTemplatesByContextAndCategory(
  context: 'nest' | 'grind' | 'self',
  category: string
): TaskTemplate[] {
  return TASK_TEMPLATES[context].filter(t => t.category === category) || [];
}

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
