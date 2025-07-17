import nodemailer from "nodemailer";
import type { invoice } from "@prisma/client";
import { generateInvoicePDF } from "./pdfService";

const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;

const transporter = nodemailer.createTransport({
  service: "gmail", // or 'smtp.yourprovider.com'
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Sends an invoice PDF to the client's email.
 */
export async function sendInvoiceEmail(invoice: invoice, toEmail: string) {
  const pdfBuffer = await generateInvoicePDF(invoice);

  const mailOptions = {
    from: `"Smart Invoice App" <${EMAIL_USER}>`,
    to: toEmail,
    subject: `Invoice from Smart Invoice App`,
    text: `Hello,\n\nPlease find attached invoice for: ${invoice.customer}\nAmount: $${invoice.total}`,
    attachments: [
      {
        filename: `invoice-${invoice.id}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
