import { injectable } from 'tsyringe';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { IStorageService } from '../../application/services';

@injectable()
export class CloudStorageService implements IStorageService {
  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Cloudinary Config Check:', {
      cloud_name: cloudName ? 'Exists' : 'Missing',
      api_key: apiKey ? 'Exists' : 'Missing',
      api_secret: apiSecret ? 'Exists' : 'Missing',
    });

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadFile(filePath: string, folder: string): Promise<string> {
    try {
      console.log('upload to cloudinary', filePath);
      const result = await cloudinary.uploader.upload(filePath, { folder });
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new Error(`Image upload failed: ${error}`);
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Image delete failed: ${error}`);
    }
  }

  async uploadBuffer(buffer: Buffer, mimeType: string, folder: string): Promise<string> {
    console.log('upload buffer to cloudinary');
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }
          resolve(result.secure_url);
        }
      );

      stream.end(buffer);
    });
  }
}
