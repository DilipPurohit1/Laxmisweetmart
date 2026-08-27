import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target both server and root frontend public/products directories
const SERVER_UPLOAD_DIR = path.resolve(__dirname, '..', '..', 'public', 'products');
const CLIENT_UPLOAD_DIR = path.resolve(__dirname, '..', '..', '..', 'public', 'products');

if (!fs.existsSync(SERVER_UPLOAD_DIR)) {
  fs.mkdirSync(SERVER_UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(CLIENT_UPLOAD_DIR)) {
  fs.mkdirSync(CLIENT_UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, SERVER_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, 'sweet-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are supported'));
    }
  }
});

const router = Router();

// POST /api/upload (Admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded' });
    return;
  }

  // Copy uploaded file to client public directory so Vite can serve it immediately
  const sourcePath = path.join(SERVER_UPLOAD_DIR, req.file.filename);
  const destPath = path.join(CLIENT_UPLOAD_DIR, req.file.filename);

  try {
    fs.copyFileSync(sourcePath, destPath);
  } catch (err) {
    console.warn('Could not copy to client directory:', err);
  }

  const fileUrl = `/products/${req.file.filename}`;
  res.status(201).json({
    url: fileUrl,
    filename: req.file.filename,
    message: 'Shop photo uploaded successfully'
  });
});

export default router;
