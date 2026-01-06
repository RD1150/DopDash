import { Button } from '@/components/ui/button';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DataExport() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const moodHistory = useStore((state) => state.moodHistory);
  const history = useStore((state) => state.history);
  const todaysActions = useStore((state) => state.todaysActions);
  const streak = useStore((state) => state.streak);
  const coins = useStore((state) => state.coins);
  const badges = useStore((state) => state.badges);

  const handleExportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      stats: {
        streak,
        coins,
        totalDaysActive: history.length,
        unlockedBadges: badges.filter(b => b.unlocked).length,
      },
      moodHistory,
      completionHistory: history,
      todaysActions,
      badges: badges.filter(b => b.unlocked),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dopamine-dasher-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Your data has been exported! 📥');
  };

  const handleDeleteAllData = () => {
    if (showDeleteConfirm) {
      // In a real app, this would clear localStorage
      localStorage.clear();
      toast.success('All data cleared. Refresh to start fresh.');
      window.location.reload();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Privacy Notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-foreground">🔒 Your Data is Private</p>
        <p className="text-xs text-muted-foreground">
          All your data is stored locally on your device. We never send it to any server. You have full control.
        </p>
      </div>

      {/* Export Button */}
      <Button
        onClick={handleExportData}
        className="w-full gap-2"
        variant="default"
      >
        <Download className="w-4 h-4" />
        Export My Data (JSON)
      </Button>

      <p className="text-xs text-muted-foreground">
        Download your mood history, completion stats, and badges as a backup.
      </p>

      {/* Delete Data Section */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <p className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</p>
        </div>

        <Button
          onClick={handleDeleteAllData}
          variant="outline"
          className="w-full gap-2 border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
          {showDeleteConfirm ? 'Click again to confirm' : 'Delete All Data'}
        </Button>

        <p className="text-xs text-muted-foreground">
          This will permanently delete all your data. This action cannot be undone.
        </p>
      </div>
    </div>
  );
}
