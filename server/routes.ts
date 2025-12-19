import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for image uploads
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage_multer,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Serve uploaded files
  app.use("/uploads", (await import("express")).static(uploadDir));

  // Image upload endpoint
  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

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
      title: "Оформим вашу недвижимость под ключ",
      subtitle: "Кадастровые работы любой сложности с гарантией результата. Вы получаете готовые документы - мы берём на себя всё остальное.",
      ctaText: "Бесплатная консультация",
      backgroundImage: ""
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

    // 4. Services (real data from kadastr-online.ru)
    await storage.updateContentBlock('services', [
      { id: "1", title: "Технический план объекта", description: "Подготовка технического плана для постановки дома, бани, гаража на кадастровый учет", price: "от 8 000 ₽", icon: "FileText" },
      { id: "2", title: "Межевой план", description: "Определение и закрепление границ земельного участка, разделы и объединения", price: "от 7 000 ₽", icon: "MapPin" },
      { id: "3", title: "Акт обследования", description: "Документ для снятия объекта недвижимости с учета при сносе", price: "от 5 000 ₽", icon: "Ruler" },
      { id: "4", title: "Перевод в жилое", description: "Перевод нежилого дома в СНТ в жилой с полным сопровождением", price: "от 18 000 ₽", icon: "Home" },
      { id: "5", title: "Экспертиза объекта", description: "Строительная и землеустроительная экспертиза любой сложности", price: "от 20 000 ₽", icon: "Scale" },
      { id: "6", title: "Консультация", description: "Бесплатная консультация в сфере земельно-имущественных отношений", price: "Бесплатно", icon: "Award" },
    ]);

    // 5. Problems section
    await storage.updateContentBlock('problems', [
      { id: "1", title: "Отсутствие договора на результат", text: "Обычно заключают договор на разработку плана, а посещение кадастровой палаты остается вашей проблемой. Мы заключаем договор на результат - получение кадастрового паспорта.", image: "" },
      { id: "2", title: "Отсутствие оптимального решения", text: "Не зная всех механизмов, инженер не может определить оптимальный путь. Бездумная работа приводит к проблемам на следующих этапах. У нас работают сертифицированные инженеры.", image: "" },
      { id: "3", title: "Незнание законодательства", text: "Работа по привычному пути приводит к неактуальным этапам работ, что увеличивает бюджет и сроки. Мы следим за изменениями и используем актуальные методы.", image: "" },
    ]);

    // 6. Testimonials
    await storage.updateContentBlock('testimonials', [
      { id: "1", name: "Алексей П.", text: "Быстро оформили дом, никаких проблем с документами. Все сделали под ключ как обещали. Рекомендую!", rating: 5 },
      { id: "2", name: "Марина С.", text: "Помогли с межеванием сложного участка с наложением границ. Решили все вопросы с соседями. Спасибо за профессионализм!", rating: 5 },
      { id: "3", name: "Игорь В.", text: "Все четко, в срок и по адекватной цене. Договор на результат - это главное отличие от других.", rating: 5 },
      { id: "4", name: "ООО СтройИнвест", text: "Сотрудничаем уже 3 года по всем объектам. Надежный партнер, всегда соблюдают сроки.", rating: 5 },
    ]);
  }
}
