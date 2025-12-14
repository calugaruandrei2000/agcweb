import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { Resend } from "resend";

// Initialize Resend client using environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerRoutes(app: Express, httpServer: Server): Promise<Server> {

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);

      // Create message in your storage
      const message = await storage.createContactMessage(validatedData);

      // Send email via Resend
      await resend.emails.send({
        from: "agcweb@outlook.com", // sau orice email valid verificat pe Resend
        to: "agcweb@outlook.com",   // poți folosi adresa destinatarului
        subject: `Mesaj nou de la ${validatedData.name}`,
        html: `<p>${validatedData.message}</p><p>Email: ${validatedData.email}</p>`
      });

      res.status(201).json({
        success: true,
        message: "Mesajul a fost trimis cu succes!",
        data: message
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, error: validationError.message });
      } else {
        console.error("CONTACT EMAIL ERROR:", error);
        res.status(500).json({
          success: false,
          error: "A apărut o eroare. Vă rugăm încercați din nou."
        });
      }
    }
  });

  // Get all contact messages (for admin purposes)
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

