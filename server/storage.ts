import { programs, activities, tableConfig, users, adminSettings, programSuggestions, tableColumnConfig, type Program, type InsertProgram, type Activity, type InsertActivity, type TableConfig, type InsertTableConfig, type User, type InsertUser, type UpsertUser, type AdminSettings, type InsertAdminSettings, type ProgramSuggestion, type InsertProgramSuggestion, type TableColumnConfig, type InsertTableColumnConfig } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Programs
  getPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<boolean>;

  // Activities
  getActivities(): Promise<Activity[]>;
  getActivitiesByProgram(programId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: number): Promise<boolean>;

  // Table Configuration
  getTableConfig(tableName: string): Promise<TableConfig | undefined>;
  updateTableConfig(config: InsertTableConfig): Promise<TableConfig>;
  getTableColumnConfig(tableName: string): Promise<TableColumnConfig[]>;
  updateTableColumnConfig(config: InsertTableColumnConfig): Promise<TableColumnConfig>;

  // Program Suggestions
  getProgramSuggestions(keyword?: string): Promise<ProgramSuggestion[]>;
  createProgramSuggestion(suggestion: InsertProgramSuggestion): Promise<ProgramSuggestion>;
  updateProgramSuggestion(id: number, suggestion: Partial<InsertProgramSuggestion>): Promise<ProgramSuggestion | undefined>;

  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Admin Settings
  getAdminSettings(category?: string): Promise<AdminSettings[]>;
  updateAdminSetting(key: string, value: string, category: string): Promise<AdminSettings>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize database with sample data if needed
    this.initializeData();
  }

  // Helper function to convert date strings to Date objects
  private processDateFields(data: any) {
    const processed = { ...data };
    if (processed.startDate && typeof processed.startDate === 'string') {
      processed.startDate = new Date(processed.startDate);
    }
    if (processed.endDate && typeof processed.endDate === 'string') {
      processed.endDate = new Date(processed.endDate);
    }
    return processed;
  }

  async initializeData() {
    try {
      // Check if data already exists
      const existingPrograms = await db.select().from(programs).limit(1);
      if (existingPrograms.length > 0) return; // Data already initialized

      // Create default programs
      const defaultPrograms: InsertProgram[] = [
        {
          name: "CORE Program",
          type: "CORE",
          description: "Core program for capacity building and training",
          status: "active",
          progress: 75,
          participants: 245,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          budgetAllocated: 500000,
          budgetUsed: 390000,
          color: "#4A90A4",
          icon: "bullseye"
        },
        {
          name: "RIN Program",
          type: "RIN",
          description: "Refugee Integration Network program",
          status: "active",
          progress: 60,
          participants: 189,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          budgetAllocated: 350000,
          budgetUsed: 210000,
          color: "#E67E22",
          icon: "handshake"
        },
        {
          name: "AGUKA Program",
          type: "AGUKA",
          description: "Agricultural development and business growth",
          status: "active",
          progress: 45,
          participants: 156,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          budgetAllocated: 400000,
          budgetUsed: 180000,
          color: "#27AE60",
          icon: "seedling"
        },
        {
          name: "i-ACC Program",
          type: "i-ACC",
          description: "Innovation accelerator for startups",
          status: "active",
          progress: 30,
          participants: 32,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          budgetAllocated: 250000,
          budgetUsed: 75000,
          color: "#8E44AD",
          icon: "rocket"
        },
        {
          name: "MCF (Grow2Scale)",
          type: "MCF",
          description: "Market Connect Fund for scaling businesses",
          status: "active",
          progress: 85,
          participants: 18,
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-12-31"),
          budgetAllocated: 600000,
          budgetUsed: 510000,
          color: "#3498DB",
          icon: "chart-line"
        }
      ];

      await db.insert(programs).values(defaultPrograms);

      // Create default activities
      const defaultActivities: InsertActivity[] = [
        {
          programId: 1,
          type: "Training Session",
          description: "Capacity building workshop",
          date: new Date("2025-06-18"),
          status: "completed",
          details: "25 participants"
        },
        {
          programId: 2,
          type: "Coaching Session",
          description: "Business mentoring",
          date: new Date("2025-06-17"),
          status: "in_progress",
          details: "Refugee entrepreneurs"
        },
        {
          programId: 3,
          type: "Business Review",
          description: "Quarterly assessment",
          date: new Date("2025-06-16"),
          status: "scheduled",
          details: "Growth assessment"
        },
        {
          programId: 4,
          type: "Pitch Event",
          description: "Startup showcase",
          date: new Date("2025-06-15"),
          status: "completed",
          details: "8 startups presented"
        },
        {
          programId: 5,
          type: "Quarterly Review",
          description: "Financial reporting",
          date: new Date("2025-06-14"),
          status: "pending",
          details: "Financial reporting"
        }
      ];

      await db.insert(activities).values(defaultActivities);

      // Create default table config
      await db.insert(tableConfig).values({
        tableName: "recent_activity",
        columns: [
          { key: "program", label: "Program", type: "text" },
          { key: "activityType", label: "Activity Type", type: "text" },
          { key: "date", label: "Date", type: "date" },
          { key: "status", label: "Status", type: "status" },
          { key: "details", label: "Details", type: "text" },
          { key: "actions", label: "Actions", type: "actions" }
        ],
        data: []
      });

      // Create admin user
      await db.insert(users).values({
        username: "admin",
        password: "admin123", // In production, this should be hashed
        role: "admin"
      });

      // Create default admin settings
      const defaultSettings = [
        { key: "dashboard_title", value: "BPN Program Management", category: "ui" },
        { key: "welcome_message", value: "Good morning! Here's your program management overview.", category: "ui" },
        { key: "default_theme", value: "default", category: "theme" },
        { key: "show_timeline", value: "false", category: "ui" },
        { key: "items_per_page", value: "5", category: "ui" },
      ];

      await db.insert(adminSettings).values(defaultSettings);

      // Create default program suggestions
      const defaultSuggestions = [
        {
          keyword: "education",
          name: "Basic Education Enhancement",
          type: "CORE",
          description: "Improving literacy and numeracy skills in rural communities",
          tags: ["education", "literacy", "rural"],
          category: "education",
          priority: "high",
          defaultColor: "#4A90A4",
          defaultIcon: "bullseye",
          metadata: { sector: "education", target: "rural communities" }
        },
        {
          keyword: "health",
          name: "Community Health Program",
          type: "RIN",
          description: "Strengthening healthcare delivery systems",
          tags: ["health", "community", "healthcare"],
          category: "health",
          priority: "high",
          defaultColor: "#E67E22",
          defaultIcon: "handshake",
          metadata: { sector: "health", target: "communities" }
        },
        {
          keyword: "agriculture",
          name: "Sustainable Agriculture Initiative",
          type: "AGUKA",
          description: "Promoting sustainable farming practices and food security",
          tags: ["agriculture", "sustainability", "food"],
          category: "agriculture",
          priority: "medium",
          defaultColor: "#27AE60",
          defaultIcon: "seedling",
          metadata: { sector: "agriculture", target: "farmers" }
        }
      ];

      await db.insert(programSuggestions).values(defaultSuggestions);
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  // Programs
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs);
  }

  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async createProgram(program: InsertProgram): Promise<Program> {
    const processedProgram = this.processDateFields(program);
    const [newProgram] = await db.insert(programs).values(processedProgram).returning();
    return newProgram;
  }

  async updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined> {
    const processedProgram = this.processDateFields(program);
    const [updated] = await db.update(programs)
      .set({ ...processedProgram, updatedAt: new Date() })
      .where(eq(programs.id, id))
      .returning();
    return updated;
  }

  async deleteProgram(id: number): Promise<boolean> {
    const result = await db.delete(programs).where(eq(programs.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async getActivitiesByProgram(programId: number): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.programId, programId));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined> {
    const [updated] = await db.update(activities)
      .set(activity)
      .where(eq(activities.id, id))
      .returning();
    return updated;
  }

  async deleteActivity(id: number): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Table Configuration
  async getTableConfig(tableName: string): Promise<TableConfig | undefined> {
    const [config] = await db.select().from(tableConfig).where(eq(tableConfig.tableName, tableName));
    return config;
  }

  async updateTableConfig(config: InsertTableConfig): Promise<TableConfig> {
    const [updated] = await db.insert(tableConfig)
      .values(config)
      .onConflictDoUpdate({
        target: tableConfig.tableName,
        set: {
          columns: config.columns,
          data: config.data,
          updatedAt: new Date(),
        },
      })
      .returning();
    return updated;
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.username,
        set: userData,
      })
      .returning();
    return user;
  }

  // Admin Settings
  async getAdminSettings(category?: string): Promise<AdminSettings[]> {
    if (category) {
      return await db.select().from(adminSettings).where(eq(adminSettings.category, category));
    }
    return await db.select().from(adminSettings);
  }

  async updateAdminSetting(key: string, value: string, category: string): Promise<AdminSettings> {
    const [setting] = await db.insert(adminSettings)
      .values({ key, value, category })
      .onConflictDoUpdate({
        target: adminSettings.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    return setting;
  }

  // Table Column Configuration
  async getTableColumnConfig(tableName: string): Promise<TableColumnConfig[]> {
    return await db.select().from(tableColumnConfig).where(eq(tableColumnConfig.tableName, tableName));
  }

  async updateTableColumnConfig(config: InsertTableColumnConfig): Promise<TableColumnConfig> {
    const [result] = await db.insert(tableColumnConfig)
      .values(config)
      .onConflictDoUpdate({
        target: [tableColumnConfig.tableName, tableColumnConfig.columnKey],
        set: { ...config, updatedAt: new Date() },
      })
      .returning();
    return result;
  }

  // Program Suggestions
  async getProgramSuggestions(keyword?: string): Promise<ProgramSuggestion[]> {
    if (keyword) {
      return await db.select().from(programSuggestions)
        .where(eq(programSuggestions.keyword, keyword));
    }
    return await db.select().from(programSuggestions);
  }

  async createProgramSuggestion(suggestion: InsertProgramSuggestion): Promise<ProgramSuggestion> {
    const [result] = await db.insert(programSuggestions).values(suggestion).returning();
    return result;
  }

  async updateProgramSuggestion(id: number, suggestion: Partial<InsertProgramSuggestion>): Promise<ProgramSuggestion | undefined> {
    const [result] = await db.update(programSuggestions)
      .set(suggestion)
      .where(eq(programSuggestions.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
