# Feature Architecture - Habit Tracking, Analytics, Mood Tracking

## Database Schema Extensions

### 1. Habits Table
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50), -- 'daily', 'weekly', 'custom'
  target_count INT, -- e.g., 3 for "3x daily"
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE habit_completions (
  id UUID PRIMARY KEY,
  habit_id UUID NOT NULL,
  user_id UUID NOT NULL,
  completed_at TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (habit_id) REFERENCES habits(id)
);
```

### 2. Mood Tracking Table
```sql
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_level INT (1-5), -- 1=Terrible, 5=Amazing
  energy_level VARCHAR(50), -- 'low', 'medium', 'high'
  notes TEXT,
  created_at TIMESTAMP
);
```

### 3. Analytics/Stats Table
```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE,
  tasks_completed INT,
  habits_completed INT,
  current_streak INT,
  mood_avg FLOAT,
  energy_avg FLOAT,
  updated_at TIMESTAMP
);
```

---

## Feature 1: Habit Tracking

### UI Components
1. **Habit List Page** - Show all habits with today's status
2. **Habit Creation Modal** - Add new habits
3. **Habit Completion Button** - Quick check-off with confetti
4. **Streak Counter** - Show current streak for each habit
5. **Habit History** - View past completions

### Key Features
- ✅ Create daily/weekly habits
- ✅ Set target count (e.g., "3x daily")
- ✅ Quick completion with confetti animation
- ✅ Streak counter with milestone celebrations
- ✅ Habit reminders (notifications)
- ✅ Habit history view

### User Flow
1. User clicks "Add Habit"
2. Enters habit name, frequency, target count
3. Habit appears in dashboard
4. User clicks to complete → confetti animation
5. Streak increments
6. At milestones (7, 30, 100 days) → special celebration

---

## Feature 2: Analytics Dashboard

### UI Components
1. **Stats Overview Card** - Total tasks, current streak, habits completed
2. **Weekly Chart** - Tasks completed per day (bar chart)
3. **Monthly Chart** - Tasks completed per week (line chart)
4. **Streak Visualization** - Calendar heatmap of completions
5. **Top Habits** - Most completed habits
6. **Productivity Trends** - Best day/time patterns

### Key Metrics
- Total tasks completed (all-time)
- Current streak (days)
- Weekly average
- Monthly average
- Habits completed today
- Best performing habits
- Productivity by day of week
- Productivity by time of day

### User Flow
1. User navigates to Analytics
2. Sees overview stats
3. Views weekly/monthly charts
4. Sees streak calendar
5. Identifies patterns and trends

---

## Feature 3: Mood/Energy Tracking

### UI Components
1. **Mood Check-in Button** - Quick 1-5 mood selector
2. **Energy Level Selector** - Low/Medium/High
3. **Mood History** - View past mood entries
4. **Mood Trends** - Chart of mood over time
5. **Correlation Analysis** - Link mood to task completion

### Key Features
- ✅ Quick 1-5 mood check-in (1=Terrible, 5=Amazing)
- ✅ Energy level tracking (Low/Medium/High)
- ✅ Optional notes for reflection
- ✅ Mood history view
- ✅ Mood trends chart
- ✅ Correlation with task completion

### User Flow
1. User clicks mood check-in button
2. Selects mood (1-5) and energy level
3. Optional: adds notes
4. Mood is recorded
5. User can view mood trends over time
6. See correlation between mood and productivity

---

## Implementation Plan

### Phase 1: Database & Backend (Week 1)
- [ ] Create habits table and migrations
- [ ] Create mood_entries table and migrations
- [ ] Create user_stats table and migrations
- [ ] Build API endpoints for habits (CRUD)
- [ ] Build API endpoints for mood tracking (CRUD)
- [ ] Build API endpoints for analytics (GET stats)

### Phase 2: Frontend - Habit Tracking (Week 1-2)
- [ ] Create Habit List component
- [ ] Create Habit Creation modal
- [ ] Create Habit Completion button with confetti
- [ ] Create Streak Counter display
- [ ] Create Habit History view
- [ ] Add habit reminders/notifications

### Phase 3: Frontend - Analytics Dashboard (Week 2)
- [ ] Create Analytics page layout
- [ ] Create Stats Overview card
- [ ] Create Weekly/Monthly charts (using Chart.js or Recharts)
- [ ] Create Streak Calendar heatmap
- [ ] Create Top Habits section
- [ ] Create Productivity Trends analysis

### Phase 4: Frontend - Mood Tracking (Week 2)
- [ ] Create Mood Check-in button/modal
- [ ] Create Energy Level selector
- [ ] Create Mood History view
- [ ] Create Mood Trends chart
- [ ] Add correlation analysis

### Phase 5: Integration & Polish (Week 3)
- [ ] Integrate habits into dashboard
- [ ] Integrate mood tracking into dashboard
- [ ] Integrate analytics into dashboard
- [ ] Add notifications for habit reminders
- [ ] Test all features
- [ ] Polish animations and UX

---

## Data Flow

### Habit Completion Flow
```
User clicks "Complete Habit"
→ API call to mark habit complete
→ Update habit_completions table
→ Calculate new streak
→ Trigger confetti animation
→ Update user_stats
→ Show streak milestone if applicable
```

### Mood Check-in Flow
```
User clicks mood check-in
→ Modal opens with mood selector
→ User selects mood (1-5) and energy
→ API call to save mood_entry
→ Update user_stats with mood average
→ Show mood trend chart
```

### Analytics Update Flow
```
Every day at midnight:
→ Calculate daily stats
→ Update user_stats table
→ Aggregate weekly/monthly stats
→ Generate charts and insights
```

---

## UI/UX Considerations

### Habit Tracking
- **Simplicity:** One-click completion (no confirmation needed)
- **Feedback:** Confetti on completion, streak counter updates
- **Motivation:** Show streaks, milestones, progress
- **ADHD-Friendly:** Quick, visual, celebratory

### Analytics Dashboard
- **Clarity:** Show key metrics at a glance
- **Visualization:** Charts are colorful and engaging
- **Trends:** Help users identify patterns
- **Motivation:** Show progress over time

### Mood Tracking
- **Simplicity:** Quick 1-click mood selector
- **Privacy:** Optional notes (no pressure to explain)
- **Insights:** Show mood trends and correlations
- **ADHD-Friendly:** Non-judgmental, reflective

---

## Success Metrics

### Habit Tracking
- Users create at least 1 habit
- Habit completion rate > 70%
- Streak milestones achieved

### Analytics Dashboard
- Users view analytics at least 1x per week
- Users understand their productivity patterns
- Increased motivation from seeing progress

### Mood Tracking
- Users check in mood at least 3x per week
- Users identify mood-productivity correlations
- Improved emotional awareness

---

## Next Steps
1. Review this architecture with user
2. Adjust based on feedback
3. Start Phase 1 (database & backend)
4. Build incrementally with testing
