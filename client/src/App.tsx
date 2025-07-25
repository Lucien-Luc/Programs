import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/LanguageProvider";
import { AutoTranslateProvider } from "@/lib/auto-translate";
import { SettingsProvider } from "@/lib/settings-context";
import Dashboard from "@/pages/dashboard";
import ProgramDetail from "@/pages/program-detail";
import Admin from "@/pages/admin-simple";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/program/:id" component={ProgramDetail} />
      <Route path="/admin" component={Admin} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <SettingsProvider>
            <AutoTranslateProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </AutoTranslateProvider>
          </SettingsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
