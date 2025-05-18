import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MaintenanceRequest } from "@shared/schema";

interface MaintenanceTableProps {
  maintenanceRequests: MaintenanceRequest[];
  onViewRequest: (id: number) => void;
}

export function MaintenanceTable({ maintenanceRequests, onViewRequest }: MaintenanceTableProps) {
  // Function to render status badge with appropriate colors
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "urgent":
        return <Badge variant="destructive">{status}</Badge>;
      case "in progress":
        return <Badge variant="outline" className="bg-warning-100 text-warning-700 border-warning-200">{status}</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-200">{status}</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-secondary-100 text-secondary-700 border-secondary-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-neutral-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Issue</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tenant</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-neutral-200 bg-white">
          {maintenanceRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{request.issue}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{request.propertyName}, Unit {request.unitNumber}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{request.tenantName}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{formatDate(request.dateSubmitted)}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {renderStatusBadge(request.status)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                <Button 
                  variant="link" 
                  onClick={() => onViewRequest(request.id)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
