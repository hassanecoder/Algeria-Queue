import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import Services from "@/pages/services";
import Offices from "@/pages/offices";
import OfficeDetail from "@/pages/office-detail";
import Booking from "@/pages/booking";
import MyAppointments from "@/pages/my-appointments";
import QueueStatus from "@/pages/queue-status";
import AdminDashboard from "@/pages/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Facing Pages with Layout */}
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/services">
        <Layout><Services /></Layout>
      </Route>
      <Route path="/offices">
        <Layout><Offices /></Layout>
      </Route>
      <Route path="/offices/:id">
        <Layout><OfficeDetail /></Layout>
      </Route>
      <Route path="/book/:officeId">
        <Layout><Booking /></Layout>
      </Route>
      <Route path="/appointments">
        <Layout><MyAppointments /></Layout>
      </Route>
      
      {/* Specific isolated views */}
      <Route path="/queue/:officeId">
        <QueueStatus />
      </Route>
      <Route path="/admin">
        <AdminDashboard />
      </Route>
      
      {/* 404 */}
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
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
