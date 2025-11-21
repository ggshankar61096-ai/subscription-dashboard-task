import prisma from '../../_prisma.js';
import jwt from 'jsonwebtoken';

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

const generateTokens = (userId, email, role) => {
  const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { token, refreshToken };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ message: 'No refresh token provided' });
    }

    // Verify token signature
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check token exists in DB and not revoked/expired
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token invalid or revoked' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Rotate refresh token: revoke old and issue new
    await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revoked: true } });
    const { token, refreshToken: newRefresh } = generateTokens(user.id, user.email, user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { token: newRefresh, userId: user.id, expiresAt } });

    res.status(200).json({
      token,
      refreshToken: newRefresh,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Refresh failed', error: error.message });
  }
}
