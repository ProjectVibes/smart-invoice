import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authMiddleware";
import { generateInvoicePDF } from "../services/pdfService";
import { sendInvoiceEmail } from "../services/emailService";

const router = Router();
const prisma = new PrismaClient();

// All routes in this file are protected
router.use(authenticate);

// POST /api/invoice — Create Invoice
router.post("/", async (req, res) => {
  try {
    const {
  customer,
  email,
  items,       // Expecting array or JSON
  total,
  due_date,
  coupon_code, // optional
  is_paid,
} = req.body;

const user_id = (req as any).user_id;

    const invoice = await prisma.invoice.create({
      data: {
    customer,
    email,
    items, // pass array or object directly
    total: parseFloat(total),
    due_date: new Date(due_date),
    is_paid: Boolean(is_paid),
    coupon_code: coupon_code || null,
    user: {
      connect: { id: user_id     },
    },
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Invoice creation failed", error });
  }
});

// GET /api/invoice — Get All Invoices for Logged-in User
router.get("/", async (req, res) => {
  try {
    const user_id = (req as any).user_id;

    const invoices = await prisma.invoice.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Fetching invoices failed", error });
  }
});

router.get("/:id/pdf", async (req, res) => {
  try {
    const user_id = (req as any).user_id;
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
    });

    if (!invoice || invoice.user_id !== user_id) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const pdfBuffer = await generateInvoicePDF(invoice);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${invoice.id}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "PDF generation failed", error });
  }
});

// POST /api/invoice/:id/send
router.post("/:id/send", async (req, res) => {
  try {
    const user_id = (req as any).user_id;
    const { toEmail } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
    });

    if (!invoice || invoice.user_id !== user_id) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await sendInvoiceEmail(invoice, toEmail);

    res.json({ message: "Invoice sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email sending failed", error });
  }
});



export default router;
