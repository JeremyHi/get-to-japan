import jwt from 'jsonwebtoken';
import { userQueries } from '../db/queries.js';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { message: 'Authentication required', code: 'UNAUTHORIZED' },
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = userQueries.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: { message: 'User not found', code: 'UNAUTHORIZED' },
      });
    }

    // Check if subscription has expired
    if (user.subscription_tier === 'pro' && user.subscription_expires_at) {
      if (new Date(user.subscription_expires_at) < new Date()) {
        // Subscription expired, downgrade to free
        user.subscription_tier = 'free';
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: { message: 'Invalid token', code: 'UNAUTHORIZED' },
    });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = userQueries.findById(decoded.userId);

    if (user) {
      // Check if subscription has expired
      if (user.subscription_tier === 'pro' && user.subscription_expires_at) {
        if (new Date(user.subscription_expires_at) < new Date()) {
          user.subscription_tier = 'free';
        }
      }
      req.user = user;
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }

  next();
}

export function requirePro(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: { message: 'Authentication required', code: 'UNAUTHORIZED' },
    });
  }

  if (req.user.subscription_tier !== 'pro') {
    return res.status(403).json({
      error: {
        message: 'Pro subscription required',
        code: 'PRO_REQUIRED',
        upgradeUrl: '/pricing',
      },
    });
  }

  next();
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
