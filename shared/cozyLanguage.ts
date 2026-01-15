// Cozy, shame-free language for Dopamine Dasher
// Used throughout the app to create a supportive, non-judgmental experience

export const COZY_MESSAGES = {
  // Completion messages
  completion: [
    'You did it!',
    'Well deserved!',
    'That is a win!',
    'You are amazing!',
    'Boom!',
    'Crushing it!',
    'You got this!',
    'Beautiful work!',
  ],

  // Encouragement for low energy
  lowEnergy: [
    'Even tiny steps count.',
    'You are doing better than you think.',
    'Progress over perfection.',
    'Your brain works differently. That is not broken.',
    'Be gentle with yourself.',
    'You are enough as you are.',
    'Small wins are still wins.',
  ],

  // Encouragement for overwhelm
  overwhelmed: [
    'One tiny thing at a time.',
    'You do not have to do it all today.',
    'Break it down smaller.',
    'You are not broken, you are just overwhelmed.',
    'Breathe. You have got this.',
    'Start with just 2 minutes.',
    'Overwhelm is temporary.',
  ],

  // Encouragement for boredom
  bored: [
    'Let us make this fun!',
    'Time to shake things up.',
    'Your brain needs stimulation. That is normal.',
    'Let us find the dopamine!',
    'Ready for a challenge?',
    'This could be more interesting than you think.',
  ],

  // Encouragement for high energy
  energized: [
    'YES! Ride this wave!',
    'You are ON FIRE!',
    'This is your moment!',
    'Let us make magic happen!',
    'You are unstoppable!',
    'Channel that energy!',
  ],

  // Context switching (guilt-free)
  contextSwitch: [
    'Switching is not failing.',
    'Your brain knows what it needs.',
    'Context switching is a feature, not a bug.',
    'You are adapting, not quitting.',
    'It is okay to pivot.',
  ],

  // Partial completion
  partialCompletion: [
    'You showed up. That matters.',
    'Partial progress is still progress.',
    'You did what you could. That is enough.',
    '2 minutes is better than zero.',
    'You tried. That counts.',
  ],
};

export function getRandomMessage(category: keyof typeof COZY_MESSAGES): string {
  const messages = COZY_MESSAGES[category];
  if (Array.isArray(messages)) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return 'You are doing great!';
}

export function getStreakMessage(days: number): string {
  const streakMessages: Record<number, string> = {
    3: 'You are building momentum!',
    7: 'One week of wins!',
    14: 'Two weeks strong!',
    30: 'A whole month! You are incredible!',
    100: 'ONE HUNDRED DAYS! You are a legend!',
  };
  return streakMessages[days] || `${days} days! Keep it up!`;
}
