import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { DistrictAdmin } from '../../domain/entities/DistrictAdmin';
import { UserRole } from '../../common/enums';
import { ILogger, IStorageService } from '../../common/interfaces';
import bcrypt from 'bcrypt';

@injectable()
export class CreateDistrictAdminUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('ILogger') private logger: ILogger,
        @inject('IStorageService') private storageService: IStorageService
    ) { }

    async execute(data: Partial<DistrictAdmin>, filePath?: string): Promise<DistrictAdmin> {
        this.logger.info('Creating District Admin', { email: data.email });

        const existing = await this.userRepo.findByEmail(data.email!);
        if (existing) throw new Error('Email already exists');

        let photoUrl = '';
        if (filePath) {
            try {
                photoUrl = await this.storageService.uploadFile(filePath, 'district_admins');
            } catch (error) {
                this.logger.error('Failed to upload admin photo', undefined, { error });
            }
        }

        const hashedPassword = await bcrypt.hash(data.password!, 10);

        const adminData: DistrictAdmin = {
            ...data,
            password: hashedPassword,
            role: UserRole.DISTRICT_ADMIN,
            photoUrl: photoUrl || undefined
        } as DistrictAdmin;

        const result = (await this.userRepo.create(adminData)) as DistrictAdmin;
        this.logger.info('District Admin created', { id: result.id });
        return result;
    }
}
