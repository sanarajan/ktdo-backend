import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IDriverRepository } from '../../domain/repositories/IDriverRepository';

@injectable()
export class DeleteDistrictAdminUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('IDriverRepository') private driverRepo: IDriverRepository
    ) { }

    async execute(adminId: string): Promise<boolean> {
        const members = await this.driverRepo.findByDistrictAdminId(adminId);
        if (members && members.length > 0) {
            throw new Error('Cannot delete district admin who has added members');
        }

        if (!this.userRepo.delete) {
            throw new Error('Delete operation not supported by repository');
        }

        return await this.userRepo.delete(adminId);
    }
}
