import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/auth-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import Tenants from "@/pages/tenants";
import Billing from "@/pages/billing";
import Maintenance from "@/pages/maintenance";
import MaintenanceTracker from "@/pages/maintenance-tracker";
import FinancialAnalytics from "@/pages/financial-analytics";
import AdvancedAnalytics from "@/pages/advanced-analytics";
import TenantDashboard from "@/pages/tenant-dashboard";
import TenantExpenses from "@/pages/tenant-expenses";
import CommunicationCenter from "@/pages/communication-center";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Landing from "@/pages/landing";

function PrivateRoute({ component: Component, ...rest }: { component: React.ComponentType, path: string }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">
        {() => <PrivateRoute component={Dashboard} path="/dashboard" />}
      </Route>
      <Route path="/properties">
        {() => <PrivateRoute component={Properties} path="/properties" />}
      </Route>
      <Route path="/tenants">
        {() => <PrivateRoute component={Tenants} path="/tenants" />}
      </Route>
      <Route path="/billing">
        {() => <PrivateRoute component={Billing} path="/billing" />}
      </Route>
      <Route path="/maintenance">
        {() => <PrivateRoute component={Maintenance} path="/maintenance" />}
      </Route>
      <Route path="/maintenance-tracker">
        {() => <PrivateRoute component={MaintenanceTracker} path="/maintenance-tracker" />}
      </Route>
      <Route path="/financial-analytics">
        {() => <PrivateRoute component={FinancialAnalytics} path="/financial-analytics" />}
      </Route>
      <Route path="/advanced-analytics">
        {() => <PrivateRoute component={AdvancedAnalytics} path="/advanced-analytics" />}
      </Route>
      <Route path="/tenant-dashboard">
        {() => <PrivateRoute component={TenantDashboard} path="/tenant-dashboard" />}
      </Route>
      <Route path="/tenant-expenses">
        {() => <PrivateRoute component={TenantExpenses} path="/tenant-expenses" />}
      </Route>
      <Route path="/communication-center">
        {() => <PrivateRoute component={CommunicationCenter} path="/communication-center" />}
      </Route>
      <Route path="/">
        {() => {
          if (user) {
            // Redirect based on user role
            return user.role === 'tenant' 
              ? <Redirect to="/tenant-dashboard" /> 
              : <Redirect to="/dashboard" />;
          } 
          return <Landing />;
        }}
      </Route>
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
