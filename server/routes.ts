import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerRoutes(app: Express, httpServer: Server): Promise<Server> {
  
  // Endpoint pentru contact
  app.post("/api/contact", async (req, res) => {
    console.log("[contact] Request received:", req.body);

    try {
      // Validare date
      const validatedData = insertContactMessageSchema.parse(req.body);
      console.log("[contact] Data validated:", validatedData);

      // Creare mesaj in storage
      const message = await storage.createContactMessage(validatedData);
      console.log("[contact] Message stored:", message);

      // Trimitere email
      try {
        console.log("[contact] Sending email via Resend...");
        const emailResponse = await resend.emails.send({
          from: "agcweb@outlook.com",
          to: validatedData.email,
          subject: "Mesaj primit",
          html: `<p>Salut ${validatedData.name},</p><p>Am primit mesajul tău: ${validatedData.message}</p>`
        });
        console.log("[contact] Email sent successfully:", emailResponse);
      } catch (emailErr) {
        console.error("[contact] Error sending email:", emailErr);
      }

      res.status(201).json({
        success: true,
        message: "Mesajul a fost trimis cu succes!",
        data: message
      });

    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.log("[contact] Validation error:", validationError.message);
        res.status(400).json({ success: false, error: validationError.message });
      } else {
        console.error("[contact] Unknown error:", error);
        res.status(500).json({
          success: false,
          error: "A apărut o eroare. Vă rugăm încercați din nou."
        });
      }
    }
  });

  // Endpoint pentru preluare mesaje contact (pentru admin)
  app.get("/api/contact", async (_req, res) => {
    console.log("[contact] GET request for messages");

    try {
      const messages = await storage.getContactMessages();
      console.log("[contact] Messages fetched:", messages.length);
      res.json(messages);
    } catch (error) {
      console.error("[contact] Error fetching messages:", error);
      res.status(500).json({ success: false, error: "A apărut o eroare." });
    }
  });

  return httpServer;
}
