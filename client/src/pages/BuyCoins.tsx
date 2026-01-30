import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { ChevronLeft, Zap, Sparkles, Crown, Gem } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { COIN_PACKAGES, getTotalCoins } from '@shared/coinPackages';
import { trpc } from '@/lib/trpc';

export default function BuyCoins() {
  const [, setLocation] = useLocation();
  const coins = useStore((state) => state.coins);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create checkout session mutation
  const createCheckout = trpc.payments.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      setError(err.message || 'Failed to create checkout session');
      setIsLoading(false);
    },
  });

  const handleBuyCoins = async (packageId: string) => {
    setSelectedPackage(packageId);
    setIsLoading(true);
    setError(null);

    try {
      await createCheckout.mutateAsync({ packageId });
    } catch (err) {
      setError('Failed to process payment. Please try again.');
      setIsLoading(false);
    }
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'starter':
        return <Zap className="w-8 h-8" />;
      case 'boost':
        return <Sparkles className="w-8 h-8" />;
      case 'pro':
        return <Crown className="w-8 h-8" />;
      case 'elite':
        return <Gem className="w-8 h-8" />;
      default:
        return <Zap className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation('/shop')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Buy Coins</h1>
          <div className="text-sm font-semibold text-primary">
            {coins} coins
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Get More Coins</h2>
          <p className="text-muted-foreground">
            Unlock premium items and rewards for Dashie
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Coin Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {COIN_PACKAGES.map((pkg, index) => {
            const totalCoins = getTotalCoins(pkg);
            const isPopular = pkg.popular;
            const isSelected = selectedPackage === pkg.id;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer transition-all ${
                    isPopular ? 'ring-2 ring-primary md:col-span-2' : ''
                  } ${isSelected ? 'ring-2 ring-accent' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                      Most Popular
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{pkg.label}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                      </div>
                      <div className="text-primary">
                        {getPackageIcon(pkg.id)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Coin Display */}
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Total Coins
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {totalCoins.toLocaleString()}
                      </div>
                      {pkg.bonus && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                          +{pkg.bonus} bonus coins ({Math.round((pkg.bonus / pkg.coins) * 100)}% extra)
                        </div>
                      )}
                    </div>

                    {/* Price and Button */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="text-2xl font-bold">{pkg.priceUSD}</span>
                      </div>

                      <Button
                        onClick={() => handleBuyCoins(pkg.id)}
                        disabled={isLoading && isSelected}
                        className="w-full"
                        variant={isPopular ? 'default' : 'outline'}
                      >
                        {isLoading && isSelected ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          `Buy ${pkg.label}`
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Methods Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary/30 border border-secondary rounded-lg p-6 text-center"
        >
          <h3 className="font-semibold mb-3">Secure Payment Methods</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Apple Pay
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              PayPal
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Credit/Debit Card
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            All payments are processed securely by Stripe. Your card information is never stored locally.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
