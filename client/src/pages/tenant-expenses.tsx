import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Plus, 
  Calendar, 
  ArrowDown, 
  ArrowUp,
  Filter,
  Download,
  Clock,
  Wallet,
  Home,
  ShoppingBag,
  Car,
  Utensils,
  LifeBuoy,
  Lightbulb,
  Wifi,
  Smartphone,
  HeartPulse,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, addMonths } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";
import { TenantHeader } from "@/components/tenant/tenant-header";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";

// Types for tenant expenses
interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
}

interface Budget {
  category: string;
  limit: number;
  current: number;
  icon: React.ReactNode;
}

interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
  icon: React.ReactNode;
}

interface MonthlyTotal {
  month: string;
  housing: number;
  utilities: number;
  other: number;
  total: number;
}

// Form schema for expense
const expenseFormSchema = z.object({
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(3, { message: "Description must be at least 3 characters" }).max(100),
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0" }),
  date: z.string().min(1, { message: "Please select a date" }),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
});

// Expense categories with icons
const expenseCategories = [
  { value: "rent", label: "Rent", icon: <Home className="h-4 w-4" /> },
  { value: "electricity", label: "Electricity", icon: <Lightbulb className="h-4 w-4" /> },
  { value: "water", label: "Water", icon: <LifeBuoy className="h-4 w-4" /> },
  { value: "internet", label: "Internet", icon: <Wifi className="h-4 w-4" /> },
  { value: "phone", label: "Phone", icon: <Smartphone className="h-4 w-4" /> },
  { value: "groceries", label: "Groceries", icon: <ShoppingBag className="h-4 w-4" /> },
  { value: "transportation", label: "Transportation", icon: <Car className="h-4 w-4" /> },
  { value: "dining", label: "Dining Out", icon: <Utensils className="h-4 w-4" /> },
  { value: "healthcare", label: "Healthcare", icon: <HeartPulse className="h-4 w-4" /> },
  { value: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { value: "work", label: "Work Expenses", icon: <Briefcase className="h-4 w-4" /> },
  { value: "other", label: "Other", icon: <Wallet className="h-4 w-4" /> },
];

export default function TenantExpenses() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  // Mock budgets data
  const budgets: Budget[] = [
    { 
      category: "Housing", 
      limit: 1500, 
      current: 1500, 
      icon: <Home className="h-4 w-4" /> 
    },
    { 
      category: "Utilities", 
      limit: 300, 
      current: 220, 
      icon: <Lightbulb className="h-4 w-4" /> 
    },
    { 
      category: "Groceries", 
      limit: 400, 
      current: 320, 
      icon: <ShoppingBag className="h-4 w-4" /> 
    },
    { 
      category: "Transportation", 
      limit: 200, 
      current: 180, 
      icon: <Car className="h-4 w-4" /> 
    },
  ];

  // Form for adding expenses
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      category: "",
      description: "",
      amount: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      isRecurring: false,
    },
  });

  // Watch isRecurring to conditionally show frequency dropdown
  const isRecurring = form.watch("isRecurring");

  // Helper function to get date range for selected month
  const getMonthDateRange = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number);
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(startDate);
    return { startDate, endDate };
  };

  // Generate mock expenses for 6 months
  const generateMockExpenses = () => {
    const today = new Date();
    const expenses: Expense[] = [];
    let id = 1;

    // Generate recurring expenses (rent, utilities)
    for (let i = 0; i < 6; i++) {
      const date = subMonths(today, i);
      
      // Rent
      expenses.push({
        id: id++,
        category: "rent",
        description: "Monthly Rent",
        amount: 1500,
        date: format(date, "yyyy-MM-dd"),
        isRecurring: true,
        recurringFrequency: "monthly"
      });
      
      // Utilities
      expenses.push({
        id: id++,
        category: "electricity",
        description: "Electricity Bill",
        amount: 85 + Math.floor(Math.random() * 30),
        date: format(date, "yyyy-MM-dd"),
        isRecurring: true,
        recurringFrequency: "monthly"
      });
      
      expenses.push({
        id: id++,
        category: "water",
        description: "Water Bill",
        amount: 45 + Math.floor(Math.random() * 15),
        date: format(date, "yyyy-MM-dd"),
        isRecurring: true,
        recurringFrequency: "monthly"
      });
      
      expenses.push({
        id: id++,
        category: "internet",
        description: "Internet Service",
        amount: 75,
        date: format(date, "yyyy-MM-dd"),
        isRecurring: true,
        recurringFrequency: "monthly"
      });
      
      // Variable expenses - groceries (weekly entries)
      for (let week = 0; week < 4; week++) {
        const weekDate = new Date(date);
        weekDate.setDate(weekDate.getDate() - (week * 7));
        
        expenses.push({
          id: id++,
          category: "groceries",
          description: "Weekly Groceries",
          amount: 70 + Math.floor(Math.random() * 30),
          date: format(weekDate, "yyyy-MM-dd"),
          isRecurring: false
        });
      }
      
      // Dining out (random 2-5 times per month)
      const diningCount = 2 + Math.floor(Math.random() * 4);
      for (let d = 0; d < diningCount; d++) {
        const diningDate = new Date(date);
        diningDate.setDate(diningDate.getDate() - Math.floor(Math.random() * 30));
        
        expenses.push({
          id: id++,
          category: "dining",
          description: "Restaurant",
          amount: 30 + Math.floor(Math.random() * 50),
          date: format(diningDate, "yyyy-MM-dd"),
          isRecurring: false
        });
      }
      
      // Transportation
      expenses.push({
        id: id++,
        category: "transportation",
        description: "Monthly Bus Pass",
        amount: 75,
        date: format(date, "yyyy-MM-dd"),
        isRecurring: true,
        recurringFrequency: "monthly"
      });
      
      // Random other expenses
      const otherCount = Math.floor(Math.random() * 3);
      for (let o = 0; o < otherCount; o++) {
        const otherDate = new Date(date);
        otherDate.setDate(otherDate.getDate() - Math.floor(Math.random() * 30));
        
        const categories = ["healthcare", "education", "work", "other"];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        expenses.push({
          id: id++,
          category: randomCategory,
          description: `${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)} Expense`,
          amount: 20 + Math.floor(Math.random() * 100),
          date: format(otherDate, "yyyy-MM-dd"),
          isRecurring: false
        });
      }
    }
    
    return expenses;
  };

  const allExpenses = generateMockExpenses();
  
  // Filter expenses for selected month
  const filterExpensesByMonth = (expenses: Expense[], yearMonth: string) => {
    const { startDate, endDate } = getMonthDateRange(yearMonth);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: startDate, end: endDate });
    });
  };
  
  const currentMonthExpenses = filterExpensesByMonth(allExpenses, selectedMonth);
  
  // Calculate category totals
  const calculateCategoryTotals = (expenses: Expense[]) => {
    const categoryTotals: { [key: string]: number } = {};
    let total = 0;
    
    expenses.forEach(expense => {
      const { category, amount } = expense;
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      total += amount;
    });
    
    const result: CategoryTotal[] = Object.entries(categoryTotals).map(([category, total]) => {
      const categoryObj = expenseCategories.find(c => c.value === category);
      return {
        category: categoryObj?.label || category,
        total,
        percentage: total / (expenses.reduce((sum, exp) => sum + exp.amount, 0) || 1) * 100,
        icon: categoryObj?.icon || <Wallet className="h-4 w-4" />,
      };
    }).sort((a, b) => b.total - a.total);
    
    return { categoryTotals: result, total };
  };
  
  const { categoryTotals, total: monthlyTotal } = calculateCategoryTotals(currentMonthExpenses);
  
  // Calculate monthly expenses for chart
  const calculateMonthlyExpenses = () => {
    const result: MonthlyTotal[] = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthYearStr = format(date, "yyyy-MM");
      const monthExpenses = filterExpensesByMonth(allExpenses, monthYearStr);
      
      // Group expenses by category
      const housing = monthExpenses
        .filter(e => e.category === "rent")
        .reduce((sum, e) => sum + e.amount, 0);
      
      const utilities = monthExpenses
        .filter(e => ["electricity", "water", "internet", "phone"].includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);
      
      const other = monthExpenses
        .filter(e => !["rent", "electricity", "water", "internet", "phone"].includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);
      
      result.push({
        month: format(date, "MMM"),
        housing,
        utilities,
        other,
        total: housing + utilities + other
      });
    }
    
    return result;
  };
  
  const monthlyExpenses = calculateMonthlyExpenses();
  
  // Calculate budget status
  const calculateBudgetStatus = (budget: Budget) => {
    const percentage = (budget.current / budget.limit) * 100;
    let status: 'danger' | 'warning' | 'success' = 'success';
    
    if (percentage >= 90) {
      status = 'danger';
    } else if (percentage >= 75) {
      status = 'warning';
    }
    
    return {
      percentage: Math.min(percentage, 100),
      status
    };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof expenseFormSchema>) => {
    console.log(values);
    setIsAddExpenseOpen(false);
    form.reset();
    // In a real app, this would call an API to add the expense
  };

  // Generate month options for dropdown
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = subMonths(today, i);
      const value = format(date, "yyyy-MM");
      const label = format(date, "MMMM yyyy");
      
      options.push({ value, label });
    }
    
    return options;
  };
  
  const monthOptions = generateMonthOptions();

  // Category icon component
  const CategoryIcon = ({ category }: { category: string }) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('rent') || lowerCategory.includes('housing')) {
      return <Home className="h-4 w-4" />;
    } else if (lowerCategory.includes('electric')) {
      return <Lightbulb className="h-4 w-4" />;
    } else if (lowerCategory.includes('water')) {
      return <LifeBuoy className="h-4 w-4" />;
    } else if (lowerCategory.includes('internet') || lowerCategory.includes('wifi')) {
      return <Wifi className="h-4 w-4" />;
    } else if (lowerCategory.includes('phone')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (lowerCategory.includes('groceries')) {
      return <ShoppingBag className="h-4 w-4" />;
    } else if (lowerCategory.includes('transport') || lowerCategory.includes('car')) {
      return <Car className="h-4 w-4" />;
    } else if (lowerCategory.includes('dining') || lowerCategory.includes('restaurant')) {
      return <Utensils className="h-4 w-4" />;
    } else {
      return <Wallet className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <TenantSidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-primary-50 to-white">
        <TenantHeader />

        <div className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-2">
                  Personal Finances
                </h1>
                <p className="text-neutral-600">Track your expenses and budget</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Select defaultValue={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Expense</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Expense</DialogTitle>
                      <DialogDescription>
                        Enter the details of your expense below.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {expenseCategories.map(category => (
                                    <SelectItem key={category.value} value={category.value}>
                                      <div className="flex items-center">
                                        {category.icon}
                                        <span className="ml-2">{category.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Monthly Rent" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="0.00" 
                                    className="pl-9"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="isRecurring"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">This is a recurring expense</FormLabel>
                            </FormItem>
                          )}
                        />
                        {isRecurring && (
                          <FormField
                            control={form.control}
                            name="recurringFrequency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Frequency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        <DialogFooter>
                          <Button type="submit">Add Expense</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Monthly Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">Monthly Expenses</CardTitle>
                    <Badge variant="outline" className="bg-primary-50 border-primary-200 text-primary-700">
                      {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}
                    </Badge>
                  </div>
                  <CardDescription>
                    Overview of your spending trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Chart would go here - simplified for this example */}
                  <div className="h-64 w-full relative">
                    <div className="absolute inset-y-0 left-0 w-12 flex flex-col justify-between items-end pr-2 text-xs text-neutral-500">
                      <span>$2500</span>
                      <span>$2000</span>
                      <span>$1500</span>
                      <span>$1000</span>
                      <span>$500</span>
                      <span>$0</span>
                    </div>
                    <div className="absolute left-12 right-0 top-0 bottom-0">
                      {/* Horizontal grid lines */}
                      <div className="absolute inset-0">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i} 
                            className="absolute left-0 right-0 border-t border-neutral-100"
                            style={{ top: `${i * 20}%` }}
                          />
                        ))}
                      </div>
                      
                      {/* Bars */}
                      <div className="absolute inset-0 flex justify-around items-end pt-5">
                        {monthlyExpenses.map((month, index) => {
                          const maxValue = 2500; // Maximum value for scaling
                          const housingHeight = (month.housing / maxValue) * 100;
                          const utilitiesHeight = (month.utilities / maxValue) * 100;
                          const otherHeight = (month.other / maxValue) * 100;
                          
                          return (
                            <div key={index} className="flex flex-col items-center w-full">
                              <div className="w-4/5 flex flex-col-reverse">
                                <div 
                                  className="w-full bg-primary-500 rounded-t-sm" 
                                  style={{ height: `${housingHeight}%` }}
                                  title={`Housing: ${formatCurrency(month.housing)}`}
                                />
                                <div 
                                  className="w-full bg-secondary-500 rounded-t-sm" 
                                  style={{ height: `${utilitiesHeight}%` }}
                                  title={`Utilities: ${formatCurrency(month.utilities)}`}
                                />
                                <div 
                                  className="w-full bg-amber-500 rounded-t-sm" 
                                  style={{ height: `${otherHeight}%` }}
                                  title={`Other: ${formatCurrency(month.other)}`}
                                />
                              </div>
                              <span className="text-xs mt-2 text-neutral-500">{month.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center items-center gap-6 mt-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary-500 rounded-sm mr-2" />
                      <span className="text-xs text-neutral-700">Housing</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-secondary-500 rounded-sm mr-2" />
                      <span className="text-xs text-neutral-700">Utilities</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-sm mr-2" />
                      <span className="text-xs text-neutral-700">Other</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <PieChart className="h-5 w-5 text-primary-500 mr-2" />
                    Expense Breakdown
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-neutral-900">
                      {formatCurrency(monthlyTotal)}
                    </div>
                    <div className="text-sm text-neutral-500">Total Expenses</div>
                  </div>
                  
                  <div className="space-y-4">
                    {categoryTotals.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {category.icon}
                            <span className="text-sm ml-2">{category.category}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(category.total)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full">
                          <div 
                            className={cn(
                              "h-full rounded-full", 
                              index === 0 ? "bg-primary-500" : 
                              index === 1 ? "bg-secondary-500" : 
                              index === 2 ? "bg-amber-500" : 
                              "bg-neutral-500"
                            )}
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Budget Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {budgets.map((budget, index) => {
              const { percentage, status } = calculateBudgetStatus(budget);
              return (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {budget.icon}
                        <h3 className="text-sm font-medium ml-2">{budget.category}</h3>
                      </div>
                      <Badge 
                        className={cn(
                          "text-xs",
                          status === 'danger' ? "bg-rose-100 text-rose-800 border-rose-200" :
                          status === 'warning' ? "bg-amber-100 text-amber-800 border-amber-200" :
                          "bg-emerald-100 text-emerald-800 border-emerald-200"
                        )}
                      >
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress 
                        value={percentage} 
                        className="h-2 bg-neutral-100" 
                        // Adjusted from indicatorClassName to use style
                        style={{
                          '--progress-background': status === 'danger' ? 'rgb(225, 29, 72)' : 
                                                  status === 'warning' ? 'rgb(245, 158, 11)' : 
                                                  'rgb(16, 185, 129)'
                        } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>Spent: {formatCurrency(budget.current)}</span>
                        <span>Limit: {formatCurrency(budget.limit)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Expenses */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 text-primary-500 mr-2" />
                  Recent Expenses
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
              <CardDescription>
                Your recent expenses for {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">DATE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">CATEGORY</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">DESCRIPTION</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">AMOUNT</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500">RECURRING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMonthExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                          No expenses found for this month
                        </td>
                      </tr>
                    ) : (
                      currentMonthExpenses.map((expense) => {
                        const categoryData = expenseCategories.find(c => c.value === expense.category);
                        
                        return (
                          <tr key={expense.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                            <td className="px-4 py-3 text-sm text-neutral-900">
                              {format(new Date(expense.date), "MMM d, yyyy")}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="p-1 rounded bg-neutral-100 mr-2">
                                  <CategoryIcon category={expense.category} />
                                </div>
                                <span className="text-sm font-medium text-neutral-900">
                                  {categoryData?.label || expense.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-700">
                              {expense.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-neutral-900">
                              {formatCurrency(expense.amount)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {expense.isRecurring ? (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  {expense.recurringFrequency}
                                </Badge>
                              ) : (
                                <span className="text-xs text-neutral-400">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="py-4 px-6 border-t border-neutral-100">
              <div className="flex justify-between items-center w-full text-sm">
                <span className="text-neutral-500">
                  Showing {currentMonthExpenses.length} expenses
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}