import express from 'express';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/overview', async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate()+1);
  const todays = await prisma.appointment.count({ where: { date: { gte: todayStart, lt: tomorrow } } });
  const total = await prisma.appointment.count();
  const pending = await prisma.appointment.count({ where: { status: 'PENDING' } });
  const cancelled = await prisma.appointment.count({ where: { status: 'CANCELLED' } });
  const users = await prisma.user.count();
  const upcomingSlots = await prisma.slot.count({ where: { date: { gte: todayStart }, available: true } });
  res.json({ todays, total, pending, cancelled, users, upcomingSlots });
});

router.get('/appointments', async (req, res) => {
  const list = await prisma.appointment.findMany({ include: { user: true }, orderBy: { date: 'asc' } });
  res.json(list);
});

router.post('/appointments/:id/approve', async (req, res) => {
  const id = Number(req.params.id);
  const updated = await prisma.appointment.update({ where: { id }, data: { status: 'APPROVED' } });
  res.json(updated);
});

router.post('/appointments/:id/cancel', async (req, res) => {
  const id = Number(req.params.id);
  const updated = await prisma.appointment.update({ where: { id }, data: { status: 'CANCELLED' } });
  res.json(updated);
});

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({ include: { appointments: true } });
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, totalAppointments: u.appointments.length, status: u.status })));
});

router.post('/users/:id/block', async (req, res) => {
  const id = Number(req.params.id);
  const updated = await prisma.user.update({ where: { id }, data: { status: 'BLOCKED' } });
  res.json(updated);
});

router.post('/users/:id/unblock', async (req, res) => {
  const id = Number(req.params.id);
  const updated = await prisma.user.update({ where: { id }, data: { status: 'ACTIVE' } });
  res.json(updated);
});

router.delete('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.appointment.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  res.json({ ok: true });
});

router.get('/slots', async (req, res) => {
  const slots = await prisma.slot.findMany({ orderBy: { date: 'asc' } });
  res.json(slots);
});

router.post('/slots', async (req, res) => {
  try {
    const { date, startTime, endTime, available = true } = req.body;
    if (!startTime || !endTime) return res.status(400).json({ error: 'Missing start/end time' });
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return res.status(400).json({ error: 'Invalid start/end time' });
    if (end <= start) return res.status(400).json({ error: 'End must be after start' });
    const day = date ? new Date(date) : new Date(start.getFullYear(), start.getMonth(), start.getDate());
    if (Number.isNaN(day.getTime())) return res.status(400).json({ error: 'Invalid date' });
    const created = await prisma.slot.create({ data: { date: day, startTime: start, endTime: end, available } });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/slots/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { date, startTime, endTime, available } = req.body;
  const updated = await prisma.slot.update({ where: { id }, data: { date: date ? new Date(date) : undefined, startTime: startTime ? new Date(startTime) : undefined, endTime: endTime ? new Date(endTime) : undefined, available } });
  res.json(updated);
});

router.delete('/slots/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.slot.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
