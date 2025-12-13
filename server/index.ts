import type { Express } from "express";
import nodemailer from "nodemailer";

export async function registerRoutes(_server: any, app: Express) {

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, service, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      // TEST SMTP (foarte important)
      await transporter.verify();

      await transporter.sendMail({
        from: `"AGC Web Contact" <${process.env.MAIL_USER}>`,
        to: "agcweb@outlook.com",
        subject: "Mesaj nou de pe site – AGC Web",
        replyTo: email,
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
      });

    } catch (error) {
      console.error("CONTACT EMAIL ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Eroare la trimiterea emailului",
      });
    }
  });

}
