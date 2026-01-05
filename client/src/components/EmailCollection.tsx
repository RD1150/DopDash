import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { soundManager } from '@/lib/sound';
import { haptics } from '@/lib/haptics';

interface EmailCollectionProps {
  onClose?: () => void;
  inline?: boolean;
}

export default function EmailCollection({ onClose, inline = false }: EmailCollectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Store email in localStorage for now
      // TODO: Replace with actual GHL webhook or API endpoint
      const emails = JSON.parse(localStorage.getItem('collected_emails') || '[]');
      emails.push({
        email,
        timestamp: new Date().toISOString(),
        source: 'dopamine_dasher'
      });
      localStorage.setItem('collected_emails', JSON.stringify(emails));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      soundManager.playSuccess();
      haptics.celebrate();
      setIsSuccess(true);

      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={cn(
      "space-y-4",
      !inline && "bg-card border-2 border-border rounded-2xl p-6 shadow-lg"
    )}>
      {!inline && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Stay Connected</h3>
              <p className="text-sm text-muted-foreground">
                Get updates, tips, and exclusive features
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 space-y-3"
        >
          <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h4 className="font-bold text-lg">You're all set!</h4>
            <p className="text-sm text-muted-foreground">
              We'll keep you updated on new features and tips.
            </p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              disabled={isSubmitting}
              className={cn(
                "text-base",
                error && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Subscribe
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            No spam, ever. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {content}
    </motion.div>
  );
}
