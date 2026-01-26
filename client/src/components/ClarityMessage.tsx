import { motion } from 'framer-motion';

interface ClarityMessageProps {
  showSubline?: boolean;
}

export default function ClarityMessage({ showSubline = true }: ClarityMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 mb-6 text-center"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        Pick one tiny action. Finish it. Get dopamine.
      </h2>
      {showSubline && (
        <p className="text-muted-foreground text-base md:text-lg">
          This app helps you start when you feel stuck.
        </p>
      )}
    </motion.div>
  );
}
