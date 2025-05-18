import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { PlusCircle, Search, MoreHorizontal, UserPlus } from "lucide-react";
import { format } from "date-fns";

// Mock tenant data - would be fetched from the API in a real app
const tenants = [
  {
    id: 1,
    name: "Anna Johnson",
    email: "anna@example.com",
    phone: "123-456-7890",
    propertyName: "Westview Apartments",
    unitNumber: "302",
    leaseStart: "2023-01-15",
    leaseEnd: "2024-01-14",
    rentAmount: 1200,
    status: "active"
  },
  {
    id: 2,
    name: "Robert Chen",
    email: "robert@example.com",
    phone: "234-567-8901",
    propertyName: "Riverside Apartments",
    unitNumber: "107",
    leaseStart: "2022-09-01",
    leaseEnd: "2023-08-31",
    rentAmount: 950,
    status: "active"
  },
  {
    id: 3,
    name: "Sarah Miller",
    email: "sarah@example.com",
    phone: "345-678-9012",
    propertyName: "Oakridge Townhomes",
    unitNumber: "5B",
    leaseStart: "2022-11-15",
    leaseEnd: "2023-11-14",
    rentAmount: 1400,
    status: "active"
  },
  {
    id: 4,
    name: "Michael Garcia",
    email: "michael@example.com",
    phone: "456-789-0123",
    propertyName: "Westview Apartments",
    unitNumber: "210",
    leaseStart: "2023-02-01",
    leaseEnd: "2024-01-31",
    rentAmount: 1150,
    status: "active"
  }
];

export default function Tenants() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-2">Tenants</h1>
              <p className="text-neutral-600">Manage all your tenants and lease information.</p>
            </div>
            <Button className="mt-4 md:mt-0">
              <UserPlus className="h-4 w-4 mr-2" /> Add Tenant
            </Button>
          </div>

          <Card>
            <CardHeader className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <Input 
                    type="search" 
                    placeholder="Search tenants..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {filteredTenants.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No tenants found</h3>
                  <p className="text-neutral-600 mb-6">
                    {searchTerm ? "Try a different search term." : "Add your first tenant to get started."}
                  </p>
                  {!searchTerm && (
                    <Button className="mx-auto">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Tenant
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-neutral-50">
                    <TableRow>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Contact</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Lease Period</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Rent</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.map((tenant) => (
                      <TableRow key={tenant.id} className="border-b border-neutral-200">
                        <TableCell className="text-sm font-medium text-neutral-800">{tenant.name}</TableCell>
                        <TableCell className="text-sm text-neutral-600">
                          <div>{tenant.email}</div>
                          <div>{tenant.phone}</div>
                        </TableCell>
                        <TableCell className="text-sm text-neutral-600">
                          <div>{tenant.propertyName}</div>
                          <div>Unit {tenant.unitNumber}</div>
                        </TableCell>
                        <TableCell className="text-sm text-neutral-600">
                          <div>{format(new Date(tenant.leaseStart), "MMM d, yyyy")} -</div>
                          <div>{format(new Date(tenant.leaseEnd), "MMM d, yyyy")}</div>
                        </TableCell>
                        <TableCell className="text-sm text-neutral-600">${tenant.rentAmount}/month</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs rounded-full bg-secondary-100 text-secondary-700">
                            Active
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
                              <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
                              <DropdownMenuItem>Manage Lease</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
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
