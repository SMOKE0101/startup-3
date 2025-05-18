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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Filter, MoreHorizontal, DollarSign } from "lucide-react";
import { format } from "date-fns";

// Mock payment data - would be fetched from the API in a real app
const payments = [
  {
    id: 1,
    propertyName: "Westview Apartments",
    amount: 8400,
    dueDate: "2023-09-01",
    status: "pending",
    type: "rent",
    tenantName: "Multiple tenants"
  },
  {
    id: 2,
    propertyName: "Oakridge Townhomes",
    amount: 6200,
    dueDate: "2023-09-03",
    status: "pending",
    type: "rent",
    tenantName: "Multiple tenants"
  },
  {
    id: 3,
    propertyName: "Riverside Apartments",
    amount: 1850,
    dueDate: "2023-09-05",
    status: "pending",
    type: "utilities",
    tenantName: "Multiple tenants"
  },
  {
    id: 4,
    propertyName: "Westview Apartments",
    amount: 250,
    dueDate: "2023-08-20",
    status: "overdue",
    type: "maintenance",
    tenantName: "N/A"
  },
  {
    id: 5,
    propertyName: "Riverside Apartments",
    amount: 9500,
    dueDate: "2023-08-01",
    status: "paid",
    type: "rent",
    tenantName: "Multiple tenants"
  }
];

export default function Billing() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPayments = payments.filter(payment => {
    if (activeTab === "all") return true;
    return payment.status === activeTab;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-secondary-100 text-secondary-700";
      case "overdue":
        return "bg-danger-100 text-danger-700";
      case "pending":
      default:
        return "bg-warning-100 text-warning-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "overdue":
        return "Overdue";
      case "pending":
      default:
        return "Pending";
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
              <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-2">Billing</h1>
              <p className="text-neutral-600">Manage all your payments, rents, and expenses.</p>
            </div>
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Payment
            </Button>
          </div>

          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardHeader className="p-6 flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-heading">Payments</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No payments found</h3>
                  <p className="text-neutral-600 mb-6">
                    {activeTab !== "all" 
                      ? `You don't have any ${activeTab} payments.` 
                      : "No payments have been recorded yet."}
                  </p>
                  <Button className="mx-auto">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Payment
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-neutral-50">
                    <TableRow>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Due Date</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Tenant</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="border-b border-neutral-200">
                        <TableCell className="text-sm font-medium text-neutral-800">{payment.propertyName}</TableCell>
                        <TableCell className="text-sm text-neutral-600">${payment.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-neutral-600">
                          {format(new Date(payment.dueDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-sm text-neutral-600 capitalize">{payment.type}</TableCell>
                        <TableCell className="text-sm text-neutral-600">{payment.tenantName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(payment.status)}`}>
                            {getStatusText(payment.status)}
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
                              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
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
