import { injectable } from 'tsyringe';
import { IDriverRepository } from '../../../domain/repositories/IDriverRepository';
import { Driver } from '../../../domain/entities/Driver';
import { MongoUserRepository } from './MongoUserRepository';
import { UserModel } from '../schemas/UserSchema';
import { UserRole } from '../../../common/enums';

@injectable()
export class MongoDriverRepository extends MongoUserRepository implements IDriverRepository {
    async findByDistrictAdminId(adminId: string): Promise<Driver[]> {
        const drivers = await UserModel.find({ districtAdminId: adminId, role: UserRole.MEMBER, isDeleted: { $ne: true } });
        return drivers.map(d => d.toObject() as unknown as Driver);
    }

    async findByStateAndDistrict(state: string, district: string): Promise<Driver[]> {
        // Escape special regex characters to prevent errors
        const escapeRegex = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        
        const stateRegex = new RegExp(`^\\s*${escapeRegex(state.trim())}\\s*$`, 'i');
        const districtRegex = new RegExp(`^\\s*${escapeRegex(district.trim())}\\s*$`, 'i');

        const drivers = await UserModel.find({ 
            state: { $regex: stateRegex }, 
            district: { $regex: districtRegex }, 
            role: UserRole.MEMBER, 
            isDeleted: { $ne: true } 
        });
        return drivers.map(d => d.toObject() as unknown as Driver);
    }

    async updateStatus(driverId: string, status: string): Promise<Driver | null> {
        return (await this.update(driverId, { status } as any)) as Driver | null;
    }

    async assignUniqueId(driverId: string, uniqueId: string): Promise<Driver | null> {
        return (await this.update(driverId, { uniqueId } as any)) as Driver | null;
    }

    async getNextUniqueId(): Promise<string> {
        // Find highest numeric uniqueId and increment; start from 1000 if none
        const last = await UserModel.findOne({ uniqueId: { $exists: true }, isDeleted: { $ne: true } })
            .sort({ uniqueId: -1 })
            .select('uniqueId')
            .lean();

        const lastNumber = last?.uniqueId ? parseInt(String((last as any).uniqueId), 10) : 999;
        const next = Number.isFinite(lastNumber) ? lastNumber + 1 : 1000;
        return String(next);
    }
}

