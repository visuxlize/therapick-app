import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  varchar,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name"),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
});

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

// --- Therapick Waitlist (public) ---

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

export const waitlistRelations = relations(waitlistUsers, ({ one }) => ({
  referrer: one(waitlistUsers, {
    fields: [waitlistUsers.referredBy],
    references: [waitlistUsers.id],
  }),
}));