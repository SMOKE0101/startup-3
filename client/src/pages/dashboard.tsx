import { useQuery } from "@tanstack/react-query";
import { Building, Users, DollarSign, Wrench, BarChart, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { PropertyOverview } from "@/components/dashboard/property-overview";
import { MaintenanceRequests } from "@/components/dashboard/maintenance-requests";
import { BillingOverview } from "@/components/dashboard/billing-overview";
import { VacancyOverview } from "@/components/dashboard/vacancy-overview";
import { RecentMessages } from "@/components/dashboard/recent-messages";
import { type DashboardStats } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats", { ownerId: user?.id }],
    enabled: !!user?.id,
  });

  const today = format(new Date(), "MMMM d, yyyy");

  // Selected premium property images for background
  const propertyBackgroundImages = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Luxury house
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Modern apartment building
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", // Luxury condo
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"  // Premium house
  ];
  
  // We use the user's ID to select a consistent image that represents "their property"
  // In a real app, this would be based on the user's actual primary property
  const backgroundImage = propertyBackgroundImages[user?.id ? (user.id % propertyBackgroundImages.length) : 0];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-primary-50 to-white relative">
        {/* Property Watermark Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 z-0" 
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
          aria-hidden="true"
        />
        
        {/* Gradient overlay for better readability */}
        <div 
          className="absolute inset-0 z-0 bg-gradient-to-tr from-primary-50/90 via-transparent to-white/60" 
          aria-hidden="true"
        />
        
        <Header />

        <div className="flex-1 p-6 md:p-8 relative z-10">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-2">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-neutral-600">Dashboard overview for {today}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-primary-600 bg-primary-50 px-4 py-2 rounded-full border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
                <BarChart className="h-4 w-4" />
                <span>Property Analytics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Properties"
              value={isLoading ? "Loading..." : stats?.totalProperties || 0}
              icon={<Building className="h-5 w-5" />}
              change={!isLoading && stats ? { value: 2, isPositive: true } : undefined}
              iconBgClass="bg-gradient-to-br from-primary-100 to-primary-200"
              iconTextClass="text-primary-700"
              className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] border border-primary-100"
            />
            <StatCard
              title="Active Tenants"
              value={isLoading ? "Loading..." : stats?.activeTenantsCount || 0}
              icon={<Users className="h-5 w-5" />}
              change={!isLoading && stats ? { value: 3, isPositive: true } : undefined}
              iconBgClass="bg-gradient-to-br from-secondary-100 to-secondary-200"
              iconTextClass="text-secondary-700"
              className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] border border-secondary-100"
            />
            <StatCard
              title="This Month's Revenue"
              value={isLoading ? "Loading..." : `$${stats?.currentMonthRevenue?.toLocaleString() || 0}`}
              icon={<DollarSign className="h-5 w-5" />}
              change={!isLoading && stats ? { value: "8.3%", isPositive: true } : undefined}
              iconBgClass="bg-gradient-to-br from-emerald-100 to-emerald-200"
              iconTextClass="text-emerald-700"
              className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] border border-emerald-100"
            />
            <StatCard
              title="Open Maintenance Requests"
              value={isLoading ? "Loading..." : stats?.openMaintenanceRequests || 0}
              icon={<Wrench className="h-5 w-5" />}
              change={!isLoading && stats ? { value: 2, isPositive: false } : undefined}
              iconBgClass="bg-gradient-to-br from-amber-100 to-amber-200"
              iconTextClass="text-amber-700"
              className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] border border-amber-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PropertyOverview className="shadow-sm hover:shadow-md transition-shadow border border-neutral-200 rounded-xl overflow-hidden" />
              <MaintenanceRequests className="shadow-sm hover:shadow-md transition-shadow border border-neutral-200 rounded-xl overflow-hidden" />
            </div>

            <div className="space-y-6">
              <BillingOverview className="shadow-sm hover:shadow-md transition-shadow border border-neutral-200 rounded-xl overflow-hidden" />
              <VacancyOverview className="shadow-sm hover:shadow-md transition-shadow border border-neutral-200 rounded-xl overflow-hidden" />
              <RecentMessages className="shadow-sm hover:shadow-md transition-shadow border border-neutral-200 rounded-xl overflow-hidden" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
