import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Home, Volume2 } from 'lucide-react';

interface HomeTasksSettingsProps {
  homeTasksMode: boolean;
  completionSoundEnabled: boolean;
  onHomeTasksModeChange: (enabled: boolean) => void;
  onCompletionSoundChange: (enabled: boolean) => void;
}

export default function HomeTasksSettings({
  homeTasksMode,
  completionSoundEnabled,
  onHomeTasksModeChange,
  onCompletionSoundChange,
}: HomeTasksSettingsProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Home Tasks / Student Support
      </h2>

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {/* Home Tasks Mode Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Home Tasks Mode</p>
              <p className="text-sm text-muted-foreground">
                {homeTasksMode
                  ? 'Household & school tasks enabled'
                  : 'Enable for household & school tasks'}
              </p>
            </div>
          </div>
          <Switch
            checked={homeTasksMode}
            onCheckedChange={onHomeTasksModeChange}
          />
        </div>

        {/* Completion Sound Toggle */}
        {homeTasksMode && (
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Completion Sound</p>
                <p className="text-sm text-muted-foreground">
                  {completionSoundEnabled
                    ? 'Gentle sound on task completion'
                    : 'No sound (off by default)'}
                </p>
              </div>
            </div>
            <Switch
              checked={completionSoundEnabled}
              onCheckedChange={onCompletionSoundChange}
            />
          </div>
        )}
      </div>

      {/* Info Message */}
      {homeTasksMode && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong>Home Tasks Mode</strong> shows household and school-related tasks with simpler affirmations designed for younger users. Perfect for parents supporting their kids' productivity!
          </p>
        </div>
      )}
    </section>
  );
}
