import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import DashboardPage from "@/pages/dashboard";
import AttributionPage from "@/pages/attribution";
import CampaignsPage from "@/pages/campaigns";
import BookingsPage from "@/pages/bookings";
import ContentPage from "@/pages/content";
import AgentsPage from "@/pages/agents";
import AlertsPage from "@/pages/alerts";
import DepartmentsPage from "@/pages/departments";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/attribution" component={AttributionPage} />
        <Route path="/campaigns" component={CampaignsPage} />
        <Route path="/bookings" component={BookingsPage} />
        <Route path="/content" component={ContentPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/alerts" component={AlertsPage} />
        <Route path="/departments" component={DepartmentsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;