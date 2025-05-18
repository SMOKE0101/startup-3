import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  FileText, 
  Wrench, 
  Calendar, 
  MessageCircle, 
  DollarSign, 
  ChevronRight, 
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { format, addDays } from "date-fns";
import { TenantHeader } from "@/components/tenant/tenant-header";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";

// Mock data types for tenant dashboard
interface TenantProperty {
  id: number;
  name: string;
  address: string;
  unitNumber: string;
  imageUrl: string;
  landlordName: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  rentDueDay: number;
}

interface TenantPayment {
  id: number;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface TenantMaintenanceRequest {
  id: number;
  issue: string;
  description: string;
  status: 'pending' | 'in_progress' | 'scheduled' | 'completed';
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  notes?: string;
}

interface TenantDocument {
  id: number;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
}

interface TenantMessage {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export default function TenantDashboard() {
  const { user } = useAuth();
  const today = new Date();

  // Ensure this page is only accessible for tenants
  if (user?.role !== UserRole.TENANT) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
          <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-neutral-600">This dashboard is only for tenant accounts.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Go to appropriate dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock tenant data - in a real app, these would be fetched from the backend
  const tenantProperty: TenantProperty = {
    id: 1,
    name: "Westside Apartments",
    address: "123 Main Street, Anytown, CA 90210",
    unitNumber: "304",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    landlordName: "John Smith",
    leaseStart: "2025-01-01",
    leaseEnd: "2025-12-31",
    rentAmount: 1500,
    rentDueDay: 1
  };

  // Generate upcoming payments
  const generatePayments = () => {
    const payments: TenantPayment[] = [];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Previous month's payment (paid)
    const prevMonth = new Date(currentYear, currentMonth - 1, tenantProperty.rentDueDay);
    payments.push({
      id: 1,
      amount: tenantProperty.rentAmount,
      dueDate: format(prevMonth, "yyyy-MM-dd"),
      status: 'paid',
      description: `Rent for ${format(prevMonth, "MMMM yyyy")}`
    });
    
    // Current month's payment (pending/paid depending on current day)
    const currentMonthDue = new Date(currentYear, currentMonth, tenantProperty.rentDueDay);
    payments.push({
      id: 2,
      amount: tenantProperty.rentAmount,
      dueDate: format(currentMonthDue, "yyyy-MM-dd"),
      status: today.getDate() > tenantProperty.rentDueDay ? 'paid' : 'pending',
      description: `Rent for ${format(currentMonthDue, "MMMM yyyy")}`
    });
    
    // Next month's payment (pending)
    const nextMonth = new Date(currentYear, currentMonth + 1, tenantProperty.rentDueDay);
    payments.push({
      id: 3,
      amount: tenantProperty.rentAmount,
      dueDate: format(nextMonth, "yyyy-MM-dd"),
      status: 'pending',
      description: `Rent for ${format(nextMonth, "MMMM yyyy")}`
    });
    
    return payments;
  };

  const tenantPayments = generatePayments();

  // Mock maintenance requests
  const maintenanceRequests: TenantMaintenanceRequest[] = [
    {
      id: 1,
      issue: "Leaking Faucet",
      description: "The bathroom sink faucet is leaking water constantly.",
      status: 'in_progress',
      createdAt: format(addDays(today, -5), "yyyy-MM-dd"),
      updatedAt: format(addDays(today, -3), "yyyy-MM-dd"),
      scheduledDate: format(addDays(today, 2), "yyyy-MM-dd")
    },
    {
      id: 2,
      issue: "Broken Light Fixture",
      description: "The ceiling light in the living room doesn't work.",
      status: 'completed',
      createdAt: format(addDays(today, -15), "yyyy-MM-dd"),
      updatedAt: format(addDays(today, -10), "yyyy-MM-dd")
    },
    {
      id: 3,
      issue: "AC Not Cooling",
      description: "The air conditioning unit isn't cooling the apartment properly.",
      status: 'pending',
      createdAt: format(today, "yyyy-MM-dd"),
      updatedAt: format(today, "yyyy-MM-dd")
    }
  ];

