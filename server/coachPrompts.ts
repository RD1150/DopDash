/**
 * Context-Aware Prompt Builder for AI Coach
 * Generates personalized system prompts based on user state and situation
 */

import { NervousSystemState, getTechniquesForState } from './therapyKnowledgeBase';

export interface CoachContext {
  nervousSystemState: NervousSystemState;
  tasksCompleted?: number;
  currentMood?: number; // 1-5
  recentChallenge?: string;
  streakDays?: number;
  conversationHistory?: Array<{ role: string; message: string }>;
}

/**
 * Get state-specific guidance
 */
function getStateGuidance(state: NervousSystemState): string {
  const guidance: Record<NervousSystemState, string> = {
    squirrel: `The user's nervous system is in "squirrel" mode - scattered, overwhelmed, jumping between thoughts. 
    They need:
    - Permission to start small (2-5 minute tasks)
    - Reassurance that their scattered brain is normal for ADHD
    - Grounding techniques to anchor them
    - Micro-commitments instead of big goals
    - Celebration of tiny wins`,
    
    tired: `The user's nervous system is in "tired" mode - low energy, low dopamine, activation energy is high.
    They need:
    - Movement or stimulation FIRST before tasks
    - Dopamine stacking (pair boring task with something fun)
    - Permission to rest without guilt
    - Micro-movements to build momentum
    - Validation that low energy is a nervous system state, not laziness`,
    
    focused: `The user's nervous system is in "focused" mode - good energy, ready for work, dopamine is flowing.
    They need:
    - Encouragement to ride this wave
    - Permission to do deeper work now
    - Strategies to protect this state
    - Reminders to take breaks
    - Celebration of their momentum`,
    
    hurting: `The user's nervous system is in "hurting" mode - pain, dysregulation, overwhelm, possibly shutdown.
    They need:
    - Compassion and validation above all else
    - Permission to do NOTHING if needed
    - Gentle grounding and self-care first
    - Smallest possible actions (or rest)
    - Reassurance that this is temporary
    - Distress tolerance skills`
  };
  
  return guidance[state];
}

/**
 * Get challenge-specific techniques
 */
function getTechniquesForChallenge(challenge: string, state: NervousSystemState): string {
  const techniques = getTechniquesForState(state);
  
  // Map common challenges to relevant technique categories
  const challengeKeywords: Record<string, string[]> = {
    overwhelm: ['grounding', 'emotion'],
    procrastination: ['motivation', 'breakdown'],
    'can\'t start': ['motivation', 'breakdown'],
    'too many tasks': ['breakdown', 'cognitive'],
    'feeling bad': ['emotion', 'cognitive'],
    'anxious': ['grounding', 'emotion'],
    'tired': ['motivation', 'emotion'],
    'stuck': ['motivation', 'breakdown'],
    'perfectionism': ['cognitive', 'breakdown'],
    'shame': ['cognitive', 'emotion']
  };
  
  let relevantCategories: string[] = [];
  for (const [keyword, categories] of Object.entries(challengeKeywords)) {
    if (challenge.toLowerCase().includes(keyword)) {
      relevantCategories = categories;
      break;
    }
  }
  
  if (relevantCategories.length === 0) {
    relevantCategories = ['grounding', 'motivation'];
  }
  
  const filtered = techniques.filter(t => relevantCategories.includes(t.category));
  
  if (filtered.length === 0) {
    return '';
  }
  
  return filtered
    .slice(0, 3)
    .map(t => `- **${t.name}** (${t.duration} min): ${t.description}`)
    .join('\n');
}

/**
 * Build context-aware system prompt for the coach
 */
export function buildCoachSystemPrompt(context: CoachContext): string {
  const stateGuidance = getStateGuidance(context.nervousSystemState);
  const techniques = getTechniquesForState(context.nervousSystemState);
  const techniqueList = techniques
    .slice(0, 5)
    .map(t => `- **${t.name}** (${t.duration} min): ${t.description}`)
    .join('\n');
  
  let challengeContext = '';
  if (context.recentChallenge) {
    const relevantTechniques = getTechniquesForChallenge(context.recentChallenge, context.nervousSystemState);
    challengeContext = `

**Specific Challenge:** ${context.recentChallenge}
${relevantTechniques ? `\nRelevant techniques for this challenge:\n${relevantTechniques}` : ''}`;
  }
  
  let progressContext = '';
  if (context.tasksCompleted !== undefined || context.streakDays !== undefined) {
    progressContext = '\n\n**User Progress:**';
    if (context.tasksCompleted !== undefined) {
      progressContext += `\n- Tasks completed today: ${context.tasksCompleted}`;
    }
    if (context.streakDays !== undefined) {
      progressContext += `\n- Current streak: ${context.streakDays} days`;
    }
    if (context.currentMood !== undefined) {
      progressContext += `\n- Current mood: ${context.currentMood}/5`;
    }
  }

  return `You are Dashie, a compassionate AI behavioral therapy coach for people with ADHD. Your role is to provide evidence-based support using CBT/DBT techniques tailored to the user's nervous system state.

**Current User State: ${context.nervousSystemState.toUpperCase()}**

${stateGuidance}

**Available Techniques for This State:**
${techniqueList}

**Your Coaching Style:**
1. Be warm, non-judgmental, and celebrate small wins
2. Acknowledge ADHD-specific challenges without shame
3. Suggest concrete, time-bounded techniques (2-5 minutes)
4. Use the techniques above when relevant to the user's situation
5. Keep responses concise (2-3 sentences max) unless they ask for more detail
6. Ask clarifying questions if needed
7. Celebrate progress: "You're doing great for an ADHD brain"
8. Reframe challenges: "This isn't laziness, it's activation energy"
9. Offer micro-wins: "What's the smallest step right now?"
10. Use encouraging tone with emojis sparingly
11. Remember: You're here to support, not fix. Some days are just survival days, and that's okay.
12. If they mention pain/dysregulation: Prioritize grounding and self-care over productivity

**Important Boundaries:**
- You are NOT a replacement for mental health treatment
- If someone mentions suicidal thoughts or severe crisis, encourage them to contact a mental health professional
- You can suggest techniques, but the user decides what works for them
- Celebrate their autonomy and choices${challengeContext}${progressContext}`;
}

/**
 * Build a follow-up prompt that references conversation history
 */
export function buildFollowUpContext(
  previousMessages: Array<{ role: string; message: string }>,
  currentState: NervousSystemState
): string {
  if (previousMessages.length === 0) {
    return '';
  }

  // Get the last 3 exchanges for context
  const recentExchanges = previousMessages.slice(-6);
  const context = recentExchanges
    .map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.message}`)
    .join('\n');

  return `\n\nRecent conversation context:\n${context}\n\nContinue supporting the user based on what you've learned about their situation.`;
}

/**
 * Generate a personalized opening message
 */
export function generateOpeningMessage(context: CoachContext): string {
  const openings: Record<NervousSystemState, string> = {
    squirrel: `Hey! I see your brain is in squirrel mode right now - scattered and jumping around. That's totally normal for ADHD. I'm here to help you find something small and doable. What's the main thing on your mind?`,
    
    tired: `I can tell you're running on low energy right now. That's not laziness - that's your nervous system asking for something different. Want to try something that might help you get moving? What would feel good to you?`,
    
    focused: `Nice! Your brain is in a good place right now. You've got momentum. What do you want to tackle while this energy is here?`,
    
    hurting: `I'm here with you. Sounds like things are tough right now. We don't need to push - let's focus on what would actually help you feel better. What do you need most right now?`
  };
  
  return openings[context.nervousSystemState];
}
