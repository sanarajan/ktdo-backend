import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { AppError } from '../../domain/errors/AppError';

/**
 * Image validation and processing utility for passport photos
 * Requirements:
 * - Accepted formats: JPG, JPEG, PNG
 * - Size: 30 KB - 300 KB
 * - Output: 413×531 pixels (passport ratio)
 * - Format: JPEG with quality 80
 * - Metadata: EXIF stripped
 */

interface ValidationResult {
  valid: boolean;
  error?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export class ImageProcessor {
  // Allowed MIME types
  private static readonly ALLOWED_MIMETYPES = ['image/jpeg', 'image/png'];

  // Allowed file extensions
  private static readonly ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

  // File size limits (in bytes)
  private static readonly MIN_FILE_SIZE = 30 * 1024; // 30 KB
  private static readonly MAX_FILE_SIZE = 300 * 1024; // 300 KB

  // Passport photo dimensions
  private static readonly PASSPORT_WIDTH = 413;
  private static readonly PASSPORT_HEIGHT = 531;

  // Acceptable aspect ratio range for passport photos (portrait)
  // Passport ratio is 413:531 = 0.778
  private static readonly MIN_ASPECT_RATIO = 0.7; // Allow some flexibility
  private static readonly MAX_ASPECT_RATIO = 0.85;

  /**
   * Validate image file before processing
   */
  static validateFile(file: Express.Multer.File): ValidationResult {
    // Check if file exists
    if (!file) {
      return {
        valid: false,
        error: 'No file provided'
      };
    }

    // Check file size
    if (file.size < this.MIN_FILE_SIZE) {
      return {
        valid: false,
        error: `Image too small. Minimum size: ${this.MIN_FILE_SIZE / 1024} KB`
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Image too large. Maximum size: ${this.MAX_FILE_SIZE / 1024} KB`
      };
    }

    // Check MIME type
    if (!this.ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return {
        valid: false,
        error: `Invalid image format. Only JPG, JPEG, and PNG are allowed`
      };
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        error: `Invalid file extension. Only .jpg, .jpeg, and .png are allowed`
      };
    }

    return { valid: true };
  }

  /**
   * Get image dimensions from buffer
   */
  static async getImageDimensions(buffer: Buffer): Promise<ImageDimensions> {
    try {
      const metadata = await sharp(buffer).metadata();
      if (!metadata.width || !metadata.height) {
        throw new AppError('Unable to determine image dimensions', 400);
      }
      return {
        width: metadata.width,
        height: metadata.height
      };
    } catch (error) {
      throw new AppError('Failed to read image dimensions', 400);
    }
  }

  /**
   * Validate image dimensions for passport photo
   */
  static validateDimensions(dimensions: ImageDimensions): ValidationResult {
    const { width, height } = dimensions;

    // Check if image is in portrait orientation
    if (width > height) {
      return {
        valid: false,
        error: 'Image must be in portrait orientation (height > width)'
      };
    }

    // Calculate aspect ratio
    const aspectRatio = width / height;

    // Check if aspect ratio is within acceptable range for passport
    if (aspectRatio < this.MIN_ASPECT_RATIO || aspectRatio > this.MAX_ASPECT_RATIO) {
      return {
        valid: false,
        error: `Image aspect ratio not suitable for passport photo. Expected ratio between ${this.MIN_ASPECT_RATIO} and ${this.MAX_ASPECT_RATIO}`
      };
    }

    return { valid: true };
  }

  /**
   * Process image: resize, compress, and remove metadata
   * Converts to JPEG with quality 80 at 413×531 dimensions
   */
  static async processImage(buffer: Buffer, outputPath: string): Promise<Buffer> {
    try {
      const processedBuffer = await sharp(buffer)
        .resize(this.PASSPORT_WIDTH, this.PASSPORT_HEIGHT, {
          fit: 'cover', // Ensures the image covers the entire dimensions
          position: 'center' // Centers the crop
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Save to file
      await fs.writeFile(outputPath, processedBuffer);

      return processedBuffer;
    } catch (error) {
      throw new AppError('Failed to process image', 500);
    }
  }

  /**
   * Complete validation pipeline: file validation + dimension validation
   */
  static async fullValidation(file: Express.Multer.File): Promise<ValidationResult> {
    // Step 1: Validate file properties
    const fileValidation = this.validateFile(file);
    if (!fileValidation.valid) {
      return fileValidation;
    }

    // Step 2: Get image dimensions
    let dimensions: ImageDimensions;
    try {
      dimensions = await this.getImageDimensions(file.buffer);
    } catch (error) {
      return {
        valid: false,
        error: 'Unable to validate image dimensions'
      };
    }

    // Step 3: Validate dimensions
    const dimensionValidation = this.validateDimensions(dimensions);
    if (!dimensionValidation.valid) {
      return dimensionValidation;
    }

    return { valid: true };
  }

  /**
   * Generate a unique filename for the processed image
   */
  static generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalName);
    return `passport_${timestamp}_${randomStr}.jpg`;
  }
}
