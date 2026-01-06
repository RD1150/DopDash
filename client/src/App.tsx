import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";
import NotFound from "@/pages/NotFound";
import { useEffect, useState } from "react";
import { registerServiceWorker } from "@/lib/serviceWorker";
import FriendTrialOnboarding from "@/components/FriendTrialOnboarding";
import Dash from "@/pages/Dash";
import FlavorSelector from "@/pages/FlavorSelector";
import Reward from "@/pages/Reward";
import SettingsPage from "./pages/Settings";
import Streak from "./pages/Streak";
import Welcome from "./pages/Welcome";
import Shop from "./pages/Shop";
import JournalPage from "./pages/Journal";
import Stats from "./pages/Stats";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/flavor" component={FlavorSelector} />
      <Route path="/dash" component={Dash} />
      <Route path="/reward" component={Reward} />
      <Route path={"/streak"} component={Streak} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/journal"} component={JournalPage} />
      <Route path={"/stats"} component={Stats} />
      <Route path={"/settings"} component={SettingsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const theme = useStore((state) => state.theme);
  const showOnboardingChecklist = useStore((state) => state.showOnboardingChecklist);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Register Service Worker for offline support
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Show onboarding on first visit
  useEffect(() => {
    if (showOnboardingChecklist) {
      setShowOnboarding(true);
    }
  }, [showOnboardingChecklist]);

  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove('theme-ocean', 'theme-sunset', 'theme-lavender');
    // Add current theme class if not default
    if (theme !== 'default') {
      document.body.classList.add(`theme-${theme}`);
    }
  }, [theme]);


  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <FriendTrialOnboarding
            isOpen={showOnboarding}
            onComplete={() => setShowOnboarding(false)}
          />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
