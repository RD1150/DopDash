/**
 * Behavioral Therapy Knowledge Base
 * Evidence-based CBT/DBT techniques for ADHD support
 * 
 * This knowledge base powers the AI coach with therapeutic interventions
 * tailored to ADHD nervous system states and common challenges.
 */

export type NervousSystemState = 'squirrel' | 'tired' | 'focused' | 'hurting';
export type TherapyCategory = 'grounding' | 'motivation' | 'breakdown' | 'cognitive' | 'emotion';

export interface TherapyTechnique {
  id: string;
  name: string;
  category: TherapyCategory;
  state: NervousSystemState[];
  description: string;
  steps: string[];
  duration: number; // minutes
  evidence: string; // CBT/DBT/ADHD research basis
  coachPrompt: string; // How the AI coach should introduce this
}

/**
 * GROUNDING TECHNIQUES
 * For: Overwhelm, anxiety, scattered thoughts
 * Evidence: DBT distress tolerance, mindfulness-based interventions
 */
export const groundingTechniques: TherapyTechnique[] = [
  {
    id: 'grounding-5-4-3-2-1',
    name: '5-4-3-2-1 Grounding',
    category: 'grounding',
    state: ['squirrel', 'hurting'],
    description: 'Sensory grounding technique to anchor to the present moment',
    steps: [
      'Name 5 things you can see right now',
      'Name 4 things you can physically feel (texture, temperature)',
      'Name 3 things you can hear',
      'Name 2 things you can smell (or imagine)',
      'Name 1 thing you can taste'
    ],
    duration: 2,
    evidence: 'DBT distress tolerance skill; reduces anxiety and hyperarousal',
    coachPrompt: 'Your brain is bouncing around. Let\'s anchor to the present moment with the 5-4-3-2-1 technique. This takes 2 minutes and works fast.'
  },
  {
    id: 'grounding-box-breathing',
    name: 'Box Breathing',
    category: 'grounding',
    state: ['hurting', 'squirrel'],
    description: 'Controlled breathing to regulate nervous system',
    steps: [
      'Breathe in for 4 counts',
      'Hold for 4 counts',
      'Breathe out for 4 counts',
      'Hold for 4 counts',
      'Repeat 5 times'
    ],
    duration: 3,
    evidence: 'Vagal toning; reduces cortisol and activates parasympathetic nervous system',
    coachPrompt: 'Your nervous system needs to calm down. Box breathing takes 3 minutes and resets your body\'s stress response.'
  },
  {
    id: 'grounding-body-scan',
    name: 'Quick Body Scan',
    category: 'grounding',
    state: ['squirrel', 'hurting'],
    description: 'Progressive muscle awareness to ground in body',
    steps: [
      'Tense your toes for 3 seconds, then release',
      'Tense your legs for 3 seconds, then release',
      'Tense your core for 3 seconds, then release',
      'Tense your arms for 3 seconds, then release',
      'Tense your face for 3 seconds, then release'
    ],
    duration: 2,
    evidence: 'Progressive muscle relaxation; interrupts anxiety loop',
    coachPrompt: 'Let\'s get you back in your body. This quick scan takes 2 minutes and resets your nervous system.'
  }
];

/**
 * MOTIVATION TECHNIQUES
 * For: Low dopamine, procrastination, task initiation
 * Evidence: ADHD dopamine deficit theory, behavioral activation
 */
export const motivationTechniques: TherapyTechnique[] = [
  {
    id: 'motivation-micro-commitment',
    name: 'Micro-Commitment',
    category: 'motivation',
    state: ['tired', 'squirrel'],
    description: 'Commit to just 2 minutes to bypass activation energy',
    steps: [
      'Say out loud: "I\'m doing this for 2 minutes only"',
      'Set a 2-minute timer',
      'Start the task',
      'At 2 minutes, decide: continue or stop (both are wins)'
    ],
    duration: 2,
    evidence: 'ADHD activation energy research; reduces decision paralysis',
    coachPrompt: 'Your ADHD brain needs activation energy. Just commit to 2 minutes. That\'s it. No guilt if you stop.'
  },
  {
    id: 'motivation-dopamine-stacking',
    name: 'Dopamine Stacking',
    category: 'motivation',
    state: ['tired', 'squirrel'],
    description: 'Pair boring task with something enjoyable',
    steps: [
      'Choose your boring task',
      'Pick something you enjoy (music, snack, movement)',
      'Do them together',
      'Celebrate the completion'
    ],
    duration: 1,
    evidence: 'Behavioral pairing; increases dopamine for low-stimulation tasks',
    coachPrompt: 'Let\'s hack your dopamine. Pair this task with something you enjoy. Music? Snack? Movement? Your brain will thank you.'
  },
  {
    id: 'motivation-implementation-intention',
    name: 'Implementation Intention',
    category: 'motivation',
    state: ['tired', 'squirrel', 'focused'],
    description: 'Create if-then plan to reduce decision friction',
    steps: [
      'Identify the trigger: "When I finish breakfast..."',
      'Define the action: "...I immediately open my task list"',
      'Say it out loud 3 times',
      'Follow through when the trigger happens'
    ],
    duration: 1,
    evidence: 'Implementation intentions reduce executive load; ADHD-friendly',
    coachPrompt: 'Your ADHD brain hates decisions. Let\'s create an if-then plan so your brain knows exactly what to do next.'
  }
];

