import { injectable, inject } from "tsyringe";
import { IDriverRepository } from "../../domain/repositories/IDriverRepository";
import { Driver } from "../../domain/entities/Driver";
import { ApprovalStatus, UserRole } from "../../common/enums";
import { ILogger, IStorageService } from "../../common/interfaces";
import { ImageProcessor } from "../../infrastructure/utils/ImageProcessor";
import { AppError } from "../../domain/errors/AppError";
import path from "path";

@injectable()
export class AddMemberUseCase {
  constructor(
    @inject("IDriverRepository") private driverRepo: IDriverRepository,
    @inject("ILogger") private logger: ILogger,
    @inject("IStorageService") private storageService: IStorageService
  ) {}

  async execute(data: Partial<Driver>, file?: Express.Multer.File): Promise<Driver> {
    // this.logger.info("Admin adding new member", { email: data.email });

    const existingEmail = await this.driverRepo.findByEmail(data.email!);
    if (existingEmail) throw new AppError('Email already exists', 400);

    if (data.phone) {
      const existingPhone = await this.driverRepo.findByPhone(data.phone);
      if (existingPhone) throw new AppError('Phone number already exists', 400);
    }

    let photoUrl = "";
    if (file) {
      try {
        // Validate image
        const validation = await ImageProcessor.fullValidation(file);
        if (!validation.valid) {
          throw new AppError(validation.error || "Image validation failed", 400);
        }

        // Process image: resize, compress, strip metadata
        const filename = ImageProcessor.generateFilename(file.originalname);
        const outputPath = path.join(__dirname, "../../../uploads/temp", filename);

        // Create uploads/temp directory if it doesn't exist
        const fs = require("fs").promises;
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        // Process and save image
        await ImageProcessor.processImage(file.buffer, outputPath);

        // Upload to cloud storage
        photoUrl = await this.storageService.uploadFile(outputPath, "ktdo");

        // Clean up temporary file
        try {
          await fs.unlink(outputPath);
        } catch (error) {
          this.logger.warn("Failed to delete temp image file", { path: outputPath });
        }
      } catch (error: any) {
        this.logger.error("Failed to process/upload driver photo", undefined, { error: error.message });
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError("Image processing failed", 400);
      }
    }

    const driverData: Driver = {
      ...data,
      role: UserRole.MEMBER,
      // If caller set status (e.g., district admin), keep it; otherwise default to PENDING
      status: (data && (data as any).status) || ApprovalStatus.PENDING,
      uniqueId: undefined,
      photoUrl: photoUrl || undefined,
      createdBy: (data as any).createdBy,
      createdById: (data as any).createdById,
    } as Driver;
    const result = (await this.driverRepo.create(driverData)) as Driver;
    return result;
  }
}
