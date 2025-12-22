import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { ILogger } from '../../common/interfaces';

@injectable()
export class ToggleBlockStatusUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('ILogger') private logger: ILogger
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
