import { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, Zap, Heart, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  category: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'What is Dopamine Dasher?',
    answer: 'Dopamine Dasher is a task app designed specifically FOR ADHD brains, not against them. Formed with the knowledge and practice of hundreds of ADHD practitioners, it breaks projects into 2-5 minute micro-tasks and gives you instant dopamine rewards (confetti, animations, points) for each completion. This builds momentum without shame. The app understands that your brain works differently—and that\'s not broken, it\'s just different.',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    category: 'Getting Started',
    question: 'Why do I need to tell the app how I\'m feeling?',
    answer: 'Your nervous system state matters more than willpower. If you\'re "Squirrel" (overwhelmed), you need tiny micro-tasks to build momentum. If you\'re "Tired," you might need movement first to activate your brain. If you\'re "Hurting," rest is more productive than forcing tasks. By understanding your state first, Dopamine Dasher sequences tasks that will actually work for you TODAY, not some theoretical perfect version of you.',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    category: 'Getting Started',
    question: 'What\'s the Decision Tree?',
    answer: 'The Decision Tree is the smart core of Dopamine Dasher. Instead of picking tasks randomly, it asks: "How are you feeling?" → "How much time do you have?" → "What needs doing?" Then it sequences your tasks by activation energy (easiest first) so you build momentum. It\'s like having a coach who knows your brain and says "Start here, then here, then here" instead of overwhelming you with everything at once.',
    icon: <Target className="w-5 h-5" />,
  },

  {
    category: 'How It Works',
    question: 'What are "activation energy levels"?',
    answer: 'Activation energy is how much mental effort a task requires to START. Micro-tasks (2-3 min) have almost zero activation energy—open mail, stretch, drink water. Easy tasks (5-8 min) require a bit more focus. Medium tasks (10-20 min) need real concentration. Deep work (30+ min) requires flow state. The Decision Tree sequences them smartly: if you\'re overwhelmed, start with micro-tasks to build momentum. If you\'re focused, jump to deep work while your brain is ready.',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    category: 'How It Works',
    question: 'Why does it ask for time available first?',
    answer: 'Because honesty about capacity prevents shame spirals. If you only have 15 minutes, the app won\'t suggest a 45-minute project. Instead, it shows you exactly what you CAN accomplish in that time—maybe three micro-tasks that build momentum. This removes the guilt of "I didn\'t finish" and replaces it with "I started, and that\'s enough." Sometimes taking a 20-minute bath is more productive than forcing 15 minutes of grinding.',
    icon: <Target className="w-5 h-5" />,
  },
  {
    category: 'How It Works',
    question: 'What\'s the difference between Squirrel, Tired, Focused, and Hurting?',
    answer: 'These are nervous system states. **Squirrel** = overwhelmed, scattered, need micro-wins to build focus. **Tired** = low energy, need movement/activation before tasks. **Focused** = good energy, can tackle harder work. **Hurting** = physical or emotional pain, rest is more productive than forcing tasks. Each state gets different task sequences and warmup activities. The app doesn\'t judge—it just adapts.',
    icon: <Brain className="w-5 h-5" />,
  },

  {
    category: 'Dopamine & Rewards',
    question: 'Why does the app have confetti and animations?',
    answer: 'ADHD brains have lower baseline dopamine than neurotypical brains. This creates a "bucket with a hole"—dopamine drains fast, so you constantly seek quick hits (social media, junk food, doom scrolling). Dopamine Dasher provides HEALTHY dopamine hits: instant rewards for real accomplishments. Confetti, animations, points, and streaks activate your reward system so you stay motivated without the crash that comes from scrolling.',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    category: 'Dopamine & Rewards',
    question: 'What\'s a "dopamine menu"?',
    answer: 'A dopamine menu is a pre-planned list of activities organized by stimulation level. **Appetizers** (1-3 min quick hits): stretching, favorite song, cold water splash. **Entrées** (10-30 min): walking, journaling, cooking. **Sides** (accompaniments): podcasts, music, fidget tools. **Desserts** (high-stimulation, use sparingly): social media, video games. **Specials** (planned treats): concerts, massages. Instead of doom scrolling when overwhelmed, you pick an appetizer. This prevents the dopamine cliff crash.',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    category: 'Dopamine & Rewards',
    question: 'Why do I get points for tasks?',
    answer: 'Points create immediate, tangible feedback. Your brain sees the number go up and gets a dopamine hit. This is especially important for ADHD brains that struggle with delayed gratification. Points also let you "buy" dopamine multiplier upgrades—a progression system that makes you feel like you\'re advancing. The goal isn\'t to gamify life into addiction; it\'s to work WITH your neurobiology instead of against it.',
    icon: <Zap className="w-5 h-5" />,
  },

  {
    category: 'Common Struggles',
    question: 'I have a huge project. How do I break it down?',
    answer: 'Use the Brain Dump feature to list everything, then let the Decision Tree sequence it. Or manually break it into micro-tasks: instead of "clean kitchen," try "clear counters" (2 min) → "wash dishes" (5 min) → "sweep floor" (5 min). Each small completion gives you a dopamine hit and builds momentum. Your mail example is perfect: "open mail" (2 min) → "sort mail" (5 min) → "process bills" (10 min). Three wins instead of one overwhelming task.',
    icon: <Target className="w-5 h-5" />,
  },
  {
    category: 'Common Struggles',
    question: 'I keep starting but not finishing. Why?',
    answer: 'You might be starting with tasks that are too hard. The Decision Tree fixes this by starting with activation energy that matches your state. If you\'re Squirrel (overwhelmed), it suggests micro-tasks first. Finishing those builds momentum for harder tasks. Also, ADHD brains often need breaks—the app lets you pause the timer without guilt. Sometimes "I did 5 minutes and paused" is a win. Progress over perfection.',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    category: 'Common Struggles',
    question: 'What if I\'m having a really bad ADHD day?',
    answer: 'Tell the app you\'re "Hurting." It will suggest rest activities and gentle tasks only. Sometimes the most productive thing is a 20-minute bath, a walk, or just lying down. The app won\'t judge. ADHD isn\'t laziness—it\'s a neurological difference. Bad days are part of the cycle. The goal is sustainable progress, not heroic effort every single day. Rest is productive.',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    category: 'Common Struggles',
    question: 'I feel like I\'m cheating by using micro-tasks.',
    answer: 'You\'re not cheating—you\'re working with your brain instead of against it. Neurotypical brains can force themselves through boring tasks. ADHD brains need activation energy and dopamine hits to start. Micro-tasks aren\'t "easier"—they\'re smarter. Three 5-minute tasks that you actually complete are better than one 15-minute task you avoid. Progress is progress. Your brain works differently, and that\'s not a flaw to fix—it\'s a feature to leverage.',
    icon: <Brain className="w-5 h-5" />,
  },

  {
    category: 'Features & Customization',
    question: 'Can I create my own task sequences?',
    answer: 'Yes! The app comes with pre-built sequences (mail handling, cleaning, work flow, self-care), but you can create custom sequences. Tag tasks with activation energy levels (micro/easy/medium/deep) and dopamine menu categories (appetizer/entrée/side/dessert/special). The Decision Tree will sequence them intelligently based on your state and available time.',
    icon: <Target className="w-5 h-5" />,
  },
  {
    category: 'Features & Customization',
    question: 'What\'s a "streak"?',
    answer: 'A streak tracks consecutive task completions. Each completed task adds to your streak multiplier (1x → 1.5x → 2x → 2.5x). This creates compounding motivation: early wins make later tasks feel easier because your dopamine is already flowing. Streaks reset only on missed sequences, not individual tasks. Celebrate milestones (5, 10, 20, 50+ tasks) for extra dopamine hits.',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    category: 'Features & Customization',
    question: 'Can I pause the timer without it ruining my streak?',
    answer: 'Yes! The app includes pause functionality because ADHD brains often need breaks mid-task. Pausing doesn\'t reset your streak or count as failure. Sometimes you need water, a stretch, or a moment to breathe. The timer waits. When you\'re ready, you resume. This is intentional design—the inability to pause causes many ADHD people to close the app entirely, which defeats the purpose.',
    icon: <Heart className="w-5 h-5" />,
  },

  {
    category: 'Philosophy',
    question: 'Why is this different from other task apps?',
    answer: 'Most task apps assume your brain works like a neurotypical brain: you can force yourself through boring tasks, delay is fine, and willpower is enough. Dopamine Dasher assumes your brain is ADHD: you need instant feedback, activation energy matters, and dopamine regulation is foundational. It\'s not about productivity hacks—it\'s about understanding neurobiology and building systems that work WITH your brain instead of against it.',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    category: 'Philosophy',
    question: 'Is this app trying to make me addicted?',
    answer: 'No. The goal is sustainable progress, not addiction. Variable rewards (random dopamine bonuses) keep you engaged, but they\'re designed to reinforce real accomplishments, not endless scrolling. The dopamine menu helps you replace destructive dopamine-seeking (doom scrolling) with healthy alternatives (movement, creativity, rest). If you find yourself obsessing, that\'s a sign to use "Dopamine Fasting Mode" to take a break. The app should serve you, not control you.',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    category: 'Philosophy',
    question: 'What if I just want to use the timer without all the gamification?',
    answer: 'You can! The app has a "Zen Mode" that strips away confetti and animations. You still get task sequencing and the Decision Tree logic, but the experience is calmer. Some days you need dopamine hits; other days you need quiet focus. The app adapts to what you need.',
    icon: <Heart className="w-5 h-5" />,
  },

  {
    category: 'Support',
    question: 'I have feedback or found a bug.',
    answer: 'We\'d love to hear from you! Dopamine Dasher is built by understanding real ADHD experiences. Your feedback helps us make it better. Submit issues through the Settings page or email support. Every bug report and feature request helps us serve ADHD brains better.',
    icon: <Target className="w-5 h-5" />,
  },
];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Getting Started');

  const categories = Array.from(new Set(faqItems.map(item => item.category)));
  const filteredItems = faqItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-20">
      {/* Header */}
      <div className="container max-w-3xl mx-auto px-4 pt-12 pb-8 text-center space-y-4">
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about Dopamine Dasher and how it works with your ADHD brain.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="container max-w-3xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setExpandedIndex(null);
              }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-accent/50 text-muted-foreground hover:bg-accent'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="container max-w-3xl mx-auto px-4 space-y-3">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className="bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-md"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-start gap-4 hover:bg-accent/50 transition-colors text-left"
            >
              <div className="flex-shrink-0 text-primary mt-1">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-lg">
                  {item.question}
                </h3>
              </div>
              <div className="flex-shrink-0 text-muted-foreground mt-1">
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedIndex === index && (
              <div className="px-6 py-4 bg-accent/30 border-t border-border">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="container max-w-3xl mx-auto px-4 mt-16 py-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-200/50 dark:border-purple-800/50 text-center space-y-4">
        <h2 className="text-2xl font-bold">Still have questions?</h2>
        <p className="text-muted-foreground">
          We\'re here to help. Your brain works differently, and that\'s not broken—it\'s just different.
        </p>
      </div>
    </div>
  );
}
