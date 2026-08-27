import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { Product } from '../types.js';

const router = Router();

// GET /api/products (Public - Visible products only)
router.get('/', (req: Request, res: Response) => {
  const { category, search, festive } = req.query;
  let products = db.getProducts(false); // Only visible

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }

  if (festive === 'true') {
    products = products.filter(p => p.isFestiveSpecial);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json(products);
});

// GET /api/products/admin-all (Admin - Includes hidden products)
router.get('/admin-all', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  const products = db.getProducts(true);
  res.json(products);
});

// GET /api/products/:id (Public)
router.get('/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// POST /api/products (Admin)
router.post('/', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const {
    name,
    hindiName,
    description,
    category,
    unit,
    indicativePrice,
    images,
    allergens,
    isFestiveSpecial,
    isPerishable,
    isVisible,
    model3DType
  } = req.body;

  if (!name || !category || indicativePrice === undefined) {
    res.status(400).json({ error: 'Name, category, and indicativePrice are required' });
    return;
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name,
    hindiName: hindiName || '',
    description: description || 'Freshly prepared at Shri Laxmi Sweet Mart Mapusa.',
    category,
    unit: unit || 'kg',
    indicativePrice: Number(indicativePrice),
    images: Array.isArray(images) && images.length ? images : ['/products/placeholder.jpg'],
    allergens: allergens || ['milk'],
    isFestiveSpecial: !!isFestiveSpecial,
    isPerishable: !!isPerishable,
    isVisible: isVisible !== undefined ? !!isVisible : true,
    isPlaceholderSample: false,
    model3DType: model3DType || 'peda',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createProduct(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id (Admin)
router.put('/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ message: 'Product deleted successfully' });
});

// PATCH /api/products/:id/visibility (Admin)
router.patch('/:id/visibility', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { isVisible } = req.body;
  const updated = db.toggleVisibility(req.params.id, !!isVisible);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

// PATCH /api/products/:id/festive (Admin)
router.patch('/:id/festive', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { isFestiveSpecial } = req.body;
  const updated = db.toggleFestive(req.params.id, !!isFestiveSpecial);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

export default router;
