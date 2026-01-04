import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dash from "@/pages/Dash";
import FlavorSelector from "@/pages/FlavorSelector";
import Reward from "@/pages/Reward";
import SettingsPage from "@/pages/Settings";
import Streak from "@/pages/Streak";
import Welcome from "@/pages/Welcome";
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
      <Route path="/streak" component={Streak} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
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