  // Mock documents
  const documents: TenantDocument[] = [
    {
      id: 1,
      name: "Lease Agreement",
      type: "PDF",
      uploadedBy: "Landlord",
      uploadedAt: "2025-01-01",
      fileSize: "2.5 MB"
    },
    {
      id: 2,
      name: "Property Rules",
      type: "PDF",
      uploadedBy: "Landlord",
      uploadedAt: "2025-01-01",
      fileSize: "1.2 MB"
    },
    {
      id: 3,
      name: "Move-in Inspection",
      type: "PDF",
      uploadedBy: "Tenant",
      uploadedAt: "2025-01-02",
      fileSize: "3.7 MB"
    }
  ];

  // Mock messages
  const messages: TenantMessage[] = [
    {
      id: 1,
      sender: "John Smith (Landlord)",
      content: "Just confirming our maintenance appointment for this Friday at 10am.",
      createdAt: format(addDays(today, -1), "yyyy-MM-dd HH:mm"),
      isRead: true
    },
    {
      id: 2,
      sender: "Property Management",
      content: "We'll be performing routine hallway maintenance next week. No action needed from you.",
      createdAt: format(addDays(today, -3), "yyyy-MM-dd HH:mm"),
      isRead: false
    }
  ];

  // Calculate days left in lease
  const calculateLeaseRemaining = () => {
    const leaseEnd = new Date(tenantProperty.leaseEnd);
    const diffTime = Math.abs(leaseEnd.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalLeaseDays = Math.abs(
      (new Date(tenantProperty.leaseEnd).getTime() - new Date(tenantProperty.leaseStart).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    
    return {
      daysLeft: diffDays,
      percentageComplete: 100 - Math.round((diffDays / totalLeaseDays) * 100)
    };
  };

  const leaseInfo = calculateLeaseRemaining();

  // Calculate payment status for current month
  const calculatePaymentStatus = () => {
    const currentMonthPayment = tenantPayments.find(p => {
      const paymentMonth = new Date(p.dueDate).getMonth();
      const currentMonth = today.getMonth();
      return paymentMonth === currentMonth;
    });
    
    return currentMonthPayment?.status || 'pending';
  };

  const currentMonthPaymentStatus = calculatePaymentStatus();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200">Overdue</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">Completed</Badge>;
      default:
        return <Badge className="bg-neutral-100 text-neutral-800">{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <TenantSidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-primary-50 to-white relative">
        {/* Property Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 z-0" 
          style={{ backgroundImage: `url(${tenantProperty.imageUrl})` }}
          aria-hidden="true"
        />
        
        <div 
          className="absolute inset-0 z-0 bg-gradient-to-tr from-primary-50/90 via-transparent to-white/60" 
          aria-hidden="true"
        />
        
        <TenantHeader />

        <div className="flex-1 p-6 md:p-8 relative z-10">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-2">
                  Welcome back, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-neutral-600">Here's an overview of your apartment and account.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  variant="outline" 
                  className="border-primary-200 text-primary-700 hover:bg-primary-50"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>Contact Landlord</span>
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700">
                  <Wrench className="h-4 w-4 mr-2" />
                  <span>Request Maintenance</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Apartment Overview */}
          <Card className="mb-8 border-none shadow-md">
            <CardHeader className="pb-2 border-b border-neutral-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-heading font-semibold flex items-center">
                  <Home className="h-5 w-5 text-primary-500 mr-2" />
                  Your Apartment
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-800">
                  View Details <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/5">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={tenantProperty.imageUrl} 
                      alt={tenantProperty.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-3/5 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">{tenantProperty.name}, Unit {tenantProperty.unitNumber}</h3>
                    <p className="text-neutral-600">{tenantProperty.address}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 bg-neutral-50">
                      <p className="text-sm text-neutral-500 mb-1">Rent Amount</p>
                      <p className="text-lg font-semibold text-neutral-900">{formatCurrency(tenantProperty.rentAmount)}</p>
                      <p className="text-xs text-neutral-500">Due on the {tenantProperty.rentDueDay}{tenantProperty.rentDueDay === 1 ? 'st' : 'th'}</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-neutral-50">
                      <p className="text-sm text-neutral-500 mb-1">May 2025 Rent</p>
                      <div className="flex items-center">
                        {currentMonthPaymentStatus === 'paid' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-500 mr-2" />
                        )}
                        <p className="text-lg font-semibold text-neutral-900">
                          {currentMonthPaymentStatus === 'paid' ? 'Paid' : 'Due Soon'}
                        </p>
                      </div>
                      <p className="text-xs text-neutral-500">
                        {currentMonthPaymentStatus === 'paid' 
                          ? 'Thank you for your payment' 
                          : `Due on ${format(new Date(2025, 4, 1), "MMM d, yyyy")}`}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 bg-neutral-50">
                      <p className="text-sm text-neutral-500 mb-1">Lease Ends</p>
                      <p className="text-lg font-semibold text-neutral-900">
                        {format(new Date(tenantProperty.leaseEnd), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-neutral-500">{leaseInfo.daysLeft} days remaining</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Lease Progress</p>
                      <p className="text-sm text-neutral-500">{leaseInfo.percentageComplete}% Complete</p>
                    </div>
                    <Progress value={leaseInfo.percentageComplete} className="h-2 bg-neutral-100" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-neutral-100 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-white">Payments</TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-white">Maintenance</TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-white">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Overview */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <DollarSign className="h-5 w-5 text-emerald-500 mr-2" />
                        Payment Overview
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary-600">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {tenantPayments.slice(0, 2).map(payment => (
                        <div key={payment.id} className="flex justify-between items-center p-3 rounded-lg border bg-neutral-50">
                          <div>
                            <p className="font-medium text-neutral-900">{payment.description}</p>
                            <p className="text-sm text-neutral-500">
                              Due on {format(new Date(payment.dueDate), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full mt-2">Make a Payment</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Maintenance Overview */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Wrench className="h-5 w-5 text-amber-500 mr-2" />
                        Maintenance Requests
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary-600">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {maintenanceRequests.slice(0, 2).map(request => (
                        <div 
                          key={request.id} 
                          className={cn(
                            "flex justify-between items-center p-3 rounded-lg border",
                            request.status === 'pending' ? 'bg-amber-50 border-amber-100' : 
                            request.status === 'in_progress' ? 'bg-blue-50 border-blue-100' : 
                            'bg-neutral-50'
                          )}
                        >
                          <div>
                            <p className="font-medium text-neutral-900">{request.issue}</p>
                            <p className="text-sm text-neutral-500">
                              Submitted on {format(new Date(request.createdAt), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <div>
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                      ))}
                      <Button className="w-full mt-2">New Request</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Messages and Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Messages */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <MessageCircle className="h-5 w-5 text-primary-500 mr-2" />
                        Recent Messages
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary-600">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500">
                        <MessageCircle className="h-10 w-10 mx-auto text-neutral-300 mb-2" />
                        <p>No messages yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map(message => (
                          <div key={message.id} className="p-3 rounded-lg border bg-neutral-50">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-medium text-neutral-900">{message.sender}</p>
                              <div className="flex items-center">
                                <p className="text-xs text-neutral-500">
                                  {format(new Date(message.createdAt), "MMM d")}
                                </p>
                                {!message.isRead && (
                                  <span className="ml-2 w-2 h-2 rounded-full bg-primary-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-neutral-700">{message.content}</p>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full mt-2">Send Message</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Documents */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <FileText className="h-5 w-5 text-secondary-500 mr-2" />
                        Important Documents
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary-600">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {documents.map(document => (
                        <div key={document.id} className="flex justify-between items-center p-3 rounded-lg border bg-neutral-50">
                          <div className="flex items-center">
                            <div className="bg-secondary-100 text-secondary-700 p-2 rounded mr-3">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{document.name}</p>
                              <p className="text-xs text-neutral-500">
                                {document.uploadedBy} • {document.fileSize}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary-600">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Payment History</CardTitle>
                  <CardDescription>View and manage your payments</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Detailed payment history would go here */}
                  <div className="text-center py-10 text-neutral-500">
                    <DollarSign className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <p>Full payment history will be displayed here.</p>
                    <Button className="mt-4">Make a Payment</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Maintenance Requests</CardTitle>
                  <CardDescription>Submit and track maintenance requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Detailed maintenance history would go here */}
                  <div className="text-center py-10 text-neutral-500">
                    <Wrench className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <p>All maintenance requests will be displayed here.</p>
                    <Button className="mt-4">Submit New Request</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Documents</CardTitle>
                  <CardDescription>View and manage your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Detailed documents list would go here */}
                  <div className="text-center py-10 text-neutral-500">
                    <FileText className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <p>All documents will be displayed here.</p>
                    <Button className="mt-4">Upload Document</Button>
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