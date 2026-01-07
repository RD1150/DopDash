import { useLocation } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
  label: string;
  path: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  const [, setLocation] = useLocation();

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center gap-2 text-sm px-4 py-2 overflow-x-auto', className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.path} className="flex items-center gap-2 whitespace-nowrap">
            <button
              onClick={() => setLocation(item.path)}
              className={cn(
                'transition-colors',
                isLast
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </button>
            {!isLast && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        );
      })}
    </motion.div>
  );
}
