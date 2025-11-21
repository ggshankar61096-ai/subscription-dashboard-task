import prisma from '../../_prisma.js';
import jwt from 'jsonwebtoken';

const verifyToken = (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const decoded = verifyToken(authHeader);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const planId = req.query.planId;
    if (!planId) {
      return res.status(400).json({ message: 'Missing planId' });
    }

    const userId = decoded.userId;

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
      include: { plan: true },
    });

    res.status(201).json({
      id: subscription.id,
      planId: subscription.planId,
      name: subscription.plan.name,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
}
