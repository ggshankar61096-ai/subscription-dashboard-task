import prisma from '../_prisma.js';
import jwt from 'jsonwebtoken';

const verifyToken = (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try { return jwt.verify(token, process.env.JWT_SECRET); } catch { return null; }
};

const adminMiddleware = (decoded) => {
  return decoded?.role === 'admin';
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const decoded = verifyToken(authHeader);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
    if (!adminMiddleware(decoded)) return res.status(403).json({ message: 'Forbidden: Admin access required' });

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

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: err.message });
  }
}
