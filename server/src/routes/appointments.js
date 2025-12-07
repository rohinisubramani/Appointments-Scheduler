import express from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { nextTokenNumberForDate } from '../utils/token.js';
import { sendSms } from '../services/notifications.js';
import { generateBillPdf } from '../services/billing.js';

const router = express.Router();

function canModify(dateTime) {
  const now = new Date();
  const diffMs = new Date(dateTime).getTime() - now.getTime();
  const hours = diffMs / 1000 / 60 / 60;
  return hours >= 24;
}

function parseDateAndTime(date, time) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  if (time && /^\d{2}:\d{2}$/.test(time)) {
    const [h, m] = time.split(':').map(Number);
    d.setHours(h, m, 0, 0);
  }
  const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return { dateOnly, dateTime: d };
}

router.post('/', requireAuth, async (req, res) => {
  try {
    const { date, time, amount = 0 } = req.body;
    if (!date) return res.status(400).json({ error: 'Missing date' });
    const parsed = parseDateAndTime(date, time);
    if (!parsed) return res.status(400).json({ error: 'Invalid date/time' });
    const { dateOnly, dateTime } = parsed;

    const conflict = await prisma.appointment.findFirst({ where: { date: dateOnly, time: dateTime, status: { not: 'CANCELLED' } } });
    if (conflict) return res.status(409).json({ error: 'Slot already booked' });

    const tokenNumber = await nextTokenNumberForDate(dateOnly);
    const appt = await prisma.appointment.create({
      data: { userId: req.user.id, date: dateOnly, time: dateTime, tokenNumber, billAmount: amount }
    });
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    await sendSms(user.phone, `Appointment booked. Token ${tokenNumber} on ${dateOnly.toDateString()} at ${dateTime.toLocaleTimeString()}`);
    res.status(201).json(appt);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const appts = await prisma.appointment.findMany({ where: { userId: req.user.id }, orderBy: { date: 'asc' } });
    res.json(appts);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
    if (!canModify(existing.time)) return res.status(400).json({ error: 'Can modify only 24h before' });
    const { date, time } = req.body;
    const parsed = date ? parseDateAndTime(date, time ?? existing.time.toISOString().slice(11,16)) : { dateOnly: existing.date, dateTime: time ? parseDateAndTime(existing.date, time).dateTime : existing.time };
    if (!parsed || Number.isNaN(parsed.dateTime.getTime())) return res.status(400).json({ error: 'Invalid date/time' });
    const { dateOnly, dateTime } = parsed;
    const conflict = await prisma.appointment.findFirst({ where: { id: { not: id }, date: dateOnly, time: dateTime, status: { not: 'CANCELLED' } } });
    if (conflict) return res.status(409).json({ error: 'Slot already booked' });
    const updated = await prisma.appointment.update({ where: { id }, data: { date: dateOnly, time: dateTime } });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
    if (!canModify(existing.time)) return res.status(400).json({ error: 'Can delete only 24h before' });
    const cancelled = await prisma.appointment.update({ where: { id }, data: { status: 'CANCELLED' } });
    res.json(cancelled);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/bill', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const appt = await prisma.appointment.findUnique({ where: { id } });
    if (!appt || appt.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
    const user = await prisma.user.findUnique({ where: { id: appt.userId } });
    const pdf = await generateBillPdf({ tokenNumber: appt.tokenNumber, name: user.name, date: appt.date, time: appt.time, amount: appt.billAmount });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="bill_${appt.id}.pdf"`);
    res.send(pdf);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
