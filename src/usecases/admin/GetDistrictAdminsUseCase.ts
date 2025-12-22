import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserRole } from '../../common/enums';
import { User } from '../../domain/entities/User';

@injectable()
export class GetDistrictAdminsUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository
    ) { }

    async execute(): Promise<User[]> {
        return this.userRepo.findAllByRole(UserRole.DISTRICT_ADMIN);
    }
}
