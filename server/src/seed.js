import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({ data: { name: 'Admin', email: adminEmail, phone: '9999999999', passwordHash, role: 'ADMIN' } });
    console.log('Admin user created: admin@example.com / Admin@123');
  }
  const today = new Date();
  today.setHours(0,0,0,0);
  const s1 = await prisma.slot.create({ data: { date: today, startTime: new Date(today.getTime() + 9*60*60*1000), endTime: new Date(today.getTime() + 12*60*60*1000), available: true } });
  const s2 = await prisma.slot.create({ data: { date: today, startTime: new Date(today.getTime() + 14*60*60*1000), endTime: new Date(today.getTime() + 18*60*60*1000), available: true } });
  console.log('Seeded slots', s1.id, s2.id);
}

main().finally(async () => {
  await prisma.$disconnect();
});
