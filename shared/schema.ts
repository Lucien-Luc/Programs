import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'CORE', 'RIN', 'AGUKA', 'i-ACC', 'MCF'
  description: text("description"),
  status: text("status").notNull().default("active"), // 'active', 'paused', 'completed', 'cancelled'
  progress: integer("progress").notNull().default(0), // 0-100
  participants: integer("participants").notNull().default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budgetAllocated: integer("budget_allocated").default(0),
  budgetUsed: integer("budget_used").default(0),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").references(() => programs.id),
  type: text("type").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // 'completed', 'in_progress', 'scheduled', 'pending', 'cancelled'
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tableConfig = pgTable("table_config", {
  id: serial("id").primaryKey(),
  tableName: text("table_name").notNull(),
  columns: jsonb("columns").notNull(), // Array of column definitions
  data: jsonb("data").notNull(), // Array of row data
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'admin', 'user'
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertTableConfigSchema = createInsertSchema(tableConfig).omit({
  id: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type TableConfig = typeof tableConfig.$inferSelect;
export type InsertTableConfig = z.infer<typeof insertTableConfigSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
