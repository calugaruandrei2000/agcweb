import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import sgMail from "@sendgrid/mail";

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function registerRoutes(app: Express, httpServer: Server): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      console.log("[contact] Message stored:", message);

      console.log("[contact] Sending email via SendGrid...");

      // SendGrid email
      const msg = {
        to: "andreicalugaru2000@gmail.com", // schimbă cu adresa ta
        from: "agcweb@outlook.com",     // poate fi și Outlook, dar prin SendGrid
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
