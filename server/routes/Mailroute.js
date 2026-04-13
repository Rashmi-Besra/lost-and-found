import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const MailRouter = express.Router();

/* Nodemailer Configuration */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* Send Email */

MailRouter.post("/send-email", async (req, res) => {

  try {

    const { ownerUid, senderEmail, itemDetails, title } = req.body;

    if (!ownerUid || !senderEmail || !itemDetails) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    /* Get owner's email from Firebase */

    const ownerRecord = await admin.auth().getUser(ownerUid);
    const ownerEmail = ownerRecord.email;

    /* Email Template */

    const mailOptions = {

      from: process.env.EMAIL_USER,
      replyTo: senderEmail,
      to: ownerEmail,

      subject: `Reclaim Campus: Possible Match for Your Lost Item`,

      text: `
Hello,

A student has found an item that might match something you reported as lost.

📦 Item Title:
${title || "Lost Item"}

📝 Item Description:
${itemDetails}

If this item belongs to you, please contact the finder directly by replying to this email.

Finder Email:
${senderEmail}

When responding, please include identifying details such as:
• color
• brand
• scratches
• stickers
• serial numbers

This helps confirm ownership before returning the item.

Thank you for using Reclaim Campus Lost & Found.

Best regards,
Reclaim Support Team
Campus Lost & Found System
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {

    console.error("Email sending error:", error);

    res.status(500).json({
      error: "Failed to send email"
    });

  }

});

export default MailRouter;