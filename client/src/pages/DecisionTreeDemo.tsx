import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { AlertCircle, Loader2 } from 'lucide-react';

type UserState = 'squirrel' | 'tired' | 'focused' | 'hurting';
type TimeAvailable = '15min' | '30min' | '1hour' | '2plus';

const DEMO_TASKS = [
  // Mail tasks (low activation energy)
  { id: 1, title: 'Open all mail and discard junk', durationMinutes: 2, activationEnergy: 'micro' as const },
  { id: 2, title: 'Read through and categorize mail', durationMinutes: 5, activationEnergy: 'easy' as const },
  { id: 3, title: 'Address 3-5 mail items (bills, responses, shredding)', durationMinutes: 10, activationEnergy: 'medium' as const },
  
  // Cleaning tasks
  { id: 4, title: 'Quick tidy - put items away', durationMinutes: 3, activationEnergy: 'micro' as const },
  { id: 5, title: 'Sweep kitchen', durationMinutes: 8, activationEnergy: 'easy' as const },
  { id: 6, title: 'Mop floors', durationMinutes: 20, activationEnergy: 'medium' as const },
  
  // Work tasks
  { id: 7, title: 'Check emails', durationMinutes: 5, activationEnergy: 'easy' as const },
  { id: 8, title: 'Respond to urgent messages', durationMinutes: 10, activationEnergy: 'medium' as const },
  { id: 9, title: 'Deep work on project', durationMinutes: 45, activationEnergy: 'deep' as const },
];

export default function DecisionTreeDemo() {
  const [selectedState, setSelectedState] = useState<UserState>('squirrel');
  const [selectedTime, setSelectedTime] = useState<TimeAvailable>('30min');
  const [selectedTasks, setSelectedTasks] = useState<number[]>(
    DEMO_TASKS.slice(0, 3).map(t => t.id) // Default: mail tasks
  );
  const [sequenceResult, setSequenceResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sequenceTasksMutation = trpc.decisionTree.sequenceTasks.useMutation();

  const handleSequence = async () => {
    setIsLoading(true);
    try {
      const result = await sequenceTasksMutation.mutateAsync({
        userState: selectedState,
        timeAvailable: selectedTime,
        taskIds: selectedTasks,
      });
      setSequenceResult(result);
    } catch (error) {
      console.error('Error sequencing tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (taskId: number) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getStateColor = (state: UserState) => {
    const colors: Record<UserState, string> = {
      squirrel: 'bg-amber-100 border-amber-300',
      tired: 'bg-blue-100 border-blue-300',
      focused: 'bg-green-100 border-green-300',
      hurting: 'bg-red-100 border-red-300',
    };
    return colors[state];
  };

  const getStateDescription = (state: UserState) => {
    const descriptions: Record<UserState, string> = {
      squirrel: 'Overwhelmed, scattered, need to start small',
      tired: 'Low energy, need movement first',
      focused: 'Good energy, ready for deep work',
      hurting: 'Pain or dysregulated, need rest first',
    };
    return descriptions[state];
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Decision Tree Demo</h1>
        <p className="text-gray-600">Test the ADHD-informed task sequencing algorithm</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column: Input controls */}
        <div className="space-y-6">
          {/* State Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. How's your nervous system?</CardTitle>
              <CardDescription>Pick the state that matches you right now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['squirrel', 'tired', 'focused', 'hurting'] as UserState[]).map(state => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedState === state
                      ? getStateColor(state) + ' border-current'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold capitalize">{state}</div>
                  <div className="text-sm text-gray-600">{getStateDescription(state)}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle>2. How much time do you have?</CardTitle>
              <CardDescription>Pick your available time window</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {(['15min', '30min', '1hour', '2plus'] as TimeAvailable[]).map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border-2 font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {time === '2plus' ? '2+ hours' : time}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Task Selection */}
          <Card>
            <CardHeader>
              <CardTitle>3. What needs doing?</CardTitle>
              <CardDescription>Select tasks from your brain dump</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {DEMO_TASKS.map(task => (
                <label
                  key={task.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-gray-500">
                      {task.durationMinutes}min • {task.activationEnergy}
                    </div>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>

          <Button
            onClick={handleSequence}
            disabled={isLoading || selectedTasks.length === 0}
            className="w-full h-12 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sequencing...
              </>
            ) : (
              'Get My Task Sequence'
            )}
          </Button>
        </div>

        {/* Right column: Results */}
        <div className="space-y-6">
          {sequenceResult ? (
            <>
              {/* Validation */}
              <Card className={sequenceResult.isValid ? 'border-green-300' : 'border-yellow-300'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className={sequenceResult.isValid ? 'text-green-600' : 'text-yellow-600'}>
                      {sequenceResult.isValid ? '✓' : '⚠'}
                    </span>
                    Sequence Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Total Duration</div>
                    <div className="text-2xl font-bold">{sequenceResult.totalDuration} min</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Time Remaining</div>
                    <div className="text-lg font-semibold">{sequenceResult.timeRemaining} min</div>
                  </div>
                  {sequenceResult.warnings.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      {sequenceResult.warnings.map((warning: string, i: number) => (
                        <div key={i} className="text-sm text-yellow-800 flex gap-2">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sequenced Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Task Sequence</CardTitle>
                  <CardDescription>In order, with timing and reasoning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sequenceResult.sequenced.map((task: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold">
                              {task.order}
                            </span>
                            <span className="font-semibold">{task.title}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{task.reason}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-blue-600">{task.estimatedDuration}m</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-96">
              <CardContent className="text-center">
                <div className="text-gray-500">
                  <div className="text-lg font-medium mb-2">Your sequence will appear here</div>
                  <div className="text-sm">Select tasks and click "Get My Task Sequence"</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
