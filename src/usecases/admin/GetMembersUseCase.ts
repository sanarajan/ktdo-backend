import { injectable, inject } from 'tsyringe';
import { IDriverRepository } from '../../domain/repositories/IDriverRepository';
import { UserRole } from '../../common/enums';
import { Driver } from '../../domain/entities/Driver';

@injectable()
export class GetMembersUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository
    ) { }

    async execute(districtAdminId?: string): Promise<Driver[]> {
        // Get all members first
        const allMembers = (await this.driverRepo.findAllByRole(UserRole.MEMBER)) as Driver[];

        // If districtAdminId is provided, filter members by that district admin
        // Otherwise, return all members (for Main Admin)
        if (districtAdminId) {
            return allMembers.filter(
                (driver) => driver.districtAdminId === districtAdminId
            );
        }

        // Return all members for Main Admin
        return allMembers;
    }
}
