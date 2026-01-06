import { inject, injectable } from 'tsyringe';
import { IDriverRepository } from '../../../../domain/repositories/IDriverRepository';
import { ILoggerService } from '../../../../application/services';
import { Driver } from '../../../../domain/entities/Driver';
import { DeleteResult, IDeleteMemberUseCase } from '../../interface/admin/IDeleteMemberUseCase';

@injectable()
export class DeleteMemberUseCase implements IDeleteMemberUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('ILoggerService') private logger: ILoggerService
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
