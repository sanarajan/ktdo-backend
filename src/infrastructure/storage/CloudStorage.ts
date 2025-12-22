import { injectable } from 'tsyringe';
import { v2 as cloudinary } from 'cloudinary';
import { IStorageService } from '../../common/interfaces';

@injectable()
export class CloudStorageService implements IStorageService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    async uploadFile(filePath: string, folder: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(filePath, { folder });
            return result.secure_url;
        } catch (error) {
            throw new Error(`Image upload failed: ${error}`);
        }
    }

    async deleteFile(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            throw new Error(`Image delete failed: ${error}`);
        }
    }
}
