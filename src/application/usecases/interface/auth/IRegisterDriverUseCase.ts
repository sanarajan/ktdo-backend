import { Driver } from '../../../../domain/entities/Driver';

export interface IRegisterDriverUseCase {
    execute(data: Partial<Driver>, file?: Express.Multer.File): Promise<Driver>;
}
