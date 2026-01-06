import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../common/enums';
import { container } from '../infrastructure/config/container';
import { IJwtService } from '../application/services';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { StatusCode, ErrorMessage } from '../common/constants';

const jwtService = container.resolve<IJwtService>('IJwtService');

export const protect = (roles: UserRole[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let token = req.headers.authorization?.split(' ')[1];

        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: ErrorMessage.NOT_AUTHORIZED });
        }

        try {
            const decoded: any = jwtService.verifyAccessToken(token);
            if (!decoded) {
                return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: ErrorMessage.INVALID_TOKEN });
            }
            // Normalize id field from token payload (support id or _id)
            if (decoded._id && !decoded.id) decoded.id = decoded._id;

            // Check if user still exists in database
            const userRepository = container.resolve<IUserRepository>('IUserRepository');
            const user = await userRepository.findById(decoded.id);
            
            if (!user) {
                return res.status(StatusCode.UNAUTHORIZED).json({ 
                    success: false, 
                    message: ErrorMessage.USER_NO_LONGER_EXISTS 
                });
            }

            // Check if user is blocked
            if ((user as any).isBlocked) {
                return res.status(StatusCode.FORBIDDEN).json({ 
                    success: false, 
                    message: ErrorMessage.ACCOUNT_BLOCKED 
                });
            }

            (req as any).user = decoded;

            if (roles.length > 0 && !roles.includes((decoded as any).role)) {
                 console.log("middleware err forbid")
                return res.status(StatusCode.FORBIDDEN).json({ success: false, message: ErrorMessage.FORBIDDEN });
            }
       
            next();
        } catch (err) {
             console.log("middleware error", err)
            return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: ErrorMessage.NOT_AUTHORIZED });
        }
    };
};

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Safe cast to any to access user property set by protect
        const user = (req as any).user;

        if (!user) {
            return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: ErrorMessage.NOT_AUTHORIZED });
        }

        if (!roles.includes(user.role)) {
            return res.status(StatusCode.FORBIDDEN).json({ success: false, message: ErrorMessage.FORBIDDEN });
        }
        next();
    };
};
