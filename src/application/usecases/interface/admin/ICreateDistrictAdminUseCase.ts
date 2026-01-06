import { DistrictAdmin } from '../../../../domain/entities/DistrictAdmin';

export interface ICreateDistrictAdminUseCase {
    execute(data: Partial<DistrictAdmin>, file?: Express.Multer.File): Promise<DistrictAdmin>;
}
