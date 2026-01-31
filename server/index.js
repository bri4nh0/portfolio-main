// server/index.js
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

// Load .env only in local development
if (process.env.NODE_ENV !== "production") {
  import('dotenv').then(dotenv => {
    dotenv.config({ path: "./server/.env" });
    console.log("✅ Loaded local .env");
  });
}

// Ensure DATABASE_URL exists
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Set it in .env (local) or Render environment variables.");
  process.exit(1);
}

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ Connection error:", err);
    process.exit(1);
  });

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.get("/api/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // First increment the view count
    await pool.query(
      "UPDATE posts SET views = views + 1 WHERE id = $1",
      [id]
    );
    
    // Then fetch the updated post
    const result = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/contact", async (req, res) => {
  console.log("📩 Contact form submission received:", req.body);
  
  // 1. Get data from request body
  const { name, email, message } = req.body;
  
  // 2. Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      error: "Name, email, and message are required" 
    });
  }
  
  // 3. Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: "Invalid email format" 
    });
  }
  
  try {
    // 4. Save to PostgreSQL
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, message) 
       VALUES ($1, $2, $3) 
       RETURNING id, submitted_at`,
      [name, email, message]
    );
    
    console.log(`✅ Message saved with ID: ${result.rows[0].id}`);
    
    // 5. Success response
    res.status(201).json({
      success: true,
      messageId: result.rows[0].id,
      submittedAt: result.rows[0].submitted_at,
      message: "Thank you for your message! I'll get back to you soon."
    });
    
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({ 
      error: "Failed to save message. Please try again later." 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
