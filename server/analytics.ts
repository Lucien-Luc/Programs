import { Router } from "express";
import { db } from "./db";
import { adminSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Chart configuration storage key
const CHART_CONFIG_KEY = "analytics_chart_configs";
const ANALYTICS_DATA_KEY = "analytics_data";

// Get chart configurations
router.get("/charts", async (req, res) => {
  try {
    const [setting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, CHART_CONFIG_KEY));

    if (setting) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error fetching chart configurations:", error);
    res.status(500).json({ error: "Failed to fetch chart configurations" });
  }
});

// Save chart configurations
router.post("/charts", async (req, res) => {
  try {
    const { charts } = req.body;

    if (!Array.isArray(charts)) {
      return res.status(400).json({ error: "Charts must be an array" });
    }

    // Validate chart configurations
    for (const chart of charts) {
      if (!chart.id || !chart.title || !chart.type || !chart.dataSource) {
        return res.status(400).json({ 
          error: "Each chart must have id, title, type, and dataSource" 
        });
      }
    }

    const chartConfigJson = JSON.stringify(charts);

    // Check if setting exists
    const [existingSetting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, CHART_CONFIG_KEY));

    if (existingSetting) {
      // Update existing configuration
      await db
        .update(adminSettings)
        .set({ 
          value: chartConfigJson,
          updatedAt: new Date()
        })
        .where(eq(adminSettings.key, CHART_CONFIG_KEY));
    } else {
      // Create new configuration
      await db.insert(adminSettings).values({
        key: CHART_CONFIG_KEY,
        value: chartConfigJson,
        category: "analytics"
      });
    }

    res.json({ success: true, charts });
  } catch (error) {
    console.error("Error saving chart configurations:", error);
    res.status(500).json({ error: "Failed to save chart configurations" });
  }
});

// Get analytics data for charts
router.get("/data/:dataSource", async (req, res) => {
  try {
    const { dataSource } = req.params;
    
    // This endpoint can be extended to provide specific data transformations
    // for different chart types and data sources
    
    switch (dataSource) {
      case "programs":
        // Get all programs data
        const programs = await db.query.programs.findMany();
        res.json(programs);
        break;
        
      case "monthlyProgress":
        // Generate monthly progress data based on actual program data
        // This could be enhanced to calculate real metrics from the database
        const monthlyData = [
          { month: "Jan", progress: 65, budget: 85000, participants: 120 },
          { month: "Feb", progress: 72, budget: 92000, participants: 145 },
          { month: "Mar", progress: 78, budget: 88000, participants: 160 },
          { month: "Apr", progress: 85, budget: 95000, participants: 180 },
          { month: "May", progress: 88, budget: 102000, participants: 195 },
          { month: "Jun", progress: 92, budget: 98000, participants: 210 },
        ];
        res.json(monthlyData);
        break;
        
      case "programTypes":
        // Get program type distribution
        const programTypes = await db.query.programs.findMany();
        const typeData = programTypes.reduce((acc: any[], program) => {
          const existing = acc.find(item => item.type === program.type);
          if (existing) {
            existing.count += 1;
            existing.budget += program.budgetAllocated || 0;
          } else {
            acc.push({
              type: program.type,
              count: 1,
              budget: program.budgetAllocated || 0
            });
          }
          return acc;
        }, []);
        res.json(typeData);
        break;
        
      case "statusDistribution":
        // Get status distribution
        const allPrograms = await db.query.programs.findMany();
        const statusData = allPrograms.reduce((acc: any[], program) => {
          const existing = acc.find(item => item.status === program.status);
          if (existing) {
            existing.count += 1;
            existing.value += 1;
          } else {
            acc.push({
              status: program.status,
              count: 1,
              value: 1
            });
          }
          return acc;
        }, []);
        res.json(statusData);
        break;
        
      default:
        res.status(404).json({ error: "Data source not found" });
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

// Get analytics data
router.get("/data", async (req, res) => {
  try {
    const [setting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, ANALYTICS_DATA_KEY));

    if (setting) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

// Save analytics data
router.post("/data", async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Data must be an array" });
    }

    const dataJson = JSON.stringify(data);

    // Check if setting exists
    const [existingSetting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, ANALYTICS_DATA_KEY));

    if (existingSetting) {
      // Update existing data
      await db
        .update(adminSettings)
        .set({ 
          value: dataJson,
          updatedAt: new Date()
        })
        .where(eq(adminSettings.key, ANALYTICS_DATA_KEY));
    } else {
      // Create new data
      await db.insert(adminSettings).values({
        key: ANALYTICS_DATA_KEY,
        value: dataJson,
        category: "analytics"
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error saving analytics data:", error);
    res.status(500).json({ error: "Failed to save analytics data" });
  }
});

export default router;