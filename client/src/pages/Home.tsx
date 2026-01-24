import { useLocation } from "wouter";
import { Zap, Target, Trophy, Sparkles, Heart, Brain, LogIn, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import PickAndWinSection from "@/components/PickAndWinSection";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

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
      title: "Bullseye Wins",
      description: "Dashie helps you hit your targets. Every win counts, no matter the size."
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
          {/* Early Access Badge */}
          <div className="inline-block mb-2">
            <span className="px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold border border-accent/30">
              🚀 Early Access
            </span>
          </div>

          {/* Dashie Character */}
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <motion.img
              src="/dashie-hero.png"
              alt="Dashie - Your task companion"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
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
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => setLocation('/dash')}
                className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => window.location.href = getLoginUrl()}
                  className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign Up Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation('/vibe-check')}
                  className="text-lg px-8 py-6 rounded-full"
                >
                  Try Demo
                </Button>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Free signup • Save your progress • No credit card needed
          </p>
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
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
                "Finally, a productivity app that doesn't make me feel broken."
              </p>
              <p className="text-muted-foreground">
                — Every ADHD brain that's tried this
              </p>
            </div>
            
            <div className="border-t border-border pt-6 space-y-4">
              <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
                "I can finally put the entire dishwasher away before randomly switching to something else. I think it's the dopamine spikes this app helps me get."
              </p>
              <p className="text-muted-foreground">
                — MomTo3
              </p>
            </div>
          </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated && (
                <Button
                  size="lg"
                  onClick={() => window.location.href = getLoginUrl()}
                  className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Create Free Account
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation('/vibe-check')}
                className="text-lg px-8 py-6 rounded-full"
              >
                {isAuthenticated ? "Start a New Task" : "Try Demo First"}
              </Button>
            </div>
        </motion.div>
      </div>

      {/* Pick & Win Section - Always show unless authenticated */}
      {!isAuthenticated ? (
        <PickAndWinSection
          onEmailCapture={(email, character, discountCode) => {
            const signupUrl = new URL(getLoginUrl());
            signupUrl.searchParams.set('email', email);
            signupUrl.searchParams.set('discount', discountCode);
            signupUrl.searchParams.set('character', character);
            window.location.href = signupUrl.toString();
          }}
        />
      ) : null}

      {/* Beta Tester Program */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-primary/20 py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="text-center space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">Join Our Beta Testers</h2>
              <p className="text-lg text-muted-foreground">Get lifetime free Pro access + shape Dopamine Dasher's future</p>
            </div>
            
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-8 space-y-4 inline-block">
              <div className="space-y-3">
                <p className="font-semibold text-foreground">What You Get:</p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Lifetime free Pro access (even after launch)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Early access to new features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Direct feedback channel with the creator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Beta tester badge in the app</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Limited spots available • First come, first served</p>
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const email = prompt('Enter your email to become a beta tester:');
                    if (email) {
                      alert('Thanks! We will be in touch soon.');
                    }
                  }}
                >
                  Become a Beta Tester
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <p className="text-sm text-muted-foreground">
            {isAuthenticated ? (
              <>Your progress is saved • Access anywhere • ADHD-friendly design</>
            ) : (
              <>Try free • Save your progress • Your data stays yours</>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
