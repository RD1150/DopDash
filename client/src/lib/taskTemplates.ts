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
}

export const TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
  nest: [
    // The Nest - Home, chores, life admin
    {
      id: 'nest-1',
      title: 'Clear one surface',
      description: 'Pick one desk, table, or counter and clear it completely',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🏠'
    },
    {
      id: 'nest-2',
      title: 'Wash 5 dishes',
      description: 'Just 5 dishes - not the whole sink',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🍽️'
    },
    {
      id: 'nest-3',
      title: 'Make your bed',
      description: 'Smooth out the sheets and fluff the pillows',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '🛏️'
    },
    {
      id: 'nest-4',
      title: 'Toss 10 things',
      description: 'Find 10 items to throw away or donate',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 4,
      icon: '🗑️'
    },
    {
      id: 'nest-5',
      title: 'Wipe down bathroom mirror',
      description: 'Quick wipe with a cloth or paper towel',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '🪞'
    },
    {
      id: 'nest-6',
      title: 'Sweep one room',
      description: 'Just one room - bedroom, kitchen, or living room',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '🧹'
    },
    {
      id: 'nest-7',
      title: 'Do laundry - one load',
      description: 'Start one load in the washer',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '👕'
    },
    {
      id: 'nest-8',
      title: 'Organize one drawer',
      description: 'Pick one drawer and organize it',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '🗄️'
    },
    {
      id: 'nest-9',
      title: 'Take out the trash',
      description: 'Empty one trash can',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '🗑️'
    },
    {
      id: 'nest-10',
      title: 'Water the plants',
      description: 'Give your plants a drink',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🌱'
    },
    {
      id: 'nest-11',
      title: 'Fold one basket of clothes',
      description: 'Just one basket - not all the laundry',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '👔'
    },
    {
      id: 'nest-12',
      title: 'Wipe down kitchen counter',
      description: 'Quick wipe and clear the clutter',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🧽'
    },
    {
      id: 'nest-13',
      title: 'Organize your nightstand',
      description: 'Clear and organize what\'s on your nightstand',
      context: 'nest',
      difficulty: 'easy',
      estimatedMinutes: 4,
      icon: '🌙'
    },
    {
      id: 'nest-14',
      title: 'Vacuum one room',
      description: 'Quick vacuum of one room',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '🧹'
    },
    {
      id: 'nest-15',
      title: 'Unload the dishwasher',
      description: 'Empty it completely',
      context: 'nest',
      difficulty: 'medium',
      estimatedMinutes: 4,
      icon: '🍴'
    }
  ],
  grind: [
    // The Grind - Work, study, emails
    {
      id: 'grind-1',
      title: 'Reply to 3 emails',
      description: 'Just 3 quick emails - not your whole inbox',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 4,
      icon: '📧'
    },
    {
      id: 'grind-2',
      title: 'Read one article',
      description: 'Read one article for work or learning',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '📰'
    },
    {
      id: 'grind-3',
      title: 'Write one paragraph',
      description: 'Just one paragraph of your project',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 4,
      icon: '✍️'
    },
    {
      id: 'grind-4',
      title: 'Organize your workspace',
      description: 'Clear desk, arrange supplies',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🖥️'
    },
    {
      id: 'grind-5',
      title: 'Make a to-do list',
      description: 'Write down your top 5 priorities',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '📝'
    },
    {
      id: 'grind-6',
      title: 'Attend one meeting',
      description: 'Show up and participate',
      context: 'grind',
      difficulty: 'hard',
      estimatedMinutes: 5,
      icon: '📞'
    },
    {
      id: 'grind-7',
      title: 'Review one document',
      description: 'Read through and make notes',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '📄'
    },
    {
      id: 'grind-8',
      title: 'Send one important message',
      description: 'Send that message you\'ve been putting off',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 3,
      icon: '💬'
    },
    {
      id: 'grind-9',
      title: 'Check calendar for tomorrow',
      description: 'Review what\'s scheduled',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '📅'
    },
    {
      id: 'grind-10',
      title: 'Complete one small task',
      description: 'Pick something quick from your list',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '✅'
    },
    {
      id: 'grind-11',
      title: 'Study for 5 minutes',
      description: 'Just 5 minutes of focused study',
      context: 'grind',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '📚'
    },
    {
      id: 'grind-12',
      title: 'Organize your files',
      description: 'Create folders or organize digital files',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '📁'
    },
    {
      id: 'grind-13',
      title: 'Brainstorm ideas',
      description: 'Spend 5 minutes brainstorming',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '💡'
    },
    {
      id: 'grind-14',
      title: 'Update your resume/CV',
      description: 'Add one recent accomplishment',
      context: 'grind',
      difficulty: 'medium',
      estimatedMinutes: 4,
      icon: '📋'
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
      title: 'Drink a glass of water',
      description: 'Hydrate - one full glass',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 1,
      icon: '💧'
    },
    {
      id: 'self-2',
      title: 'Take your vitamins',
      description: 'Take your daily vitamins or meds',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 1,
      icon: '💊'
    },
    {
      id: 'self-3',
      title: 'Brush your teeth',
      description: 'Full brush and floss',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🪥'
    },
    {
      id: 'self-4',
      title: 'Take a shower',
      description: 'Quick shower - you got this',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '🚿'
    },
    {
      id: 'self-5',
      title: 'Stretch for 5 minutes',
      description: 'Gentle stretching or yoga',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🧘'
    },
    {
      id: 'self-6',
      title: 'Go for a short walk',
      description: 'Even just around the block',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '🚶'
    },
    {
      id: 'self-7',
      title: 'Eat a healthy snack',
      description: 'Fruit, nuts, or veggies',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '🥗'
    },
    {
      id: 'self-8',
      title: 'Do 10 push-ups or sit-ups',
      description: 'Quick exercise',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '💪'
    },
    {
      id: 'self-9',
      title: 'Meditate for 3 minutes',
      description: 'Calm your mind',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 3,
      icon: '🧠'
    },
    {
      id: 'self-10',
      title: 'Journal for 5 minutes',
      description: 'Write down your thoughts',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '📓'
    },
    {
      id: 'self-11',
      title: 'Skincare routine',
      description: 'Wash face and apply moisturizer',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 3,
      icon: '✨'
    },
    {
      id: 'self-12',
      title: 'Make your bed',
      description: 'Start the day right',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 2,
      icon: '🛏️'
    },
    {
      id: 'self-13',
      title: 'Eat a full meal',
      description: 'Sit down and eat something',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '🍽️'
    },
    {
      id: 'self-14',
      title: 'Get ready for bed',
      description: 'Brush teeth, change clothes, wind down',
      context: 'self',
      difficulty: 'medium',
      estimatedMinutes: 5,
      icon: '🌙'
    },
    {
      id: 'self-15',
      title: 'Do something you enjoy',
      description: 'Play, read, or do a hobby',
      context: 'self',
      difficulty: 'easy',
      estimatedMinutes: 5,
      icon: '🎮'
    }
  ]
};

// Helper function to get templates for a specific context
export function getTemplatesForContext(context: 'nest' | 'grind' | 'self'): TaskTemplate[] {
  return TASK_TEMPLATES[context] || [];
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
