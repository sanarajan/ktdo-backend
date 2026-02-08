import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { ILoggerService, IJwtService, IHashService } from '../../../../application/services';
import { AppError } from '../../../../domain/errors/AppError';
import { AuthTokens, ILoginUserUseCase } from '../../interface/auth/ILoginUserUseCase';
import { User } from '../../../../domain/entities/User';

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('IJwtService') private jwtService: IJwtService,
        @inject('ILoggerService') private logger: ILoggerService,
        @inject('IHashService') private hashService: IHashService
    ) { }

    async execute(email: string, pass: string): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
        this.logger.info('Attempting login', { email });
        const user = await this.userRepo.findByEmail(email);

        if (!user) {
            this.logger.warn('Login failed: User not found', { email });
            throw new AppError('Invalid email or password', 401);
        }

        if (user.isBlocked) {
            this.logger.warn('Login failed: Account blocked', { email });
            throw new AppError('Your account has been blocked. Please contact support.', 403);
        }

        const isMatch = await this.hashService.compare(pass, user.password!);
        if (!isMatch) {
            this.logger.warn('Login failed: Invalid password', { email });
            throw new AppError('Invalid email or password', 401);
        }

        const tokens = this.jwtService.generateTokens({
            id: user.id,
            role: user.role,
            workingState: user.workingState,
            workingDistrict: user.workingDistrict
        });

        const { password, ...userWithoutPass } = user;
        return { user: userWithoutPass, tokens };
    }
}
