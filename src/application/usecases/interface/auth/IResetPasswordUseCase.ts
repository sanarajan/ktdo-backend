export interface IResetPasswordUseCase {
    execute(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
}
