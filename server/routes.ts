import type { Express } from "express";
import { Resend } from "resend";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { storage } from "./storage";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerRoutes(app: Express) {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const { name, email, phone, service, message } = validatedData;

      // salvează în DB (cum aveai deja)
      const saved = await storage.createContactMessage(validatedData);

      // trimite email
      await resend.emails.send({
        from: "AGC Web <onboarding@resend.dev>",
        to: ["agcweb@outlook.com"],
        replyTo: email,
        subject: "Mesaj nou de pe site – AGC Web",
        text: `
Mesaj nou primit de pe formularul de contact

Nume: ${name}
Email: ${email}
Telefon: ${phone || "-"}
Serviciu: ${service || "-"}

Mesaj:
${message}
        `,
      });

      return res.status(201).json({
        success: true,
        message: "Mesajul a fost trimis cu succes!",
        data: saved,
      });

    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ success: false, error: validationError.message });
      }

      console.error("CONTACT EMAIL ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Eroare la trimiterea emailului",
      });
    }
  });
}
