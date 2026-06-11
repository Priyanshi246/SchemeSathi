require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // for development flexibility
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve uploaded documents statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mapping
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Default welcome route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to SchemeSathi AI Backend API!" });
});

// Seed default users for Hackathon Demo Mode
async function seedDemoUsers() {
  try {
    const demoEmail = "citizen@schemesathi.ai";
    const existing = await db.users.findByEmail(demoEmail);
    
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);

      // Create citizen Aarav Sharma
      const citizen = await db.users.create({
        name: "Aarav Sharma",
        email: demoEmail,
        password: hashedPassword,
        role: "Citizen",
        age: 20,
        gender: "Male",
        income: 200000,
        state: "Rajasthan",
        education: "Undergraduate",
        occupation: "Student"
      });

      console.log(`Backend Server: Seeded default citizen user: ${demoEmail} (password: password123)`);

      // Seed an Admin user too
      const adminEmail = "admin@schemesathi.ai";
      const hashedAdminPassword = await bcrypt.hash("admin123", salt);
      await db.users.create({
        name: "Welfare Officer Priya",
        email: adminEmail,
        password: hashedAdminPassword,
        role: "Admin"
      });
      
      console.log(`Backend Server: Seeded default admin user: ${adminEmail} (password: admin123)`);

      // Create a welcome notification for Aarav
      await db.notifications.create({
        user_id: citizen.id,
        title: "Welcome to SchemeSathi AI!",
        message: "Hello Aarav! I am your AI Welfare Officer. Chat with me or upload your documents to discover which central and state welfare benefits you qualify for!"
      });
    }
  } catch (err) {
    console.error("Error seeding demo users on backend startup:", err.message);
  }
}

// Start Server after database initialization
async function startServer() {
  try {
    // 1. Initialize tables & seed schemes
    await db.init();
    
    // 2. Seed default users
    await seedDemoUsers();

    // 3. Listen
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`   SchemeSathi AI Server started on port ${PORT}      `);
      console.log(`   Local Server URL: http://localhost:${PORT}        `);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error("Failed to start SchemeSathi backend server:", err);
    process.exit(1);
  }
}

startServer();
