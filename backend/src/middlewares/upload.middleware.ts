import { Request } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Error: Images only (jpeg, jpg, png)!'));
  },
});

// Configure middleware to handle one 'logo' and up to 5 'images'
export const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 }, // Single logo file
  { name: 'images', maxCount: 5 }, // Up to 5 images
  { name: 'banner', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

export default uploadFields;