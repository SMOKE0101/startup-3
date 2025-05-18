import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  PieChart,
  BarChart4, 
  Download,
  Wallet,
  Home,
  FileText,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for financial analytics (would be fetched from backend)
interface FinancialOverview {
  totalRevenue: number;
  revenueChange: number;
  totalExpenses: number;
  expenseChange: number;
  netIncome: number;
  netIncomeChange: number;
  occupancyRate: number;
  occupancyRateChange: number;
}

interface MonthlyFinancial {
  month: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}

interface PropertyFinancial {
  id: number;
  name: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  revenuePerUnit: number;
  units: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function FinancialAnalytics() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("year");
  const [propertyFilter, setPropertyFilter] = useState("all");

  // Generate last 12 months
  const generateLastMonths = (count: number) => {
    const today = new Date();
    const months = [];
    
    for (let i = count - 1; i >= 0; i--) {
      const month = subMonths(today, i);
      months.push({
        month: format(month, "MMM yyyy"),
        revenue: 10000 + Math.random() * 5000,
        expenses: 5000 + Math.random() * 2000,
        netIncome: 0 // Will calculate
      });
    }
    
    // Calculate net income
    months.forEach(month => {
      month.netIncome = month.revenue - month.expenses;
    });
    
    return months;
  };

  // Get months for current year
  const getCurrentYearMonths = () => {
    const year = new Date().getFullYear();
    const start = startOfMonth(new Date(year, 0, 1));
    const end = endOfMonth(new Date(year, 11, 31));
    
    return eachMonthOfInterval({ start, end }).map(date => {
      return {
        month: format(date, "MMM yyyy"),
        revenue: 10000 + Math.random() * 5000,
        expenses: 5000 + Math.random() * 2000,
        netIncome: 0 // Will calculate
      };
    }).map(month => {
      month.netIncome = month.revenue - month.expenses;
      return month;
    });
  };

  // Mock financial overview data
  const financialOverview: FinancialOverview = {
    totalRevenue: 250000,
    revenueChange: 8.2,
    totalExpenses: 98500,
    expenseChange: 3.5,
    netIncome: 151500,
    netIncomeChange: 12.7,
    occupancyRate: 92,
    occupancyRateChange: 5.2
  };

  // Mock monthly financial data (generated above)
  const monthlyFinancials: MonthlyFinancial[] = timeframe === "year" 
    ? getCurrentYearMonths() 
    : generateLastMonths(timeframe === "3months" ? 3 : 6);

  // Mock property financial data
  const propertyFinancials: PropertyFinancial[] = [
    {
      id: 1,
      name: "Westside Apartments",
      revenue: 125000,
      expenses: 48500,
      netIncome: 76500,
      revenuePerUnit: 1350,
      units: 20
    },
    {
      id: 2,
      name: "Eastside Condos",
      revenue: 85000,
      expenses: 32000,
      netIncome: 53000,
      revenuePerUnit: 1650,
      units: 12
    },
    {
      id: 3,
      name: "Downtown Lofts",
      revenue: 40000,
      expenses: 18000,
      netIncome: 22000,
      revenuePerUnit: 1850,
      units: 8
    }
  ];

  // Mock revenue breakdown
  const revenueBreakdown: CategoryBreakdown[] = [
    { category: "Rent", amount: 225000, percentage: 90 },
    { category: "Late Fees", amount: 5000, percentage: 2 },
    { category: "Parking", amount: 12500, percentage: 5 },
    { category: "Amenities", amount: 7500, percentage: 3 }
  ];

  // Mock expense breakdown
  const expenseBreakdown: CategoryBreakdown[] = [
    { category: "Maintenance", amount: 32500, percentage: 33 },
    { category: "Property Tax", amount: 25000, percentage: 25.5 },
    { category: "Insurance", amount: 15000, percentage: 15.2 },
    { category: "Utilities", amount: 12500, percentage: 12.7 },
    { category: "Management", amount: 8500, percentage: 8.6 },
    { category: "Other", amount: 5000, percentage: 5 }
  ];

