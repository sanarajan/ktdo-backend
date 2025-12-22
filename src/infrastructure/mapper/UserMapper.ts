import { User } from '../../common/interfaces';
import { UserModel } from '../database/schemas/UserSchema';

export class UserMapper {
    static toDomain(userDoc: any): User {
        return {
            id: userDoc._id.toString(),
            email: userDoc.email,
            name: userDoc.name,
            role: userDoc.role,
            phone: userDoc.phone,
            address: userDoc.address,
            isBlocked: userDoc.isBlocked,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt,
            // Add other fields as necessary, strictly typing against User interface
        } as User;
    }

    static toPersistence(user: User): any {
        return {
            email: user.email,
            name: user.name,
            role: user.role,
            password: user.password,
            // ... map other fields
        };
    }
}
