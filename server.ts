import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "portfolio-db.json");

// Middleware to parse JSON bodies
app.use(express.json());

// Helper to read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database, restoring defaults:", error);
    return {};
  }
}

// Helper to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}

// Simple Admin Authentication Middleware
const ADMIN_TOKEN = "portfolio-admin-super-secret-token";

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized access to admin panel" });
    return;
  }
  next();
}

// --- Public API Routes ---

// 1. Get Public Portfolio Data (stripped of admin password and inquiries)
app.get("/api/portfolio", (req: Request, res: Response) => {
  const db = readDB();
  const publicData = {
    about: db.about || {},
    skills: db.skills || [],
    projects: db.projects || [],
    blogs: db.blogs || [],
    socialLinks: db.socialLinks || {}
  };
  res.json(publicData);
});

// 2. Submit Contact / Hire Inquiry
app.post("/api/contact", (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const db = readDB();
  const newInquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name,
    email,
    subject,
    message,
    date: new Date().toISOString(),
    status: "unread"
  };

  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(newInquiry);

  if (writeDB(db)) {
    res.json({ success: true, message: "Thank you! Your message has been received.", inquiry: newInquiry });
  } else {
    res.status(500).json({ error: "Failed to save inquiry. Please try again." });
  }
});

// 3. Admin Login
app.post("/api/login", (req: Request, res: Response) => {
  const { password } = req.body;
  const db = readDB();
  const dbPassword = db.admin?.password || "admin";

  if (password === dbPassword) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "Invalid admin password" });
  }
});

// --- Secure Admin API Routes (Require Auth) ---

// 4. Get Full Admin Database (including inquiries)
app.get("/api/admin/data", requireAdmin, (req: Request, res: Response) => {
  const db = readDB();
  res.json({
    about: db.about || {},
    skills: db.skills || [],
    projects: db.projects || [],
    blogs: db.blogs || [],
    socialLinks: db.socialLinks || {},
    inquiries: db.inquiries || []
  });
});

// 5. Update About Section
app.post("/api/admin/update-about", requireAdmin, (req: Request, res: Response) => {
  const { name, role, avatar, bio, email, phone, location, education, experience, resumeUrl, logoType, logoText, logoImage } = req.body;
  const db = readDB();

  db.about = {
    name: name || db.about.name,
    role: role || db.about.role,
    avatar: avatar || db.about.avatar,
    bio: bio || db.about.bio,
    email: email || db.about.email,
    phone: phone || db.about.phone,
    location: location || db.about.location,
    education: education || db.about.education,
    experience: experience || db.about.experience,
    resumeUrl: resumeUrl || db.about.resumeUrl,
    logoType: logoType || db.about.logoType || "text",
    logoText: logoText !== undefined ? logoText : db.about.logoText,
    logoImage: logoImage !== undefined ? logoImage : db.about.logoImage
  };

  if (writeDB(db)) {
    res.json({ success: true, data: db.about });
  } else {
    res.status(500).json({ error: "Failed to write database" });
  }
});

// 6. Update Skills
app.post("/api/admin/update-skills", requireAdmin, (req: Request, res: Response) => {
  const { skills } = req.body;
  if (!Array.isArray(skills)) {
    res.status(400).json({ error: "Skills must be an array" });
    return;
  }

  const db = readDB();
  db.skills = skills;

  if (writeDB(db)) {
    res.json({ success: true, data: db.skills });
  } else {
    res.status(500).json({ error: "Failed to write database" });
  }
});

// 7. Update Projects
app.post("/api/admin/update-projects", requireAdmin, (req: Request, res: Response) => {
  const { projects } = req.body;
  if (!Array.isArray(projects)) {
    res.status(400).json({ error: "Projects must be an array" });
    return;
  }

  const db = readDB();
  db.projects = projects;

  if (writeDB(db)) {
    res.json({ success: true, data: db.projects });
  } else {
    res.status(500).json({ error: "Failed to write database" });
  }
});

// 8. Update Blogs (Add/Edit/Delete handled via complete array update)
app.post("/api/admin/update-blogs", requireAdmin, (req: Request, res: Response) => {
  const { blogs } = req.body;
  if (!Array.isArray(blogs)) {
    res.status(400).json({ error: "Blogs must be an array" });
    return;
  }

  const db = readDB();
  db.blogs = blogs;

  if (writeDB(db)) {
    res.json({ success: true, data: db.blogs });
  } else {
    res.status(500).json({ error: "Failed to write database" });
  }
});

// 9. Update Social Links and External URLs
app.post("/api/admin/update-socials", requireAdmin, (req: Request, res: Response) => {
  const { socialLinks } = req.body;
  if (!socialLinks) {
    res.status(400).json({ error: "Social links are required" });
    return;
  }

  const db = readDB();
  db.socialLinks = {
    ...db.socialLinks,
    ...socialLinks
  };

  if (writeDB(db)) {
    res.json({ success: true, data: db.socialLinks });
  } else {
    res.status(500).json({ error: "Failed to write database" });
  }
});

// 10. Update Inquiry Status (read/unread/replied)
app.post("/api/admin/update-inquiry-status", requireAdmin, (req: Request, res: Response) => {
  const { id, status } = req.body;
  if (!id || !status) {
    res.status(400).json({ error: "ID and status are required" });
    return;
  }

  const db = readDB();
  db.inquiries = db.inquiries || [];
  const inquiry = db.inquiries.find((inq: any) => inq.id === id);

  if (inquiry) {
    inquiry.status = status;
    if (writeDB(db)) {
      res.json({ success: true, data: db.inquiries });
    } else {
      res.status(500).json({ error: "Failed to write database" });
    }
  } else {
    res.status(404).json({ error: "Inquiry not found" });
  }
});

// 11. Delete Inquiry
app.post("/api/admin/delete-inquiry", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ error: "ID is required" });
    return;
  }

  const db = readDB();
  db.inquiries = db.inquiries || [];
  const initialLength = db.inquiries.length;
  db.inquiries = db.inquiries.filter((inq: any) => inq.id !== id);

  if (db.inquiries.length < initialLength) {
    if (writeDB(db)) {
      res.json({ success: true, data: db.inquiries });
    } else {
      res.status(500).json({ error: "Failed to write database" });
    }
  } else {
    res.status(404).json({ error: "Inquiry not found" });
  }
});

// 12. Update Admin Password
app.post("/api/admin/update-password", requireAdmin, (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.trim().length < 4) {
    res.status(400).json({ error: "Password must be at least 4 characters long" });
    return;
  }

  const db = readDB();
  db.admin = db.admin || {};
  db.admin.password = newPassword.trim();

  if (writeDB(db)) {
    res.json({ success: true, message: "Password updated successfully!" });
  } else {
    res.status(500).json({ error: "Failed to write database" });
  }
});


// --- Vite Middleware and Asset Serving ---

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
