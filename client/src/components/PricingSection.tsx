import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SUBSCRIPTION_TIERS } from "@shared/subscriptionTiers";

export function PricingSection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Support when motivation is hard.
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free. Upgrade only if you want more support.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Tier */}
          <Card className="p-8 border-2 border-border">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Free — Always Available
              </h3>
              <p className="text-sm text-muted-foreground">
                Start without pressure.
              </p>
            </div>

            <p className="text-foreground mb-6">
              Dopamine Dasher is free to use and designed to help you begin — even on days when motivation feels low.
            </p>

            <div className="mb-8">
              <p className="text-sm text-muted-foreground font-medium mb-4">
                The free version is meant to help you start something small and feel a win — no guilt, no pressure.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Create and complete tasks",
                "Instant dopamine feedback",
                "Gentle rewards and progress tracking",
                "Calm, judgment-free experience",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full">
              Start Free
            </Button>
          </Card>

          {/* Premium Tier */}
          <Card className="p-8 border-2 border-accent bg-accent/5 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Recommended
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Premium Support
              </h3>
              <p className="text-sm text-muted-foreground">
                When you want things to feel easier.
              </p>
            </div>

            <p className="text-foreground mb-6">
              Premium is for days when decision fatigue, burnout, or ADHD paralysis get in the way. It adds extra support — not extra pressure.
            </p>

            <div className="mb-8">
              <div className="text-3xl font-bold text-foreground mb-2">
                $5.99<span className="text-lg font-normal text-muted-foreground"> / month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cancel anytime. No guilt.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Auto-Dash task suggestions",
                "Let the app suggest one small thing when you feel stuck.",
                "Low-Energy Mode",
                "Softer tasks and gentler language for hard days.",
                "Streak forgiveness",
                "Progress doesn't disappear if you miss a day.",
                "Custom rewards & feedback",
                "Adjust sounds, affirmations, and completion style.",
                "Gentle insights",
                "Learn what helps you start — without charts or productivity scores.",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mb-8 p-4 bg-background rounded-lg">
              <p className="text-sm italic text-muted-foreground">
                Premium isn't about doing more. It's about needing less effort to begin.
              </p>
            </div>

            <Button className="w-full bg-accent hover:bg-accent/90">
              Upgrade for More Support
            </Button>
          </Card>
        </div>

        {/* Trust Copy */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You'll never lose access to the free version.<br />
            Upgrade only if it feels helpful for you.
          </p>
        </div>

        {/* Differentiator Block */}
        <div className="mt-16 p-8 bg-muted rounded-lg text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Why Dopamine Dasher is different
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most productivity apps focus on doing more.<br />
            Dopamine Dasher focuses on starting — and feeling okay while you do.<br />
            <span className="font-semibold text-foreground">Built for ADHD brains, burnout days, and real life.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
