import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express, httpServer: Server): Promise<Server> {

  // Configurare Nodemailer pentru Outlook
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Endpoint pentru formularul de contact
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);

      console.log("[contact] Request received:", validatedData);
      console.log("[contact] Data validated:", validatedData);
      console.log("[contact] Message stored:", message);
      console.log("[contact] Sending email via Nodemailer...");

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: "agcweb@outlook.com", // înlocuiește cu adresa unde vrei să primești mesajele
        subject: `Mesaj nou de la ${validatedData.name}`,
        text: `
Nume: ${validatedData.name}
Email: ${validatedData.email}
Telefon: ${validatedData.phone}
Serviciu: ${validatedData.service}
Mesaj: ${validatedData.message}
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("[contact] Email sent successfully");

      res.status(201).json({
        success: true,
        message: "Mesajul a fost trimis cu succes!",
        data: message,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.log("[contact] Validation error:", validationError.message);
        res.status(400).json({ success: false, error: validationError.message });
      } else {
        console.error("[contact] Error creating contact message:", error);
        res.status(500).json({
          success: false,
          error: "A apărut o eroare. Vă rugăm încercați din nou.",
        });
      }
    }
  });

  // Endpoint pentru afișarea mesajelor (admin)
  app.get("/api/contact", async (_req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("[contact] Error fetching contact messages:", error);
      res.status(500).json({ success: false, error: "A apărut o eroare." });
    }
  });

  return httpServer;
}
