import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import Dash from "@/pages/Dash";
import FlavorSelector from "@/pages/FlavorSelector";
import Reward from "@/pages/Reward";
import SettingsPage from "./pages/Settings";
import Streak from "./pages/Streak";
import Welcome from "./pages/Welcome";
import Shop from "./pages/Shop";
import JournalPage from "./pages/Journal";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/flavor" component={FlavorSelector} />
      <Route path="/dash" component={Dash} />
      <Route path="/reward" component={Reward} />
      <Route path={"/streak"} component={Streak} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/journal"} component={JournalPage} />
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
