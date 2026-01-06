import { inject, injectable } from 'tsyringe';
import { IDriverRepository } from '../../../../domain/repositories/IDriverRepository';
import { ILoggerService } from '../../../../application/services';
import { Driver } from '../../../../domain/entities/Driver';
import { IRecordPrintIdUseCase } from '../../interface/admin/IRecordPrintIdUseCase';

@injectable()
export class RecordPrintIdUseCase implements IRecordPrintIdUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('ILoggerService') private logger: ILoggerService
    ) {}

    async execute(memberId: string): Promise<Driver> {
        const member = await this.driverRepo.findById(memberId);
        if (!member) {
            throw new Error('Member not found');
        }

        const currentCount = (member as any).printCount || 0;
        const updated = await this.driverRepo.update(memberId, {
            printCount: currentCount + 1
        } as Partial<Driver>);

        if (!updated) {
            throw new Error('Failed to update print count');
        }

        this.logger.info('Print count updated', { memberId, newCount: currentCount + 1 });
        return updated as Driver;
    }
}
