import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { Order, OrderStatus } from '../types.js';
import Stripe from 'stripe';

const router = Router();
const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_shrilaxmi_1985';
const stripe = new Stripe(stripeSecret, { apiVersion: '2025-02-24.acacia' as any });

// POST /api/orders (Create Order)
router.post('/', (req: Request, res: Response) => {
  const { customer, items, paymentMethod, paymentStatus } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Customer and items are required' });
    return;
  }

  const subtotal = items.reduce((sum: number, it: any) => sum + it.pricePerUnit * it.quantity, 0);
  const settings = db.getSettings();
  const isFree = subtotal >= (settings.lowStockThreshold ? 499 : 499) || customer.deliveryType === 'pickup';
  const deliveryFee = isFree ? 0 : 50;
  const total = subtotal + deliveryFee;

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `SLSM-1985-${randomSuffix}`,
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: paymentMethod || 'stripe_card',
    paymentStatus: paymentStatus || 'paid',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createOrder(newOrder);
  res.status(201).json(newOrder);
});

// POST /api/orders/create-checkout-session (Stripe Test Mode)
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { items, customer, successUrl, cancelUrl } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Cart items required' });
      return;
    }

    const subtotal = items.reduce((sum: number, it: any) => sum + it.pricePerUnit * it.quantity, 0);
    const deliveryFee = customer?.deliveryType === 'pickup' || subtotal >= 499 ? 0 : 50;
    const total = subtotal + deliveryFee;

    // Generate mock/test session ID for test-mode checkout
    const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.json({
      sessionId: mockSessionId,
      total,
      currency: 'inr',
      status: 'success'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create checkout session' });
  }
});

// GET /api/orders (Admin)
router.get('/', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { status } = req.query;
  let orders = db.getOrders();

  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }

  res.json(orders);
});

// GET /api/orders/:id (Public tracking)
router.get('/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

// PATCH /api/orders/:id/status (Admin)
router.patch('/:id/status', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }

  const updated = db.updateOrderStatus(req.params.id, status as OrderStatus);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(updated);
});

export default router;