/**
 * TASK BREAKDOWN TECHNIQUES
 * For: Overwhelm, executive dysfunction, task initiation
 * Evidence: CBT task analysis, behavioral activation
 */
export const breakdownTechniques: TherapyTechnique[] = [
  {
    id: 'breakdown-two-minute-rule',
    name: 'Two-Minute Rule',
    category: 'breakdown',
    state: ['squirrel', 'tired', 'hurting', 'focused'],
    description: 'Break tasks into 2-minute chunks',
    steps: [
      'Look at the task',
      'Ask: "What\'s the first 2-minute piece?"',
      'Do that piece',
      'Celebrate',
      'Repeat for next piece'
    ],
    duration: 2,
    evidence: 'Behavioral activation; ADHD brains work in short bursts',
    coachPrompt: 'This task feels big. Let\'s break it into 2-minute pieces. You can do anything for 2 minutes.'
  },
  {
    id: 'breakdown-reverse-planning',
    name: 'Reverse Planning',
    category: 'breakdown',
    state: ['squirrel', 'hurting'],
    description: 'Start from the end and work backwards',
    steps: [
      'Picture the finished task',
      'What\'s the last step?',
      'What comes before that?',
      'Keep going backwards until you find step 1',
      'Start with step 1'
    ],
    duration: 3,
    evidence: 'Reduces overwhelm; ADHD brains see the big picture better',
    coachPrompt: 'Let\'s work backwards from the finish line. This helps your ADHD brain see the path forward.'
  },
  {
    id: 'breakdown-smallest-next-step',
    name: 'Smallest Next Step',
    category: 'breakdown',
    state: ['squirrel', 'tired', 'focused'],
    description: 'Find the absolute smallest action',
    steps: [
      'Look at the task',
      'Ask: "What\'s the smallest possible action?"',
      'Do that action (even if it\'s just 30 seconds)',
      'Celebrate',
      'Ask again: "What\'s the next smallest action?"'
    ],
    duration: 1,
    evidence: 'Overcomes activation energy barrier; momentum building',
    coachPrompt: 'What\'s the tiniest action you can take right now? Not the whole task—just the first micro-step.'
  }
];

/**
 * COGNITIVE TECHNIQUES
 * For: Negative self-talk, perfectionism, shame
 * Evidence: CBT cognitive restructuring
 */
export const cognitiveTechniques: TherapyTechnique[] = [
  {
    id: 'cognitive-thought-record',
    name: 'Thought Record',
    category: 'cognitive',
    state: ['hurting', 'tired'],
    description: 'Challenge negative ADHD thoughts',
    steps: [
      'Notice the thought: "I\'m so lazy"',
      'Ask: "Is this true? What\'s the evidence?"',
      'Find the evidence against it: "I completed 3 tasks yesterday"',
      'Reframe: "I have ADHD, not laziness. My brain works differently."',
      'Notice how you feel'
    ],
    duration: 3,
    evidence: 'CBT cognitive restructuring; reduces shame and self-blame',
    coachPrompt: 'That voice saying you\'re lazy? That\'s ADHD shame talking. Let\'s challenge it with evidence.'
  },
  {
    id: 'cognitive-shame-interrupt',
    name: 'Shame Interrupt',
    category: 'cognitive',
    state: ['hurting'],
    description: 'Interrupt shame spiral with self-compassion',
    steps: [
      'Notice the shame: "I failed again"',
      'Say: "This is a moment of suffering. Suffering is part of life."',
      'Say: "I\'m not alone. Everyone with ADHD struggles with this."',
      'Say: "What would I say to a friend right now?"',
      'Say it to yourself'
    ],
    duration: 2,
    evidence: 'Self-compassion reduces shame; DBT distress tolerance',
    coachPrompt: 'You\'re in a shame spiral. Let\'s interrupt it with the same compassion you\'d give a friend.'
  },
  {
    id: 'cognitive-perfectionism-challenge',
    name: 'Perfectionism Challenge',
    category: 'cognitive',
    state: ['squirrel', 'hurting'],
    description: 'Challenge all-or-nothing thinking',
    steps: [
      'Notice: "If I can\'t do it perfectly, why try?"',
      'Ask: "Is perfect required? Or just done?"',
      'Reframe: "Done is better than perfect. Progress over perfection."',
      'Start with 70% effort',
      'Celebrate the 70% version'
    ],
    duration: 2,
    evidence: 'CBT cognitive distortion challenge; ADHD perfectionism pattern',
    coachPrompt: 'Perfectionism is the enemy of done. Let\'s aim for 70% and celebrate it.'
  }
];

