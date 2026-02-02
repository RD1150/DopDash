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
import BuyCoins from "./pages/BuyCoins";
import PaymentHistory from "./pages/PaymentHistory";
import Referrals from "./pages/Referrals";
import JournalPage from "./pages/Journal";
import Stats from "./pages/Stats";
import Someday from "./pages/Someday";
import Leaderboard from "./pages/Leaderboard";
import RewardsShop from "./pages/RewardsShop";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BrainCheckDemo from "./pages/BrainCheckDemo";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BottomNav from "@/components/BottomNav";
import QuickActionButton from "@/components/QuickActionButton";
import { useRetentionTracking } from "@/hooks/useRetentionTracking";
import { useAuth } from "@/_core/hooks/useAuth";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/flavor" component={FlavorSelector} />
      <Route path="/dash" component={Dash} />
      <Route path="/reward" component={Reward} />
      <Route path="/streak" component={Streak} />
      <Route path="/shop" component={Shop} />
      <Route path="/buy-coins" component={BuyCoins} />
      <Route path="/payment-history" component={PaymentHistory} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/journal" component={JournalPage} />
      <Route path="/stats" component={Stats} />
      <Route path="/someday" component={Someday} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/rewards-shop" component={RewardsShop} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/faq" component={FAQ} />
      <Route path="/brain-check" component={BrainCheckDemo} />
      <Route path="/404" component={NotFound} />
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
  const { isAuthenticated } = useAuth();
  
  // Track retention silently
  useRetentionTracking();

  // Register Service Worker for offline support
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Show onboarding on first visit (only for authenticated users)
  useEffect(() => {
    if (showOnboardingChecklist && isAuthenticated) {
      setShowOnboarding(true);
    }
  }, [showOnboardingChecklist, isAuthenticated]);

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
          <BottomNav />
          <QuickActionButton />
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
