// Push Notification Service for Dopamine Dasher
// Handles daily reminders and streak protection alerts

export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private scheduledNotifications: number[] = [];

  private constructor() {
    this.loadScheduledNotifications();
  }

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  private loadScheduledNotifications() {
    const stored = localStorage.getItem('scheduled_notifications');
    if (stored) {
      this.scheduledNotifications = JSON.parse(stored);
    }
  }

  private saveScheduledNotifications() {
    localStorage.setItem('scheduled_notifications', JSON.stringify(this.scheduledNotifications));
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  scheduleDailyReminder(hour: number = 9, minute: number = 0) {
    if (Notification.permission !== 'granted') {
      return;
    }

    // Calculate time until next notification
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    // Schedule the notification
    const timeoutId = window.setTimeout(() => {
      this.showNotification(
        'Time to Dash! 🎯',
        'Your future self will thank you for starting now.',
        'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026756998/UtisFcIFIvNTgjAT.png'
      );

      // Reschedule for next day
      this.scheduleDailyReminder(hour, minute);
    }, timeUntilNotification);

    this.scheduledNotifications.push(timeoutId);
    this.saveScheduledNotifications();
  }

  scheduleStreakProtection(streakDays: number) {
    if (Notification.permission !== 'granted' || streakDays === 0) {
      return;
    }

    // Schedule notification for 8 PM if user hasn't completed today's task
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(20, 0, 0, 0);

    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
      // Check if user completed today's task
      const lastActivity = localStorage.getItem('last_activity_date');
      const today = new Date().toDateString();

      if (lastActivity !== today) {
        this.showNotification(
          `Don't Break Your ${streakDays}-Day Streak! 🔥`,
          'Just one quick win to keep it going!',
          'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026756998/UtisFcIFIvNTgjAT.png'
        );
      }
    }, timeUntilReminder);

    this.scheduledNotifications.push(timeoutId);
    this.saveScheduledNotifications();
  }

  showNotification(title: string, body: string, icon?: string) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: icon || 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026756998/UtisFcIFIvNTgjAT.png',
        badge: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026756998/UtisFcIFIvNTgjAT.png',
        tag: 'dopamine-dasher',
        requireInteraction: false,
        silent: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  }

  clearAllNotifications() {
    this.scheduledNotifications.forEach(id => clearTimeout(id));
    this.scheduledNotifications = [];
    this.saveScheduledNotifications();
  }

  // Motivational messages for different times of day
  getMotivationalMessage(): string {
    const hour = new Date().getHours();
    const messages = {
      morning: [
        'Good morning! Let\'s make today count 🌅',
        'Rise and shine! Your future self is cheering for you 💪',
        'New day, fresh start. You\'ve got this! ✨',
      ],
      afternoon: [
        'Afternoon energy boost time! 🚀',
        'You\'re doing great! Keep the momentum going 🎯',
        'Quick win time! Let\'s dash through one task 💨',
      ],
      evening: [
        'Evening check-in: How are we doing? 🌙',
        'Wind down with one last win for today 🎉',
        'Almost there! Finish strong 💪',
      ],
    };

    let timeOfDay: 'morning' | 'afternoon' | 'evening';
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 18) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    const messageArray = messages[timeOfDay];
    return messageArray[Math.floor(Math.random() * messageArray.length)];
  }
}

export const notificationScheduler = NotificationScheduler.getInstance();
