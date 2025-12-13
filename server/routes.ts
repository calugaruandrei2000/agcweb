import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import nodemailer from "nodemailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request
      const validatedData = insertContactMessageSchema.parse(req.body);

      // Save message in storage
      const message = await storage.createContactMessage(validatedData);

      // Setup mail transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER || "agcweb@outlook.com",
          pass: process.env.MAIL_PASS || "alalthcqmhplrvjx",
        },
      });

      // Optional: test SMTP connection
      try {
        await transporter.verify();
        console.log("SMTP verified successfully");
      } catch (err) {
        console.error("SMTP verification failed:", err);
      }

      // Send email
      await transporter.sendMail({
        from: `"AGC Web Contact" <${process.env.MAIL_USER || "agcweb@outlook.com"}>`,
        to: "agcweb@outlook.com",
        replyTo: validatedData.email,
        subject: "Mesaj nou de pe site – AGC Web",
        text: `
Mesaj nou primit de pe formularul de contact

Nume: ${validatedData.name}
Email: ${validatedData.email}
Telefon: ${validatedData.phone || "-"}
Serviciu: ${validatedData.service || "-"}

Mesaj:
${validatedData.message}
        `,
      });

      // Return success
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
        console.error("CONTACT EMAIL ERROR:", error);
        res.status(500).json({ success: false, error: "A apărut o eroare. Vă rugăm încercați din nou." });
      }
    }
  });

  // Get all contact messages (admin)
  app.get("/api/contact", async (req, res) => {
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
