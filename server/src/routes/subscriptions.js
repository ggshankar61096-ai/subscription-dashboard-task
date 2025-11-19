import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/subscribe/:planId', authMiddleware, async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.userId;

    // Check if plan exists
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if user already has an active subscription
    const existing = await prisma.subscription.findFirst({
      where: { userId, status: 'active' },
    });
    if (existing) {
      return res.status(400).json({ message: 'User already has an active subscription' });
    }

    // Create subscription
    const now = new Date();
    const endDate = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000);
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        startDate: now,
        endDate,
        status: 'active',
      },
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
});

router.get('/my-subscription', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: 'active' },
      include: { plan: true },
    });

    if (!subscription) {
      return res.json(null);
    }

    res.json({
      id: subscription.id,
      planId: subscription.planId,
      name: subscription.plan.name,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscription', error: error.message });
  }
});

router.get('/admin/subscriptions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: { user: true, plan: true },
    });

    const formatted = subscriptions.map(sub => ({
      id: sub.id,
      userId: sub.userId,
      userName: sub.user.name,
      planName: sub.plan.name,
      status: sub.status,
      startDate: sub.startDate,
      endDate: sub.endDate,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
  }
});

export default router;
