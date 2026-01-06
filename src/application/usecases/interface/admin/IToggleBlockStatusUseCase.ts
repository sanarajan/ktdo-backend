import { User } from '../../../../domain/entities/User';

export interface IToggleBlockStatusUseCase {
    execute(userId: string): Promise<User | null>;
}
