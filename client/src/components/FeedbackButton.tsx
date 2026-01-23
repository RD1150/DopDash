import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitFeedback = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setFeedback('');
      setFeedbackType('general');
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Failed to submit feedback:', error);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    await submitFeedback.mutateAsync({
      type: feedbackType,
      message: feedback,
    });
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-40 p-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all hover:scale-110"
        title="Send feedback"
        aria-label="Send feedback"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed bottom-32 right-6 z-50 w-80 bg-card rounded-lg border border-border shadow-xl p-4">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-semibold mb-1">Thank you!</h3>
              <p className="text-sm text-muted-foreground">Your feedback helps us improve</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Send Feedback</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded"
                  aria-label="Close feedback"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Feedback Type */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Type
                  </label>
                  <div className="flex gap-2">
                    {(['bug', 'feature', 'general'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFeedbackType(type)}
                        className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                          feedbackType === type
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {type === 'bug' ? '🐛 Bug' : type === 'feature' ? '✨ Feature' : '💬 General'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none text-sm"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!feedback.trim() || isSubmitting}
                  className="w-full"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-3 text-center">
                Your feedback is anonymous and helps us improve
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
