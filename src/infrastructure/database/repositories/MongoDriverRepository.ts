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

    async findByStateAndDistrict(workingState: string, workingDistrict: string): Promise<Driver[]> {
        // Escape special regex characters to prevent errors
        const escapeRegex = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

        const stateRegex = new RegExp(`^\\s*${escapeRegex(workingState.trim())}\\s*$`, 'i');
        const districtRegex = new RegExp(`^\\s*${escapeRegex(workingDistrict.trim())}\\s*$`, 'i');

        const drivers = await UserModel.find({
            workingState: { $regex: stateRegex },
            workingDistrict: { $regex: districtRegex },
            role: UserRole.MEMBER,
            isDeleted: { $ne: true }
        });
        return drivers.map(d => {
            const obj: any = d.toObject();
            obj.id = obj._id ? obj._id.toString() : obj.id;
            if (obj.districtAdminId) obj.districtAdminId = obj.districtAdminId.toString();
            if (obj.createdById) obj.createdById = obj.createdById.toString();
            return obj as Driver;
        });
    }

    async updateStatus(driverId: string, status: string): Promise<Driver | null> {
        return (await this.update(driverId, { status } as any)) as Driver | null;
    }

    async assignUniqueId(driverId: string, uniqueId: string): Promise<Driver | null> {
        return (await this.update(driverId, { uniqueId } as any)) as Driver | null;
    }

    async getNextUniqueId(): Promise<string> {
        // Find highest numeric uniqueId and increment; start from 1001 if none (including deleted members)
        const last = await UserModel.findOne({ uniqueId: { $exists: true } })
            .sort({ uniqueId: -1 })
            .select('uniqueId')
            .lean();

        const lastNumber = last?.uniqueId ? parseInt(String((last as any).uniqueId), 10) : 1000;
        const next = Number.isFinite(lastNumber) ? lastNumber + 1 : 1001;
        return String(next);
    }
}

