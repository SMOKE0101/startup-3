import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/lib/types";
import { 
  ChevronDown, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter, 
  Users, 
  DollarSign, 
  Home,
  PieChart,
  AlertCircle,
  ArrowUpRight,
  LineChart
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

// Mock types for analytics
interface PropertyPerformance {
  id: number;
  name: string;
  occupancyRate: number;
  occupancyTrend: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  roi: number;
}

interface TenantAnalytics {
  totalTenants: number;
  newTenants: number;
  renewalRate: number;
  tenantSatisfaction: number;
  avgTenancyLength: number;
  tenantTurnover: number;
  demographics: {
    category: string;
    value: number;
    percentage: number;
  }[];
}

interface MarketAnalytics {
  currentPropertyValue: number;
  valueChange: number;
  marketRentAverage: number;
  yourRentAverage: number;
  marketTrends: {
    month: string;
    marketValue: number;
    propertyValue: number;
  }[];
  competitiveAnalysis: {
    factor: string;
    yourScore: number;
    marketAverage: number;
  }[];
}

interface PredictiveAnalytics {
  vacancyPrediction: {
    month: string;
    predictedRate: number;
    confidenceInterval: [number, number];
  }[];
  revenueForecast: {
    month: string;
    predictedRevenue: number;
    bestCase: number;
    worstCase: number;
  }[];
  maintenancePredictions: {
    category: string;
    probability: number;
    estimatedCost: number;
    timeframe: string;
  }[];
}

export default function AdvancedAnalytics() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("6months");
  const [propertyFilter, setPropertyFilter] = useState("all");
  
  // Ensure this page is only accessible for landlords and property managers
  if (user?.role !== UserRole.LANDLORD && user?.role !== UserRole.PROPERTY_MANAGER) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
          <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-neutral-600">This page is only for landlord and property manager accounts.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  // Mock data for property performance
  const properties: PropertyPerformance[] = [
    {
      id: 1,
      name: "Westside Apartments",
      occupancyRate: 92,
      occupancyTrend: 5,
      revenue: 125000,
      expenses: 45000,
      netIncome: 80000,
      roi: 12.5
    },
    {
      id: 2,
      name: "Eastside Condos",
      occupancyRate: 86,
      occupancyTrend: 2,
      revenue: 95000,
      expenses: 38000,
      netIncome: 57000,
      roi: 9.8
    },
    {
      id: 3,
      name: "Downtown Lofts",
      occupancyRate: 78,
      occupancyTrend: -3,
      revenue: 68000,
      expenses: 32000,
      netIncome: 36000,
      roi: 7.2
    }
  ];
  
  // Mock tenant analytics
  const tenantAnalytics: TenantAnalytics = {
    totalTenants: 48,
    newTenants: 7,
    renewalRate: 76,
    tenantSatisfaction: 85,
    avgTenancyLength: 28, // months
    tenantTurnover: 18, // percentage yearly
    demographics: [
      { category: "Young Professionals", value: 22, percentage: 46 },
      { category: "Families", value: 15, percentage: 31 },
      { category: "Seniors", value: 7, percentage: 15 },
      { category: "Students", value: 4, percentage: 8 }
    ]
  };

  // Mock market analytics
  const marketAnalytics: MarketAnalytics = {
    currentPropertyValue: 3450000,
    valueChange: 5.8,
    marketRentAverage: 1650,
    yourRentAverage: 1725,
    marketTrends: Array.from({ length: 12 }).map((_, i) => {
      const date = subMonths(new Date(), 11 - i);
      return {
        month: format(date, "MMM yyyy"),
        marketValue: 1550 + (i * 10) + (Math.random() * 20 - 10),
        propertyValue: 1625 + (i * 12) + (Math.random() * 30 - 15)
      };
    }),
    competitiveAnalysis: [
      { factor: "Amenities", yourScore: 8.2, marketAverage: 7.5 },
      { factor: "Location", yourScore: 9.0, marketAverage: 8.2 },
      { factor: "Property Condition", yourScore: 8.4, marketAverage: 7.8 },
      { factor: "Price", yourScore: 7.6, marketAverage: 8.0 }
    ]
  };

  // Mock predictive analytics
  const predictiveAnalytics: PredictiveAnalytics = {
    vacancyPrediction: Array.from({ length: 6 }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i + 1);
      const baseRate = 8 + (Math.sin(i) * 3);
      return {
        month: format(date, "MMM yyyy"),
        predictedRate: baseRate,
        confidenceInterval: [Math.max(0, baseRate - 2), Math.min(100, baseRate + 2)]
      };
    }),
    revenueForecast: Array.from({ length: 6 }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i + 1);
      const baseValue = 85000 + (i * 1500);
      return {
        month: format(date, "MMM yyyy"),
        predictedRevenue: baseValue,
        bestCase: baseValue * 1.1,
        worstCase: baseValue * 0.9
      };
    }),
    maintenancePredictions: [
      { 
        category: "HVAC System", 
        probability: 68, 
        estimatedCost: 3500, 
        timeframe: "3-6 months" 
      },
      { 
        category: "Roof Repairs", 
        probability: 32, 
        estimatedCost: 5800, 
        timeframe: "6-12 months" 
      },
      { 
        category: "Plumbing Issues", 
        probability: 45, 
        estimatedCost: 1200, 
        timeframe: "2-4 months" 
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-primary-50 to-white relative">
        {/* Property Background Watermark */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 z-0" 
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)` 
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
                  Advanced Analytics
                </h1>
                <p className="text-neutral-600">Comprehensive insights and predictions for your portfolio</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="flex items-center gap-2 bg-primary-600">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="property" className="space-y-8">
            <TabsList className="bg-neutral-100">
              <TabsTrigger value="property" className="data-[state=active]:bg-white">
                <Home className="h-4 w-4 mr-2" />
                Property Performance
              </TabsTrigger>
              <TabsTrigger value="tenant" className="data-[state=active]:bg-white">
                <Users className="h-4 w-4 mr-2" />
                Tenant Analytics
              </TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Analysis
              </TabsTrigger>
              <TabsTrigger value="predictive" className="data-[state=active]:bg-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Predictive Analytics
              </TabsTrigger>
            </TabsList>

            {/* Property Performance Tab */}
            <TabsContent value="property" className="space-y-6">
              {/* Property Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map(property => (
                  <Card key={property.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">{property.name}</CardTitle>
                      <CardDescription>Performance Overview</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-neutral-500">Occupancy</p>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{property.occupancyRate}%</p>
                            <span className={cn(
                              "text-xs flex items-center",
                              property.occupancyTrend > 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                              {property.occupancyTrend > 0 ? 
                                <TrendingUp className="h-3 w-3 mr-1" /> : 
                                <ChevronDown className="h-3 w-3 mr-1" />
                              }
                              {Math.abs(property.occupancyTrend)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">ROI</p>
                          <p className="text-lg font-semibold">{property.roi}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Revenue</p>
                          <p className="text-lg font-semibold">{formatCurrency(property.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Net Income</p>
                          <p className="text-lg font-semibold">{formatCurrency(property.netIncome)}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                      >
                        View Details <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Property Performance Metrics */}
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-medium">Portfolio Performance</CardTitle>
                    <CardDescription>Comparative analysis across properties</CardDescription>
                  </div>
                  <Select defaultValue="revenue">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="occupancy">Occupancy</SelectItem>
                      <SelectItem value="expenses">Expenses</SelectItem>
                      <SelectItem value="netIncome">Net Income</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  {/* This would be a chart in a real implementation */}
                  <div className="h-80 w-full bg-neutral-50 rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <p className="text-neutral-500">Property performance comparison chart</p>
                      <p className="text-xs text-neutral-400 mt-2">Shows revenue breakdown by property</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tenant Analytics Tab */}
            <TabsContent value="tenant" className="space-y-6">
              {/* Tenant Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-neutral-500 text-sm font-medium">Total Tenants</h3>
                      <span className="bg-primary-100 text-primary-600 p-2 rounded-full">
                        <Users className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">{tenantAnalytics.totalTenants}</p>
                    <div className="flex items-center mt-2">
                      <div className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full">
                        +{tenantAnalytics.newTenants} new
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-neutral-500 text-sm font-medium">Renewal Rate</h3>
                      <span className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">{tenantAnalytics.renewalRate}%</p>
                    <p className="text-xs text-neutral-500 mt-2">Of eligible tenants renewed leases</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-neutral-500 text-sm font-medium">Satisfaction</h3>
                      <span className="bg-secondary-100 text-secondary-600 p-2 rounded-full">
                        <PieChart className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">{tenantAnalytics.tenantSatisfaction}%</p>
                    <p className="text-xs text-neutral-500 mt-2">Based on survey responses</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-neutral-500 text-sm font-medium">Avg. Tenancy</h3>
                      <span className="bg-amber-100 text-amber-600 p-2 rounded-full">
                        <Calendar className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">{tenantAnalytics.avgTenancyLength} mo</p>
                    <p className="text-xs text-neutral-500 mt-2">Average length of stay</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tenant Demographics */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Tenant Demographics</CardTitle>
                  <CardDescription>Breakdown of your tenant population</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chart area */}
                    <div className="h-64 bg-neutral-50 rounded-lg border flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                        <p className="text-neutral-500">Tenant demographics chart</p>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="space-y-4">
                      {tenantAnalytics.demographics.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.category}</span>
                            <span className="text-sm text-neutral-900">
                              {item.value} ({item.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-neutral-100 rounded-full">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                index === 0 ? "bg-primary-500" : 
                                index === 1 ? "bg-secondary-500" : 
                                index === 2 ? "bg-amber-500" : 
                                "bg-emerald-500"
                              )} 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Market Analysis Tab */}
            <TabsContent value="market" className="space-y-6">
              {/* Market Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-neutral-500 text-sm font-medium">Property Value</h3>
                      <span className="bg-primary-100 text-primary-600 p-2 rounded-full">
                        <Home className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">{formatCurrency(marketAnalytics.currentPropertyValue)}</p>
                    <div className="flex items-center mt-2">
                      <span className={cn(
                        "text-xs font-medium flex items-center",
                        marketAnalytics.valueChange > 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {marketAnalytics.valueChange > 0 ? 
                          <TrendingUp className="h-3 w-3 mr-1" /> : 
                          <ChevronDown className="h-3 w-3 mr-1" />
                        }
                        {formatPercentage(marketAnalytics.valueChange)} from last year
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-neutral-500 text-sm font-medium">Your Avg. Rent</h3>
                      <span className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                        <DollarSign className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">${marketAnalytics.yourRentAverage}</p>
                    <div className="flex items-center mt-2">
                      <span className={cn(
                        "text-xs font-medium",
                        marketAnalytics.yourRentAverage > marketAnalytics.marketRentAverage ? "text-emerald-600" : "text-amber-600"
                      )}>
                        {marketAnalytics.yourRentAverage > marketAnalytics.marketRentAverage ? 
                          `${formatPercentage((marketAnalytics.yourRentAverage / marketAnalytics.marketRentAverage - 1) * 100)} above market` : 
                          `${formatPercentage((1 - marketAnalytics.yourRentAverage / marketAnalytics.marketRentAverage) * 100)} below market`
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-neutral-500 text-sm font-medium">Market Avg. Rent</h3>
                      <span className="bg-secondary-100 text-secondary-600 p-2 rounded-full">
                        <LineChart className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">${marketAnalytics.marketRentAverage}</p>
                    <p className="text-xs text-neutral-500 mt-2">Based on comparable properties</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-neutral-500 text-sm font-medium">Rental Growth</h3>
                      <span className="bg-amber-100 text-amber-600 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-neutral-900">4.8%</p>
                    <p className="text-xs text-neutral-500 mt-2">Annual rent growth in area</p>
                  </CardContent>
                </Card>
              </div>

              {/* Market Comparison Chart */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Market Rent Comparison</CardTitle>
                  <CardDescription>Your rent vs. market average over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {/* This would be a chart in a real implementation */}
                  <div className="h-80 w-full bg-neutral-50 rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <p className="text-neutral-500">Market comparison chart</p>
                      <p className="text-xs text-neutral-400 mt-2">Showing your rents vs. market averages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Competitive Analysis */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Competitive Analysis</CardTitle>
                  <CardDescription>How your properties compare to market offerings</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {marketAnalytics.competitiveAnalysis.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.factor}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-primary-700 font-medium">
                              Your Score: {item.yourScore}
                            </span>
                            <span className="text-xs text-neutral-500">
                              Market: {item.marketAverage}
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full relative">
                          {/* Market Average marker */}
                          <div 
                            className="absolute h-4 w-0.5 bg-neutral-300 rounded-full top-1/2 transform -translate-y-1/2"
                            style={{ left: `${(item.marketAverage / 10) * 100}%` }}
                          />
                          {/* Your score progress bar */}
                          <div 
                            className={cn(
                              "h-full rounded-full bg-primary-500"
                            )} 
                            style={{ width: `${(item.yourScore / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Predictive Analytics Tab */}
            <TabsContent value="predictive" className="space-y-6">
              {/* Vacancy Prediction */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Vacancy Prediction</CardTitle>
                  <CardDescription>Projected vacancy rates for the next 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {/* This would be a chart in a real implementation */}
                  <div className="h-80 w-full bg-neutral-50 rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <p className="text-neutral-500">Vacancy prediction chart</p>
                      <p className="text-xs text-neutral-400 mt-2">With confidence intervals</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-medium">Predicted Vacancy Rates</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="px-2 py-2 text-left text-xs font-medium text-neutral-500">Month</th>
                            <th className="px-2 py-2 text-center text-xs font-medium text-neutral-500">Predicted Rate</th>
                            <th className="px-2 py-2 text-center text-xs font-medium text-neutral-500">Best Case</th>
                            <th className="px-2 py-2 text-center text-xs font-medium text-neutral-500">Worst Case</th>
                          </tr>
                        </thead>
                        <tbody>
                          {predictiveAnalytics.vacancyPrediction.map((prediction, index) => (
                            <tr key={index} className="border-b border-neutral-100">
                              <td className="px-2 py-2 text-left font-medium">{prediction.month}</td>
                              <td className="px-2 py-2 text-center">{prediction.predictedRate.toFixed(1)}%</td>
                              <td className="px-2 py-2 text-center text-emerald-600">{prediction.confidenceInterval[0].toFixed(1)}%</td>
                              <td className="px-2 py-2 text-center text-amber-600">{prediction.confidenceInterval[1].toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Forecast */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Revenue Forecast</CardTitle>
                  <CardDescription>Projected revenue for the next 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {/* This would be a chart in a real implementation */}
                  <div className="h-80 w-full bg-neutral-50 rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <p className="text-neutral-500">Revenue forecast chart</p>
                      <p className="text-xs text-neutral-400 mt-2">With best and worst case scenarios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance Predictions */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Maintenance Predictions</CardTitle>
                  <CardDescription>Predicted maintenance needs based on property age and history</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {predictiveAnalytics.maintenancePredictions.map((prediction, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-neutral-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{prediction.category}</h4>
                            <p className="text-sm text-neutral-500 mt-1">
                              Estimated within {prediction.timeframe}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "text-xs px-2 py-0.5 rounded-full inline-block",
                              prediction.probability > 65 ? "bg-rose-100 text-rose-800" :
                              prediction.probability > 40 ? "bg-amber-100 text-amber-800" :
                              "bg-emerald-100 text-emerald-800"
                            )}>
                              {prediction.probability}% probability
                            </div>
                            <p className="text-sm font-medium mt-1">
                              Est. cost: {formatCurrency(prediction.estimatedCost)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full">View All Predictions</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}