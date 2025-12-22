import { injectable } from 'tsyringe';
import { IDriverRepository } from '../../../domain/repositories/IDriverRepository';
import { Driver } from '../../../domain/entities/Driver';
import { MongoUserRepository } from './MongoUserRepository';
import { UserModel } from '../schemas/UserSchema';
import { UserRole } from '../../../common/enums';

@injectable()
export class MongoDriverRepository extends MongoUserRepository implements IDriverRepository {
    async findByDistrictAdminId(adminId: string): Promise<Driver[]> {
        const drivers = await UserModel.find({ districtAdminId: adminId, role: UserRole.MEMBER });
        return drivers.map(d => d.toObject() as unknown as Driver);
    }

    async updateStatus(driverId: string, status: string): Promise<Driver | null> {
        return (await this.update(driverId, { status } as any)) as Driver | null;
    }

    async assignUniqueId(driverId: string, uniqueId: string): Promise<Driver | null> {
        return (await this.update(driverId, { uniqueId } as any)) as Driver | null;
    }
}
