import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IRegisterDriverUseCase } from '../../application/usecases/interface/auth/IRegisterDriverUseCase';
import { ILoginUserUseCase } from '../../application/usecases/interface/auth/ILoginUserUseCase';
import { IResetPasswordUseCase } from '../../application/usecases/interface/auth/IResetPasswordUseCase';
import { StatusCode, SuccessMessage } from '../../common/constants';

@injectable()
export class AuthController {
    constructor(
        @inject('IRegisterDriverUseCase') private registerDriverUseCase: IRegisterDriverUseCase,
        @inject('ILoginUserUseCase') private loginUserUseCase: ILoginUserUseCase,
        @inject('IResetPasswordUseCase') private resetPasswordUseCase: IResetPasswordUseCase
    ) { }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = (req as any).user.id;

            await this.resetPasswordUseCase.execute(userId, currentPassword, newPassword);

            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.PASSWORD_RESET_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
           console.log("this is controller reach")
            console.log('AuthController - register - licenceNumber:', req.body.licenceNumber);
            const file = (req as any).file; // Get the file buffer from multer
            const driver = await this.registerDriverUseCase.execute(req.body, file);
            res.status(StatusCode.CREATED).json({
                success: true,
                message: SuccessMessage.REGISTRATION_SUCCESS,
                data: driver
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const { user, tokens } = await this.loginUserUseCase.execute(email, password);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.LOGIN_SUCCESS,
                data: { user, tokens }
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            res.status(StatusCode.OK).json({ success: true, message: SuccessMessage.LOGOUT_SUCCESS });
        } catch (error) {
            next(error);
        }
    }
}
