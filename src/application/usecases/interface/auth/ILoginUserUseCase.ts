import { User } from '../../../../domain/entities/User';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface ILoginUserUseCase {
    execute(email: string, pass: string): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }>;
}
