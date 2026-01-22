import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { AlertCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

type UserState = 'squirrel' | 'tired' | 'focused' | 'hurting';
type TimeAvailable = '5min' | '15min' | '30min' | '1hour' | '2plus';
type Step = 'state' | 'time' | 'tasks' | 'results';

const DEMO_TASKS = [
  { id: 1, title: 'Open all mail and discard junk', durationMinutes: 2, activationEnergy: 'micro' as const },
  { id: 2, title: 'Read through and categorize mail', durationMinutes: 5, activationEnergy: 'easy' as const },
  { id: 3, title: 'Address 3-5 mail items (bills, responses, shredding)', durationMinutes: 10, activationEnergy: 'medium' as const },
  { id: 4, title: 'Quick tidy - put items away', durationMinutes: 3, activationEnergy: 'micro' as const },
  { id: 5, title: 'Sweep kitchen', durationMinutes: 8, activationEnergy: 'easy' as const },
  { id: 6, title: 'Mop floors', durationMinutes: 20, activationEnergy: 'medium' as const },
  { id: 7, title: 'Check emails', durationMinutes: 5, activationEnergy: 'easy' as const },
  { id: 8, title: 'Respond to urgent messages', durationMinutes: 10, activationEnergy: 'medium' as const },
  { id: 9, title: 'Deep work on project', durationMinutes: 45, activationEnergy: 'deep' as const },
];

export default function BrainCheckDemo() {
  const [currentStep, setCurrentStep] = useState<Step>('state');
  const [selectedState, setSelectedState] = useState<UserState | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeAvailable | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [sequenceResult, setSequenceResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sequenceTasksMutation = trpc.decisionTree.sequenceTasks.useMutation();

  const timeOptions: { value: TimeAvailable; label: string }[] = [
    { value: '5min', label: '5 minutes' },
    { value: '15min', label: '15 minutes' },
    { value: '30min', label: '30 minutes' },
    { value: '1hour', label: '1 hour' },
    { value: '2plus', label: '2+ hours' },
  ];

  const handleStateSelect = (state: UserState) => {
    setSelectedState(state);
    setCurrentStep('time');
  };

  const handleTimeSelect = (time: TimeAvailable) => {
    setSelectedTime(time);
    setCurrentStep('tasks');
  };

  const toggleTask = (taskId: number) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSequence = async () => {
    if (!selectedState || !selectedTime || selectedTasks.length === 0) return;
    setIsLoading(true);
    try {
      const result = await sequenceTasksMutation.mutateAsync({
        userState: selectedState,
        timeAvailable: selectedTime,
        taskIds: selectedTasks,
      });
      setSequenceResult(result);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error sequencing tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('state');
    setSelectedState(null);
    setSelectedTime(null);
    setSelectedTasks([]);
    setSequenceResult(null);
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

  const getStateEmoji = (state: UserState) => {
    const emojis: Record<UserState, string> = {
      squirrel: '🐿️',
      tired: '😴',
      focused: '🎯',
      hurting: '🤕',
    };
    return emojis[state];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - with breathing room */}
      <div className="pt-8 pb-12 px-4 text-center border-b border-gray-100">
        <h1 className="text-4xl font-bold mb-3">Brain Check</h1>
        <p className="text-lg text-gray-600">Let's figure out what you actually need right now</p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress indicator - with spacing */}
        <div className="mb-12 flex gap-2">
          {(['state', 'time', 'tasks', 'results'] as Step[]).map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`h-2 flex-1 rounded-full transition-all ${
                  ['state', 'time', 'tasks', 'results'].indexOf(currentStep) >= index
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              />
              {index < 3 && <div className="w-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: State Assessment */}
        {currentStep === 'state' && (
          <div className="space-y-8">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl">How are you feeling right now?</CardTitle>
                <CardDescription className="text-base mt-2">Pick the state that matches your nervous system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(['squirrel', 'tired', 'focused', 'hurting'] as UserState[]).map(state => (
                  <button
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      selectedState === state
                        ? getStateColor(state) + ' border-current'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xl capitalize">{state}</div>
                        <div className="text-sm text-gray-600 mt-1">{getStateDescription(state)}</div>
                      </div>
                      <div className="text-4xl">{getStateEmoji(state)}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Spacer */}
            <div className="h-8" />
          </div>
        )}

        {/* Step 2: Time Assessment */}
        {currentStep === 'time' && selectedState && (
          <div className="space-y-8">
            {/* Show selected state as breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button onClick={() => setCurrentStep('state')} className="hover:text-blue-600">
                State
              </button>
              <span>→</span>
              <span className="font-semibold text-gray-900 capitalize">{selectedState}</span>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl">How much time do you have?</CardTitle>
                <CardDescription className="text-base mt-2">Be honest about what's realistic right now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {timeOptions.map(({ value: time, label }) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:shadow-md font-semibold text-lg ${
                      selectedTime === time
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Navigation buttons - with spacing */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('state')}
                className="flex-1 h-12"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>

            {/* Spacer */}
            <div className="h-8" />
          </div>
        )}

        {/* Step 3: Task Selection */}
        {currentStep === 'tasks' && selectedState && selectedTime && (
          <div className="space-y-8">
            {/* Show breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button onClick={() => setCurrentStep('state')} className="hover:text-blue-600">
                State
              </button>
              <span>→</span>
              <span className="capitalize">{selectedState}</span>
              <span>→</span>
              <button onClick={() => setCurrentStep('time')} className="hover:text-blue-600">
                Time
              </button>
              <span>→</span>
              <span className="font-semibold text-gray-900">{selectedTime === '2plus' ? '2+ hours' : selectedTime}</span>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl">What needs doing?</CardTitle>
                <CardDescription className="text-base mt-2">Select tasks from your brain dump</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {DEMO_TASKS.map(task => (
                    <label
                      key={task.id}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-base">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {task.durationMinutes}min • {task.activationEnergy}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('time')}
                className="flex-1 h-12"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSequence}
                disabled={isLoading || selectedTasks.length === 0}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sequencing...
                  </>
                ) : (
                  <>
                    Get My Sequence
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Spacer */}
            <div className="h-8" />
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 'results' && sequenceResult && (
          <div className="space-y-8">
            {/* State Summary - Hero card */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-sm">
              <CardHeader className="pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{getStateEmoji(selectedState!)}</span>
                  <div>
                    <CardTitle className="text-3xl">Your Personalized Sequence</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Based on your {selectedState} state and {selectedTime === '2plus' ? '2+ hours' : selectedTime} available
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Spacer */}
            <div className="h-6" />

            {/* Validation Summary */}
            <Card className={`border-0 shadow-sm ${sequenceResult.isValid ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className={sequenceResult.isValid ? 'text-green-600 text-2xl' : 'text-yellow-600 text-2xl'}>
                    {sequenceResult.isValid ? '✓' : '⚠'}
                  </span>
                  Sequence Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Duration</div>
                    <div className="text-3xl font-bold">{sequenceResult.totalDuration}m</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
                    <div className="text-3xl font-bold text-green-600">{sequenceResult.timeRemaining}m</div>
                  </div>
                </div>

                {sequenceResult.warnings.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                    {sequenceResult.warnings.map((warning: string, i: number) => (
                      <div key={i} className="text-sm text-yellow-900 flex gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        {warning}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Spacer */}
            <div className="h-6" />

            {/* Sequenced Tasks */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">Your Task Sequence</CardTitle>
                <CardDescription className="text-base mt-2">In order, with timing and reasoning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sequenceResult.sequenced.map((task: any, index: number) => (
                  <div
                    key={index}
                    className="p-5 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white text-lg font-bold">
                            {task.order}
                          </span>
                          <span className="font-bold text-lg">{task.title}</span>
                        </div>
                        <div className="text-sm text-gray-600 ml-13">{task.reason}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-3xl font-bold text-blue-600">{task.estimatedDuration}m</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Spacer */}
            <div className="h-8" />

            {/* Action Buttons */}
            <div className="flex gap-3 pb-8">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 h-12"
              >
                Start Over
              </Button>
              <Button
                onClick={handleReset}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-base font-semibold"
              >
                Let's Go! 🚀
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
