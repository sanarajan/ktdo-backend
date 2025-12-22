import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { JwtService } from '../../infrastructure/auth/JwtService';
import { ILogger } from '../../common/interfaces';
import bcrypt from 'bcrypt';
import { AppError } from '../../domain/errors/AppError';

@injectable()
export class LoginUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject(JwtService) private jwtService: JwtService,
        @inject('ILogger') private logger: ILogger
    ) { }

    async execute(email: string, pass: string) {
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

        const isMatch = await bcrypt.compare(pass, user.password!);
        if (!isMatch) {
            this.logger.warn('Login failed: Invalid password', { email });
            throw new AppError('Invalid email or password', 401);
        }

        const tokens = this.jwtService.generateTokens({
            id: user.id,
            role: user.role,
            state: (user as any).state,
            district: (user as any).district
        });

        const { password, ...userWithoutPass } = user;
        return { user: userWithoutPass, tokens };
    }
}
