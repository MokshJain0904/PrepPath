import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { registerSchema, loginSchema, updateUserSchema } from '../schemas/authSchemas.js';
import { validateBody } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function createToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

function setTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// POST /api/auth/register
router.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, targetRole, experienceLevel, dailyCommitmentHours } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      targetRole: targetRole || '',
      experienceLevel: experienceLevel || '',
      dailyCommitmentHours: dailyCommitmentHours || 3,
    });

    const token = createToken(user._id);
    setTokenCookie(res, token);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
      dailyCommitmentHours: user.dailyCommitmentHours,
    };

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      data: { user: userData, token },
      user: userData,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = createToken(user._id);
    setTokenCookie(res, token);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
      dailyCommitmentHours: user.dailyCommitmentHours,
    };

    return res.json({
      success: true,
      message: 'Welcome back!',
      token,
      data: { user: userData, token },
      user: userData,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  });
  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const userData = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    targetRole: req.user.targetRole,
    experienceLevel: req.user.experienceLevel,
    dailyCommitmentHours: req.user.dailyCommitmentHours,
    createdAt: req.user.createdAt,
  };

  return res.json({
    success: true,
    data: { user: userData },
    user: userData,
  });
});

// PATCH /api/auth/me
router.patch('/me', requireAuth, validateBody(updateUserSchema), async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select('-passwordHash');

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
      user,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
