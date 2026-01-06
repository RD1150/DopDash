import Layout from '@/components/Layout';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { ArrowLeft, TrendingUp, Calendar, Zap, Award, Heart } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Stats() {
  const [, setLocation] = useLocation();
  const history = useStore((state) => state.history) || [];
  const streak = useStore((state) => state.streak);
  const moodHistory = useStore((state) => state.moodHistory) || [];
  
  // Mock data for the prototype - in real app would calculate from history
  const weeklyData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 3 },
    { name: 'Wed', tasks: 6 },
    { name: 'Thu', tasks: 2 },
    { name: 'Fri', tasks: 5 },
    { name: 'Sat', tasks: 3 },
    { name: 'Sun', tasks: 4 },
  ];

  // Calculate mood improvement average
  const avgMoodImprovement = moodHistory.length > 0
    ? (moodHistory.reduce((sum, entry) => sum + entry.improvement, 0) / moodHistory.length).toFixed(1)
    : 0;
  
  // Prepare mood trend data (last 7 entries)
  const moodTrendData = moodHistory.slice(-7).map((entry, idx) => ({
    day: `Day ${idx + 1}`,
    before: entry.beforeMood,
    after: entry.afterMood,
    improvement: entry.improvement
  }));

  const stats = [
    {
      label: "Current Streak",
      value: streak,
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      desc: "Days in a row"
    },
    {
      label: "Total Wins",
      value: history.length,
      icon: <Award className="w-5 h-5 text-purple-500" />,
      desc: "Tasks completed"
    },
    {
      label: "Avg Mood Boost",
      value: `+${avgMoodImprovement}`,
      icon: <Heart className="w-5 h-5 text-red-500" />,
      desc: "Per task"
    }
  ];

  return (
    <Layout className="pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation('/dash')}
          className="rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold">Your Stats</h1>
      </div>

      <div className="space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-6 rounded-2xl border border-border shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-muted rounded-xl">
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  {stat.desc}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mood Trend Chart - moved below stats */}

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-6 rounded-3xl border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Activity
            </h2>
            <select className="bg-muted text-sm rounded-lg px-3 py-1 border-none outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--popover)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="tasks" radius={[6, 6, 6, 6]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--primary)" opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mood Trend Chart */}
        {moodTrendData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card p-6 rounded-3xl border border-border shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Mood Trend
              </h2>
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                Last {moodTrendData.length} tasks
              </span>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodTrendData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ 
                      backgroundColor: 'var(--popover)',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="before" stroke="var(--muted-foreground)" name="Before" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="after" stroke="var(--primary)" name="After" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: moodTrendData.length > 0 ? 0.5 : 0.4 }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-3xl border border-primary/10"
        >
          <h3 className="font-bold text-lg mb-2 text-primary">💡 Insight</h3>
          {moodHistory.length > 0 ? (
            <p className="text-muted-foreground">
              Your mood improves by an average of <span className="font-bold text-foreground">+{avgMoodImprovement}</span> points per task. 
              <span className="block mt-2">Completing tasks genuinely helps your mood. Keep going!</span>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Start tracking your mood after completing tasks to see how they impact your wellbeing.
            </p>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
