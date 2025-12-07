import { prisma } from '../index.js';

export async function nextTokenNumberForDate(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const count = await prisma.appointment.count({ where: { date: { gte: start, lt: end } } });
  return count + 1;
}
