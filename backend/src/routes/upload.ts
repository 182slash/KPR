import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { cloudinary } from '../config/cloudinary';
import { authGuard } from '../middleware/authGuard';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Store in memory — we pipe to Cloudinary immediately
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  },
});

function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  filename?: string
): Promise<{ secure_url: string; public_id: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `kpr/${folder}`,
        ...(filename ? { public_id: filename } : {}),
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Upload failed'));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
}

// POST /v1/upload/image — single image upload
router.post('/image', authGuard, upload.single('file'), async (req, res) => {
  if (!req.file) throw new AppError('No file provided', 400);

  const folder = (req.body.folder as string) ?? 'gallery';
  const allowedFolders = ['albums', 'members', 'events', 'merch', 'gallery'];
  if (!allowedFolders.includes(folder)) {
    throw new AppError(`Invalid folder. Allowed: ${allowedFolders.join(', ')}`, 400);
  }

  const result = await uploadToCloudinary(req.file.buffer, folder);

  res.status(201).json({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    },
  });
});

// POST /v1/upload/images — multiple images
router.post('/images', authGuard, upload.array('files', 10), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) throw new AppError('No files provided', 400);

  const folder = (req.body.folder as string) ?? 'gallery';

  const results = await Promise.all(
    files.map((file) => uploadToCloudinary(file.buffer, folder))
  );

  res.status(201).json({
    data: results.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      width: r.width,
      height: r.height,
    })),
  });
});

// DELETE /v1/upload/image/:publicId — delete from Cloudinary
router.delete('/image/:publicId(*)', authGuard, async (req, res) => {
  const publicId = req.params.publicId;
  if (!publicId) throw new AppError('Public ID required', 400);

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new AppError('Failed to delete from Cloudinary', 500);
    }
    res.json({ message: 'Image deleted', result: result.result });
  } catch (err: any) {
    throw new AppError(err?.message ?? 'Cloudinary delete failed', 500);
  }
});

export default router;
