import { db } from "./db";
import {
  contentBlocks,
  inquiries,
  type InsertContentBlock,
  type ContentBlock,
  type InsertInquiry,
  type Inquiry
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Content
  getContentBlocks(): Promise<Record<string, any>>;
  updateContentBlock(key: string, value: any): Promise<ContentBlock>;
  
  // Inquiries
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
}

export class DatabaseStorage implements IStorage {
  async getContentBlocks(): Promise<Record<string, any>> {
    const blocks = await db.select().from(contentBlocks);
    const result: Record<string, any> = {};
    blocks.forEach(block => {
      result[block.key] = block.value;
    });
    return result;
  }

  async updateContentBlock(key: string, value: any): Promise<ContentBlock> {
    const [existing] = await db.select().from(contentBlocks).where(eq(contentBlocks.key, key));
    
    if (existing) {
      const [updated] = await db
        .update(contentBlocks)
        .set({ value })
        .where(eq(contentBlocks.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(contentBlocks)
        .values({ key, value })
        .returning();
      return created;
    }
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newItem] = await db.insert(inquiries).values(inquiry).returning();
    return newItem;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(inquiries.createdAt);
  }
}

export const storage = new DatabaseStorage();
