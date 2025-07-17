import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { invoice } from "@prisma/client";
import fs from "fs";
import path from "path";

/**
 * Generates a PDF Buffer from invoice data
 */
export async function generateInvoicePDF(invoice: invoice): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const drawText = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  drawText("Invoice", 250, 370, 18);
  drawText(`Invoice ID: ${invoice.id}`, 50, 330);
  drawText(`Client Name: ${invoice.customer}`, 50, 310);
  drawText(`Amount: $${invoice.total.toFixed(2)}`, 50, 290);
  drawText(`Status: ${invoice.is_paid}`, 50, 270);
  drawText(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 50, 250);
  drawText(`Created At: ${new Date(invoice.created_at).toLocaleDateString()}`, 50, 230);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Optional: Save to disk (for dev or test)
 */
export async function savePDFToDisk(invoice: invoice) {
  const pdfBuffer = await generateInvoicePDF(invoice);
  const filePath = path.join(__dirname, `../../invoices/${invoice.id}.pdf`);
  fs.writeFileSync(filePath, pdfBuffer);
  return filePath;
}
