/**
 * AI Coach Chat Component
 * Real-time behavioral therapy support with CBT/DBT techniques
 */

import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Lightbulb, Clock } from 'lucide-react';
import { Streamdown } from 'streamdown';

export type NervousSystemState = 'squirrel' | 'tired' | 'focused' | 'hurting';

interface CoachMessage {
  id: string;
  type: 'user' | 'coach';
  message: string;
  timestamp: Date;
  suggestedTechnique?: {
    id: string;
    name: string;
    description: string;
    duration: number;
    steps: string[];
  };
}

interface AICoachChatProps {
  nervousSystemState: NervousSystemState;
  context?: {
    tasksCompleted?: number;
    currentMood?: number;
    recentChallenge?: string;
    streakDays?: number;
  };
  onTechniqueSelected?: (techniqueId: string) => void;
  className?: string;
}

export function AICoachChat({
  nervousSystemState,
  context,
  onTechniqueSelected,
  className = ''
}: AICoachChatProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: '0',
      type: 'coach',
      message: `Hey! I'm Dashie, your ADHD coach. I'm here to help you navigate your ${nervousSystemState} brain right now. What's going on?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const chatMutation = trpc.coach.chat.useMutation({
    onSuccess: (data) => {
      const coachMessage: CoachMessage = {
        id: String(messages.length),
        type: 'coach',
        message: typeof data.message === 'string' ? data.message : "I'm here to help.",
        timestamp: data.timestamp,
        suggestedTechnique: data.suggestedTechnique || undefined
      };
      setMessages(prev => [...prev, coachMessage]);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
      const errorMessage: CoachMessage = {
        id: String(messages.length),
        type: 'coach',
        message: 'Sorry, I lost connection. Try again in a moment!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: CoachMessage = {
      id: String(messages.length),
      type: 'user',
      message: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Get coach response
    await chatMutation.mutateAsync({
      message: input,
      nervousSystemState,
      context
    });
  };

  const handleTechniqueClick = (techniqueId: string) => {
    onTechniqueSelected?.(techniqueId);
  };

  return (
    <div className={`flex flex-col h-full bg-background rounded-lg border border-border ${className}`}>
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {typeof msg.message === 'string' ? (
                    <Streamdown>{msg.message}</Streamdown>
                  ) : (
                    msg.message
                  )}
                </p>

                {/* Suggested Technique */}
                {msg.suggestedTechnique && msg.type === 'coach' && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold mb-1">
                          Try this:
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs h-auto py-2"
                          onClick={() => handleTechniqueClick(msg.suggestedTechnique!.id)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{msg.suggestedTechnique.name}</div>
                            <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {msg.suggestedTechnique.duration} min
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs opacity-60 mt-2">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-muted/30">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Tell me what's on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Tip: Describe what you're feeling or what you're struggling with
        </p>
      </div>
    </div>
  );
}
