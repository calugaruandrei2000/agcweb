import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import sgMail from "@sendgrid/mail";

// ✅ Configurează cheia API SendGrid în Render:
// Variabila trebuie să fie exact SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Email-ul "from" trebuie să fie o adresă verificată în SendGrid
const FROM_EMAIL = "no-reply@agcweb.com"; // recomand să folosești o adresă validă și verificată

export async function registerRoutes(app: Express, httpServer: Server): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);

      // Salvăm mesajul în baza de date
      const message = await storage.createContactMessage(validatedData);
      console.log("[contact] Message stored:", message);

      // Trimitem emailul prin SendGrid
      console.log("[contact] Sending email via SendGrid...");
      const msg = {
        to: "agcweb@outlook.com", // adresa ta de primire a mesajelor
        from: FROM_EMAIL,
        subject: `Mesaj contact de la ${validatedData.name}`,
        text: `
Name: ${validatedData.name}
Email: ${validatedData.email}
Phone: ${validatedData.phone}
Service: ${validatedData.service}
Message: ${validatedData.message}
        `,
      };

      await sgMail.send(msg);
      console.log("[contact] Email sent successfully");

      res.status(201).json({
        success: true,
        message: "Mesajul a fost trimis cu succes!",
        data: message,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, error: validationError.message });
      } else {
        console.error("[contact] Error sending email or saving message:", error);
        res.status(500).json({
          success: false,
          error: "A apărut o eroare. Vă rugăm încercați din nou.",
        });
      }
    }
  });

  app.get("/api/contact", async (_req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ success: false, error: "A apărut o eroare." });
    }
  });

  return httpServer;
}
