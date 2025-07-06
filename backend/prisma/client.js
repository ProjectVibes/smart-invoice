// db.js or prisma/client.js
// import { PrismaClient } from '@prisma/client';
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

export default prisma;