  // Determine display months for X axis in chart
  const displayMonths = monthlyFinancials.map(item => item.month.substring(0, 3));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Generate random color (for chart segments)
  const getRandomColor = (index: number) => {
    const colors = [
      "bg-primary-500", "bg-secondary-500", "bg-amber-500", 
      "bg-emerald-500", "bg-rose-500", "bg-purple-500"
    ];
    return colors[index % colors.length];
  };

  // Format change percentages with arrow
  const formatChange = (change: number, inverse: boolean = false) => {
    const isPositive = inverse ? change < 0 : change > 0;
    const formattedChange = `${Math.abs(change).toFixed(1)}%`;
    
    return (
      <span className={`inline-flex items-center text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
        {formattedChange}
      </span>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-primary-50 to-white">
        <Header />

        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-2">
                Financial Analytics
              </h1>
              <p className="text-neutral-600">Track your property revenue, expenses, and financial performance</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2 border-primary-200 text-primary-700">
                <Calendar className="h-4 w-4" />
                <span>Custom Date Range</span>
              </Button>
              <Button className="flex items-center gap-2 bg-primary-600">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-sm hover:shadow-md transition-shadow border-primary-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-neutral-500 text-sm font-medium">Total Revenue</h3>
                  <span className="bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5" />
                  </span>
                </div>
                <p className="text-2xl font-semibold text-neutral-900 mb-2">{formatCurrency(financialOverview.totalRevenue)}</p>
                {formatChange(financialOverview.revenueChange)}
                <p className="text-xs text-neutral-500 mt-2">vs. previous period</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow border-secondary-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-neutral-500 text-sm font-medium">Total Expenses</h3>
                  <span className="bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-700 p-2 rounded-lg">
                    <Wallet className="h-5 w-5" />
                  </span>
                </div>
                <p className="text-2xl font-semibold text-neutral-900 mb-2">{formatCurrency(financialOverview.totalExpenses)}</p>
                {formatChange(financialOverview.expenseChange, true)}
                <p className="text-xs text-neutral-500 mt-2">vs. previous period</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow border-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-neutral-500 text-sm font-medium">Net Income</h3>
                  <span className="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </span>
                </div>
                <p className="text-2xl font-semibold text-neutral-900 mb-2">{formatCurrency(financialOverview.netIncome)}</p>
                {formatChange(financialOverview.netIncomeChange)}
                <p className="text-xs text-neutral-500 mt-2">vs. previous period</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow border-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-neutral-500 text-sm font-medium">Occupancy Rate</h3>
                  <span className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 p-2 rounded-lg">
                    <Home className="h-5 w-5" />
                  </span>
                </div>
                <p className="text-2xl font-semibold text-neutral-900 mb-2">{financialOverview.occupancyRate}%</p>
                {formatChange(financialOverview.occupancyRateChange)}
                <p className="text-xs text-neutral-500 mt-2">vs. previous period</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList className="bg-neutral-100">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
                <TabsTrigger value="revenue" className="data-[state=active]:bg-white">Revenue</TabsTrigger>
                <TabsTrigger value="expenses" className="data-[state=active]:bg-white">Expenses</TabsTrigger>
                <TabsTrigger value="properties" className="data-[state=active]:bg-white">By Property</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-neutral-500" />
                  <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="h-9 w-[140px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Chart - Monthly Financial Performance */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-heading font-medium">Monthly Financial Performance</CardTitle>
                      <CardDescription>Revenue, expenses, and net income by month</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary-50 border-primary-200 text-primary-700">
                      {timeframe === "year" ? "2025" : timeframe === "3months" ? "Last 3 Months" : "Last 6 Months"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Chart visualization - we'll use CSS to mock this for simplicity */}
                  <div className="h-72 relative">
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 w-full flex justify-between px-4">
                      {displayMonths.map((month, i) => (
                        <div key={i} className="text-xs text-neutral-500">{month}</div>
                      ))}
                    </div>
                    
                    {/* Y-axis and horizontal grid lines */}
                    <div className="absolute left-0 top-0 h-64 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="flex items-center">
                          <span className="text-xs text-neutral-500 w-14 text-right pr-2">
                            ${(20000 - i * 5000).toLocaleString()}
                          </span>
                          <div className="w-full h-px bg-neutral-200" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Chart content - bars for each month */}
                    <div className="absolute left-16 top-0 right-0 bottom-8 flex justify-between px-4">
                      {monthlyFinancials.map((month, i) => {
                        const maxValue = 20000;
                        const revenueHeight = (month.revenue / maxValue) * 100;
                        const expenseHeight = (month.expenses / maxValue) * 100;
                        const netIncomeHeight = (month.netIncome / maxValue) * 100;
                        
                        return (
                          <div key={i} className="flex flex-col items-center justify-end space-x-1 relative h-64">
                            <div className="w-8 flex space-x-1">
                              <div 
                                className="w-2 bg-primary-500 rounded-t-sm" 
                                style={{ height: `${revenueHeight}%` }}
                                title={`Revenue: ${formatCurrency(month.revenue)}`}
                              />
                              <div 
                                className="w-2 bg-secondary-500 rounded-t-sm" 
                                style={{ height: `${expenseHeight}%` }}
                                title={`Expenses: ${formatCurrency(month.expenses)}`}
                              />
                              <div 
                                className="w-2 bg-emerald-500 rounded-t-sm" 
                                style={{ height: `${netIncomeHeight}%` }}
                                title={`Net Income: ${formatCurrency(month.netIncome)}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Chart legend */}
                  <div className="flex justify-center items-center gap-6 mt-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary-500 rounded-sm mr-2" />
                      <span className="text-xs text-neutral-700">Revenue</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-secondary-500 rounded-sm mr-2" />
                      <span className="text-xs text-neutral-700">Expenses</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-2" />
                      <span className="text-xs text-neutral-700">Net Income</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue and Expense Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-heading font-medium flex items-center">
                          <PieChart className="h-5 w-5 text-primary-500 mr-2" />
                          Revenue Breakdown
                        </CardTitle>
                        <CardDescription>Revenue by category</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary-600 gap-1">
                        <span>Details</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Pie chart visualization - simple representation */}
                    <div className="flex">
                      <div className="w-1/2">
                        <div className="relative w-32 h-32 mx-auto">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {revenueBreakdown.map((item, index) => {
                              // Calculate the offset based on preceding items' percentages
                              const offset = revenueBreakdown
                                .slice(0, index)
                                .reduce((sum, prev) => sum + prev.percentage, 0);
                              
                              // Convert percentage to degrees (360 degrees for a full circle)
                              const degrees = (item.percentage / 100) * 360;
                              
                              // Convert degrees to SVG arc command
                              const rad = (Math.PI / 180);
                              const x1 = 50 + 40 * Math.cos((offset) * rad);
                              const y1 = 50 + 40 * Math.sin((offset) * rad);
                              const x2 = 50 + 40 * Math.cos((offset + degrees) * rad);
                              const y2 = 50 + 40 * Math.sin((offset + degrees) * rad);
                              
                              // Determine if the arc should take the long path (large-arc-flag)
                              const largeArcFlag = degrees > 180 ? 1 : 0;
                              
                              return (
                                <path 
                                  key={index}
                                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                  fill={getRandomColor(index).replace('bg-', 'fill-').replace('-500', '-400')}
                                  stroke="#fff"
                                  strokeWidth="1"
                                />
                              );
                            })}
                          </svg>
                        </div>
                      </div>

                      <div className="w-1/2 space-y-3">
                        {revenueBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 ${getRandomColor(index)} rounded-sm mr-2`} />
                              <span className="text-sm">{item.category}</span>
                            </div>
                            <div className="text-sm font-medium text-neutral-900">
                              {formatCurrency(item.amount)}
                              <span className="text-xs text-neutral-500 ml-1">
                                ({item.percentage}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expense Breakdown */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-heading font-medium flex items-center">
                          <BarChart4 className="h-5 w-5 text-secondary-500 mr-2" />
                          Expense Breakdown
                        </CardTitle>
                        <CardDescription>Expenses by category</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary-600 gap-1">
                        <span>Details</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Bar chart visualization - simple representation */}
                    <div className="space-y-5">
                      {expenseBreakdown.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-700">{item.category}</span>
                            <span className="text-sm font-medium text-neutral-900">
                              {formatCurrency(item.amount)}
                              <span className="text-xs text-neutral-500 ml-1">({item.percentage}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-neutral-100 rounded-full">
                            <div 
                              className={`h-full ${getRandomColor(index)} rounded-full`} 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Property Financial Performance */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-heading font-medium flex items-center">
                        <Home className="h-5 w-5 text-amber-500 mr-2" />
                        Property Financial Summary
                      </CardTitle>
                      <CardDescription>Financial performance by property</CardDescription>
                    </div>
                    <Select defaultValue={propertyFilter} onValueChange={setPropertyFilter}>
                      <SelectTrigger className="h-9 w-[180px]">
                        <SelectValue placeholder="Filter property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="profitable">Most Profitable</SelectItem>
                        <SelectItem value="revenue">Highest Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="px-4 py-3 text-left font-medium text-neutral-500">Property</th>
                          <th className="px-4 py-3 text-right font-medium text-neutral-500">Revenue</th>
                          <th className="px-4 py-3 text-right font-medium text-neutral-500">Expenses</th>
                          <th className="px-4 py-3 text-right font-medium text-neutral-500">Net Income</th>
                          <th className="px-4 py-3 text-right font-medium text-neutral-500">Profit Margin</th>
                          <th className="px-4 py-3 text-right font-medium text-neutral-500">Rev/Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyFinancials.map((property) => (
                          <tr key={property.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                            <td className="px-4 py-4 font-medium text-neutral-900">{property.name}</td>
                            <td className="px-4 py-4 text-right">{formatCurrency(property.revenue)}</td>
                            <td className="px-4 py-4 text-right">{formatCurrency(property.expenses)}</td>
                            <td className="px-4 py-4 text-right font-medium">{formatCurrency(property.netIncome)}</td>
                            <td className="px-4 py-4 text-right">
                              <Badge 
                                variant="outline" 
                                className="bg-emerald-50 border-emerald-200 text-emerald-700"
                              >
                                {((property.netIncome / property.revenue) * 100).toFixed(1)}%
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-right">{formatCurrency(property.revenuePerUnit)}</td>
                          </tr>
                        ))}
                        
                        {/* Totals row */}
                        <tr className="bg-neutral-50 font-medium">
                          <td className="px-4 py-3 text-neutral-900">All Properties</td>
                          <td className="px-4 py-3 text-right text-primary-700">
                            {formatCurrency(propertyFinancials.reduce((sum, p) => sum + p.revenue, 0))}
                          </td>
                          <td className="px-4 py-3 text-right text-secondary-700">
                            {formatCurrency(propertyFinancials.reduce((sum, p) => sum + p.expenses, 0))}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-700">
                            {formatCurrency(propertyFinancials.reduce((sum, p) => sum + p.netIncome, 0))}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Badge variant="outline" className="bg-emerald-100 border-emerald-200 text-emerald-700 font-medium">
                              {(propertyFinancials.reduce((sum, p) => sum + p.netIncome, 0) / 
                                propertyFinancials.reduce((sum, p) => sum + p.revenue, 0) * 100).toFixed(1)}%
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(propertyFinancials.reduce((sum, p) => sum + p.revenue, 0) / 
                              propertyFinancials.reduce((sum, p) => sum + p.units, 0))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-heading font-medium">Revenue Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of revenue sources and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-16 text-neutral-500">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                      <p>Revenue analysis details will be displayed here</p>
                      <Button variant="outline" className="mt-4">Configure Revenue Categories</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="space-y-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-heading font-medium">Expense Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of expense categories and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-16 text-neutral-500">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                      <p>Expense analysis details will be displayed here</p>
                      <Button variant="outline" className="mt-4">Configure Expense Categories</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* By Property Tab */}
            <TabsContent value="properties" className="space-y-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-heading font-medium">Property Financial Analysis</CardTitle>
                  <CardDescription>Detailed financial breakdown by property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-16 text-neutral-500">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                      <p>Property financial analysis details will be displayed here</p>
                      <Button variant="outline" className="mt-4">View All Properties</Button>
                    </div>
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