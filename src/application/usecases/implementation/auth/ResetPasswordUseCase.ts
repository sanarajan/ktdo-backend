import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { ILoggerService, IEmailService, IHashService } from '../../../../application/services';
import { AppError } from '../../../../domain/errors/AppError';
import { ErrorMessage, SuccessMessage } from '../../../../common/constants';
import { IResetPasswordUseCase } from '../../interface/auth/IResetPasswordUseCase';

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('IEmailService') private emailService: IEmailService,
        @inject('ILoggerService') private logger: ILoggerService,
        @inject('IHashService') private hashService: IHashService
    ) { }

    async execute(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
        this.logger.info('Attempting password reset', { userId });
        
        const user = await this.userRepo.findById(userId);
        if (!user) {
            this.logger.warn('Password reset failed: User not found', { userId });
            throw new AppError(ErrorMessage.USER_NOT_FOUND, 404);
        }

        // Verify current password
        const isMatch = await this.hashService.compare(currentPassword, user.password!);
        if (!isMatch) {
            this.logger.warn('Password reset failed: Invalid current password', { userId });
            throw new AppError(ErrorMessage.INVALID_CURRENT_PASSWORD, 400);
        }

        // Hash new password
        const hashedPassword = await this.hashService.hash(newPassword);

        // Update user password
        await this.userRepo.update(userId, { password: hashedPassword });

        // Send email
        await this.emailService.sendPasswordResetEmail(user.email, newPassword);

        this.logger.info(SuccessMessage.PASSWORD_RESET_SUCCESS, { userId });
        return true;
    }
}
