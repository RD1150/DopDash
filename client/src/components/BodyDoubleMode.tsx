import { Button } from '@/components/ui/button';
import { Users, Heart } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface BodyDoubleFriend {
  id: string;
  name: string;
  streak: number;
  tasksCompleted: number;
  currentTask?: string;
}

export default function BodyDoubleMode() {
  const bodyDoubleModeEnabled = useStore((state) => state.bodyDoubleModeEnabled);
  const setBodyDoubleModeEnabled = useStore((state) => state.setBodyDoubleModeEnabled);
  const [activeFriends, setActiveFriends] = useState<BodyDoubleFriend[]>([
    { id: '1', name: 'Alex', streak: 12, tasksCompleted: 45, currentTask: 'Writing emails' },
    { id: '2', name: 'Jordan', streak: 8, tasksCompleted: 32, currentTask: 'Organizing files' },
  ]);

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
        <div className="space-y-1">
          <p className="font-medium text-sm">Body Double Mode</p>
          <p className="text-xs text-muted-foreground">Focus together with friends</p>
        </div>
        <Button
          size="sm"
          variant={bodyDoubleModeEnabled ? 'default' : 'outline'}
          onClick={() => setBodyDoubleModeEnabled(!bodyDoubleModeEnabled)}
        >
          {bodyDoubleModeEnabled ? 'Active' : 'Inactive'}
        </Button>
      </div>

      {bodyDoubleModeEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Active Friends */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Users className="w-3 h-3 inline mr-1" />
              Friends Focusing Now
            </p>

            {activeFriends.length > 0 ? (
              <div className="space-y-2">
                {activeFriends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium">{friend.name}</p>
                      {friend.currentTask && (
                        <p className="text-xs text-muted-foreground">{friend.currentTask}</p>
                      )}
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>🔥 {friend.streak} day</span>
                        <span>✅ {friend.tasksCompleted} tasks</span>
                      </div>
                    </div>
                    <div className="text-lg animate-pulse">💚</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                No friends focusing right now. Invite them to join!
              </p>
            )}
          </div>

          {/* Messaging */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              <Heart className="w-3 h-3 inline mr-1 text-primary" />
              You're not alone. {activeFriends.length} friend{activeFriends.length !== 1 ? 's' : ''} focusing with you.
            </p>
          </div>

          {/* Join Session */}
          <Button className="w-full gap-2" variant="outline">
            <Users className="w-4 h-4" />
            Invite Friend to Focus
          </Button>
        </motion.div>
      )}
    </div>
  );
}
