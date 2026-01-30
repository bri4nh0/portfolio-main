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
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post('/api/posts/:id/view', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE posts SET views = views + 1 WHERE id = $1 RETURNING views',
      [req.params.id]
    );
    res.json({ views: result.rows[0].views });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
