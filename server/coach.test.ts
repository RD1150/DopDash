/**
 * Tests for AI Coach functionality
 * Covers therapy knowledge base, prompt building, and technique recommendations
 */

import { describe, it, expect } from 'vitest';
import {
  getAllTechniques,
  getTechniquesForState,
  getRandomTechniqueForState,
  groundingTechniques,
  motivationTechniques,
  breakdownTechniques,
  cognitiveTechniques,
  emotionTechniques
} from './therapyKnowledgeBase';
import {
  buildCoachSystemPrompt,
  generateOpeningMessage,
  type CoachContext
} from './coachPrompts';

describe('Therapy Knowledge Base', () => {
  it('should have all technique categories', () => {
    expect(groundingTechniques.length).toBeGreaterThan(0);
    expect(motivationTechniques.length).toBeGreaterThan(0);
    expect(breakdownTechniques.length).toBeGreaterThan(0);
    expect(cognitiveTechniques.length).toBeGreaterThan(0);
    expect(emotionTechniques.length).toBeGreaterThan(0);
  });

  it('should have at least 15 total techniques', () => {
    const allTechniques = getAllTechniques();
    expect(allTechniques.length).toBeGreaterThanOrEqual(15);
  });

  it('should return techniques for squirrel state', () => {
    const techniques = getTechniquesForState('squirrel');
    expect(techniques.length).toBeGreaterThan(0);
    expect(techniques.every(t => t.state.includes('squirrel'))).toBe(true);
  });

  it('should return techniques for tired state', () => {
    const techniques = getTechniquesForState('tired');
    expect(techniques.length).toBeGreaterThan(0);
    expect(techniques.every(t => t.state.includes('tired'))).toBe(true);
  });

  it('should return techniques for focused state', () => {
    const techniques = getTechniquesForState('focused');
    expect(techniques.length).toBeGreaterThan(0);
    expect(techniques.every(t => t.state.includes('focused'))).toBe(true);
  });

  it('should return techniques for hurting state', () => {
    const techniques = getTechniquesForState('hurting');
    expect(techniques.length).toBeGreaterThan(0);
    expect(techniques.every(t => t.state.includes('hurting'))).toBe(true);
  });

  it('should return random technique for each state', () => {
    const states = ['squirrel', 'tired', 'focused', 'hurting'] as const;
    states.forEach(state => {
      const technique = getRandomTechniqueForState(state);
      expect(technique).not.toBeNull();
      expect(technique?.state).toContain(state);
    });
  });

  it('should have unique technique IDs', () => {
    const allTechniques = getAllTechniques();
    const ids = allTechniques.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('each technique should have required fields', () => {
    const allTechniques = getAllTechniques();
    allTechniques.forEach(technique => {
      expect(technique.id).toBeDefined();
      expect(technique.name).toBeDefined();
      expect(technique.category).toBeDefined();
      expect(technique.state).toBeDefined();
      expect(technique.description).toBeDefined();
      expect(technique.steps).toBeDefined();
      expect(technique.steps.length).toBeGreaterThan(0);
      expect(technique.duration).toBeGreaterThan(0);
      expect(technique.evidence).toBeDefined();
      expect(technique.coachPrompt).toBeDefined();
    });
  });

  it('should have valid technique durations (1-5 minutes)', () => {
    const allTechniques = getAllTechniques();
    allTechniques.forEach(technique => {
      expect(technique.duration).toBeGreaterThanOrEqual(1);
      expect(technique.duration).toBeLessThanOrEqual(5);
    });
  });
});

describe('Coach Prompts', () => {
  it('should build system prompt for squirrel state', () => {
    const context: CoachContext = {
      nervousSystemState: 'squirrel'
    };
    const prompt = buildCoachSystemPrompt(context);
    expect(prompt).toContain('squirrel');
    expect(prompt).toContain('Dashie');
    expect(prompt).toContain('CBT');
    expect(prompt).toContain('DBT');
  });

  it('should build system prompt for tired state', () => {
    const context: CoachContext = {
      nervousSystemState: 'tired'
    };
    const prompt = buildCoachSystemPrompt(context);
    expect(prompt).toContain('tired');
    expect(prompt).toContain('low energy');
  });

  it('should build system prompt for focused state', () => {
    const context: CoachContext = {
      nervousSystemState: 'focused'
    };
    const prompt = buildCoachSystemPrompt(context);
    expect(prompt).toContain('focused');
    expect(prompt).toContain('momentum');
  });

  it('should build system prompt for hurting state', () => {
    const context: CoachContext = {
      nervousSystemState: 'hurting'
    };
    const prompt = buildCoachSystemPrompt(context);
    expect(prompt).toContain('hurting');
    expect(prompt).toContain('compassion');
  });

  it('should include context in system prompt', () => {
    const context: CoachContext = {
      nervousSystemState: 'squirrel',
      tasksCompleted: 3,
      streakDays: 5,
      currentMood: 3
    };
    const prompt = buildCoachSystemPrompt(context);
    expect(prompt).toContain('Tasks completed today: 3');
    expect(prompt).toContain('Current streak: 5 days');
    expect(prompt).toContain('Current mood: 3/5');
  });

  it('should include challenge context when provided', () => {
    const context: CoachContext = {
      nervousSystemState: 'squirrel',
      recentChallenge: 'Too many tasks and feeling overwhelmed'
    };
    const prompt = buildCoachSystemPrompt(context);
    expect(prompt).toContain('Too many tasks and feeling overwhelmed');
  });

  it('should generate opening message for squirrel state', () => {
    const context: CoachContext = {
      nervousSystemState: 'squirrel'
    };
    const message = generateOpeningMessage(context);
    expect(message).toContain('squirrel');
    expect(message.length).toBeGreaterThan(0);
  });

  it('should generate opening message for tired state', () => {
    const context: CoachContext = {
      nervousSystemState: 'tired'
    };
    const message = generateOpeningMessage(context);
    expect(message).toContain('low energy');
    expect(message.length).toBeGreaterThan(0);
  });

  it('should generate opening message for focused state', () => {
    const context: CoachContext = {
      nervousSystemState: 'focused'
    };
    const message = generateOpeningMessage(context);
    expect(message).toContain('momentum');
    expect(message.length).toBeGreaterThan(0);
  });

  it('should generate opening message for hurting state', () => {
    const context: CoachContext = {
      nervousSystemState: 'hurting'
    };
    const message = generateOpeningMessage(context);
    expect(message).toContain('tough');
    expect(message.length).toBeGreaterThan(0);
  });

  it('should include techniques in system prompt', () => {
    const context: CoachContext = {
      nervousSystemState: 'squirrel'
    };
    const prompt = buildCoachSystemPrompt(context);
    expect(prompt).toContain('Available Techniques');
    expect(prompt).toContain('min');
  });

  it('should include coaching guidelines in system prompt', () => {
    const context: CoachContext = {
      nervousSystemState: 'squirrel'
    };
    const prompt = buildCoachSystemPrompt(context);
    expect(prompt).toContain('warm');
    expect(prompt).toContain('non-judgmental');
    expect(prompt).toContain('celebrate');
  });
});

describe('Technique Coverage', () => {
  it('should have grounding techniques for squirrel state', () => {
    const techniques = getTechniquesForState('squirrel');
    const hasGrounding = techniques.some(t => t.category === 'grounding');
    expect(hasGrounding).toBe(true);
  });

  it('should have motivation techniques for tired state', () => {
    const techniques = getTechniquesForState('tired');
    const hasMotivation = techniques.some(t => t.category === 'motivation');
    expect(hasMotivation).toBe(true);
  });

  it('should have emotion techniques for hurting state', () => {
    const techniques = getTechniquesForState('hurting');
    const hasEmotion = techniques.some(t => t.category === 'emotion');
    expect(hasEmotion).toBe(true);
  });

  it('should have breakdown techniques for squirrel state', () => {
    const techniques = getTechniquesForState('squirrel');
    const hasBreakdown = techniques.some(t => t.category === 'breakdown');
    expect(hasBreakdown).toBe(true);
  });

  it('should have cognitive techniques for hurting state', () => {
    const techniques = getTechniquesForState('hurting');
    const hasCognitive = techniques.some(t => t.category === 'cognitive');
    expect(hasCognitive).toBe(true);
  });
});

describe('Technique Details', () => {
  it('should have valid step counts for all techniques', () => {
    const allTechniques = getAllTechniques();
    allTechniques.forEach(technique => {
      expect(technique.steps.length).toBeGreaterThanOrEqual(3);
      expect(technique.steps.length).toBeLessThanOrEqual(10);
    });
  });

  it('should have evidence descriptions for all techniques', () => {
    const allTechniques = getAllTechniques();
    allTechniques.forEach(technique => {
      expect(technique.evidence.length).toBeGreaterThan(5);
    });
  });

  it('should have coach prompts for all techniques', () => {
    const allTechniques = getAllTechniques();
    allTechniques.forEach(technique => {
      expect(technique.coachPrompt.length).toBeGreaterThan(10);
      expect(technique.coachPrompt).toContain('.');
    });
  });
});

describe('State Coverage', () => {
  it('all states should have at least 1 technique', () => {
    const states = ['squirrel', 'tired', 'focused', 'hurting'] as const;
    states.forEach(state => {
      const techniques = getTechniquesForState(state);
      expect(techniques.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('squirrel state should have multiple techniques', () => {
    const techniques = getTechniquesForState('squirrel');
    expect(techniques.length).toBeGreaterThanOrEqual(5);
  });

  it('tired state should have multiple techniques', () => {
    const techniques = getTechniquesForState('tired');
    expect(techniques.length).toBeGreaterThanOrEqual(3);
  });

  it('hurting state should have multiple techniques', () => {
    const techniques = getTechniquesForState('hurting');
    expect(techniques.length).toBeGreaterThanOrEqual(5);
  });

  it('should have techniques for multiple categories across all states', () => {
    const allTechniques = getAllTechniques();
    const categories = new Set(allTechniques.map(t => t.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });
});
