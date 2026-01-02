import { User } from '../entities/User';

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(id: string, user: Partial<User>): Promise<User | null>;
    findAll?(): Promise<User[]>;
    findAllByRole(role: string): Promise<User[]>;
    delete?(id: string): Promise<boolean>;
}
