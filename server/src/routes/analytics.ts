import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics (Admin only)
router.get('/', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  const products = db.getProducts();
  const orders = db.getOrders();
  const settings = db.getSettings();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'packed').length;
  
  const lowStockThreshold = settings.lowStockThreshold || 15;
  const lowStockItems = products.filter(p => p.stock <= lowStockThreshold);
  const perishableAlerts = products.filter(p => p.isPerishable && p.stock <= lowStockThreshold);

  // Sales by Category
  const categorySalesMap: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod?.category || 'other';
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.pricePerUnit * item.quantity;
    });
  });

  const categoryBreakdown = Object.entries(categorySalesMap).map(([category, revenue]) => ({
    category,
    revenue
  }));

  // Top Selling Sweets
  const sweetSalesCount: Record<string, { name: string; quantity: number; revenue: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!sweetSalesCount[item.productId]) {
        sweetSalesCount[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
      }
      sweetSalesCount[item.productId].quantity += item.quantity;
      sweetSalesCount[item.productId].revenue += item.pricePerUnit * item.quantity;
    });
  });

  const topSweets = Object.values(sweetSalesCount)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  res.json({
    metrics: {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts: products.length,
      lowStockCount: lowStockItems.length,
      perishableAlertsCount: perishableAlerts.length,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    },
    lowStockItems,
    perishableAlerts,
    categoryBreakdown,
    topSweets
  });
});

export default router;
