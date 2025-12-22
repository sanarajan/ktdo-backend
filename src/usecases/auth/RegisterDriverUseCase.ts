import { injectable, inject } from 'tsyringe';
import { IDriverRepository } from '../../domain/repositories/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { ApprovalStatus, UserRole } from '../../common/enums';
import { ILogger, IStorageService } from '../../common/interfaces';
import bcrypt from 'bcrypt';

@injectable()
export class RegisterDriverUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('ILogger') private logger: ILogger,
        @inject('IStorageService') private storageService: IStorageService
    ) { }

    async execute(data: Partial<Driver>, filePath?: string): Promise<Driver> {
        this.logger.info('Registering new driver', { email: data.email });

        const existing = await this.driverRepo.findByEmail(data.email!);
        if (existing) throw new Error('Email already exists');

        let photoUrl = '';
        if (filePath) {
            try {
                photoUrl = await this.storageService.uploadFile(filePath, 'drivers');
            } catch (error) {
                this.logger.error('Failed to upload driver photo', undefined, { error });
                // Proceed without photo or throw? Let's proceed but warn.
            }
        }

        const hashedPassword = await bcrypt.hash(data.password!, 10);

        const driverData: Driver = {
            ...data,
            password: hashedPassword,
            role: UserRole.MEMBER,
            status: ApprovalStatus.APPROVED, // Auto-approve
            uniqueId: `DRV-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Auto-generate ID
            photoUrl: photoUrl || undefined
        } as Driver;

        const result = (await this.driverRepo.create(driverData)) as Driver;
        this.logger.info('Driver registered successfully', { id: result.id });
        return result;
    }
}
