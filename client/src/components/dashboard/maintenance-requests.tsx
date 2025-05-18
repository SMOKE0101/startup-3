import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type MaintenanceRequest } from "@/lib/types";
import { format } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Wrench } from "lucide-react";

interface MaintenanceRequestsProps {
  className?: string;
}

export function MaintenanceRequests({ className }: MaintenanceRequestsProps) {
  const { user } = useAuth();

  const { data: requests, isLoading, error } = useQuery<MaintenanceRequest[]>({
    queryKey: ["/api/maintenance-requests", { ownerId: user?.id }],
    enabled: !!user?.id,
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning-100 text-warning-700";
      case "in_progress":
        return "bg-warning-100 text-warning-700";
      case "urgent":
        return "bg-danger-100 text-danger-700";
      case "scheduled":
        return "bg-neutral-100 text-neutral-700";
      case "completed":
        return "bg-secondary-100 text-secondary-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "urgent":
        return "Urgent";
      case "scheduled":
        return "Scheduled";
      case "completed":
        return "Completed";
      case "pending":
      default:
        return "Pending";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-heading font-semibold text-neutral-900 flex items-center">
            <Wrench className="mr-2 h-5 w-5 text-primary-500" />
            Recent Maintenance Requests
          </CardTitle>
          <Link href="/maintenance" className="text-primary-600 text-sm font-medium hover:underline flex items-center">
            <span>View All</span>
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading maintenance requests...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-danger-500">Failed to load maintenance requests</p>
          </div>
        ) : requests?.length === 0 ? (
          <div className="py-8 text-center">
            <p>No maintenance requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-50">
                <TableRow>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Issue</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Tenant</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((request) => (
                  <TableRow key={request.id} className="border-b border-neutral-200">
                    <TableCell className="text-sm text-neutral-800">{request.issue}</TableCell>
                    <TableCell className="text-sm text-neutral-600">{`Property ${request.propertyId}, Unit ${request.unitNumber}`}</TableCell>
                    <TableCell className="text-sm text-neutral-600">Tenant {request.tenantId}</TableCell>
                    <TableCell className="text-sm text-neutral-600">
                      {format(new Date(request.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" className="text-primary-600 hover:text-primary-800">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
