import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Building, 
  Filter,
  SortDesc,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays, subDays } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";

// Types for maintenance requests
interface MaintenanceRequest {
  id: number;
  propertyId: number;
  unitNumber: string;
  propertyName: string;
  tenantId: number;
  tenantName: string;
  issue: string;
  description: string;
  status: "pending" | "in_progress" | "scheduled" | "completed" | "urgent";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  completedDate?: string;
  assignedTo?: string;
  notes?: string;
  attachments?: string[];
}

// Form schema for creating a maintenance request
const maintenanceFormSchema = z.object({
  propertyId: z.string().min(1, { message: "Please select a property" }),
  unitNumber: z.string().min(1, { message: "Please provide a unit number" }),
  issue: z.string().min(3, { message: "Issue must be at least 3 characters" }).max(100),
  description: z.string().min(10, { message: "Please provide more details" }),
  priority: z.enum(["low", "medium", "high", "urgent"], { required_error: "Please select a priority" }),
});

export default function MaintenanceTracker() {
  const { user } = useAuth();
  const [requestFilter, setRequestFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);

  const form = useForm<z.infer<typeof maintenanceFormSchema>>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      propertyId: "",
      unitNumber: "",
      issue: "",
      description: "",
      priority: "medium",
    },
  });

  // Mock data - in a real app, these would be fetched from the API
  const isTenant = user?.role === UserRole.TENANT;
  const isLandlord = user?.role === UserRole.LANDLORD || user?.role === UserRole.PROPERTY_MANAGER;

  // Sample properties for the form
  const properties = [
    { id: 1, name: "Westside Apartments" },
    { id: 2, name: "Eastside Condos" },
    { id: 3, name: "Downtown Lofts" }
  ];

  // Sample filter options
  const filterOptions = [
    { value: "all", label: "All Requests" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "urgent", label: "Urgent" }
  ];

  // Sample maintenance requests
  const maintenanceRequests: MaintenanceRequest[] = [
    {
      id: 1,
      propertyId: 1,
      propertyName: "Westside Apartments",
      unitNumber: "203",
      tenantId: 101,
      tenantName: "John Smith",
      issue: "Broken Heater",
      description: "The heater in the living room is making a loud noise and not heating properly.",
      status: "urgent",
      priority: "high",
      createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
      scheduledDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      assignedTo: "Mike Technician"
    },
    {
      id: 2,
      propertyId: 1,
      propertyName: "Westside Apartments",
      unitNumber: "105",
      tenantId: 102,
      tenantName: "Sarah Johnson",
      issue: "Leaking Faucet",
      description: "The bathroom sink faucet is leaking water constantly and creating a puddle.",
      status: "in_progress",
      priority: "medium",
      createdAt: format(subDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
      assignedTo: "Mike Technician",
      notes: "Parts ordered, scheduled for repair on Thursday"
    },
    {
      id: 3,
      propertyId: 2,
      propertyName: "Eastside Condos",
      unitNumber: "302",
      tenantId: 103,
      tenantName: "Robert Brown",
      issue: "Broken Window",
      description: "The window in the bedroom won't close properly, letting in cold air and noise.",
      status: "scheduled",
      priority: "medium",
      createdAt: format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: format(subDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
      scheduledDate: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      assignedTo: "Home Repair Specialists"
    },
    {
      id: 4,
      propertyId: 3,
      propertyName: "Downtown Lofts",
      unitNumber: "501",
      tenantId: 104,
      tenantName: "Emily Wilson",
      issue: "Clogged Drain",
      description: "The kitchen sink is completely clogged and water won't drain at all.",
      status: "completed",
      priority: "high",
      createdAt: format(subDays(new Date(), 14), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: format(subDays(new Date(), 11), "yyyy-MM-dd'T'HH:mm:ss"),
      completedDate: format(subDays(new Date(), 11), "yyyy-MM-dd"),
      assignedTo: "Plumbing Pros",
      notes: "Fixed clogged drain, recommended regular maintenance"
    },
    {
      id: 5,
      propertyId: 2,
      propertyName: "Eastside Condos",
      unitNumber: "204",
      tenantId: 105,
      tenantName: "James Anderson",
      issue: "AC Not Working",
      description: "The air conditioning unit isn't turning on at all, and the apartment is getting very hot.",
      status: "pending",
      priority: "high",
      createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss")
    }
  ];

  // Filter and sort requests
  const filteredRequests = maintenanceRequests
    .filter(request => {
      // Filter by status
      if (requestFilter !== "all" && request.status !== requestFilter) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          request.issue.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          request.tenantName.toLowerCase().includes(query) ||
          request.unitNumber.toLowerCase().includes(query) ||
          request.propertyName.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  // For tenants, only show their requests
  const displayedRequests = isTenant 
    ? filteredRequests.filter(req => req.tenantId === user?.id)
    : filteredRequests;

  // Stats for landlords
  const requestStats = {
    total: maintenanceRequests.length,
    urgent: maintenanceRequests.filter(r => r.status === "urgent").length,
    inProgress: maintenanceRequests.filter(r => r.status === "in_progress").length,
    pending: maintenanceRequests.filter(r => r.status === "pending").length,
    scheduled: maintenanceRequests.filter(r => r.status === "scheduled").length,
    completed: maintenanceRequests.filter(r => r.status === "completed").length,
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "urgent":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200">Urgent</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">Pending</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">In Progress</Badge>;
      case "scheduled":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">Completed</Badge>;
      default:
        return <Badge className="bg-neutral-100 text-neutral-800">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200">Urgent</Badge>;
      case "high":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">High</Badge>;
      case "medium":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Medium</Badge>;
      case "low":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">Low</Badge>;
      default:
        return <Badge className="bg-neutral-100 text-neutral-800">{priority}</Badge>;
    }
  };

  const handleSubmitRequest = (values: z.infer<typeof maintenanceFormSchema>) => {
    console.log("Submitted request:", values);
    setShowNewRequestDialog(false);
    form.reset();
    // In a real app, this would call an API to create the request
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-primary-50 to-white">
        <Header />

        <div className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-2">
                  Maintenance Tracker
                </h1>
                <p className="text-neutral-600">
                  {isTenant 
                    ? "Submit and track maintenance requests for your unit" 
                    : "Manage and monitor all maintenance requests across your properties"}
                </p>
              </div>
              
              <div>
                <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      <span>New Request</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Submit Maintenance Request</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to submit a new maintenance request.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmitRequest)} className="space-y-4 pt-4">
                        <FormField
                          control={form.control}
                          name="propertyId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select property" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {properties.map(property => (
                                    <SelectItem key={property.id} value={property.id.toString()}>
                                      {property.name}
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
                          name="unitNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 101" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="issue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Issue Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Leaking Faucet" {...field} />
                              </FormControl>
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
                                <Textarea 
                                  placeholder="Please provide detailed information about the issue" 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Stats Cards for Landlords */}
          {isLandlord && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <Card className="bg-neutral-50 border-neutral-200">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-neutral-500 text-xs mb-1">Total</p>
                  <p className="text-2xl font-semibold">{requestStats.total}</p>
                </CardContent>
              </Card>
              <Card className="bg-rose-50 border-rose-200">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-rose-600 text-xs mb-1">Urgent</p>
                  <p className="text-2xl font-semibold text-rose-700">{requestStats.urgent}</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-amber-600 text-xs mb-1">Pending</p>
                  <p className="text-2xl font-semibold text-amber-700">{requestStats.pending}</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-blue-600 text-xs mb-1">In Progress</p>
                  <p className="text-2xl font-semibold text-blue-700">{requestStats.inProgress}</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-purple-600 text-xs mb-1">Scheduled</p>
                  <p className="text-2xl font-semibold text-purple-700">{requestStats.scheduled}</p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-emerald-600 text-xs mb-1">Completed</p>
                  <p className="text-2xl font-semibold text-emerald-700">{requestStats.completed}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requests List */}
            <div className="lg:col-span-1 flex flex-col">
              <Card className="flex-1 overflow-hidden border-neutral-200">
                <CardHeader className="p-4 border-b border-neutral-100">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                        <Input 
                          type="search" 
                          placeholder="Search requests..."
                          className="pl-9 bg-neutral-50 border-neutral-200"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue={requestFilter} onValueChange={setRequestFilter}>
                        <SelectTrigger className="w-[120px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select defaultValue={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[120px]">
                          <SortDesc className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-auto max-h-[700px]">
                  {displayedRequests.length === 0 ? (
                    <div className="p-8 text-center">
                      <Wrench className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <p className="text-neutral-500">No maintenance requests found</p>
                      {searchQuery && (
                        <Button 
                          variant="link" 
                          className="mt-2" 
                          onClick={() => setSearchQuery("")}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {displayedRequests.map((request) => (
                        <div 
                          key={request.id}
                          className={cn(
                            "p-4 hover:bg-neutral-50 cursor-pointer flex flex-col",
                            selectedRequest?.id === request.id && "bg-primary-50 hover:bg-primary-50 border-l-4 border-l-primary-600"
                          )}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-neutral-900">{request.issue}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
                            {request.description}
                          </p>
                          <div className="flex items-center text-xs text-neutral-500 justify-between">
                            <div className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              <span>{request.propertyName} - {request.unitNumber}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {format(new Date(request.createdAt), "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Request Details */}
            <div className="lg:col-span-2">
              {selectedRequest ? (
                <Card className="border-neutral-200">
                  <CardHeader className="pb-2 border-b border-neutral-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-medium">{selectedRequest.issue}</CardTitle>
                        <CardDescription>
                          Request #{selectedRequest.id} - {format(new Date(selectedRequest.createdAt), "PPP")}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedRequest.status)}
                        {getPriorityBadge(selectedRequest.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Property and Tenant Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900 mb-2">Property Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Building className="h-4 w-4 text-neutral-500 mr-2" />
                            <span>{selectedRequest.propertyName}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-medium w-24">Unit:</span>
                            <span>{selectedRequest.unitNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900 mb-2">Tenant Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="font-medium w-24">Name:</span>
                            <span>{selectedRequest.tenantName}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-medium w-24">Tenant ID:</span>
                            <span>{selectedRequest.tenantId}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900 mb-2">Request Details</h3>
                      <p className="text-sm whitespace-pre-line">{selectedRequest.description}</p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900 mb-3">Request Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </div>
                            <div className="flex-1 w-px bg-neutral-200 my-1"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Request Submitted</p>
                            <p className="text-xs text-neutral-500">
                              {format(new Date(selectedRequest.createdAt), "PPP 'at' p")}
                            </p>
                          </div>
                        </div>

                        {selectedRequest.status !== "pending" && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Clock className="h-4 w-4" />
                              </div>
                              <div className="flex-1 w-px bg-neutral-200 my-1"></div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Status Updated to {selectedRequest.status === "in_progress" ? "In Progress" : selectedRequest.status}</p>
                              <p className="text-xs text-neutral-500">
                                {format(new Date(selectedRequest.updatedAt), "PPP 'at' p")}
                              </p>
                              {selectedRequest.assignedTo && (
                                <p className="text-xs text-neutral-600 mt-1">
                                  Assigned to: {selectedRequest.assignedTo}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {selectedRequest.scheduledDate && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                <Calendar className="h-4 w-4" />
                              </div>
                              {selectedRequest.status !== "completed" && (
                                <div className="flex-1 w-px bg-neutral-200 my-1"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">Scheduled for Repair</p>
                              <p className="text-xs text-neutral-500">
                                {format(new Date(selectedRequest.scheduledDate), "PPP")}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedRequest.completedDate && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Request Completed</p>
                              <p className="text-xs text-neutral-500">
                                {format(new Date(selectedRequest.completedDate), "PPP")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedRequest.notes && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900 mb-2">Notes</h3>
                        <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                          <p className="text-sm">{selectedRequest.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row sm:justify-between border-t border-neutral-100 gap-3">
                    {/* Tenant actions */}
                    {isTenant && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline">Contact Manager</Button>
                        {selectedRequest.status === "completed" && (
                          <Button variant="outline">Rate Service</Button>
                        )}
                      </div>
                    )}

                    {/* Landlord/manager actions */}
                    {isLandlord && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {selectedRequest.status === "pending" && (
                          <>
                            <Button className="bg-blue-600 hover:bg-blue-700">Start Work</Button>
                            <Button variant="outline">Schedule</Button>
                            {selectedRequest.priority !== "urgent" && (
                              <Button variant="destructive">Mark Urgent</Button>
                            )}
                          </>
                        )}
                        
                        {selectedRequest.status === "in_progress" && (
                          <>
                            <Button variant="outline">Update Status</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">Mark Complete</Button>
                          </>
                        )}
                        
                        {selectedRequest.status === "scheduled" && (
                          <>
                            <Button className="bg-blue-600 hover:bg-blue-700">Start Work</Button>
                            <Button variant="outline">Reschedule</Button>
                          </>
                        )}
                        
                        {selectedRequest.status === "completed" && (
                          <Button variant="outline">Reopen Request</Button>
                        )}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ) : (
                <Card className="border-neutral-200 h-full flex items-center justify-center">
                  <CardContent className="p-8 text-center">
                    <Wrench className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <p className="text-neutral-500 mb-2">Select a request to view details</p>
                    <p className="text-neutral-400 text-sm">
                      {displayedRequests.length === 0 
                        ? "No maintenance requests found" 
                        : "Click on a request from the list to view details"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Check component for timeline
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}