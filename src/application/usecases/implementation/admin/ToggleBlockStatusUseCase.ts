import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { ILoggerService } from '../../../../application/services';
import { User } from '../../../../domain/entities/User';
import { IToggleBlockStatusUseCase } from '../../interface/admin/IToggleBlockStatusUseCase';

@injectable()
export class ToggleBlockStatusUseCase implements IToggleBlockStatusUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('ILoggerService') private logger: ILoggerService
    ) { }

    async execute(userId: string): Promise<User | null> {
        this.logger.info('Toggling block status', { userId });

        const user = await this.userRepo.findById(userId);
        if (!user) throw new Error('User not found');

        const newStatus = !user.isBlocked;
        const updated = await this.userRepo.update(userId, { isBlocked: newStatus });

        this.logger.info('Block status updated', { userId, newStatus });
        return updated;
    }
}