/**
 * EMOTION REGULATION TECHNIQUES
 * For: Emotional dysregulation, overwhelm, frustration
 * Evidence: DBT emotion regulation skills
 */
export const emotionTechniques: TherapyTechnique[] = [
  {
    id: 'emotion-tipp-skill',
    name: 'TIPP Skill',
    category: 'emotion',
    state: ['hurting', 'squirrel'],
    description: 'Temperature, Intense exercise, Paced breathing, Paired muscle relaxation',
    steps: [
      'Temperature: Splash cold water on your face or hold ice',
      'OR Intense exercise: 30 seconds of jumping jacks',
      'OR Paced breathing: Slow, deep breaths',
      'OR Paired muscle relaxation: Tense and release muscles',
      'Notice the shift'
    ],
    duration: 1,
    evidence: 'DBT distress tolerance; activates vagal brake',
    coachPrompt: 'Your emotions are overwhelming. Let\'s use TIPP to reset your nervous system fast.'
  },
  {
    id: 'emotion-opposite-action',
    name: 'Opposite Action',
    category: 'emotion',
    state: ['tired', 'hurting', 'focused'],
    description: 'Act opposite to the emotion you\'re feeling',
    steps: [
      'Notice the emotion: "I feel like giving up"',
      'Do the opposite action: Take one small step forward',
      'Notice: Emotions follow actions',
      'Repeat'
    ],
    duration: 2,
    evidence: 'DBT emotion regulation; emotions change when behavior changes',
    coachPrompt: 'Your emotion is saying "quit". Let\'s do the opposite action and see what happens.'
  },
  {
    id: 'emotion-abc-please',
    name: 'ABC PLEASE',
    category: 'emotion',
    state: ['tired', 'hurting'],
    description: 'Self-care checklist to regulate emotions',
    steps: [
      'Accumulate positive experiences: Do something enjoyable',
      'Build mastery: Complete a task (any size)',
      'Cope ahead: Plan for the next challenge',
      'Please: Take care of yourself (sleep, eat, move)',
      'Notice mood shift'
    ],
    duration: 5,
    evidence: 'DBT emotion regulation; holistic self-care',
    coachPrompt: 'Your emotions are dysregulated. Let\'s use ABC PLEASE to get back in balance.'
  }
];

/**
 * Get techniques for a specific nervous system state
 */
export function getTechniquesForState(state: NervousSystemState): TherapyTechnique[] {
  const allTechniques = [
    ...groundingTechniques,
    ...motivationTechniques,
    ...breakdownTechniques,
    ...cognitiveTechniques,
    ...emotionTechniques
  ];
  
  return allTechniques.filter(t => t.state.includes(state));
}

/**
 * Get techniques for a specific category
 */
export function getTechniquesForCategory(category: TherapyCategory): TherapyTechnique[] {
  const allTechniques = [
    ...groundingTechniques,
    ...motivationTechniques,
    ...breakdownTechniques,
    ...cognitiveTechniques,
    ...emotionTechniques
  ];
  
  return allTechniques.filter(t => t.category === category);
}

/**
 * Get all techniques
 */
export function getAllTechniques(): TherapyTechnique[] {
  return [
    ...groundingTechniques,
    ...motivationTechniques,
    ...breakdownTechniques,
    ...cognitiveTechniques,
    ...emotionTechniques
  ];
}

/**
 * Get a random technique for a state
 */
export function getRandomTechniqueForState(state: NervousSystemState): TherapyTechnique | null {
  const techniques = getTechniquesForState(state);
  if (techniques.length === 0) return null;
  return techniques[Math.floor(Math.random() * techniques.length)];
}
