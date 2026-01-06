import { Driver } from '../../../../domain/entities/Driver';

export interface IAddMemberUseCase {
    execute(data: Partial<Driver>, file?: Express.Multer.File): Promise<Driver>;
}
