import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import confetti from 'canvas-confetti';

export function HabitTracker() {
  const [newHabitName, setNewHabitName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const habitsQuery = trpc.habits.list.useQuery();
  const createHabitMutation = trpc.habits.create.useMutation({
    onSuccess: () => {
      habitsQuery.refetch();
      setNewHabitName('');
      setShowForm(false);
    },
  });

  const completeHabitMutation = trpc.habits.complete.useMutation({
    onSuccess: () => {
      habitsQuery.refetch();
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#06b6d4', '#f97316', '#ec4899', '#8b5cf6'],
      });
    },
  });

  const handleCreateHabit = async () => {
    if (!newHabitName.trim()) return;
    await createHabitMutation.mutateAsync({
      name: newHabitName,
      frequency: 'daily',
      targetCount: 1,
    });
  };

  const handleCompleteHabit = (habitId: number) => {
    completeHabitMutation.mutate({ habitId });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Habits</h2>
        <Button onClick={() => setShowForm(!showForm)}>+ Add Habit</Button>
      </div>

      {showForm && (
        <Card className="p-4 space-y-3">
          <Input
            placeholder="Habit name (e.g., Take medication)"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleCreateHabit}
              disabled={createHabitMutation.isPending}
            >
              Create
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {habitsQuery.data?.map((habit) => (
          <Card key={habit.id} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{habit.name}</h3>
              <p className="text-sm text-muted-foreground">
                Streak: {habit.currentStreak} days
              </p>
            </div>
            <Button
              onClick={() => handleCompleteHabit(habit.id)}
              disabled={completeHabitMutation.isPending}
              className="bg-green-500 hover:bg-green-600"
            >
              ✓ Complete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
