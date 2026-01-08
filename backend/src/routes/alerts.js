import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { alertQueries } from '../db/queries.js';
import { authMiddleware, requirePro } from '../middleware/auth.js';

const router = Router();

// Free users get 1 alert, Pro users get unlimited
const FREE_ALERT_LIMIT = 1;

// Get user's alerts
router.get('/', authMiddleware, (req, res) => {
  const alerts = alertQueries.getByUser(req.user.id);

  res.json({
    alerts: alerts.map(a => ({
      id: a.id,
      origin: a.origin,
      destination: a.destination,
      departureDate: a.departure_date,
      returnDate: a.return_date,
      cabinClass: a.cabin_class,
      alertType: a.alert_type,
      targetCashPrice: a.target_cash_price,
      targetMiles: a.target_miles,
      isActive: !!a.is_active,
      lastCheckedAt: a.last_checked_at,
      lastNotifiedAt: a.last_notified_at,
      createdAt: a.created_at,
    })),
    limit: req.user.subscription_tier === 'pro' ? null : FREE_ALERT_LIMIT,
  });
});

// Create new alert
router.post('/', authMiddleware, (req, res, next) => {
  try {
    const {
      origin,
      destination = 'TYO',
      departureDate,
      returnDate,
      cabinClass,
      alertType = 'both',
      targetCashPrice,
      targetMiles,
    } = req.body;

    if (!origin || !departureDate) {
      return res.status(400).json({
        error: { message: 'Origin and departure date are required', code: 'VALIDATION_ERROR' },
      });
    }

    // Check alert limit for free users
    const existingAlerts = alertQueries.getByUser(req.user.id);
    if (req.user.subscription_tier !== 'pro' && existingAlerts.length >= FREE_ALERT_LIMIT) {
      return res.status(403).json({
        error: {
          message: `Free tier limited to ${FREE_ALERT_LIMIT} alert. Upgrade to Pro for unlimited alerts.`,
          code: 'ALERT_LIMIT_EXCEEDED',
          upgradeUrl: '/pricing',
        },
      });
    }

    const alertId = uuidv4();
    alertQueries.create({
      id: alertId,
      userId: req.user.id,
      origin,
      destination,
      departureDate,
      returnDate,
      cabinClass,
      alertType,
      targetCashPrice,
      targetMiles,
    });

    res.status(201).json({
      alert: {
        id: alertId,
        origin,
        destination,
        departureDate,
        returnDate,
        cabinClass,
        alertType,
        targetCashPrice,
        targetMiles,
        isActive: true,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete alert
router.delete('/:id', authMiddleware, (req, res, next) => {
  try {
    const { id } = req.params;

    const result = alertQueries.delete(id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: { message: 'Alert not found', code: 'NOT_FOUND' },
      });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
