import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Crown, Check, Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from 'wouter';

export default function PremiumUpgrade() {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [, navigate] = useLocation();
  const { data: premiumStatus } = trpc.stripe.checkPremiumStatus.useQuery();
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();

  const handleUpgrade = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service to continue');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCheckout.mutateAsync();
      
      if (result.url) {
        toast.success('Redirecting to checkout...');
        // Open Stripe Checkout in new tab
        window.open(result.url, '_blank');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (premiumStatus?.isPremium) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-bold text-lg">Premium Active</h3>
            <p className="text-sm text-muted-foreground">
              You have lifetime access to all premium features!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-background border-primary/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-2xl">Upgrade to Premium</h3>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Unlock all features. One payment. Yours forever.
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-primary">$29.99</div>
          <div className="text-sm text-muted-foreground mt-1">Lifetime Access</div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {[
            'All premium themes (Cyberpunk, Ocean, Sunset, Lavender)',
            'Cloud sync across devices',
            'Advanced analytics and insights',
            'Custom mascot accessories',
            'Wallpaper generator',
            'Priority support',
            'All future updates included'
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
          <Checkbox
            id="terms-agree"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1"
          />
          <label htmlFor="terms-agree" className="text-sm text-muted-foreground cursor-pointer">
            I agree to the{' '}
            <button
              onClick={() => navigate('/terms')}
              className="text-primary hover:underline font-medium"
            >
              Terms of Service
            </button>
          </label>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleUpgrade}
          disabled={isLoading || !agreedToTerms}
          className="w-full h-14 text-lg font-bold"
          size="lg"
        >
          {isLoading ? (
            'Opening checkout...'
          ) : (
            <>
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Now
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Secure payment powered by Stripe
        </p>
      </div>
    </Card>
  );
}
