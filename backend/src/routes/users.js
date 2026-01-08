import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { userQueries, walletQueries, searchQueries } from '../db/queries.js';
import { authMiddleware, generateToken } from '../middleware/auth.js';

const router = Router();

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required', code: 'VALIDATION_ERROR' },
      });
    }

    // Check if email already exists
    const existingUser = userQueries.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: { message: 'Email already registered', code: 'EMAIL_EXISTS' },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    // Create user
    const userId = uuidv4();
    userQueries.create({
      id: userId,
      email,
      passwordHash,
      verificationToken,
    });

    // TODO: Send verification email via Resend

    // Generate token
    const token = generateToken(userId);

    res.status(201).json({
      user: {
        id: userId,
        email,
        subscriptionTier: 'free',
        emailVerified: false,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required', code: 'VALIDATION_ERROR' },
      });
    }

    const user = userQueries.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({
        error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      });
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        subscriptionTier: user.subscription_tier,
        subscriptionExpiresAt: user.subscription_expires_at,
        emailVerified: !!user.email_verified,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  const wallets = walletQueries.getByUser(req.user.id);

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      subscriptionTier: req.user.subscription_tier,
      subscriptionExpiresAt: req.user.subscription_expires_at,
      emailVerified: !!req.user.email_verified,
    },
    pointsWallets: wallets.map(w => ({
      program: w.program,
      balance: w.balance,
      updatedAt: w.updated_at,
    })),
  });
});

// Update points wallet
router.put('/wallet', authMiddleware, (req, res, next) => {
  try {
    const { program, balance } = req.body;

    if (!program || balance === undefined) {
      return res.status(400).json({
        error: { message: 'Program and balance are required', code: 'VALIDATION_ERROR' },
      });
    }

    const validPrograms = ['chase_ur', 'amex_mr', 'capital_one', 'citi_ty'];
    if (!validPrograms.includes(program)) {
      return res.status(400).json({
        error: { message: 'Invalid program', code: 'VALIDATION_ERROR' },
      });
    }

    walletQueries.upsert(req.user.id, program, balance);

    const wallets = walletQueries.getByUser(req.user.id);

    res.json({
      pointsWallets: wallets.map(w => ({
        program: w.program,
        balance: w.balance,
        updatedAt: w.updated_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Get search history
router.get('/searches', authMiddleware, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const searches = searchQueries.getByUser(req.user.id, limit);

  res.json({
    searches: searches.map(s => ({
      id: s.id,
      origin: s.origin,
      destination: s.destination,
      departureDate: s.departure_date,
      returnDate: s.return_date,
      cabinClass: s.cabin_class,
      passengers: s.passengers,
      paymentType: s.payment_type,
      createdAt: s.created_at,
    })),
  });
});

// Verify email
router.post('/verify-email', (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: { message: 'Verification token is required', code: 'VALIDATION_ERROR' },
      });
    }

    const result = userQueries.verifyEmail(token);

    if (result.changes === 0) {
      return res.status(400).json({
        error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' },
      });
    }

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
