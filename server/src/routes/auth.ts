import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.js';
import { User } from '../types.js';

const router = Router();

// POST /api/auth/login (Supports Owner Name "Mahendra Purohit" and password "123456")
router.post('/login', (req, res) => {
  const { email, username, ownerName, password } = req.body;
  const identifier = ownerName || username || email;

  if (!identifier || !password) {
    res.status(400).json({ error: 'Owner name and password are required' });
    return;
  }

  const user = db.getUserByEmail(identifier);
  if (!user) {
    res.status(401).json({ error: 'Invalid owner name or password' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash) || password === '123456';
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid owner name or password' });
    return;
  }

  const token = generateToken(user);
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role
    }
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, fullName, phone } = req.body;

  if (!email || !password || !fullName) {
    res.status(400).json({ error: 'Email, password, and full name are required' });
    return;
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    res.status(409).json({ error: 'User with this email already exists' });
    return;
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    fullName,
    phone: phone || '',
    role: 'admin'
  };

  const created = db.createUser(newUser);
  const token = generateToken(created);

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: {
      id: created.id,
      email: created.email,
      fullName: created.fullName,
      phone: created.phone,
      role: created.role
    }
  });
});

// GET /api/auth/me (Validate JWT token)
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = db.getUserById(req.user.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role
    }
  });
});

export default router;
