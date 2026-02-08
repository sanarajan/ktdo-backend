import { injectable, inject } from 'tsyringe';
import { IDriverRepository } from '../../../../domain/repositories/IDriverRepository';
import { Driver } from '../../../../domain/entities/Driver';
import { ApprovalStatus, UserRole } from '../../../../common/enums';
import { ILoggerService, IStorageService, IHashService } from '../../../../application/services';
import { ImageProcessor } from '../../../../infrastructure/utils/ImageProcessor';
import { AppError } from '../../../../domain/errors/AppError';
import path from 'path';
import { IRegisterDriverUseCase } from '../../interface/auth/IRegisterDriverUseCase';

@injectable()
export class RegisterDriverUseCase implements IRegisterDriverUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('ILoggerService') private logger: ILoggerService,
        @inject('IStorageService') private storageService: IStorageService,
        @inject('IHashService') private hashService: IHashService,
        @inject('IEmailService') private emailService: any
    ) { }

    private validateRegistrationData(data: Partial<Driver>): Partial<Driver> {
        const errors: string[] = [];
        const trimmedName = data.name?.trim();
        const trimmedEmail = data.email?.trim();
        const trimmedPhone = data.phone?.trim();
        const trimmedHouse = data.houseName?.trim();
        const trimmedPlace = data.place?.trim();
        const trimmedWorkingState = data.workingState?.trim();
        const trimmedWorkingDistrict = data.workingDistrict?.trim();
        const trimmedPermanentState = (data as any).state?.trim();
        const trimmedPermanentDistrict = (data as any).district?.trim();
        const trimmedPin = (data as any).pin?.trim();
        const trimmedRto = (data as any).rtoCode?.trim();
        const trimmedStateCode = (data as any).stateCode?.trim();
        const trimmedStateRto = (data as any).stateRtoCode?.trim();
        const trimmedLicenceNumber = (data as any).licenceNumber?.trim();

        const nameRegex = /^[A-Za-z][A-Za-z\s'.-]{1,49}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const pinRegex = /^\d{6}$/;
        const rtoRegex = /^\d{1,2}$/;

        if (!trimmedName) errors.push('Name is required');
        else if (!nameRegex.test(trimmedName)) errors.push('Name must contain only letters and spaces (2-50 chars)');

        if (!trimmedEmail) errors.push('Email is required');
        else if (!emailRegex.test(trimmedEmail)) errors.push('Invalid email format');

        if (!trimmedPhone) errors.push('Phone number is required');
        else if (!phoneRegex.test(trimmedPhone)) errors.push('Phone number must be exactly 10 digits');

        if (!trimmedLicenceNumber) errors.push('Licence number is required');
        else if (trimmedLicenceNumber.length < 5 || trimmedLicenceNumber.length > 20) errors.push('Licence number must be between 5 and 20 characters');
        console.log("pass validation");
        if (!data.bloodGroup) errors.push('Blood group is required');
        if (!trimmedWorkingState) errors.push('Working State is required');
        if (!trimmedWorkingDistrict) errors.push('Working District is required');
        if (!trimmedPermanentState) errors.push('State (for Address) is required');
        if (!trimmedPermanentDistrict) errors.push('District (for Address) is required');
        if (!trimmedHouse) errors.push('House name is required');
        if (!trimmedPlace) errors.push('Place is required');
        if (!trimmedPin) errors.push('Pin code is required');
        else if (!pinRegex.test(trimmedPin)) errors.push('Pin code must be exactly 6 digits');
        if (!trimmedRto) errors.push('RTO code is required');
        else if (!rtoRegex.test(trimmedRto)) errors.push('RTO code must be numeric (1-2 digits)');

        if (errors.length) {
            throw new AppError(errors.join('; '), 400);
        }

        return {
            ...data,
            name: trimmedName!,
            email: trimmedEmail!.toLowerCase(),
            phone: trimmedPhone!,
            houseName: trimmedHouse!,
            place: trimmedPlace!,
            workingState: trimmedWorkingState!,
            workingDistrict: trimmedWorkingDistrict!,
            state: trimmedPermanentState!,
            district: trimmedPermanentDistrict!,
            pin: trimmedPin,
            bloodGroup: data.bloodGroup,
            licenceNumber: trimmedLicenceNumber,
            stateCode: trimmedStateCode,
            rtoCode: trimmedRto,
            stateRtoCode: trimmedStateRto
        };
    }

    async execute(data: Partial<Driver>, file?: Express.Multer.File): Promise<Driver> {
        // console.log('RegisterDriverUseCase - Received data:', { ...data, password: '***' });
        // console.log('RegisterDriverUseCase - licenceNumber received:', (data as any).licenceNumber);
        const sanitizedData = this.validateRegistrationData(data);
        // console.log('RegisterDriverUseCase - Sanitized data:', { ...sanitizedData, password: '***' });
        // console.log('RegisterDriverUseCase - licenceNumber after validation:', (sanitizedData as any).licenceNumber);
        this.logger.info('Registering new driver', { email: sanitizedData.email });

        const existingEmail = await this.driverRepo.findByEmail(sanitizedData.email!);
        if (existingEmail) throw new AppError('Email already exists', 400);

        const existingPhone = await this.driverRepo.findByPhone(sanitizedData.phone!);
        if (existingPhone) throw new AppError('Phone number already exists', 400);

        let photoUrl = '';

        if (file) {
            try {
                // Validate image
                const validation = await ImageProcessor.fullValidation(file);
                if (!validation.valid) {
                    throw new AppError(validation.error || 'Image validation failed', 400);
                }

                // Process image: resize, compress, strip metadata
                const filename = ImageProcessor.generateFilename(file.originalname);
                const outputPath = path.join(__dirname, '../../../../uploads/temp', filename);

                // Create uploads/temp directory if it doesn't exist
                const fs = require('fs').promises;
                await fs.mkdir(path.dirname(outputPath), { recursive: true });

                // Process and save image
                const processedBuffer = await ImageProcessor.processImage(file.buffer, outputPath);

                // Upload to cloud storage
                photoUrl = await this.storageService.uploadFile(outputPath, 'drivers');

                // Clean up temporary file
                try {
                    await fs.unlink(outputPath);
                } catch (error) {
                    this.logger.warn('Failed to delete temp image file', { path: outputPath });
                }
            } catch (error: any) {
                this.logger.error('Failed to process/upload driver photo', undefined, { error: error.message });
                if (error instanceof AppError) {
                    throw error;
                }
                throw new AppError('Image processing failed', 400);
            }
        }

        let passwordHash: string | undefined = undefined;
        if (sanitizedData.password) {
            passwordHash = await this.hashService.hash(sanitizedData.password);
        }

        const driverData: Driver = {
            ...sanitizedData,
            // Only set password when provided (optional for member registration)
            ...(passwordHash ? { password: passwordHash } : {}),
            role: UserRole.MEMBER,
            status: ApprovalStatus.PENDING, // User registration awaits approval
            photoUrl: photoUrl || undefined
            // uniqueId will be assigned when admin approves
        } as Driver;
        // console.log('RegisterDriverUseCase - Final driverData before save:', { ...driverData, password: '***' });
        console.log('RegisterDriverUseCase - licenceNumber in driverData:', (driverData as any).licenceNumber);

        const result = (await this.driverRepo.create(driverData)) as Driver;
        // this.logger.info('Driver registered successfully', { id: result.id });

        // Send registration pending approval email (non-blocking)
        try {
            await this.emailService.sendRegistrationPendingEmail(sanitizedData.email!, sanitizedData.name!);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            // this.logger.warn('Failed to send registration pending email', message);
            // Don't throw - email failure shouldn't prevent registration
        }

        return result;
    }
}
