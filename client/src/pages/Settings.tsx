import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Theme, useStore } from '@/lib/store';
import { ChevronLeft, Moon, Palette, Volume2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const flavor = useStore((state) => state.flavor);
  const currentTheme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <header className="pt-6 pb-8 flex items-center gap-4">
          <button 
            onClick={() => setLocation('/streak')}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </header>

        <div className="space-y-8">
          {/* Flavor Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Reward Flavor</h2>
            <div 
              onClick={() => setLocation('/flavor')}
              className="bg-card p-4 rounded-xl border border-border flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors"
            >
              <div>
                <p className="font-medium capitalize">{flavor.replace(/-/g, ' ')}</p>
                <p className="text-sm text-muted-foreground">Tap to change style</p>
              </div>
              <ChevronLeft className="w-5 h-5 rotate-180 text-muted-foreground" />
            </div>
          </section>

          {/* Preferences */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preferences</h2>
            
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {/* Theme Selector */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Color Theme</p>
                    <p className="text-sm text-muted-foreground">Customize your vibe</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['default', 'ocean', 'sunset', 'lavender'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "p-3 rounded-xl text-sm font-medium transition-all border-2",
                        currentTheme === t 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-transparent bg-secondary/50 hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Gentle Nudges</p>
                    <p className="text-sm text-muted-foreground">Reminders to start</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Quiet Hours</p>
                    <p className="text-sm text-muted-foreground">10 PM - 8 AM</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </section>

          {/* Danger Zone (Reset) */}
          <section className="pt-8">
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
              Reset Day Start Time
            </Button>
            <p className="text-center text-xs text-muted-foreground/40 mt-4">
              Dopamine Dasher v1.0 • No tracking. No shame.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
