export enum UserRole {
  LANDLORD = "landlord",
  TENANT = "tenant",
  PROPERTY_MANAGER = "property_manager"
}

export enum MaintenanceStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  URGENT = "urgent"
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue"
}

export enum PropertyStatus {
  FULLY_OCCUPIED = "fully_occupied",
  PARTIALLY_OCCUPIED = "partially_occupied",
  VACANT = "vacant"
}

export interface Property {
  id: number;
  name: string;
  address: string;
  units: number;
  imageUrl: string;
  status: PropertyStatus;
  tenantCount: number;
}

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  propertyId: number;
  unitNumber: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
}

export interface MaintenanceRequest {
  id: number;
  issue: string;
  description: string;
  propertyId: number;
  unitNumber: string;
  tenantId: number;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  propertyId: number;
  tenantId: number | null;
  type: string;
  description: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface DashboardStats {
  totalProperties: number;
  activeTenantsCount: number;
  currentMonthRevenue: number;
  openMaintenanceRequests: number;
}

export interface VacancyStats {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
}

export interface Vacancy {
  id: number;
  propertyName: string;
  unitNumber: string;
  vacantSince: string;
}
