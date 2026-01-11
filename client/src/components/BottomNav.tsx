import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, BarChart3, ShoppingBag, Settings, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/dash', label: 'Dash', icon: Home },
  { path: '/stats', label: 'Stats', icon: BarChart3 },
  { path: '/someday', label: 'Someday', icon: Archive },
  { path: '/shop', label: 'Shop', icon: ShoppingBag },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40"
    >
      <div className="flex items-center justify-around h-20 max-w-md mx-auto w-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <motion.button
              key={item.path}
              onClick={() => setLocation(item.path)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors relative',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-6 h-6 relative z-10" />
              <span className="text-xs font-medium relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
