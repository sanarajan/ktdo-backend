import { Driver } from '../../../../domain/entities/Driver';

export interface IRecordPrintIdUseCase {
    execute(memberId: string): Promise<Driver>;
}
