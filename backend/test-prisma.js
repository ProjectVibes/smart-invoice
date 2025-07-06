const { PrismaClient } = require('@prisma/client');
// const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to Neon PostgreSQL!");
  } catch (err) {
    console.error("❌ Failed to connect:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
