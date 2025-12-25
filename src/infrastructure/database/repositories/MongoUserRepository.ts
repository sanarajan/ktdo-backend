import { injectable } from 'tsyringe';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserModel } from '../schemas/UserSchema';

@injectable()
export class MongoUserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        return user ? user.toObject() as unknown as User : null;
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        return user ? user.toObject() as unknown as User : null;
    }

    async create(user: User): Promise<User> {
        console.log("is here exist for creation")
        const newUser = new UserModel(user);
        const saved = await newUser.save();
        return saved.toObject() as unknown as User;
    }

    async update(id: string, user: Partial<User>): Promise<User | null> {
        const updated = await UserModel.findByIdAndUpdate(id, user, { new: true });
        return updated ? updated.toObject() as unknown as User : null;
    }

    async findAll(): Promise<User[]> {
        const users = await UserModel.find();
        return users.map(u => u.toObject() as unknown as User);
    }

    async findAllByRole(role: string): Promise<User[]> {
        const users = await UserModel.find({ role });
        return users.map(u => u.toObject() as unknown as User);
    }
}
