import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-45305945/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all application data
app.get("/make-server-45305945/data", async (c) => {
  try {
    const [papers, finishes, machines, labor, marginRules, quotes] = await Promise.all([
      kv.get("app:papers"),
      kv.get("app:finishes"),
      kv.get("app:machines"),
      kv.get("app:labor"),
      kv.get("app:marginRules"),
      kv.get("app:quotes"),
    ]);

    return c.json({
      papers: papers || [],
      finishes: finishes || [],
      machines: machines || [],
      labor: labor || [],
      marginRules: marginRules || [],
      quotes: quotes || [],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return c.json({ error: "Failed to fetch data", details: String(error) }, 500);
  }
});

// Update papers
app.put("/make-server-45305945/papers", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("app:papers", body.papers);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating papers:", error);
    return c.json({ error: "Failed to update papers", details: String(error) }, 500);
  }
});

// Update finishes
app.put("/make-server-45305945/finishes", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("app:finishes", body.finishes);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating finishes:", error);
    return c.json({ error: "Failed to update finishes", details: String(error) }, 500);
  }
});

// Update machines
app.put("/make-server-45305945/machines", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("app:machines", body.machines);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating machines:", error);
    return c.json({ error: "Failed to update machines", details: String(error) }, 500);
  }
});

// Update labor
app.put("/make-server-45305945/labor", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("app:labor", body.labor);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating labor:", error);
    return c.json({ error: "Failed to update labor", details: String(error) }, 500);
  }
});

// Update margin rules
app.put("/make-server-45305945/marginRules", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("app:marginRules", body.marginRules);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating margin rules:", error);
    return c.json({ error: "Failed to update margin rules", details: String(error) }, 500);
  }
});

// Update quotes
app.put("/make-server-45305945/quotes", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("app:quotes", body.quotes);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating quotes:", error);
    return c.json({ error: "Failed to update quotes", details: String(error) }, 500);
  }
});

// Initialize data with defaults (one-time setup)
app.post("/make-server-45305945/initialize", async (c) => {
  try {
    const body = await c.req.json();
    
    // Only initialize if data doesn't exist
    const existingPapers = await kv.get("app:papers");
    if (!existingPapers || existingPapers.length === 0) {
      await Promise.all([
        kv.set("app:papers", body.papers || []),
        kv.set("app:finishes", body.finishes || []),
        kv.set("app:machines", body.machines || []),
        kv.set("app:labor", body.labor || []),
        kv.set("app:marginRules", body.marginRules || []),
        kv.set("app:quotes", body.quotes || []),
      ]);
      return c.json({ success: true, initialized: true });
    }
    
    return c.json({ success: true, initialized: false, message: "Data already exists" });
  } catch (error) {
    console.error("Error initializing data:", error);
    return c.json({ error: "Failed to initialize data", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);