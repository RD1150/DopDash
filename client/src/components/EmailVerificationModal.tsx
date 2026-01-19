import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: EmailVerificationModalProps) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendCode = trpc.emailVerification.sendVerificationCode.useMutation();
  const verifyCode = trpc.emailVerification.verifyCode.useMutation();

  const handleSendCode = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await sendCode.mutateAsync({ email });
      toast.success('Verification code sent to your email!');
      setStep('code');
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode.mutateAsync({ code });
      toast.success('Email verified! Proceeding to checkout...');
      onVerified();
      // Reset form
      setStep('email');
      setEmail('');
      setCode('');
      onClose();
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast.error('Invalid or expired code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setCode('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Verify Your Email
          </DialogTitle>
          <DialogDescription>
            {step === 'email'
              ? 'Enter your email to receive a verification code'
              : 'Enter the 6-digit code we sent to your email'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'email' ? (
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSendCode();
                  }}
                />
              </div>
              <Button
                onClick={handleSendCode}
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.slice(0, 6))}
                  disabled={isLoading}
                  maxLength={6}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleVerifyCode();
                  }}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Check your email for the 6-digit code
                </p>
              </div>
              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep('email');
                  setCode('');
                }}
                disabled={isLoading}
                className="w-full"
              >
                Use Different Email
              </Button>
            </>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {step === 'email'
            ? 'We will never share your email with anyone'
            : 'Code expires in 10 minutes'}
        </p>
      </DialogContent>
    </Dialog>
  );
}
