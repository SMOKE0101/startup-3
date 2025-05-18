import {
  users, User, InsertUser,
  properties, Property, InsertProperty,
  units, Unit, InsertUnit,
  tenants, Tenant, InsertTenant,
  maintenanceRequests, MaintenanceRequest, InsertMaintenanceRequest,
  payments, Payment, InsertPayment,
  messages, Message, InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;

  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByOwnerId(ownerId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;

  // Unit methods
  getUnit(id: number): Promise<Unit | undefined>;
  getUnitsByPropertyId(propertyId: number): Promise<Unit[]>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnit(id: number, unit: Partial<Unit>): Promise<Unit | undefined>;
  deleteUnit(id: number): Promise<boolean>;

  // Tenant methods
  getTenant(id: number): Promise<Tenant | undefined>;
  getTenantsByPropertyId(propertyId: number): Promise<Tenant[]>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, tenant: Partial<Tenant>): Promise<Tenant | undefined>;
  deleteTenant(id: number): Promise<boolean>;

  // Maintenance request methods
  getMaintenanceRequest(id: number): Promise<MaintenanceRequest | undefined>;
  getMaintenanceRequestsByPropertyId(propertyId: number): Promise<MaintenanceRequest[]>;
  getMaintenanceRequestsByTenantId(tenantId: number): Promise<MaintenanceRequest[]>;
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  updateMaintenanceRequest(id: number, request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | undefined>;
  deleteMaintenanceRequest(id: number): Promise<boolean>;

  // Payment methods
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByPropertyId(propertyId: number): Promise<Payment[]>;
  getPaymentsByTenantId(tenantId: number): Promise<Payment[]>;
  getUpcomingPayments(days: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<Payment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;

  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBySenderId(senderId: number): Promise<Message[]>;
  getMessagesByReceiverId(receiverId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, message: Partial<Message>): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    const result = await db.select().from(properties).where(eq(properties.id, id));
    return result[0];
  }

  async getPropertiesByOwnerId(ownerId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.ownerId, ownerId));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const result = await db.insert(properties).values(property).returning();
    return result[0];
  }

  async updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined> {
    const result = await db.update(properties)
      .set(property)
      .where(eq(properties.id, id))
      .returning();
    return result[0];
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id)).returning();
    return result.length > 0;
  }

  // Unit methods
  async getUnit(id: number): Promise<Unit | undefined> {
    const result = await db.select().from(units).where(eq(units.id, id));
    return result[0];
  }

  async getUnitsByPropertyId(propertyId: number): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.propertyId, propertyId));
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const result = await db.insert(units).values(unit).returning();
    return result[0];
  }

  async updateUnit(id: number, unit: Partial<Unit>): Promise<Unit | undefined> {
    const result = await db.update(units)
      .set(unit)
      .where(eq(units.id, id))
      .returning();
    return result[0];
  }

  async deleteUnit(id: number): Promise<boolean> {
    const result = await db.delete(units).where(eq(units.id, id)).returning();
    return result.length > 0;
  }

  // Tenant methods
  async getTenant(id: number): Promise<Tenant | undefined> {
    const result = await db.select().from(tenants).where(eq(tenants.id, id));
    return result[0];
  }

  async getTenantsByPropertyId(propertyId: number): Promise<Tenant[]> {
    return await db.select().from(tenants).where(eq(tenants.propertyId, propertyId));
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const result = await db.insert(tenants).values(tenant).returning();
    return result[0];
  }

  async updateTenant(id: number, tenant: Partial<Tenant>): Promise<Tenant | undefined> {
    const result = await db.update(tenants)
      .set(tenant)
      .where(eq(tenants.id, id))
      .returning();
    return result[0];
  }

  async deleteTenant(id: number): Promise<boolean> {
    const result = await db.delete(tenants).where(eq(tenants.id, id)).returning();
    return result.length > 0;
  }

  // Maintenance request methods
  async getMaintenanceRequest(id: number): Promise<MaintenanceRequest | undefined> {
    const result = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, id));
    return result[0];
  }

  async getMaintenanceRequestsByPropertyId(propertyId: number): Promise<MaintenanceRequest[]> {
    return await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.propertyId, propertyId));
  }

  async getMaintenanceRequestsByTenantId(tenantId: number): Promise<MaintenanceRequest[]> {
    return await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.tenantId, tenantId));
  }

  async createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const result = await db.insert(maintenanceRequests).values(request).returning();
    return result[0];
  }

  async updateMaintenanceRequest(id: number, request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | undefined> {
    const result = await db.update(maintenanceRequests)
      .set({
        ...request,
        updatedAt: new Date()
      })
      .where(eq(maintenanceRequests.id, id))
      .returning();
    return result[0];
  }

  async deleteMaintenanceRequest(id: number): Promise<boolean> {
    const result = await db.delete(maintenanceRequests).where(eq(maintenanceRequests.id, id)).returning();
    return result.length > 0;
  }

  // Payment methods
  async getPayment(id: number): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async getPaymentsByPropertyId(propertyId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.propertyId, propertyId));
  }

  async getPaymentsByTenantId(tenantId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.tenantId, tenantId));
  }

  async getUpcomingPayments(days: number): Promise<Payment[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return await db.select().from(payments).where(
      and(
        eq(payments.status, 'pending'),
        gte(payments.dueDate, now),
        lte(payments.dueDate, futureDate)
      )
    );
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  async updatePayment(id: number, payment: Partial<Payment>): Promise<Payment | undefined> {
    const result = await db.update(payments)
      .set(payment)
      .where(eq(payments.id, id))
      .returning();
    return result[0];
  }

  async deletePayment(id: number): Promise<boolean> {
    const result = await db.delete(payments).where(eq(payments.id, id)).returning();
    return result.length > 0;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    return result[0];
  }

  async getMessagesBySenderId(senderId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.senderId, senderId));
  }

  async getMessagesByReceiverId(receiverId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.receiverId, receiverId));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async updateMessage(id: number, message: Partial<Message>): Promise<Message | undefined> {
    const result = await db.update(messages)
      .set(message)
      .where(eq(messages.id, id))
      .returning();
    return result[0];
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id)).returning();
    return result.length > 0;
  }

  // Initialize with default data if needed
  async initializeDefaultData() {
    // Check if we already have users
    const userCount = await db.select({ count: users }).from(users);
    if (userCount.length > 0) return; // Data already exists
    
    // Create a landlord user
    const landlord: InsertUser = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "landlord",
    };
    const user = await this.createUser(landlord);
    
    // Create properties
    const property1: InsertProperty = {
      name: "Westview Apartments",
      address: "123 Main St, Anytown",
      units: 12,
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      ownerId: user.id,
    };
    const property2: InsertProperty = {
      name: "Oakridge Townhomes",
      address: "456 Oak Lane, Westfield",
      units: 8,
      imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      ownerId: user.id,
    };
    const property3: InsertProperty = {
      name: "Riverside Apartments",
      address: "789 River Dr, Eastshore",
      units: 20,
      imageUrl: "https://images.unsplash.com/photo-1580041065738-e72023775cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      ownerId: user.id,
    };
    
    await this.createProperty(property1);
    await this.createProperty(property2);
    await this.createProperty(property3);
  }
}

// Create and export an instance of DatabaseStorage
export const storage = new DatabaseStorage();
