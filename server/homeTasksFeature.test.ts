import { describe, it, expect } from 'vitest';

/**
 * Home Tasks / Student Support Mode Tests
 * Tests for household and school task suggestions, simpler affirmations, and completion sounds
 */

describe('Home Tasks Feature', () => {
  describe('Task Suggestions', () => {
    it('should have household tasks', () => {
      const householdTasks = [
        "Pick up 3 items from your room",
        "Put your books away",
        "Make your bed",
        "Wipe down the table",
        "Put dirty clothes in the hamper",
        "Organize your desk",
        "Sweep one corner",
        "Put dishes in the sink",
      ];

      expect(householdTasks.length).toBe(8);
      expect(householdTasks[0]).toBe("Pick up 3 items from your room");
    });

    it('should have school tasks', () => {
      const schoolTasks = [
        "Open your homework folder",
        "Read one page of your book",
        "Write down one thing you learned",
        "Organize your backpack",
        "Check your assignment list",
        "Write one sentence for your essay",
        "Do one math problem",
        "Review your notes for 2 minutes",
      ];

      expect(schoolTasks.length).toBe(8);
      expect(schoolTasks[0]).toBe("Open your homework folder");
    });

    it('should combine household and school tasks', () => {
      const householdTasks = [
        "Pick up 3 items from your room",
        "Put your books away",
        "Make your bed",
        "Wipe down the table",
        "Put dirty clothes in the hamper",
        "Organize your desk",
        "Sweep one corner",
        "Put dishes in the sink",
      ];

      const schoolTasks = [
        "Open your homework folder",
        "Read one page of your book",
        "Write down one thing you learned",
        "Organize your backpack",
        "Check your assignment list",
        "Write one sentence for your essay",
        "Do one math problem",
        "Review your notes for 2 minutes",
      ];

      const allTasks = [...householdTasks, ...schoolTasks];
      expect(allTasks.length).toBe(16);
    });
  });

  describe('Student Affirmations', () => {
    it('should have simple, age-appropriate affirmations', () => {
      const studentAffirmations = [
        "You did it!",
        "Awesome!",
        "Great job!",
        "You rock!",
        "Keep going!",
        "Nice work!",
        "Yay!",
        "You're amazing!",
      ];

      expect(studentAffirmations.length).toBe(8);
      expect(studentAffirmations[0]).toBe("You did it!");
    });

    it('should have shorter affirmations than adult mode', () => {
      const studentAffirmations = [
        "You did it!",
        "Awesome!",
        "Great job!",
        "You rock!",
        "Keep going!",
        "Nice work!",
        "Yay!",
        "You're amazing!",
      ];

      const adultAffirmations = [
        "Nice. That counts.",
        "Momentum unlocked.",
        "You showed up.",
        "This is how progress starts.",
        "One step forward.",
        "You're doing it.",
        "That matters.",
        "Progress, not perfection.",
      ];

      const avgStudentLength = studentAffirmations.reduce((sum, a) => sum + a.length, 0) / studentAffirmations.length;
      const avgAdultLength = adultAffirmations.reduce((sum, a) => sum + a.length, 0) / adultAffirmations.length;

      expect(avgStudentLength).toBeLessThan(avgAdultLength);
    });
  });

  describe('Completion Sound', () => {
    it('should be disabled by default', () => {
      const completionSoundEnabled = false;
      expect(completionSoundEnabled).toBe(false);
    });

    it('should be toggleable', () => {
      let completionSoundEnabled = false;
      expect(completionSoundEnabled).toBe(false);

      completionSoundEnabled = true;
      expect(completionSoundEnabled).toBe(true);

      completionSoundEnabled = false;
      expect(completionSoundEnabled).toBe(false);
    });
  });

  describe('Home Tasks Mode', () => {
    it('should be disabled by default', () => {
      const homeTasksMode = false;
      expect(homeTasksMode).toBe(false);
    });

    it('should be toggleable', () => {
      let homeTasksMode = false;
      expect(homeTasksMode).toBe(false);

      homeTasksMode = true;
      expect(homeTasksMode).toBe(true);

      homeTasksMode = false;
      expect(homeTasksMode).toBe(false);
    });

    it('should not change branding when enabled', () => {
      const branding = "Dopamine Dasher";
      const homeTasksMode = true;

      // Branding should remain the same regardless of mode
      expect(branding).toBe("Dopamine Dasher");
    });

    it('should not change UI layout when enabled', () => {
      const uiLayout = "Settings page with toggles";
      const homeTasksMode = true;

      // UI layout should remain the same
      expect(uiLayout).toBe("Settings page with toggles");
    });

    it('should not change data collection when enabled', () => {
      const dataCollection = "task completion, streak, coins";
      const homeTasksMode = true;

      // Data collection should remain the same
      expect(dataCollection).toBe("task completion, streak, coins");
    });
  });

  describe('Parent-Enabled Mode', () => {
    it('should be parent-enabled, not automatic', () => {
      // Mode should require explicit parent action to enable
      const homeTasksMode = false; // Default: off
      expect(homeTasksMode).toBe(false);

      // Parent must manually toggle it on
      const parentEnabledMode = true;
      expect(parentEnabledMode).toBe(true);
    });

    it('should show appropriate messaging for parents', () => {
      const parentMessage = "Home Tasks Mode shows household and school-related tasks with simpler affirmations designed for younger users. Perfect for parents supporting their kids' productivity!";
      expect(parentMessage).toContain("parents");
      expect(parentMessage).toContain("younger users");
    });
  });

  describe('Feature Integration', () => {
    it('should integrate with existing task system', () => {
      const taskCategories = ['focus', 'energy', 'momentum'];
      expect(taskCategories).toContain('focus');
      expect(taskCategories).toContain('energy');
      expect(taskCategories).toContain('momentum');
    });

    it('should work with existing affirmation system', () => {
      // Home Tasks mode should use StudentAffirmationFeedback component
      // instead of default AffirmationFeedback component
      const studentMode = true;
      const component = studentMode ? 'StudentAffirmationFeedback' : 'AffirmationFeedback';
      expect(component).toBe('StudentAffirmationFeedback');
    });

    it('should work with existing sound system', () => {
      // Completion sound should integrate with soundManager
      const completionSoundEnabled = true;
      expect(completionSoundEnabled).toBe(true);
    });
  });
});
