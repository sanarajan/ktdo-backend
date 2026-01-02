import { inject, injectable } from 'tsyringe';
import { IDriverRepository } from '../../domain/repositories/IDriverRepository';
import { ILogger } from '../../common/interfaces';
import { Driver } from '../../domain/entities/Driver';

interface DeleteResult {
    softDeleted: boolean;
}

@injectable()
export class DeleteMemberUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('ILogger') private logger: ILogger
    ) {}

    async execute(memberId: string): Promise<DeleteResult> {
        const member = await this.driverRepo.findById(memberId) as Driver | null;
        if (!member) {
            throw new Error('Member not found');
        }

        const hasPrinted = !!member.printCount && member.printCount > 0;

        if (hasPrinted) {
            // Soft delete to preserve audit after printing
            await this.driverRepo.update(memberId, {
                isDeleted: true,
                deletedAt: new Date()
            } as Partial<Driver>);
            this.logger.info('Soft deleted member after print', { memberId });
            return { softDeleted: true };
        }

        if (!this.driverRepo.delete) {
            throw new Error('Delete operation not supported by repository');
        }

        const deleted = await this.driverRepo.delete(memberId);
        if (!deleted) {
            throw new Error('Failed to delete member');
        }

        this.logger.info('Permanently deleted member', { memberId });
        return { softDeleted: false };
    }
}
