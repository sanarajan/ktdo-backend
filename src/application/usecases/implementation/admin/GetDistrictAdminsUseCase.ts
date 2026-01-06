import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { IDriverRepository } from '../../../../domain/repositories/IDriverRepository';
import { UserRole } from '../../../../common/enums';
import { User } from '../../../../domain/entities/User';
import { IGetDistrictAdminsUseCase } from '../../interface/admin/IGetDistrictAdminsUseCase';

@injectable()
export class GetDistrictAdminsUseCase implements IGetDistrictAdminsUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('IDriverRepository') private driverRepo: IDriverRepository
    ) { }

    async execute(): Promise<(User & { deletable: boolean })[]> {
        const admins = await this.userRepo.findAllByRole(UserRole.DISTRICT_ADMIN);
        const results: (User & { deletable: boolean })[] = [];

        for (const admin of admins) {
            const adminId = (admin as any).id || (admin as any)._id;
            const members = await this.driverRepo.findByDistrictAdminId(String(adminId));
            const deletable = !members || members.length === 0;
            results.push({ ...admin, deletable });
        }

        return results;
    }
}
