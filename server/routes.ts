import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgramSchema, insertActivitySchema, insertTableConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Programs API
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch program" });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const program = insertProgramSchema.parse(req.body);
      const newProgram = await storage.createProgram(program);
      res.json(newProgram);
    } catch (error) {
      res.status(400).json({ error: "Invalid program data" });
    }
  });

  app.put("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const program = insertProgramSchema.partial().parse(req.body);
      const updatedProgram = await storage.updateProgram(id, program);
      if (!updatedProgram) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json(updatedProgram);
    } catch (error) {
      res.status(400).json({ error: "Invalid program data" });
    }
  });

  app.delete("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProgram(id);
      if (!deleted) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete program" });
    }
  });

  // Activities API
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/programs/:id/activities", async (req, res) => {
    try {
      const programId = parseInt(req.params.id);
      const activities = await storage.getActivitiesByProgram(programId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activity = insertActivitySchema.parse(req.body);
      const newActivity = await storage.createActivity(activity);
      res.json(newActivity);
    } catch (error) {
      res.status(400).json({ error: "Invalid activity data" });
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activity = insertActivitySchema.partial().parse(req.body);
      const updatedActivity = await storage.updateActivity(id, activity);
      if (!updatedActivity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json(updatedActivity);
    } catch (error) {
      res.status(400).json({ error: "Invalid activity data" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteActivity(id);
      if (!deleted) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  // Table Configuration API
  app.get("/api/table-config/:tableName", async (req, res) => {
    try {
      const tableName = req.params.tableName;
      const config = await storage.getTableConfig(tableName);
      if (!config) {
        return res.status(404).json({ error: "Table configuration not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch table configuration" });
    }
  });

  app.post("/api/table-config", async (req, res) => {
    try {
      const config = insertTableConfigSchema.parse(req.body);
      const updatedConfig = await storage.updateTableConfig(config);
      res.json(updatedConfig);
    } catch (error) {
      res.status(400).json({ error: "Invalid table configuration" });
    }
  });

  // Authentication API
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
