import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  name: varchar("name", { length: 100 }),
  avatarUrl: text("avatar_url"),
  stripeCustomerId: text("stripe_customer_id"),

  // Location preferences
  location: jsonb("location").$type<{
    city?: string;
    state?: string;
    zip?: string;
    coordinates?: { lat: number; lng: number };
  }>(),

  // User preferences
  preferences: jsonb("preferences").$type<{
    notificationEmail?: boolean;
    moodReminders?: boolean;
    reminderTime?: string;
  }>(),

  // Verification
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),

  // Password reset
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// SESSIONS TABLE
// ============================================
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// TODOS (existing app)
// ============================================
export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  imagePath: text("image_path"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// WAITLIST (Therapick)
// ============================================
export const waitlistUsers = pgTable("waitlist_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  referralCode: varchar("referral_code", { length: 20 }).notNull().unique(),
  referredBy: uuid("referred_by"),
  position: integer("position").notNull(),
  metadata: jsonb("metadata").$type<{
    source?: string;
    utmParams?: Record<string, string>;
    userAgent?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const developmentUpdates = pgTable("development_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  todos: many(todos),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const waitlistRelations = relations(waitlistUsers, ({ one }) => ({
  referrer: one(waitlistUsers, {
    fields: [waitlistUsers.referredBy],
    references: [waitlistUsers.id],
  }),
}));

// ============================================
// TYPES (for TypeScript)
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
