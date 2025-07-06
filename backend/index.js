// index.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
// const { PrismaClient } = require('./generated/prisma');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.post('/invoice', async (req, res) => {
  const { customer, email, items, total, dueDate } = req.body;

  const invoice = await prisma.invoice.create({
    data: { customer, email, items, total, dueDate },
  });

  await transporter.sendMail({
    to: email,
    subject: `Invoice for ${customer}`,
    html: `<h3>Invoice Total: $${total}</h3><p>Due by ${dueDate}</p>`,
  });

  res.json(invoice);
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));