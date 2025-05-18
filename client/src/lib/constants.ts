// Property types
export const PROPERTY_TYPES = [
  "Apartment Building",
  "Single-Family Home",
  "Townhouse",
  "Duplex",
  "Commercial",
  "Mixed-Use",
  "Condominium",
];

// Static sample images - would be replaced with real images in production
export const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "https://images.unsplash.com/photo-1580041065738-e72023775cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
];

// Maintenance request types
export const MAINTENANCE_TYPES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Landscaping",
  "Pest Control",
  "Other",
];

// Maintenance priority levels
export const MAINTENANCE_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

// Maintenance status options
export const MAINTENANCE_STATUSES = [
  "Pending",
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
];

// Payment types
export const PAYMENT_TYPES = [
  "Rent",
  "Utility",
  "Security Deposit",
  "Late Fee",
  "Maintenance Fee",
  "Other",
];

// Payment status options
export const PAYMENT_STATUSES = [
  "Paid",
  "Pending",
  "Overdue",
  "Refunded",
  "Cancelled",
];

// Tenant status options
export const TENANT_STATUSES = [
  "Active",
  "Lease Ending",
  "Payment Late",
  "Previous",
];

// Type for maintenance stats
export interface MaintenanceStatsType {
  urgentRequests: {
    count: number;
    label: string;
  };
  inProgressRequests: {
    count: number;
    label: string;
  };
  scheduledRequests: {
    count: number;
    label: string;
  };
  completedRequests: {
    count: number;
    label: string;
  };
}

// Type for payment stats
export interface PaymentStatsType {
  totalCollected: {
    value: number;
    label: string;
    change?: {
      value: string;
      direction: "up" | "down";
      description: string;
    };
  };
  paidOnTime: {
    value: number;
    label: string;
    change?: {
      value: string;
      direction: "up" | "down";
      description: string;
    };
  };
  upcoming: {
    value: number;
    label: string;
    change?: {
      value: string;
      direction: "up" | "down";
      description: string;
    };
  };
  overdue: {
    value: number;
    label: string;
    change?: {
      value: string;
      direction: "up" | "down";
      description: string;
    };
  };
}
