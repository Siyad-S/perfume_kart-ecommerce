import { Request, Response, NextFunction } from 'express';
import { uploadSingleImage, uploadMultipleImages } from '../services/file.service';
import { UploadResult } from '../types/upload';
import { responseFormatter } from '@/utils/responseFormatter';

export const uploadImages = async (req: Request<{}, {}, Partial<{
  logo: Express.Multer.File | undefined;
  images: Express.Multer.File[] | undefined;
}>>, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const logoFile = files['logo'] ? files['logo'][0] : null;
    const imageFiles = files['images'] || [];
    const bannerFile = files['banner'] ? files['banner'][0] : null;
    const imageFile = files['image'] ? files['image'][0] : null;

    if (!logoFile && imageFiles.length === 0 && !bannerFile && !imageFile) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const response: {
      logo?: UploadResult;
      images?: UploadResult[];
      banner?: UploadResult;
      image?: UploadResult;
    } = {} as object;

    // Upload logo
    if (logoFile) {
      response.logo = await uploadSingleImage(logoFile, 'logos');
    }

    // Upload images
    if (imageFiles.length > 0) {
      response.images = await uploadMultipleImages(imageFiles, 'product-images');
    }

    // Upload banner
    if (bannerFile) {
      response.banner = await uploadSingleImage(bannerFile, 'banners');
    }

    // Upload image
    if (imageFile) {
      response.image = await uploadSingleImage(imageFile, 'category-image');
    }

    return responseFormatter(res, response, 'Files uploaded successfully', 200);
  } catch (error: any) {
    return responseFormatter(res, error, 'Internal server error', 500);
  }
};

export const sample = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return responseFormatter(res, {}, 'Sample', 200);
  } catch (error: any) {
    return responseFormatter(res, error, 'Internal server error', 500);
  }
}
