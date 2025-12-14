import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express, httpServer: Server): Promise<Server> {
  // Configurație Nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });

  // Funcție de trimis email cu retry
  async function sendEmailWithRetry(mailOptions: nodemailer.SendMailOptions, retries = 3, delayMs = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[contact] Email sent successfully on attempt ${attempt}`, info);
        return info;
      } catch (err) {
        console.error(`[contact] Email send attempt ${attempt} failed:`, err);
        if (attempt < retries) {
          console.log(`[contact] Retrying in ${delayMs / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          throw err;
        }
      }
    }
  }

  // Endpoint contact
  app.post("/api/contact", async (req, res) => {
    try {
      console.log("[contact] Request received:", req.body);

      const validatedData = insertContactMessageSchema.parse(req.body);
      console.log("[contact] Data validated:", validatedData);

      const message = await storage.createContactMessage(validatedData);
      console.log("[contact] Message stored:", message);

      // Trimite email
      console.log("[contact] Sending email via Nodemailer...");
      await sendEmailWithRetry({
        from: `"AGC Web" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO,
        subject: `Mesaj nou de la ${validatedData.name} - ${validatedData.service}`,
        text: `
Nume: ${validatedData.name}
Email: ${validatedData.email}
Telefon: ${validatedData.phone}
Serviciu: ${validatedData.service}
Mesaj: ${validatedData.message}
        `,
      });

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
        console.error("[contact] Error creating contact message:", error);
        res.status(500).json({
          success: false,
          error: "A apărut o eroare. Vă rugăm încercați din nou.",
        });
      }
    }
  });

  // Get all contact messages (admin)
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
