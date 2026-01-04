import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Theme, useStore } from '@/lib/store';
import { ChevronLeft, Moon, Palette, Volume2, Bell, Download, Smartphone, Sparkles, Plane } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import WallpaperGenerator from '@/components/WallpaperGenerator';
import { AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const flavor = useStore((state) => state.flavor);
  const currentTheme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const notificationsEnabled = useStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useStore((state) => state.setNotificationsEnabled);
  const zenMode = useStore((state) => state.zenMode);
  const setZenMode = useStore((state) => state.setZenMode);
  const soundTheme = useStore((state) => state.soundTheme);
  const setSoundTheme = useStore((state) => state.setSoundTheme);
  const [showWallpaperGen, setShowWallpaperGen] = useState(false);
  const vacationMode = useStore((state) => state.vacationMode);
  const setVacationMode = useStore((state) => state.setVacationMode);
  const cancelVacationMode = useStore((state) => state.cancelVacationMode);
  const vacationDaysRemaining = useStore((state) => state.vacationDaysRemaining);

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
        return;
      }
      
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('Notifications Enabled', {
          body: 'We will gently remind you to dash!',
          icon: '/pwa-192x192.png'
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          new Notification('Notifications Enabled', {
            body: 'We will gently remind you to dash!',
            icon: '/pwa-192x192.png'
          });
        }
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <Layout>
      <AnimatePresence>
        {showWallpaperGen && <WallpaperGenerator onClose={() => setShowWallpaperGen(false)} />}
      </AnimatePresence>
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

          {/* Widgets & Wallpapers */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Widgets</h2>
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              <div 
                onClick={() => setShowWallpaperGen(true)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Create Wallpaper Widget</p>
                    <p className="text-sm text-muted-foreground">Lock screen motivation</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 rotate-180 text-muted-foreground" />
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preferences</h2>
            
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {/* Zen Mode */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Zen Mode</p>
                    <p className="text-sm text-muted-foreground">Hide coins, streaks, and gamification</p>
                  </div>
                </div>
                <Switch 
                  checked={zenMode}
                  onCheckedChange={setZenMode}
                />
              </div>

              {/* Vacation Mode */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Vacation Mode</p>
                    <p className="text-sm text-muted-foreground">
                      {vacationMode 
                        ? `${vacationDaysRemaining} days remaining` 
                        : "Freeze streak for 7 days"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={vacationMode}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setVacationMode(7);
                    } else {
                      cancelVacationMode();
                    }
                  }}
                />
              </div>

              {/* Sound Theme */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Sound Theme</p>
                    <p className="text-sm text-muted-foreground">Choose your audio vibe</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['default', 'arcade', 'nature'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSoundTheme(t)}
                      className={cn(
                        "p-3 rounded-xl text-sm font-medium transition-all border-2 capitalize",
                        soundTheme === t 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-transparent bg-secondary/50 hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

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
                  {(['default', 'ocean', 'sunset', 'lavender', 'cottagecore', 'cyberpunk'] as Theme[]).map((t) => (
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
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Daily Reminders</p>
                    <p className="text-sm text-muted-foreground">Get gentle nudges to start</p>
                  </div>
                </div>
                <Switch 
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationToggle}
                />
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

          {/* Data Management */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data</h2>
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              <div 
                onClick={() => {
                  const state = useStore.getState();
                  const data = {
                    history: state.history,
                    badges: state.badges,
                    streak: state.streak,
                    flavor: state.flavor,
                    theme: state.theme
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `dopamine-dasher-data-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">Download your history</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 rotate-180 text-muted-foreground" />
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
