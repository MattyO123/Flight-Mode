import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  credits: decimal("credits", { precision: 10, scale: 2 }).default("0.00"),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0.00"),
  referralCode: varchar("referral_code").unique(),
  referredBy: varchar("referred_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competitions table
export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  prizeValue: decimal("prize_value", { precision: 10, scale: 2 }).notNull(),
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }).notNull(),
  maxEntries: integer("max_entries").notNull(),
  currentEntries: integer("current_entries").default(0),
  category: varchar("category").notNull(), // wellness, luxury, adventure
  destination: text("destination").notNull(),
  duration: text("duration").notNull(),
  includes: jsonb("includes").$type<string[]>().default([]),
  skillQuestion: jsonb("skill_question").$type<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>().notNull(),
  status: varchar("status").notNull().default("active"), // active, closed, drawn
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  winnerUserId: varchar("winner_user_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competition entries table
export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  competitionId: integer("competition_id").notNull(),
  userId: varchar("user_id").notNull(),
  answer: integer("answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  paymentIntentId: varchar("payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  entries: many(entries),
}));

export const competitionsRelations = relations(competitions, ({ many, one }) => ({
  entries: many(entries),
  winner: one(users, {
    fields: [competitions.winnerUserId],
    references: [users.id],
  }),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  competition: one(competitions, {
    fields: [entries.competitionId],
    references: [competitions.id],
  }),
  user: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompetitionSchema = createInsertSchema(competitions).omit({
  id: true,
  currentEntries: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEntrySchema = createInsertSchema(entries).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type Entry = typeof entries.$inferSelect;
export type InsertEntry = z.infer<typeof insertEntrySchema>;
