import { inject, injectable } from 'tsyringe';
import { IDriverRepository } from '../../domain/repositories/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { ILogger } from '../../common/interfaces';

@injectable()
export class RecordPrintIdUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('ILogger') private logger: ILogger
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
