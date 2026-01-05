import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';



export default function Onboarding() {
  const [step, setStep] = useState<'intro' | 'flavor' | 'context' | 'theme'>('intro');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [showDashie, setShowDashie] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Navigation will be handled by window.location or Link components

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        alert('Success! You\'re on the list!');
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFlavorSelect = (flavor: string) => {
    setSelectedFlavor(flavor);
    setStep('context');
  };

  const handleContextSelect = (context: string) => {
    setSelectedContext(context);
    setStep('theme');
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    // Store selections and navigate to main app
    localStorage.setItem('dashie_flavor', selectedFlavor);
    localStorage.setItem('dashie_context', selectedContext);
    localStorage.setItem('dashie_theme', theme);
    window.location.href = '/dash'
  };

  return (
    <div className="relative w-full">
      {/* Animated background elements */}
      {!showDashie && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              y: [0, 40, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0
            }}
            className="absolute top-20 left-12 text-5xl opacity-20"
          >
            🚀
          </motion.div>
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, -15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-1/3 right-16 text-6xl opacity-15"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{
              y: [0, 30, 0],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-1/3 right-24 text-4xl opacity-25"
          >
            🎉
          </motion.div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col items-center justify-start pt-12 px-4 space-y-2"
          >
            {/* Hero Section */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col items-center space-y-1 text-center"
            >
              {/* Dashie Mascot */}
              <motion.img
                src="/images/mascot/hero.png"
                alt="Dashie - Your ADHD task buddy"
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
                style={{
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))'
                }}
              />
              
              {/* Title with sparkle */}
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-bold" style={{
                  color: 'hsl(var(--primary))',
                  filter: 'brightness(1.3)',
                  textShadow: '0 2px 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)'
                }}>
                  Dopamine Dasher
                </h1>
                <motion.span
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-3 -right-8 text-3xl"
                >
                  ✨
                </motion.span>
              </div>

              {/* Tagline */}
              <p className="text-base md:text-lg font-medium max-w-sm" style={{ color: 'hsl(var(--foreground) / 0.85)' }}>
                Finally, a task app that doesn't make you feel broken.
              </p>
            </motion.div>

            {/* Pain Point + Value Proposition */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-2 max-w-lg"
            >
              <p className="text-base font-semibold text-foreground/90 leading-relaxed">
                Staring at your to-do list for 20 minutes and doing nothing?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.8)' }}>
                Break free from task paralysis. Dopamine Dasher turns overwhelming projects into 2-5 minute wins. No judgment. No guilt. Just instant dopamine hits that actually get you moving.
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">✨ Instant gratification</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">🎮 Gamified rewards</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">🧠 ADHD-designed</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-1"
            >
              <Button 
                size="lg"
                onClick={() => {
                  setShowDashie(true);
                  setTimeout(() => {
                    setStep('flavor');
                  }, 300);
                }}
                className="text-base px-8 py-6"
              >
                Start Your First Win (Free) 🚀
              </Button>
              <p className="text-xs mt-1" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>
                ⚡ Takes 30 seconds to get your first dopamine hit
              </p>
              <p className="text-xs" style={{ color: 'hsl(var(--foreground) / 0.5)' }}>
                No login • No signup • No credit card
              </p>
            </motion.div>

            {/* Email Signup */}
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              onSubmit={handleEmailSubmit}
              className="space-y-1 w-full max-w-sm"
            >
              <p className="text-sm font-medium" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
                📧 Get notified when we add new features
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '...' : 'Notify Me'}
                </Button>
              </div>
              <p className="text-xs" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </motion.form>

            {/* Skip link */}
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              href="#how-it-works"
              className="text-xs font-medium underline hover:opacity-75 transition-opacity"
              style={{ color: 'hsl(var(--primary))' }}
            >
              Skip to How It Works ↓
            </motion.a>
          </motion.div>
        )}

        {step === 'flavor' && (
          <motion.div
            key="flavor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center">What's the enemy today?</h2>
            <p className="text-foreground/70 text-center">We'll adjust the vibe to match.</p>
            
            <div className="grid grid-cols-1 gap-3 max-w-sm w-full">
              {[
                { name: 'The Wall of Awful', desc: "I can't seem to start anything.", icon: '🧱' },
                { name: 'Squirrel Brain', desc: "I'm doing 10 things at once.", icon: '🐿️' },
                { name: 'The Blahs', desc: 'Low energy. Need a boost.', icon: '😑' }
              ].map((flavor) => (
                <motion.button
                  key={flavor.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFlavorSelect(flavor.name)}
                  className="p-4 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors text-left space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{flavor.icon}</span>
                    <p className="font-semibold">{flavor.name}</p>
                  </div>
                  <p className="text-sm text-foreground/70">{flavor.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'context' && (
          <motion.div
            key="context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center">What are we tackling?</h2>
            <p className="text-foreground/70 text-center">We'll load the right tools.</p>
            
            <div className="grid grid-cols-1 gap-3 max-w-sm w-full">
              {[
                { name: 'The Nest', desc: 'Chores, cleaning, life admin.', icon: '🏠' },
                { name: 'The Grind', desc: 'Work, study, emails.', icon: '💼' },
                { name: 'The Self', desc: 'Hygiene, health, routine.', icon: '🧘' }
              ].map((context) => (
                <motion.button
                  key={context.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContextSelect(context.name)}
                  className="p-4 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors text-left space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{context.icon}</span>
                    <p className="font-semibold">{context.name}</p>
                  </div>
                  <p className="text-sm text-foreground/70">{context.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'theme' && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center">Pick your companion</h2>
            <p className="text-foreground/70 text-center">What feels good to look at?</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
              {[
                { name: 'Cottagecore', icon: '🍃', color: 'bg-green-100' },
                { name: 'Cyberpunk', icon: '🤖', color: 'bg-slate-900' },
                { name: '🌊 Ocean', icon: '💙', color: 'bg-blue-100' },
                { name: '🌅 Sunset', icon: '🧡', color: 'bg-orange-100' }
              ].map((theme) => (
                <motion.button
                  key={theme.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeSelect(theme.name)}
                  className={`p-6 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors flex flex-col items-center gap-2 ${theme.color}`}
                >
                  <span className="text-3xl">{theme.icon}</span>
                  <p className="font-semibold text-sm">{theme.name}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 px-4 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: '1️⃣',
              title: 'Pick a tiny task',
              desc: 'Choose from pre-loaded micro-tasks or add your own. Each one takes 2-5 minutes max.'
            },
            {
              num: '2️⃣',
              title: 'Just do it',
              desc: 'No timers. No pressure. Just tap when you\'re done. That\'s it.'
            },
            {
              num: '3️⃣',
              title: 'Celebrate & level up',
              desc: 'Get instant rewards, XP, and watch your streak grow. Your brain gets the dopamine it craves.'
            }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-3 text-center"
            >
              <div className="text-4xl">{step.num}</div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-foreground/70">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">FAQ</h2>
        </div>

        <div className="space-y-6">
          {[
            {
              q: 'Do I need to sign up?',
              a: 'Nope! Just click "Let\'s Go!" and start. No email, no password, no friction. Your data saves locally on your device.'
            },
            {
              q: 'Is it really free?',
              a: 'Core features are 100% free forever. Premium themes and advanced features are available for a one-time $29.99 payment (no subscription).'
            },
            {
              q: 'What makes this different from other task apps?',
              a: 'Most apps overwhelm you with features and make you feel guilty. Dopamine Dasher breaks everything into 2-5 minute tasks and celebrates every win. It\'s designed specifically for ADHD brains that need instant rewards and zero judgment.'
            }
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold">{faq.q}</h3>
              <p className="text-foreground/70">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 max-w-2xl mx-auto space-y-8">
        <div className="space-y-6">
          {[
            {
              text: "I'd stare at my to-do list for 20 minutes and do nothing. This app made it so easy to just... start. The tiny tasks don't feel overwhelming.",
              author: 'Alex T., Creative Professional'
            },
            {
              text: "First app that doesn't make me feel broken. The gamification isn't cheesy - it's genuinely motivating. I actually cleaned my kitchen for the first time in weeks.",
              author: 'Jordan M., Software Developer'
            },
            {
              text: "The quick wins actually feel... achievable? I've tried every productivity app. This is the first one I actually open every day.",
              author: 'Sam R., Entrepreneur'
            }
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2 p-4 rounded-lg bg-foreground/5"
            >
              <p className="italic text-foreground/80">"{testimonial.text}"</p>
              <p className="text-sm font-semibold">— {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4 text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold">Ready to break free?</h2>
        <Button 
          size="lg"
          onClick={() => {
            setShowDashie(true);
            setTimeout(() => {
              setStep('flavor');
            }, 300);
          }}
          className="text-base px-8 py-6"
        >
          Just throw me in →
        </Button>
      </section>
    </div>
  );
}
