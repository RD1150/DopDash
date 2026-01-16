import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

// Waitlist Form Component
function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Welcome to the waitlist! Check your email for updates.');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg border-2 border-primary/20 bg-background focus:outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: 'hsl(var(--primary))' }}
      >
        {loading ? 'Joining...' : 'Join Waitlist'}
      </button>
    </form>
  );
}

// Referral Program Component
function ReferralProgram() {
  const [referralCode] = useState('DASHIE' + Math.random().toString(36).substr(2, 9).toUpperCase());
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://dopamine-dasher.com?ref=${referralCode}`);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border-2 border-primary/20 bg-background">
        <p className="text-sm mb-2" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>Your Referral Code:</p>
        <p className="font-mono font-bold text-lg">{referralCode}</p>
      </div>
      <button
        onClick={handleCopy}
        className="w-full px-4 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'hsl(var(--primary))' }}
      >
        {copied ? '✓ Link Copied!' : 'Copy Referral Link'}
      </button>
      <p className="text-center text-sm" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>
        Share your link • Friend signs up • You both get premium free 🎉
      </p>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border-2 border-primary/20 rounded-xl overflow-hidden"
      initial={false}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
      >
        <p className="font-semibold text-base md:text-lg">{question}</p>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="p-6 pt-0" style={{ color: 'hsl(var(--foreground) / 0.8)' }}>
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl border-2 border-primary/20 bg-primary/5"
    >
      <p className="text-base md:text-lg mb-4 italic" style={{ color: 'hsl(var(--foreground) / 0.9)' }}>
        "{quote}"
      </p>
      <div>
        <p className="font-semibold text-base">{author}</p>
        <p className="text-sm" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>
          {role}
        </p>
      </div>
    </motion.div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState<'intro' | 'flavor' | 'context' | 'theme'>('intro');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const setContextStore = useStore((state) => state.setContext);
  const setThemeStore = useStore((state) => state.setTheme);
  const setFlavorStore = useStore((state) => state.setFlavor);

  const handleFlavorSelect = (flavor: string) => {
    setSelectedFlavor(flavor);
    setStep('context');
  };

  const handleContextSelect = (context: string) => {
    setSelectedContext(context);
    localStorage.setItem('dashie_context_temp', context);
    setStep('theme');
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    const finalContext = localStorage.getItem('dashie_context_temp') || 'The Self';
    const contextMap: Record<string, any> = { 'The Nest': 'nest', 'The Grind': 'grind', 'The Self': 'self' };
    const themeMap: Record<string, any> = { 'Cottagecore': 'cottagecore', 'Cyberpunk': 'cyberpunk', 'Ocean': 'ocean' };
    // Clear old storage to prevent persist middleware from loading stale state
    localStorage.removeItem('dopamine-dasher-storage');
    
    setFlavorStore(selectedFlavor as any);
    setContextStore(contextMap[finalContext] || 'self');
    setThemeStore(themeMap[theme] || 'default');
    localStorage.setItem('dashie_flavor', selectedFlavor);
    localStorage.setItem('dashie_context', finalContext);
    localStorage.setItem('dashie_theme', theme);
    localStorage.setItem('dashie_category_theme', `${finalContext}_${theme}`);
    localStorage.removeItem('dashie_context_temp');
    setTimeout(() => { window.location.href = '/dash'; }, 500);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6'],
      gravity: 0.8,
      scalar: 1.2,
      drift: 0
    });
  };

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-[#FFF9E6] to-[#FFFBF0]"
            style={{ backgroundColor: '#FFF9E6' }}
          >
            {/* Dashie - Large and prominent */}
            <div className="flex flex-col items-center mb-16">
              <motion.img
                src="/images/mascot/dashie-happy.png"
                alt="Dashie"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 md:w-40 md:h-40 object-contain mb-3"
                style={{
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))',
                  backgroundColor: 'transparent',
                  mixBlendMode: 'multiply'
                }}
              />
              <p className="text-lg md:text-xl font-semibold" style={{ color: 'hsl(var(--primary))' }}>
                Hi! I'm Dashie 👋
              </p>
            </div>

            {/* Title - Large, clear, centered */}
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-8" style={{
              color: 'hsl(var(--primary))',
              lineHeight: '1.2'
            }}>
              Dopamine Dasher
            </h1>

            {/* Tagline - Clear and simple */}
            <p className="text-xl md:text-2xl text-center mb-12 max-w-2xl" style={{ 
              color: 'hsl(var(--foreground) / 0.85)',
              lineHeight: '1.5'
            }}>
              Finally, a task app that doesn't make you feel broken.
            </p>

            {/* Pain Point - Big, readable */}
            <p className="text-lg md:text-xl font-semibold text-center mb-8 max-w-2xl" style={{
              color: 'hsl(var(--foreground) / 0.9)',
              lineHeight: '1.6'
            }}>
              Staring at your to-do list for 20 minutes and doing nothing?
            </p>

            {/* Value Prop - Bullets for scannability */}
            <div className="text-base md:text-lg text-center mb-16 max-w-2xl space-y-3" style={{
              color: 'hsl(var(--foreground) / 0.8)',
              lineHeight: '1.8'
            }}>
              <p>✅ Break free from task paralysis</p>
              <p>✅ Turn overwhelming projects into 2-5 minute wins</p>
              <p>✅ No judgment. No guilt.</p>
              <p>✅ Just instant dopamine hits that get you moving</p>
            </div>

            {/* CTA Button - Huge and prominent */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <Button 
                size="lg"
                onClick={() => {
                  triggerConfetti();
                  setTimeout(() => setStep('flavor'), 300);
                }}
                className="text-lg px-12 py-8 rounded-2xl"
              >
                Start Your First Win (Free) 🚀
              </Button>
            </motion.div>

            {/* See It In Action - Video Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full max-w-sm mb-16"
            >
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20">
                <video
                  width="100%"
                  height="auto"
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-auto rounded-2xl"
                  style={{ aspectRatio: '9/16' }}
                >
                  <source src="/videos/task-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-center mt-4 text-sm md:text-base" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
                See the dopamine magic in action ✨
              </p>
            </motion.div>

            {/* Friction reducers - Clear, easy to read */}
            <div className="text-center space-y-2 mb-12">
              <p className="text-sm md:text-base" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
                ⚡ Takes 30 seconds to get your first dopamine hit
              </p>
              <p className="text-sm md:text-base" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
                No login • No signup • No credit card
              </p>
            </div>

            {/* Trust Badge - Social Proof */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mb-12 px-6 py-4 rounded-2xl border-2 border-primary/20 bg-primary/5 inline-block"
            >
              <p className="text-center text-sm md:text-base font-semibold" style={{ color: 'hsl(var(--foreground) / 0.9)' }}>
                ✨ Trusted by 10K+ ADHD brains
              </p>
              <p className="text-center text-xs md:text-sm mt-2" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>
                38 visitors today • 8+ min average session
              </p>
            </motion.div>

            {/* Skip link - Simple */}
            <a
              href="#how-it-works"
              className="text-base font-medium underline hover:opacity-75 transition-opacity"
              style={{ color: 'hsl(var(--primary))' }}
            >
              Skip to How It Works ↓
            </a>
          </motion.div>
        )}

        {step === 'flavor' && (
          <motion.div
            key="flavor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">What's the enemy today?</h2>
            <p className="text-lg md:text-xl text-center mb-16 max-w-xl" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
              We'll adjust the vibe to match.
            </p>
            
            <div className="space-y-6 max-w-xl w-full">
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
                  className="w-full p-6 rounded-2xl border-2 border-primary/30 hover:border-primary/60 transition-colors text-left space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{flavor.icon}</span>
                    <p className="font-bold text-lg">{flavor.name}</p>
                  </div>
                  <p className="text-base text-foreground/70 ml-16">{flavor.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'context' && (
          <motion.div
            key="context"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">Where are you right now?</h2>
            <p className="text-lg md:text-xl text-center mb-4 max-w-xl" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
              Pick the context that fits your day.
            </p>
            <p className="text-xl md:text-2xl font-bold text-center mb-16 text-primary">
              Pick one 👇
            </p>
            
            <div className="space-y-6 max-w-xl w-full">
              {[
                { name: 'The Nest', desc: 'Home tasks & personal stuff', icon: '🏠' },
                { name: 'The Grind', desc: 'Work & productivity', icon: '💼' },
                { name: 'The Self', desc: 'Health & personal growth', icon: '🌱' }
              ].map((context) => (
                <motion.button
                  key={context.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContextSelect(context.name)}
                  className="w-full p-6 rounded-2xl border-2 border-primary/30 hover:border-primary/60 transition-colors text-left space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{context.icon}</span>
                    <p className="font-bold text-lg">{context.name}</p>
                  </div>
                  <p className="text-base text-foreground/70 ml-16">{context.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'theme' && (
          <motion.div
            key="theme"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">Pick your vibe</h2>
            <p className="text-lg md:text-xl text-center mb-16 max-w-xl" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
              Choose a theme that makes you happy.
            </p>
            
            <div className="space-y-6 max-w-xl w-full">
              {[
                { name: 'Cottagecore', icon: '🌿' },
                { name: 'Cyberpunk', icon: '🤖' },
                { name: 'Ocean', icon: '🌊' }
              ].map((theme) => (
                <motion.button
                  key={theme.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeSelect(theme.name)}
                  className="w-full p-6 rounded-2xl border-2 border-primary/30 hover:border-primary/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{theme.icon}</span>
                    <p className="font-bold text-lg">{theme.name}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ Section */}
        {step === 'intro' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-start pt-12 px-6 pb-12"
            id="how-it-works"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-lg md:text-xl text-center mb-16 max-w-2xl" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
              Everything you need to know about Dopamine Dasher
            </p>

            {/* Pricing Section */}
            <div className="w-full max-w-4xl mb-20 mt-8">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Tier */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 rounded-2xl border-2 border-primary/20 bg-primary/5"
                >
                  <h4 className="text-2xl font-bold mb-2">Free Forever</h4>
                  <p className="text-lg font-semibold mb-6" style={{ color: 'hsl(var(--primary))' }}>$0</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>Unlimited tasks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>Confetti rewards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>Basic themes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>Progress tracking</span>
                    </li>
                  </ul>
                  <p className="text-sm text-center" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>Perfect for getting started</p>
                </motion.div>

                {/* Premium Tier */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-8 rounded-2xl border-2 border-primary bg-primary/10 relative"
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                    <span className="text-white text-sm font-bold">Most Popular</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Premium</h4>
                  <p className="text-lg font-semibold mb-6" style={{ color: 'hsl(var(--primary))' }}>$29.99</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>Premium themes (Cyberpunk, Cottagecore, Ocean)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>Exclusive task templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span style={{ color: 'hsl(var(--primary))' }}>✓</span>
                      <span>One-time payment, forever</span>
                    </li>
                  </ul>
                  <p className="text-sm text-center" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>Lifetime access</p>
                </motion.div>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4 max-w-2xl w-full mb-16">
              {[
                {
                  q: 'How does Dopamine Dasher help with ADHD?',
                  a: 'It breaks overwhelming projects into 2-5 minute micro-tasks. Your brain gets instant dopamine rewards (confetti, animations) for each completion, building momentum without shame.'
                },
                {
                  q: 'Do I need to log in or pay to start?',
                  a: 'Nope! Try it free for 30 seconds. No login, no signup, no credit card. Ever.'
                },
                {
                  q: 'What if I want premium features?',
                  a: '$29.99 lifetime access unlocks premium themes, advanced analytics, and exclusive task templates. One-time payment, forever.'
                },
                {
                  q: 'Can I sync across devices?',
                  a: 'Yes! Create an account to sync your tasks, streaks, and progress across all your devices.'
                },
                {
                  q: 'Is my data private?',
                  a: 'Absolutely. We never sell your data. Your tasks and progress are encrypted and only visible to you.'
                },
                {
                  q: 'What if I forget to use the app?',
                  a: 'No judgment! The app is designed to be guilt-free. Pick it up anytime. Your streak resets, but your data stays. No shame, just a fresh start.'
                },
                {
                  q: 'Will this actually work for me?',
                  a: 'It\'s designed specifically for ADHD brains. But everyone\'s different. Try it free—if it doesn\'t click, no harm done. The dopamine hits are real though!'
                },
                {
                  q: 'Can I use it for big projects?',
                  a: 'Yes! Break any project into 2-5 minute tasks. Dopamine Dasher helps you chunk work into bite-sized wins so big projects feel manageable.'
                }
              ].map((item, idx) => (
                <FAQItem key={idx} question={item.q} answer={item.a} />
              ))}
            </div>

            {/* Testimonials Section */}
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 mt-8">What People Are Saying</h2>
            <p className="text-lg md:text-xl text-center mb-16 max-w-2xl" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
              Real stories from ADHD brains who finally got stuff done
            </p>

            <div className="space-y-6 max-w-2xl w-full">
              {[
                {
                  quote: "I've tried every productivity app. This is the first one that actually works for my ADHD brain. The confetti makes me smile every time.",
                  author: 'Sarah M.',
                  role: 'Designer with ADHD'
                },
                {
                  quote: "2-minute tasks sound silly until you realize you just completed 10 of them. The momentum is real. I'm actually getting things done.",
                  author: 'James T.',
                  role: 'Software Engineer'
                },
                {
                  quote: "No judgment, no guilt—just wins. That's what I needed. Finally feels like an app built FOR me, not against me.",
                  author: 'Maya P.',
                  role: 'Student with ADHD'
                },
                {
                  quote: "I can finally put the entire dishwasher away before randomly switching to something else. I think it's the dopamine spikes this app helps me get.",
                  author: 'MomTo3',
                  role: 'Parent with ADHD'
                },
                {
                  quote: "5-minute homework sprints changed my life. I went from staring at my textbook for 2 hours doing nothing to actually grinding through assignments. The streak counter keeps me accountable.",
                  author: 'Alex K.',
                  role: 'College Student with ADHD'
                }
              ].map((testimonial, idx) => (
                <TestimonialCard key={idx} {...testimonial} />
              ))}
            </div>

            {/* Email Waitlist Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl mt-20 mb-20 p-8 rounded-2xl border-2 border-primary/20 bg-primary/5"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">Join the Waitlist</h3>
              <p className="text-center mb-6" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
                Get early access to premium features and exclusive task templates
              </p>
              <WaitlistForm />
            </motion.div>

            {/* Referral Program Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-2xl mb-20 p-8 rounded-2xl border-2 border-primary bg-primary/10"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">Refer & Get Premium Free</h3>
              <p className="text-center mb-6" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
                Invite friends to Dopamine Dasher. When they sign up, you both get lifetime premium access!
              </p>
              <ReferralProgram />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
