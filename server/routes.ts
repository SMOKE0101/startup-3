import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertPropertySchema, insertUnitSchema, insertTenantSchema, insertMaintenanceRequestSchema, insertPaymentSchema, insertMessageSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

function validateRequest(schema: z.ZodType<any, any>, data: any) {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: fromZodError(error).message };
    }
    return { success: false, error: "Invalid request data" };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // In a real app, we'd generate a JWT here
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ 
      ...userWithoutPassword, 
      token: "mock-token-" + Date.now() 
    });
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const validation = validateRequest(insertUserSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const existingUser = await storage.getUserByEmail(validation.data.email);
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const newUser = await storage.createUser(validation.data);
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  });

  // User Routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  });

  // Property Routes
  app.get("/api/properties", async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId ? parseInt(req.query.ownerId as string) : undefined;
    
    if (ownerId) {
      const properties = await storage.getPropertiesByOwnerId(ownerId);
      return res.status(200).json(properties);
    }
    
    // In a real app we would handle permissions for this endpoint
    return res.status(400).json({ message: "Owner ID is required" });
  });

  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    const property = await storage.getProperty(parseInt(req.params.id));
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    return res.status(200).json(property);
  });

  app.post("/api/properties", async (req: Request, res: Response) => {
    const validation = validateRequest(insertPropertySchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const newProperty = await storage.createProperty(validation.data);
    return res.status(201).json(newProperty);
  });

  app.put("/api/properties/:id", async (req: Request, res: Response) => {
    const propertyId = parseInt(req.params.id);
    const validation = validateRequest(insertPropertySchema.partial(), req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const updatedProperty = await storage.updateProperty(propertyId, validation.data);
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json(updatedProperty);
  });

  app.delete("/api/properties/:id", async (req: Request, res: Response) => {
    const propertyId = parseInt(req.params.id);
    const deleted = await storage.deleteProperty(propertyId);
    
    if (!deleted) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(204).send();
  });

  // Unit Routes
  app.get("/api/properties/:propertyId/units", async (req: Request, res: Response) => {
    const propertyId = parseInt(req.params.propertyId);
    const units = await storage.getUnitsByPropertyId(propertyId);
    return res.status(200).json(units);
  });

  app.post("/api/properties/:propertyId/units", async (req: Request, res: Response) => {
    const propertyId = parseInt(req.params.propertyId);
    const validation = validateRequest(insertUnitSchema, { ...req.body, propertyId });
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const newUnit = await storage.createUnit(validation.data);
    return res.status(201).json(newUnit);
  });

  // Tenant Routes
  app.get("/api/properties/:propertyId/tenants", async (req: Request, res: Response) => {
    const propertyId = parseInt(req.params.propertyId);
    const tenants = await storage.getTenantsByPropertyId(propertyId);
    return res.status(200).json(tenants);
  });

  app.post("/api/tenants", async (req: Request, res: Response) => {
    const validation = validateRequest(insertTenantSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const newTenant = await storage.createTenant(validation.data);
    return res.status(201).json(newTenant);
  });

  // Maintenance Request Routes
  app.get("/api/maintenance-requests", async (req: Request, res: Response) => {
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
    const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
    
    if (propertyId) {
      const requests = await storage.getMaintenanceRequestsByPropertyId(propertyId);
      return res.status(200).json(requests);
    } else if (tenantId) {
      const requests = await storage.getMaintenanceRequestsByTenantId(tenantId);
      return res.status(200).json(requests);
    }
    
    return res.status(400).json({ message: "Property ID or Tenant ID is required" });
  });

  app.post("/api/maintenance-requests", async (req: Request, res: Response) => {
    const validation = validateRequest(insertMaintenanceRequestSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const newRequest = await storage.createMaintenanceRequest(validation.data);
    return res.status(201).json(newRequest);
  });

  app.put("/api/maintenance-requests/:id", async (req: Request, res: Response) => {
    const requestId = parseInt(req.params.id);
    const validation = validateRequest(insertMaintenanceRequestSchema.partial(), req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const updatedRequest = await storage.updateMaintenanceRequest(requestId, validation.data);
    if (!updatedRequest) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    return res.status(200).json(updatedRequest);
  });

  // Payment Routes
  app.get("/api/payments", async (req: Request, res: Response) => {
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
    const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
    const upcoming = req.query.upcoming === 'true';
    
    if (propertyId) {
      const payments = await storage.getPaymentsByPropertyId(propertyId);
      return res.status(200).json(payments);
    } else if (tenantId) {
      const payments = await storage.getPaymentsByTenantId(tenantId);
      return res.status(200).json(payments);
    } else if (upcoming) {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const payments = await storage.getUpcomingPayments(days);
      return res.status(200).json(payments);
    }
    
    return res.status(400).json({ message: "Property ID, Tenant ID, or upcoming flag is required" });
  });

  app.post("/api/payments", async (req: Request, res: Response) => {
    const validation = validateRequest(insertPaymentSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const newPayment = await storage.createPayment(validation.data);
    return res.status(201).json(newPayment);
  });

  app.put("/api/payments/:id", async (req: Request, res: Response) => {
    const paymentId = parseInt(req.params.id);
    const validation = validateRequest(insertPaymentSchema.partial(), req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const updatedPayment = await storage.updatePayment(paymentId, validation.data);
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json(updatedPayment);
  });

  // Message Routes
  app.get("/api/messages", async (req: Request, res: Response) => {
    const senderId = req.query.senderId ? parseInt(req.query.senderId as string) : undefined;
    const receiverId = req.query.receiverId ? parseInt(req.query.receiverId as string) : undefined;
    
    if (senderId) {
      const messages = await storage.getMessagesBySenderId(senderId);
      return res.status(200).json(messages);
    } else if (receiverId) {
      const messages = await storage.getMessagesByReceiverId(receiverId);
      return res.status(200).json(messages);
    }
    
    return res.status(400).json({ message: "Sender ID or Receiver ID is required" });
  });

  app.post("/api/messages", async (req: Request, res: Response) => {
    const validation = validateRequest(insertMessageSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const newMessage = await storage.createMessage(validation.data);
    return res.status(201).json(newMessage);
  });

  app.put("/api/messages/:id", async (req: Request, res: Response) => {
    const messageId = parseInt(req.params.id);
    const validation = validateRequest(insertMessageSchema.partial(), req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const updatedMessage = await storage.updateMessage(messageId, validation.data);
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json(updatedMessage);
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId ? parseInt(req.query.ownerId as string) : undefined;
    
    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    const properties = await storage.getPropertiesByOwnerId(ownerId);
    
    // In a real app, we would calculate these stats from actual data
    return res.status(200).json({
      totalProperties: properties.length,
      activeTenantsCount: 24,
      currentMonthRevenue: 18245,
      openMaintenanceRequests: 4
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
