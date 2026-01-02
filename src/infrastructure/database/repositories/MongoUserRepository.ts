import { injectable } from 'tsyringe';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserModel } from '../schemas/UserSchema';

@injectable()
export class MongoUserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email, isDeleted: { $ne: true } });
        if (!user) return null;
        const obj: any = user.toObject();
        obj.id = obj._id ? obj._id.toString() : obj.id;
        if (obj.districtAdminId) obj.districtAdminId = obj.districtAdminId.toString();
        if (obj.createdById) obj.createdById = obj.createdById.toString();
        return obj as User;
    }

    async findByPhone(phone: string): Promise<User | null> {
        const user = await UserModel.findOne({ phone, isDeleted: { $ne: true } });
        if (!user) return null;
        const obj: any = user.toObject();
        obj.id = obj._id ? obj._id.toString() : obj.id;
        if (obj.districtAdminId) obj.districtAdminId = obj.districtAdminId.toString();
        if (obj.createdById) obj.createdById = obj.createdById.toString();
        return obj as User;
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!user) return null;
        const obj: any = user.toObject();
        obj.id = obj._id ? obj._id.toString() : obj.id;
        if (obj.districtAdminId) obj.districtAdminId = obj.districtAdminId.toString();
        if (obj.createdById) obj.createdById = obj.createdById.toString();
        return obj as User;
    }

    async create(user: User): Promise<User> {
        console.log("is here exist for creation")
        const newUser = new UserModel(user);
        const saved = await newUser.save();
        const obj: any = saved.toObject();
        obj.id = obj._id ? obj._id.toString() : obj.id;
        if (obj.districtAdminId) obj.districtAdminId = obj.districtAdminId.toString();
        if (obj.createdById) obj.createdById = obj.createdById.toString();
        return obj as User;
    }

    async update(id: string, user: Partial<User>): Promise<User | null> {
        const updated = await UserModel.findByIdAndUpdate(id, user, { new: true });
        if (!updated) return null;
        const obj: any = updated.toObject();
        obj.id = obj._id ? obj._id.toString() : obj.id;
        if (obj.districtAdminId) obj.districtAdminId = obj.districtAdminId.toString();
        if (obj.createdById) obj.createdById = obj.createdById.toString();
        return obj as User;
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await UserModel.findByIdAndDelete(id);
        return !!deleted;
    }

    async findAll(): Promise<User[]> {
        const users = await UserModel.find({ isDeleted: { $ne: true } });
        return users.map(u => {
            const obj: any = u.toObject();
            obj.id = obj._id ? obj._id.toString() : obj.id;
            if (obj.districtAdminId) obj.districtAdminId = obj.districtAdminId.toString();
            if (obj.createdById) obj.createdById = obj.createdById.toString();
            return obj as User;
        });
    }

    async findAllByRole(role: string): Promise<User[]> {
        const users = await UserModel.find({ role, isDeleted: { $ne: true } });
        return users.map(u => {
            const obj: any = u.toObject();
            obj.id = obj._id ? obj._id.toString() : obj.id;
            if (obj.districtAdminId) obj.districtAdminId = obj.districtAdminId.toString();
            if (obj.createdById) obj.createdById = obj.createdById.toString();
            return obj as User;
        });
    }
}
