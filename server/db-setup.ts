
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { 
  users, properties, units, tenants, 
  maintenanceRequests, payments, messages
} from "../shared/schema";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";

dotenv.config();

async function main() {
  // Connect to the database
  const connectionString = process.env.DATABASE_URL || "";
  if (!connectionString) {
    console.error("DATABASE_URL environment variable not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log("Connected to database, starting setup...");

  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'tenant',
        avatar TEXT
      );

      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        units INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        owner_id INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS units (
        id SERIAL PRIMARY KEY,
        property_id INTEGER NOT NULL,
        unit_number TEXT NOT NULL,
        rent_amount INTEGER NOT NULL,
        is_occupied BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        unit_id INTEGER NOT NULL,
        lease_start TIMESTAMP NOT NULL,
        lease_end TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS maintenance_requests (
        id SERIAL PRIMARY KEY,
        issue TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        property_id INTEGER NOT NULL,
        unit_id INTEGER NOT NULL,
        tenant_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        amount INTEGER NOT NULL,
        due_date TIMESTAMP NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        property_id INTEGER NOT NULL,
        unit_id INTEGER,
        tenant_id INTEGER,
        type TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log("Tables created successfully");

    // Seed data
    // 1. Create users (landlord and tenants)
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    // Add a landlord
    await pool.query(`
      INSERT INTO users (name, email, password, role, avatar)
      VALUES ('John Doe', 'landlord@example.com', $1, 'landlord', 'https://i.pravatar.cc/150?u=landlord')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);

    // Add tenants
    const tenantEmails = [
      'tenant1@example.com', 
      'tenant2@example.com', 
      'tenant3@example.com',
      'tenant4@example.com',
      'tenant5@example.com'
    ];

    for (let i = 0; i < tenantEmails.length; i++) {
      await pool.query(`
        INSERT INTO users (name, email, password, role, avatar)
        VALUES ($1, $2, $3, 'tenant', $4)
        ON CONFLICT (email) DO NOTHING;
      `, [
        `Tenant ${i+1}`, 
        tenantEmails[i], 
        hashedPassword, 
        `https://i.pravatar.cc/150?u=${i+1}`
      ]);
    }

    console.log("Users created successfully");

    // 2. Create properties
    const landlord = await pool.query(`SELECT id FROM users WHERE email = 'landlord@example.com'`);
    const landlordId = landlord.rows[0].id;

    const properties = [
      {
        name: "Westview Apartments",
        address: "123 Main St, Anytown",
        units: 12,
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
      },
      {
        name: "Oakridge Townhomes",
        address: "456 Oak Lane, Westfield",
        units: 8,
        imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
      },
      {
        name: "Riverside Apartments",
        address: "789 River Dr, Eastshore",
        units: 20,
        imageUrl: "https://images.unsplash.com/photo-1580041065738-e72023775cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
      }
    ];

    for (const property of properties) {
      await pool.query(`
        INSERT INTO properties (name, address, units, image_url, owner_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING;
      `, [
        property.name, 
        property.address, 
        property.units, 
        property.imageUrl, 
        landlordId
      ]);
    }

    console.log("Properties created successfully");

    // 3. Create units for each property
    const propertiesResult = await pool.query(`SELECT id, name FROM properties`);
    
    for (const property of propertiesResult.rows) {
      const unitCount = Math.min(5, property.name.includes("Apartments") ? 12 : 8);
      
      for (let i = 1; i <= unitCount; i++) {
        const rentAmount = 900 + Math.floor(Math.random() * 500);
        const isOccupied = i <= 3; // first 3 units are occupied
        
        await pool.query(`
          INSERT INTO units (property_id, unit_number, rent_amount, is_occupied)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT DO NOTHING;
        `, [
          property.id,
          `${i}${String.fromCharCode(64 + i)}`,
          rentAmount,
          isOccupied
        ]);
      }
    }

    console.log("Units created successfully");

    // 4. Create tenants for occupied units
    const tenantsResult = await pool.query(`SELECT id FROM users WHERE role = 'tenant' LIMIT 5`);
    const unitsResult = await pool.query(`SELECT id, property_id FROM units WHERE is_occupied = true LIMIT 5`);
    
    for (let i = 0; i < Math.min(tenantsResult.rows.length, unitsResult.rows.length); i++) {
      const tenantId = tenantsResult.rows[i].id;
      const unitId = unitsResult.rows[i].id;
      const propertyId = unitsResult.rows[i].property_id;
      
      const leaseStart = new Date();
      const leaseEnd = new Date();
      leaseEnd.setFullYear(leaseEnd.getFullYear() + 1);
      
      await pool.query(`
        INSERT INTO tenants (user_id, property_id, unit_id, lease_start, lease_end)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING;
      `, [
        tenantId,
        propertyId,
        unitId,
        leaseStart.toISOString(),
        leaseEnd.toISOString()
      ]);
    }

    console.log("Tenants created successfully");

    // 5. Create maintenance requests
    const issueTypes = ["Plumbing", "Electrical", "HVAC", "Appliance", "Structural"];
    const statusTypes = ["pending", "in_progress", "scheduled", "completed"];
    
    const tenantUnitsResult = await pool.query(`
      SELECT t.id as tenant_id, t.property_id, t.unit_id 
      FROM tenants t
    `);
    
    for (const tenant of tenantUnitsResult.rows) {
      const randomIssue = issueTypes[Math.floor(Math.random() * issueTypes.length)];
      const randomStatus = statusTypes[Math.floor(Math.random() * statusTypes.length)];
      
      await pool.query(`
        INSERT INTO maintenance_requests (
          issue, description, status, property_id, unit_id, tenant_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        randomIssue, 
        `Issue with ${randomIssue.toLowerCase()} that needs to be fixed.`,
        randomStatus,
        tenant.property_id,
        tenant.unit_id,
        tenant.tenant_id
      ]);
    }

    console.log("Maintenance requests created successfully");

    // 6. Create payments
    const paymentTypes = ["rent", "utility", "maintenance"];
    const paymentStatuses = ["pending", "paid", "overdue"];
    
    for (const tenant of tenantUnitsResult.rows) {
      const randomType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
      const randomStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      
      // Create a due date within the next 30 days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
      
      await pool.query(`
        INSERT INTO payments (
          amount, due_date, status, property_id, unit_id, tenant_id, type, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        800 + Math.floor(Math.random() * 400),
        dueDate.toISOString(),
        randomStatus,
        tenant.property_id,
        tenant.unit_id,
        tenant.tenant_id,
        randomType,
        `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} payment for ${dueDate.toLocaleString('default', { month: 'long' })}`
      ]);
    }

    console.log("Payments created successfully");

    // 7. Create messages
    const messageContents = [
      "When will the maintenance be done?",
      "The rent has been paid.",
      "There's a leak in the bathroom.",
      "Can we discuss extending the lease?",
      "The heating isn't working properly."
    ];
    
    const usersResult = await pool.query(`SELECT id FROM users`);
    
    for (let i = 0; i < 10; i++) {
      const senderId = usersResult.rows[Math.floor(Math.random() * usersResult.rows.length)].id;
      let receiverId;
      
      do {
        receiverId = usersResult.rows[Math.floor(Math.random() * usersResult.rows.length)].id;
      } while (receiverId === senderId);
      
      const randomContent = messageContents[Math.floor(Math.random() * messageContents.length)];
      const isRead = Math.random() > 0.5;
      
      await pool.query(`
        INSERT INTO messages (sender_id, receiver_id, content, is_read)
        VALUES ($1, $2, $3, $4)
      `, [
        senderId,
        receiverId,
        randomContent,
        isRead
      ]);
    }
    
    console.log("Messages created successfully");
    
    console.log("Database setup complete!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
