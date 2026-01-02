import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { RegisterDriverUseCase } from '../../usecases/auth/RegisterDriverUseCase';
import { LoginUserUseCase } from '../../usecases/auth/LoginUserUseCase';
import { HttpCode } from '../../common/enums';
import { SuccessMessage } from '../../common/constants';

@injectable()
export class AuthController {
    constructor(
        @inject(RegisterDriverUseCase) private registerDriverUseCase: RegisterDriverUseCase,
        @inject(LoginUserUseCase) private loginUserUseCase: LoginUserUseCase
    ) { }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const file = (req as any).file; // Get the file buffer from multer
            const driver = await this.registerDriverUseCase.execute(req.body, file);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
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

            res.status(200).json({
                success: true,
                message: 'Login successful',
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
            res.status(200).json({ success: true, message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }
}
