import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

interface TaskBreakdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubTask {
  title: string;
  estimatedMinutes: number;
  icon: string;
}

export default function TaskBreakdown({ isOpen, onClose }: TaskBreakdownProps) {
  const [taskInput, setTaskInput] = useState('');
  const [context, setContext] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [showResults, setShowResults] = useState(false);
  const addAction = useStore((state) => state.addAction);

  const generateBreakdown = async () => {
    if (!taskInput.trim()) {
      toast.error('Please enter a task to break down');
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `You are an ADHD task breakdown expert. Break down this overwhelming task into 5-7 micro-steps that are:
- Specific and actionable (not vague)
- Ordered spatially (clockwise from door/entrance if physical space)
- Largest/most visible items first
- Each takes 2-10 minutes max
- Includes time estimate for each step

Task: "${taskInput}"
${context ? `Context: ${context}` : ''}
Time available: ${timeAvailable} minutes

Return ONLY a JSON array of objects with this exact format:
[
  {"title": "Pick up items near door", "estimatedMinutes": 2, "icon": "🚪"},
  {"title": "Clear desk surface", "estimatedMinutes": 5, "icon": "💻"}
]

Use relevant emojis for icons. Make titles SHORT (under 40 chars). Be specific and concrete.`;

      const response = await fetch('https://forge-api.manus.space/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_FRONTEND_FORGE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that breaks down tasks for people with ADHD. Always respond with valid JSON only, no markdown or explanations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate breakdown');
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      // Parse JSON response
      let parsed: SubTask[];
      try {
        // Remove markdown code blocks if present
        const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.error('Failed to parse AI response:', content);
        throw new Error('Invalid response format');
      }

      setSubtasks(parsed);
      setShowResults(true);
      toast.success('Task broken down successfully!');
    } catch (error) {
      console.error('Error generating breakdown:', error);
      toast.error('Failed to break down task. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addAllToQuickWins = () => {
    subtasks.forEach((subtask) => {
      addAction(subtask.title);
    });
    toast.success(`Added ${subtasks.length} Quick Wins!`, {
      description: 'Start with the first one and build momentum!',
    });
    handleClose();
  };

  const handleClose = () => {
    setTaskInput('');
    setContext('');
    setTimeAvailable('30');
    setSubtasks([]);
    setShowResults(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border-2 border-border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Break It Down</h2>
                <p className="text-sm text-muted-foreground">AI-powered task breakdown</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              ✕
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Task Input */}
                <div className="space-y-2">
                  <Label htmlFor="task">What's overwhelming you?</Label>
                  <Textarea
                    id="task"
                    placeholder="e.g., Clean the office, Organize garage, Pack for trip..."
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Context (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="context">Any context? (optional)</Label>
                  <Input
                    id="context"
                    placeholder="e.g., Haven't cleaned in weeks, lots of papers..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </div>

                {/* Time Available */}
                <div className="space-y-2">
                  <Label htmlFor="time">How much time do you have?</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="time"
                      type="number"
                      min="5"
                      max="120"
                      value={timeAvailable}
                      onChange={(e) => setTimeAvailable(e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateBreakdown}
                  disabled={isGenerating || !taskInput.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Breaking it down...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Break It Down
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Results Header */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
                  <h3 className="font-semibold mb-1">Your Breakdown</h3>
                  <p className="text-sm text-muted-foreground">
                    Start with step 1 and work your way through. You've got this! 💪
                  </p>
                </div>

                {/* Subtasks List */}
                <div className="space-y-3">
                  {subtasks.map((subtask, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border-2 border-border rounded-xl p-4 flex items-start gap-3 hover:border-primary/50 transition-all"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{subtask.icon}</span>
                          <h4 className="font-medium">{subtask.title}</h4>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>~{subtask.estimatedMinutes} min</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowResults(false)}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={addAllToQuickWins}
                    className="flex-1"
                    size="lg"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Add to Quick Wins
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
