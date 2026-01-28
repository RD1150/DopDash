/**
 * Demo Mode Analytics Tracking
 * Tracks user behavior during demo to optimize conversion funnel
 */

export interface DemoAnalyticsEvent {
  eventType: 'demo_start' | 'task_completed' | 'demo_gate_shown' | 'account_created' | 'demo_tutorial_shown' | 'demo_tutorial_completed';
  timestamp: number;
  taskCount?: number;
  timeSpentMs?: number;
  sessionId: string;
}

export class DemoAnalytics {
  private sessionId: string;
  private startTime: number;
  private events: DemoAnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.loadEvents();
  }

  private generateSessionId(): string {
    return `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadEvents(): void {
    const stored = localStorage.getItem('demo_analytics_events');
    if (stored) {
      try {
        this.events = JSON.parse(stored);
      } catch {
        this.events = [];
      }
    }
  }

  private saveEvents(): void {
    localStorage.setItem('demo_analytics_events', JSON.stringify(this.events));
  }

  trackDemoStart(): void {
    this.recordEvent('demo_start');
  }

  trackTaskCompleted(taskCount: number): void {
    this.recordEvent('task_completed', { taskCount });
  }

  trackDemoGateShown(taskCount: number): void {
    this.recordEvent('demo_gate_shown', { taskCount });
  }

  trackAccountCreated(taskCount: number): void {
    this.recordEvent('account_created', { taskCount });
  }

  trackDemoTutorialShown(): void {
    this.recordEvent('demo_tutorial_shown');
  }

  trackDemoTutorialCompleted(): void {
    this.recordEvent('demo_tutorial_completed');
  }

  private recordEvent(
    eventType: DemoAnalyticsEvent['eventType'],
    data?: { taskCount?: number }
  ): void {
    const event: DemoAnalyticsEvent = {
      eventType,
      timestamp: Date.now(),
      timeSpentMs: Date.now() - this.startTime,
      sessionId: this.sessionId,
      ...data,
    };

    this.events.push(event);
    this.saveEvents();

    // Log to console for debugging
    console.log('[Demo Analytics]', eventType, event);
  }

  getSessionMetrics() {
    const sessionEvents = this.events.filter(e => e.sessionId === this.sessionId);
    const demoStart = sessionEvents.find(e => e.eventType === 'demo_start');
    const accountCreated = sessionEvents.find(e => e.eventType === 'account_created');
    const tasksCompleted = sessionEvents.filter(e => e.eventType === 'task_completed').length;

    return {
      sessionId: this.sessionId,
      demoStarted: !!demoStart,
      accountCreated: !!accountCreated,
      tasksCompleted,
      conversionRate: accountCreated ? 1 : 0,
      timeSpentMs: Date.now() - this.startTime,
    };
  }

  getAllMetrics() {
    const allEvents = this.events;
    const demoSessions = new Set(allEvents.map(e => e.sessionId));
    const conversions = allEvents.filter(e => e.eventType === 'account_created').length;

    return {
      totalSessions: demoSessions.size,
      totalConversions: conversions,
      conversionRate: demoSessions.size > 0 ? conversions / demoSessions.size : 0,
      averageTasksBeforeConversion: conversions > 0
        ? allEvents
            .filter(e => e.eventType === 'task_completed')
            .reduce((sum, e) => sum + (e.taskCount || 0), 0) / conversions
        : 0,
    };
  }

  clearEvents(): void {
    this.events = [];
    localStorage.removeItem('demo_analytics_events');
  }
}

export const demoAnalytics = new DemoAnalytics();
