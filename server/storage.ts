import { programs, activities, tableConfig, users, type Program, type InsertProgram, type Activity, type InsertActivity, type TableConfig, type InsertTableConfig, type User, type InsertUser } from "@shared/schema";

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

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private programs: Map<number, Program>;
  private activities: Map<number, Activity>;
  private tableConfigs: Map<string, TableConfig>;
  private users: Map<number, User>;
  private currentProgramId: number;
  private currentActivityId: number;
  private currentUserId: number;

  constructor() {
    this.programs = new Map();
    this.activities = new Map();
    this.tableConfigs = new Map();
    this.users = new Map();
    this.currentProgramId = 1;
    this.currentActivityId = 1;
    this.currentUserId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
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

    defaultPrograms.forEach(program => {
      this.createProgram(program);
    });

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

    defaultActivities.forEach(activity => {
      this.createActivity(activity);
    });

    // Create default table config
    this.updateTableConfig({
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
    this.createUser({
      username: "admin",
      password: "admin123",
      role: "admin"
    });
  }

  async getPrograms(): Promise<Program[]> {
    return Array.from(this.programs.values());
  }

  async getProgram(id: number): Promise<Program | undefined> {
    return this.programs.get(id);
  }

  async createProgram(program: InsertProgram): Promise<Program> {
    const id = this.currentProgramId++;
    const newProgram: Program = {
      ...program,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.programs.set(id, newProgram);
    return newProgram;
  }

  async updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program | undefined> {
    const existing = this.programs.get(id);
    if (!existing) return undefined;

    const updated: Program = {
      ...existing,
      ...program,
      updatedAt: new Date(),
    };
    this.programs.set(id, updated);
    return updated;
  }

  async deleteProgram(id: number): Promise<boolean> {
    return this.programs.delete(id);
  }

  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivitiesByProgram(programId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => activity.programId === programId);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = {
      ...activity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined> {
    const existing = this.activities.get(id);
    if (!existing) return undefined;

    const updated: Activity = {
      ...existing,
      ...activity,
    };
    this.activities.set(id, updated);
    return updated;
  }

  async deleteActivity(id: number): Promise<boolean> {
    return this.activities.delete(id);
  }

  async getTableConfig(tableName: string): Promise<TableConfig | undefined> {
    return this.tableConfigs.get(tableName);
  }

  async updateTableConfig(config: InsertTableConfig): Promise<TableConfig> {
    const existing = this.tableConfigs.get(config.tableName);
    const updated: TableConfig = {
      id: existing?.id || 1,
      ...config,
      updatedAt: new Date(),
    };
    this.tableConfigs.set(config.tableName, updated);
    return updated;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
}

export const storage = new MemStorage();
