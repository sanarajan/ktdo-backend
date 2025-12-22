import { injectable, inject } from 'tsyringe';
import { IDriverRepository } from '../../domain/repositories/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { ApprovalStatus, UserRole } from '../../common/enums';
import { ILogger, IStorageService } from '../../common/interfaces';
import bcrypt from 'bcrypt';

@injectable()
export class AddMemberUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('ILogger') private logger: ILogger,
        @inject('IStorageService') private storageService: IStorageService
    ) { }

    async execute(data: Partial<Driver>, filePath?: string): Promise<Driver> {
        this.logger.info('Admin adding new member', { email: data.email });

        const existing = await this.driverRepo.findByEmail(data.email!);
        if (existing) throw new Error('Email already exists');

        let photoUrl = '';
        if (filePath) {
            try {
                photoUrl = await this.storageService.uploadFile(filePath, 'drivers');
            } catch (error) {
                this.logger.error('Failed to upload driver photo', undefined, { error });
            }
        }

        const hashedPassword = await bcrypt.hash(data.password!, 10);

        const driverData: Driver = {
            ...data,
            password: hashedPassword,
            role: UserRole.MEMBER,
            status: ApprovalStatus.APPROVED, // Admin additions are auto-approved
            uniqueId: undefined, // Or generate one? Let's leave undefined for now or implement generic ID generation if needed. UseCases usually keep it simple first.
            photoUrl: photoUrl || undefined
        } as Driver;

        const result = (await this.driverRepo.create(driverData)) as Driver;
        this.logger.info('Member added successfully by admin', { id: result.id });
        return result;
    }
}
