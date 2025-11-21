import prisma from './_prisma.js';
import jwt from 'jsonwebtoken';

const verifyToken = (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try { return jwt.verify(token, process.env.JWT_SECRET); } catch { return null; }
};

export default async function handler(req, res) {
  // POST /api/subscribe/:planId  or GET /api/my-subscription or GET /api/admin/subscriptions
  try {
    if (req.method === 'POST' && req.url?.includes('/subscribe/')) {
      const authHeader = req.headers.authorization;
      const decoded = verifyToken(authHeader);
      if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
      const planId = req.url.split('/').pop();
      const userId = decoded.userId;
      const plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) return res.status(404).json({ message: 'Plan not found' });
      const existing = await prisma.subscription.findFirst({ where: { userId, status: 'active' } });
      if (existing) return res.status(400).json({ message: 'User already has an active subscription' });
      const now = new Date();
      const endDate = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000);
      const subscription = await prisma.subscription.create({ data: { userId, planId, startDate: now, endDate, status: 'active' } });
      return res.status(201).json(subscription);
    }

    if (req.method === 'GET' && req.url === '/api/my-subscription') {
      const authHeader = req.headers.authorization;
      const decoded = verifyToken(authHeader);
      if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
      const userId = decoded.userId;
      const subscription = await prisma.subscription.findFirst({ where: { userId, status: 'active' }, include: { plan: true } });
      if (!subscription) return res.json(null);
      return res.json({ id: subscription.id, planId: subscription.planId, name: subscription.plan.name, startDate: subscription.startDate, endDate: subscription.endDate, status: subscription.status });
    }

    if (req.method === 'GET' && req.url === '/api/admin/subscriptions') {
      const authHeader = req.headers.authorization;
      const decoded = verifyToken(authHeader);
      if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
      if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
      const subscriptions = await prisma.subscription.findMany({ include: { user: true, plan: true } });
      const formatted = subscriptions.map(sub => ({ id: sub.id, userId: sub.userId, userName: sub.user.name, planName: sub.plan.name, status: sub.status, startDate: sub.startDate, endDate: sub.endDate }));
      return res.json(formatted);
    }

    return res.status(405).json({ message: 'Method not allowed or unknown path' });
  } catch (err) {
    res.status(500).json({ message: 'Subscription handler error', error: err.message });
  }
}
