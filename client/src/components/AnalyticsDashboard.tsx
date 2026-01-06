import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AnalyticsDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const statsQuery = trpc.analytics.getStats.useQuery({ date: today });
  const historyQuery = trpc.analytics.getHistory.useQuery({ days: 30 });

  const todayStats = statsQuery.data;
  const history = historyQuery.data || [];

  // Prepare chart data
  const chartData = history.map((stat) => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tasks: stat.tasksCompleted,
    habits: stat.habitsCompleted,
    mood: stat.moodAverage || 0,
  }));

  const totalTasks = history.reduce((sum, s) => sum + s.tasksCompleted, 0);
  const totalHabits = history.reduce((sum, s) => sum + s.habitsCompleted, 0);
  const avgMood = history.length > 0
    ? Math.round(history.reduce((sum, s) => sum + (s.moodAverage || 0), 0) / history.length)
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Analytics</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Today's Tasks</p>
          <p className="text-3xl font-bold">{todayStats?.tasksCompleted || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Today's Habits</p>
          <p className="text-3xl font-bold">{todayStats?.habitsCompleted || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-3xl font-bold">{todayStats?.currentStreak || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg Mood</p>
          <p className="text-3xl font-bold">{todayStats?.moodAverage || avgMood}/5</p>
        </Card>
      </div>

      {/* Tasks Chart */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Tasks & Habits Completed (30 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" fill="#4ade80" name="Tasks" />
            <Bar dataKey="habits" fill="#06b6d4" name="Habits" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Mood Trend */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Mood Trend (30 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#f97316"
              dot={false}
              name="Mood"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary Stats */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">30-Day Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Habits</p>
            <p className="text-2xl font-bold">{totalHabits}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Daily Tasks</p>
            <p className="text-2xl font-bold">
              {history.length > 0 ? (totalTasks / history.length).toFixed(1) : 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Mood</p>
            <p className="text-2xl font-bold">{avgMood}/5</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
