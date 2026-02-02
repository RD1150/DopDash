import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { SUBSCRIPTION_TIERS, calculateAnnualSavings } from "@shared/coinPackages";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function BuyCoins() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const createCheckoutMutation = trpc.payments.createCheckoutSession.useMutation();

  const handleSubscribe = async (tierId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setSelectedTier(tierId);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        tierId,
        billingPeriod,
      });

      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        toast.success("Opening checkout in a new tab...");
      }
    } catch (error) {
      toast.error("Failed to create checkout session");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Subscribe to Momentum</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Unlock Your Momentum</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose a subscription that fits your productivity goals
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "outline"}
              onClick={() => setBillingPeriod("monthly")}
              className="px-6"
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === "annual" ? "default" : "outline"}
              onClick={() => setBillingPeriod("annual")}
              className="px-6"
            >
              Annual
              <Badge className="ml-2 bg-green-500">Save 17%</Badge>
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const price = billingPeriod === "monthly" ? tier.monthlyPrice : tier.annualPrice;
            const priceDisplay = billingPeriod === "monthly" ? tier.monthlyPriceUSD : tier.annualPriceUSD;
            const period = billingPeriod === "monthly" ? "/month" : "/year";

            return (
              <Card
                key={tier.id}
                className={`relative p-8 transition-all ${
                  tier.popular
                    ? "ring-2 ring-accent scale-105 shadow-lg"
                    : "hover:shadow-lg"
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent">
                    Most Popular
                  </Badge>
                )}

                {/* Tier Name */}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold mb-1">
                    {priceDisplay}
                    <span className="text-lg text-muted-foreground font-normal">{period}</span>
                  </div>
                  {billingPeriod === "annual" && (
                    <p className="text-sm text-green-600 font-medium">
                      {calculateAnnualSavings(tier)}
                    </p>
                  )}
                </div>

                {/* Coins Info */}
                <div className="bg-accent/10 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Coins</p>
                  <p className="text-2xl font-bold">{tier.monthlyCoins.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    + {tier.dailyBonus} bonus coins daily
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-accent mt-1">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={selectedTier === tier.id && createCheckoutMutation.isPending}
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  size="lg"
                >
                  {createCheckoutMutation.isPending && selectedTier === tier.id
                    ? "Processing..."
                    : "Subscribe Now"}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Questions?</h2>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! Cancel your subscription at any time. You'll keep your coins through the end of your billing period.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold mb-2">Do unused coins expire?</h4>
              <p className="text-sm text-muted-foreground">
                No, your coins never expire. Use them whenever you want.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, Apple Pay, and PayPal through Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
