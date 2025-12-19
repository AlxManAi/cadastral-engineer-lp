import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Get all content
  app.get(api.content.list.path, async (req, res) => {
    const content = await storage.getContentBlocks();
    res.json(content);
  });

  // Update content block
  app.post(api.content.update.path, async (req, res) => {
    try {
      const { key, value } = api.content.update.input.parse(req.body);
      const updated = await storage.updateContentBlock(key, value);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data format" });
        return;
      }
      throw err;
    }
  });

  // Create Inquiry
  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      const inquiry = await storage.createInquiry(input);
      res.status(201).json(inquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid form data" });
        return;
      }
      throw err;
    }
  });

  // List Inquiries
  app.get(api.inquiries.list.path, async (req, res) => {
    const items = await storage.getInquiries();
    res.json(items);
  });

  // Seed data on startup
  await seedDatabase();

  return httpServer;
}

// Helper to seed initial data
export async function seedDatabase() {
  const content = await storage.getContentBlocks();
  
  if (Object.keys(content).length === 0) {
    console.log("Seeding initial content...");

    // 1. General Settings / Hero
    await storage.updateContentBlock('hero', {
      title: "Дом без регистрации грозит штрафом или сносом",
      subtitle: "Мы оформим всё за вас под ключ — быстро, надёжно, по закону.",
      ctaText: "Бесплатная консультация"
    });

    // 2. Stats
    await storage.updateContentBlock('stats', {
      years: "27+",
      projects: "30,000+",
      landArea: "30,000+",
      satisfaction: "98%"
    });

    // 3. Contacts
    await storage.updateContentBlock('contact', {
      phone1: "+7 903 743-80-61",
      phone2: "+7 906 770-06-97",
      email: "9037438061@mail.ru",
      whatsapp: "79037438061"
    });

    // 4. Services
    await storage.updateContentBlock('services', [
      { id: "1", title: "Технический план", description: "Для дома, участка, здания. Необходим для постановки на учет.", price: "от 5000 ₽" },
      { id: "2", title: "Межевание участка", description: "Определение и закрепление границ участка.", price: "от 7000 ₽" },
      { id: "3", title: "Кадастровый учёт", description: "Полное сопровождение регистрации права собственности.", price: "от 3000 ₽" },
      { id: "4", title: "Геодезические измерения", description: "Точные измерения с профессиональным оборудованием.", price: "от 4000 ₽" },
      { id: "5", title: "Кадастровый паспорт", description: "Получение готового документа без очередей.", price: "от 2000 ₽" },
      { id: "6", title: "Консультация", description: "Онлайн или очная встреча с инженером.", price: "Бесплатно" },
    ]);

    // 5. Testimonials
    await storage.updateContentBlock('testimonials', [
      { id: "1", name: "Алексей П.", text: "Быстро оформили дом, никаких проблем с документами.", rating: 5 },
      { id: "2", name: "Марина С.", text: "Помогли с межеванием сложного участка. Спасибо за профессионализм!", rating: 5 },
      { id: "3", name: "Игорь В.", text: "Всё четко, в срок и по адекватной цене.", rating: 5 },
    ]);
  }
}
