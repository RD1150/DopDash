import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Share2, Copy, Users, Gift } from 'lucide-react';
import { toast } from 'sonner';

export default function InviteFriends() {
  const referralCode = useStore((state) => state.referralCode);
  const referredFriends = useStore((state) => state.referredFriends);
  const generateReferralCode = useStore((state) => state.generateReferralCode);

  const shareUrl = `${window.location.origin}?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied! 📋');
  };

  const handleGenerateNewCode = () => {
    const newCode = generateReferralCode();
    toast.success(`New code generated: ${newCode}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Dopamine Dasher',
          text: 'Join me on Dopamine Dasher - a task app designed FOR ADHD brains, not against them.',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-4">
      {/* Referral Code */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg space-y-3"
      >
        <p className="text-sm font-medium">Your Referral Code</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-3 bg-background rounded font-mono text-sm font-bold text-primary">
            {referralCode}
          </code>
          <Button
            onClick={handleCopyLink}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Link
        </Button>
        <Button
          onClick={handleGenerateNewCode}
          variant="outline"
          className="gap-2"
        >
          <Gift className="w-4 h-4" />
          New Code
        </Button>
      </div>

      {/* Referral Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-secondary/50 rounded-lg space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Friends Joined</p>
            <p className="text-2xl font-bold text-primary">{referredFriends.length}</p>
          </div>
          <Users className="w-8 h-8 text-primary/50" />
        </div>

        {referredFriends.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Your Community</p>
            <div className="flex flex-wrap gap-2">
              {referredFriends.map((friendId) => (
                <div
                  key={friendId}
                  className="px-2 py-1 bg-background rounded-full text-xs text-muted-foreground"
                >
                  Friend #{referredFriends.indexOf(friendId) + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Messaging */}
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-center space-y-2">
        <p className="text-xs font-medium text-primary">Build Your Accountability Circle</p>
        <p className="text-xs text-muted-foreground">
          Share your link. Show them what's possible. Together, you're unstoppable.
        </p>
      </div>

      {/* Referral Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-center"
      >
        <p className="text-xs font-medium text-accent mb-1">Referral Rewards</p>
        <p className="text-xs text-muted-foreground">
          Each friend who joins gives you +10 coins. {referredFriends.length > 0 && `You've earned ${referredFriends.length * 10} coins! 🎉`}
        </p>
      </motion.div>
    </div>
  );
}
