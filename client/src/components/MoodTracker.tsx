import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

const MOODS = [
  { level: 1, emoji: '😢', label: 'Terrible' },
  { level: 2, emoji: '😕', label: 'Bad' },
  { level: 3, emoji: '😐', label: 'Okay' },
  { level: 4, emoji: '🙂', label: 'Good' },
  { level: 5, emoji: '😄', label: 'Amazing' },
];

const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<'low' | 'medium' | 'high' | null>(null);

  const todayMoodQuery = trpc.mood.getToday.useQuery();
  const checkInMutation = trpc.mood.checkIn.useMutation({
    onSuccess: () => {
      todayMoodQuery.refetch();
      setSelectedMood(null);
      setSelectedEnergy(null);
    },
  });

  const handleCheckIn = async () => {
    if (selectedMood === null || selectedEnergy === null) return;
    await checkInMutation.mutateAsync({
      moodLevel: selectedMood,
      energyLevel: selectedEnergy,
    });
  };

  const alreadyCheckedIn = !!todayMoodQuery.data;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">How are you feeling?</h2>

      {alreadyCheckedIn ? (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-green-800">
            ✓ You've already checked in today! {todayMoodQuery.data?.moodLevel === 5 ? '🎉' : ''}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-semibold">Mood</p>
            <div className="flex gap-2 justify-between">
              {MOODS.map((mood) => (
                <button
                  key={mood.level}
                  onClick={() => setSelectedMood(mood.level)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${
                    selectedMood === mood.level
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-semibold">Energy Level</p>
            <div className="flex gap-2">
              {ENERGY_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedEnergy(level)}
                  className={`flex-1 p-2 rounded-lg transition capitalize ${
                    selectedEnergy === level
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCheckIn}
            disabled={selectedMood === null || selectedEnergy === null || checkInMutation.isPending}
            className="w-full"
          >
            Check In
          </Button>
        </div>
      )}
    </div>
  );
}
