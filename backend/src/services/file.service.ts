import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { UploadResult } from '../types/upload';

export const uploadSingleImage = async (
  file: Express.Multer.File,
  folder: string = 'uploads'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadStream.end(file.buffer);
  });
};

export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string = 'uploads'
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
  return Promise.all(uploadPromises);
};