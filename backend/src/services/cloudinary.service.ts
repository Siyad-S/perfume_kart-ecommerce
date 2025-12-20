import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });
  }
}

export default new CloudinaryService();