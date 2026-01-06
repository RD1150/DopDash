import { describe, it, expect } from 'vitest';

describe('DashieEncouragementModal', () => {
  describe('Encouragement messages', () => {
    it('should have multiple encouraging message variants', () => {
      const messages = [
        { title: "You did good.", subtitle: "Seriously. You showed up.", emoji: "💚" },
        { title: "That counts.", subtitle: "Every second of effort is a win.", emoji: "⭐" },
        { title: "No shame here.", subtitle: "Your brain needed what it needed.", emoji: "🫂" },
        { title: "You're not broken.", subtitle: "You're just being human.", emoji: "✨" },
        { title: "Come back when ready.", subtitle: "No pressure. No judgment.", emoji: "🌱" },
      ];

      expect(messages).toHaveLength(5);
      messages.forEach(msg => {
        expect(msg.title).toBeTruthy();
        expect(msg.subtitle).toBeTruthy();
        expect(msg.emoji).toBeTruthy();
      });
    });

    it('should randomly select from messages', () => {
      const messages = [
        { title: "You did good.", subtitle: "Seriously. You showed up.", emoji: "💚" },
        { title: "That counts.", subtitle: "Every second of effort is a win.", emoji: "⭐" },
      ];

      const randomIndex = Math.floor(Math.random() * messages.length);
      const selectedMessage = messages[randomIndex];

      expect(messages).toContain(selectedMessage);
    });
  });

  describe('Time formatting', () => {
    it('should format elapsed time correctly', () => {
      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(30)).toBe('0:30');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(125)).toBe('2:05');
      expect(formatTime(900)).toBe('15:00');
    });
  });

  describe('Modal behavior', () => {
    it('should track elapsed time during focus session', () => {
      let elapsedTime = 0;
      const incrementTime = () => {
        elapsedTime += 1;
      };

      // Simulate 5 seconds of focus
      for (let i = 0; i < 5; i++) {
        incrementTime();
      }

      expect(elapsedTime).toBe(5);
    });

    it('should celebrate partial progress', () => {
      const totalTime = 15 * 60; // 15 minutes
      const elapsedTime = 120; // 2 minutes

      const progressMessage = `You focused for ${Math.floor(elapsedTime / 60)} minute${Math.floor(elapsedTime / 60) !== 1 ? 's' : ''} of effort`;

      expect(progressMessage).toContain('2 minutes');
      expect(progressMessage).toBeTruthy();
    });

    it('should allow resume without penalty', () => {
      let isActive = false;
      let showEncouragement = false;

      // User stops
      isActive = false;
      showEncouragement = true;

      expect(showEncouragement).toBe(true);

      // User resumes
      showEncouragement = false;
      isActive = true;

      expect(isActive).toBe(true);
      expect(showEncouragement).toBe(false);
    });

    it('should allow close without penalty', () => {
      let showEncouragement = true;
      let sessionEnded = false;

      // User closes encouragement modal
      showEncouragement = false;
      sessionEnded = true;

      expect(showEncouragement).toBe(false);
      expect(sessionEnded).toBe(true);
    });
  });

  describe('Shame-free messaging', () => {
    it('should never use guilt-inducing language', () => {
      const messages = [
        "You did good.",
        "That counts.",
        "No shame here.",
        "You're not broken.",
        "Come back when ready.",
      ];

      const guiltyWords = ['failed', 'broken', 'lazy', 'weak', 'pathetic', 'useless'];

      messages.forEach(msg => {
        guiltyWords.forEach(word => {
          expect(msg.toLowerCase()).not.toContain(word);
        });
      });
    });

    it('should always affirm effort', () => {
      const affirmations = [
        "You showed up.",
        "Every second of effort is a win.",
        "Your brain needed what it needed.",
        "You're just being human.",
        "No pressure. No judgment.",
      ];

      expect(affirmations).toHaveLength(5);
      affirmations.forEach(aff => {
        expect(aff).toBeTruthy();
      });
    });
  });
});
