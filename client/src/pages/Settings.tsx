import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Theme, useStore } from '@/lib/store';
import { ChevronLeft, Moon, Palette, Volume2, Bell, Download, Smartphone, Sparkles, Plane, AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import WallpaperGenerator from '@/components/WallpaperGenerator';
import EmailCollection from '@/components/EmailCollection';
import { notificationScheduler } from '@/lib/notifications';
import { AnimatePresence } from 'framer-motion';
import PremiumUpgrade from '@/components/PremiumUpgrade';
import ChangeYourVibe from '@/components/ChangeYourVibe';
import { usePremium, isPremiumTheme } from '@/hooks/usePremium';
import { Crown } from 'lucide-react';
import { toast } from 'sonner';
import DataExport from '@/components/DataExport';
import StatsSharing from '@/components/StatsSharing';
import InviteFriends from '@/components/InviteFriends';
import BodyDoubleMode from '@/components/BodyDoubleMode';

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { isPremium } = usePremium();
  const flavor = useStore((state) => state.flavor);
  const currentTheme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const setOnboardingChecklist = useStore((state) => state.setOnboardingChecklist);
  const notificationsEnabled = useStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useStore((state) => state.setNotificationsEnabled);
  const zenMode = useStore((state) => state.zenMode);
  const setZenMode = useStore((state) => state.setZenMode);
  const soundTheme = useStore((state) => state.soundTheme);
  const setSoundTheme = useStore((state) => state.setSoundTheme);
  const [showWallpaperGen, setShowWallpaperGen] = useState(false);
  const [showChangeVibe, setShowChangeVibe] = useState(false);
  const vacationMode = useStore((state) => state.vacationMode);
  const setVacationMode = useStore((state) => state.setVacationMode);
  const cancelVacationMode = useStore((state) => state.cancelVacationMode);
  const vacationDaysRemaining = useStore((state) => state.vacationDaysRemaining);
  const emergencyMode = useStore((state) => state.emergencyMode);
  const setEmergencyMode = useStore((state) => state.setEmergencyMode);
  const streak = useStore((state) => state.streak);
  const momentumMode = useStore((state) => state.momentumMode);
  const setMomentumMode = useStore((state) => state.setMomentumMode);

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      const granted = await notificationScheduler.requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        notificationScheduler.scheduleDailyReminder(9, 0);
        notificationScheduler.scheduleStreakProtection(streak);
        notificationScheduler.showNotification(
          'Notifications Enabled! 🎯',
          'We\'ll send you gentle reminders to keep your streak alive.',
          '/pwa-192x192.png'
        );
      }
    } else {
      setNotificationsEnabled(false);
      notificationScheduler.clearAllNotifications();
    }
  };

  return (
    <Layout>
      <AnimatePresence>
        {showWallpaperGen && <WallpaperGenerator onClose={() => setShowWallpaperGen(false)} />}
        {showChangeVibe && <ChangeYourVibe isOpen={showChangeVibe} onClose={() => setShowChangeVibe(false)} />}
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
          {/* Change Your Vibe Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Change Your Vibe</h2>
            <div 
              onClick={() => setShowChangeVibe(true)}
              className="bg-card p-4 rounded-xl border border-border flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors"
            >
              <div>
                <p className="font-medium">Enemy, Context & Theme</p>
                <p className="text-sm text-muted-foreground">Adjust anytime, no judgment</p>
              </div>
              <Palette className="w-5 h-5 text-muted-foreground" />
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
              {/* Emergency Mode */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-red-600 dark:text-red-400">Emergency Mode</p>
                    <p className="text-sm text-muted-foreground">Panic button: Just one tiny task</p>
                  </div>
                </div>
                <Switch 
                  checked={emergencyMode}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      if (confirm("Feeling overwhelmed? This will clear your list and give you just one tiny step. You can switch back anytime.")) {
                        setEmergencyMode(true);
                        setLocation('/');
                      }
                    } else {
                      setEmergencyMode(false);
                    }
                  }}
                />
              </div>

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

              {/* Momentum Mode */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Momentum Mode</p>
                    <p className="text-sm text-muted-foreground">Auto-continue from 2 to 15 min if active</p>
                  </div>
                </div>
                <Switch 
                  checked={momentumMode}
                  onCheckedChange={setMomentumMode}
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
                  {(['default', 'ocean', 'sunset', 'lavender', 'cottagecore', 'cyberpunk'] as Theme[]).map((t) => {
                    const isLocked = isPremiumTheme(t) && !isPremium;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          if (isLocked) {
                            toast.error('This theme requires Premium', {
                              description: 'Upgrade to unlock all premium themes',
                            });
                            return;
                          }
                          setTheme(t);
                          setOnboardingChecklist('customize_theme', true);
                        }}
                        className={cn(
                          "p-3 rounded-xl text-sm font-medium transition-all border-2 relative",
                          currentTheme === t 
                            ? "border-primary bg-primary/5 text-primary" 
                            : isLocked
                            ? "border-transparent bg-secondary/30 text-muted-foreground/50 cursor-not-allowed"
                            : "border-transparent bg-secondary/50 hover:bg-secondary text-muted-foreground"
                        )}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                        {isLocked && (
                          <Crown className="w-3 h-3 absolute top-1 right-1 text-primary" />
                        )}
                      </button>
                    );
                  })}
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

              {/* Data Export */}
              <div 
                onClick={() => {
                  const history = useStore.getState().history;
                  const csvContent = "data:text/csv;charset=utf-8," 
                    + "Date\n"
                    + history.join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "dopamine_dasher_history.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">Download your history as CSV</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 rotate-180 text-muted-foreground" />
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

          {/* Premium Upgrade */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Premium</h2>
            <PremiumUpgrade />
          </section>

          {/* Email Updates */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stay Connected</h2>
            <EmailCollection inline />
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

          {/* Data Export & Privacy */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data & Privacy</h2>
            <DataExport />
          </section>

          {/* Stats Sharing */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Share Your Progress</h2>
            <StatsSharing />
          </section>

          {/* Community Features */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Community</h2>
            <BodyDoubleMode />
          </section>

          {/* Invite Friends */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Invite Friends</h2>
            <InviteFriends />
          </section>

          {/* Danger Zone (Reset) */}
          <section className="pt-8 space-y-3">
            <Button 
              onClick={() => {
                if (confirm('Reset onboarding? You\'ll be able to choose your flavor, context, and theme again.')) {
                  useStore.getState().startApp();
                  localStorage.removeItem('selectedCategory');
                  localStorage.removeItem('selectedPreset');
                  setLocation('/');
                }
              }}
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-primary hover:bg-primary/5"
            >
              Reset Onboarding
            </Button>
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
