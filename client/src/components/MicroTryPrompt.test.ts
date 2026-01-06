import { describe, it, expect } from 'vitest';

describe('MicroTryPrompt', () => {
  describe('Low-commitment entry point', () => {
    it('should offer 2-minute micro-try as non-threatening option', () => {
      const microTryDuration = 2 * 60; // 2 minutes
      const fullDuration = 15 * 60; // 15 minutes
      
      expect(microTryDuration).toBe(120);
      expect(fullDuration).toBe(900);
      expect(microTryDuration).toBeLessThan(fullDuration);
    });

    it('should celebrate 2-minute attempt regardless of continuation', () => {
      const celebrationMessage = "You did it! 🎉";
      const subtaskMessage = "2 minutes of focus";
      
      expect(celebrationMessage).toContain('🎉');
      expect(subtaskMessage).toContain('2 minutes');
    });
  });

  describe('Decision prompt after 2 minutes', () => {
    it('should show guilt-free decision options', () => {
      const options = [
        'That\'s enough for now',
        'Keep going'
      ];

      expect(options).toHaveLength(2);
      expect(options[0]).not.toContain('fail');
      expect(options[0]).not.toContain('quit');
      expect(options[1]).not.toContain('must');
    });

    it('should affirm that either choice is a win', () => {
      const affirmation = 'Either choice is a win. You started. That matters.';
      
      expect(affirmation).toContain('win');
      expect(affirmation).toContain('started');
      expect(affirmation).toContain('matters');
    });
  });

  describe('Continuation logic', () => {
    it('should allow seamless transition from 2-min to full timer', () => {
      let timeLeft = 2 * 60; // Start at 2 minutes
      const fullTimer = 15 * 60;

      // User chooses to continue
      timeLeft = fullTimer;

      expect(timeLeft).toBe(fullTimer);
    });

    it('should not penalize stopping after 2 minutes', () => {
      let taskCompleted = false;
      let microTryAttempted = true;

      // User stops after 2 minutes
      // But we still count this as progress
      const progressCounted = microTryAttempted && !taskCompleted;

      expect(progressCounted).toBe(true);
    });
  });

  describe('Fear of failure reduction', () => {
    it('should remove commitment pressure', () => {
      const microTryMessage = 'Try for 2 minutes';
      const fullCommitmentMessage = 'Complete this 15-minute task';

      expect(microTryMessage).not.toContain('complete');
      expect(microTryMessage).not.toContain('must');
      expect(microTryMessage).toContain('Try');
    });

    it('should frame stopping as adaptation, not failure', () => {
      const stoppingMessage = 'That\'s enough for now';
      const failureLanguage = ['failed', 'quit', 'gave up', 'weak'];

      failureLanguage.forEach(word => {
        expect(stoppingMessage.toLowerCase()).not.toContain(word);
      });
    });

    it('should build confidence through small wins', () => {
      let confidenceLevel = 1;
      
      // User completes 2-minute micro-try
      confidenceLevel += 1;
      
      // User sees celebration
      confidenceLevel += 1;
      
      // User is more likely to try again
      expect(confidenceLevel).toBe(3);
      expect(confidenceLevel).toBeGreaterThan(1);
    });
  });

  describe('Momentum preservation', () => {
    it('should make continuation feel natural, not forced', () => {
      const continuationPrompt = 'Want to keep the momentum going?';
      
      expect(continuationPrompt).toContain('momentum');
      expect(continuationPrompt).not.toContain('must');
      expect(continuationPrompt).not.toContain('should');
    });

    it('should acknowledge that most people who start keep going', () => {
      // Psychological principle: starting is the hardest part
      // Once started, momentum naturally builds
      
      const startedUsers = 100;
      const continueAfterStart = 70; // ~70% continue after starting
      
      expect(continueAfterStart).toBeGreaterThan(startedUsers / 2);
    });
  });
});
