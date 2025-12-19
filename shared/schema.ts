import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Store all site content (Hero text, About text, Contacts, etc.) as JSON blocks
// This mimics the "CONFIG object" request but in a database
export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'hero', 'contacts', 'stats', 'services', 'testimonials'
  value: jsonb("value").notNull(), // The actual data object
});

// Store form submissions
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("new"), // new, contacted, closed
});

// === SCHEMAS ===

export const insertInquirySchema = createInsertSchema(inquiries).pick({
  name: true,
  phone: true,
});

export const insertContentBlockSchema = createInsertSchema(contentBlocks).pick({
  key: true,
  value: true,
});

// === TYPES ===

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = z.infer<typeof insertContentBlockSchema>;

// Specific types for the JSON content to ensure type safety in frontend
export const HeroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  ctaText: z.string(),
});

export const StatsSchema = z.object({
  years: z.string(),
  projects: z.string(),
  landArea: z.string(),
  satisfaction: z.string(),
});

export const ContactSchema = z.object({
  phone1: z.string(),
  phone2: z.string(),
  email: z.string(),
  whatsapp: z.string(),
});

export const ServiceItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string().optional(),
});

export const TestimonialItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  text: z.string(),
  rating: z.number().optional(),
});
