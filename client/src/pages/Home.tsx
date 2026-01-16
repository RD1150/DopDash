import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Zap, Target, Trophy, Sparkles, Heart, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Wins",
      description: "Bite-sized tasks designed for quick dopamine hits. No overwhelming lists."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "ADHD-Friendly",
      description: "Built by understanding executive dysfunction. No guilt, just progress."
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Gamified Progress",
      description: "Level up, earn coins, unlock badges. Make productivity actually fun."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Your Companion",
      description: "A virtual buddy that celebrates every win, no matter how small."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Streak Tracking",
      description: "Build momentum with streaks. Vacation mode protects your progress."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Boss Battles",
      description: "Turn overwhelming tasks into epic quests. Slay your dragons."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container max-w-4xl mx-auto px-4 pt-16 pb-12 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Dopamine Dasher
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Just start. That's enough.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The task manager that actually gets ADHD brains. No overwhelming lists. 
            No guilt trips. Just well-deserved wins that build momentum.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => setLocation('/vibe-check')}
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Start today
            </Button>
            <p className="text-sm text-muted-foreground">
              No login. No signup. No explanation wall.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Built Different</h2>
            <p className="text-muted-foreground">
              For brains that work differently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="bg-card border-2 border-border rounded-2xl p-6 space-y-3 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Social Proof / Testimonial Space */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-card border-2 border-border rounded-3xl p-8 md:p-12 text-center space-y-6"
        >
          <div className="space-y-4">
            <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
              "Finally, a productivity app that doesn't make me feel broken."
            </p>
            <p className="text-muted-foreground">
              — Every ADHD brain that's tried this
            </p>
          </div>

          <div className="pt-6">
            <Button
              size="lg"
              onClick={() => setLocation('/vibe-check')}
              className="text-lg px-8 py-6 rounded-full"
            >
              Try it now — it's free
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <p className="text-sm text-muted-foreground">
            Works offline • No account needed • Your data stays yours
          </p>
        </motion.div>
      </div>
    </div>
  );
}
