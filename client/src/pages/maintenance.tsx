import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, MoreHorizontal, Wrench } from "lucide-react";
import { format } from "date-fns";
import { MaintenanceStatus } from "@/lib/types";

// Mock maintenance request data - would be fetched from the API in a real app
const maintenanceRequests = [
  {
    id: 1,
    issue: "Leaking bathroom faucet",
    description: "The bathroom faucet is constantly dripping water, causing water stains.",
    propertyName: "Westview Apartments",
    unitNumber: "302",
    tenantName: "Anna Johnson",
    createdAt: "2023-08-24T10:30:00Z",
    status: MaintenanceStatus.IN_PROGRESS
  },
  {
    id: 2,
    issue: "HVAC not working",
    description: "The air conditioning unit is not cooling the apartment. It's blowing warm air.",
    propertyName: "Riverside Apartments",
    unitNumber: "107",
    tenantName: "Robert Chen",
    createdAt: "2023-08-22T14:45:00Z",
    status: MaintenanceStatus.URGENT
  },
  {
    id: 3,
    issue: "Broken window handle",
    description: "The handle on the living room window is broken and won't close properly.",
    propertyName: "Oakridge Townhomes",
    unitNumber: "5B",
    tenantName: "Sarah Miller",
    createdAt: "2023-08-21T09:15:00Z",
    status: MaintenanceStatus.SCHEDULED
  },
  {
    id: 4,
    issue: "Garbage disposal jammed",
    description: "The kitchen sink garbage disposal is jammed and making a humming noise when turned on.",
    propertyName: "Westview Apartments",
    unitNumber: "210",
    tenantName: "Michael Garcia",
    createdAt: "2023-08-20T16:20:00Z",
    status: MaintenanceStatus.COMPLETED
  }
];

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = 
      request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && request.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusClass = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING:
        return "bg-neutral-100 text-neutral-700";
      case MaintenanceStatus.IN_PROGRESS:
        return "bg-warning-100 text-warning-700";
      case MaintenanceStatus.URGENT:
        return "bg-danger-100 text-danger-700";
      case MaintenanceStatus.SCHEDULED:
        return "bg-neutral-100 text-neutral-700";
      case MaintenanceStatus.COMPLETED:
        return "bg-secondary-100 text-secondary-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getStatusText = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING:
        return "Pending";
      case MaintenanceStatus.IN_PROGRESS:
        return "In Progress";
      case MaintenanceStatus.URGENT:
        return "Urgent";
      case MaintenanceStatus.SCHEDULED:
        return "Scheduled";
      case MaintenanceStatus.COMPLETED:
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-neutral-50">
        <Header />

        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-2">Maintenance</h1>
              <p className="text-neutral-600">Track and manage all maintenance requests for your properties.</p>
            </div>
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" /> New Maintenance Request
            </Button>
          </div>

          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardHeader className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <Input 
                    type="search" 
                    placeholder="Search maintenance requests..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No maintenance requests found</h3>
                  <p className="text-neutral-600 mb-6">
                    {searchTerm ? "Try a different search term." : "No maintenance requests match the current filter."}
                  </p>
                  <Button className="mx-auto">
                    <PlusCircle className="h-4 w-4 mr-2" /> Create New Request
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-neutral-50">
                    <TableRow>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Issue</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Tenant</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} className="border-b border-neutral-200">
                        <TableCell className="text-sm font-medium text-neutral-800">
                          {request.issue}
                          <p className="font-normal text-xs text-neutral-500 mt-1 line-clamp-1">{request.description}</p>
                        </TableCell>
                        <TableCell className="text-sm text-neutral-600">
                          {request.propertyName}, Unit {request.unitNumber}
                        </TableCell>
                        <TableCell className="text-sm text-neutral-600">{request.tenantName}</TableCell>
                        <TableCell className="text-sm text-neutral-600">
                          {format(new Date(request.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuItem>Assign Vendor</DropdownMenuItem>
                              <DropdownMenuItem>Contact Tenant</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
